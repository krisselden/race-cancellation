#!/usr/bin/env node
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { SourceMapConsumer, SourceMapGenerator } = require("source-map");

const distPath = path.resolve(__dirname, "../dist");

/**
 * @param {string=} relative
 */
function resolve(relative) {
  if (relative) {
    return path.resolve(distPath, relative);
  }
}

class SourceFile {
  /**
   * @param {string} file
   * @param {string} content
   */
  constructor(file, content) {
    this.content = content;
    this.file = file;
    let line = {
      start: 0,
      first: 0,
      end: 0,
    };
    let lineStart = true;
    let lines = [line];
    for (let i = 0; i < content.length; i++) {
      const c = content[i];
      if (c === "\r") {
        continue;
      } else if (c === "\n") {
        line = {
          start: i + 1,
          first: i + 1,
          end: i + 1,
        };
        lines.push(line);
        lineStart = true;
      } else if (lineStart && (c === " " || c === "\t")) {
        line.first++;
        line.end++;
      } else {
        lineStart = false;
        line.end++;
      }
    }
    this.lines = lines;
  }

  /**
   * @param {number} line
   * @param {number} column
   */
  fix(line, column) {
    // line is 1 based
    if (line > this.lines.length) {
      console.log(`${line}:${column} outside of ${this.file}`);
      return { line, column };
    }
    const entry = this.lines[line - 1];
    const maxColumn = entry.end - entry.start;
    if (column > 0 && column >= maxColumn) {
      line++;
      if (line <= this.lines.length) {
        const nextEntry = this.lines[line - 1];
        column = nextEntry.first - nextEntry.start;
      } else {
        console.log(`${line} outside of ${this.file}`);
        line = this.lines.length;
        const lastEntry = this.lines[line - 1];
        column = lastEntry.end - lastEntry.start;
      }
    }
    return { line, column };
  }
}

fixMaps();

async function fixMaps() {
  for (const entry of readDist().values()) {
    if (entry.ext === ".js") {
      const mapContents = readFileSync(resolve(entry.map), "utf8");
      const generatedFile = new SourceFile(
        entry.file,
        readFileSync(resolve(entry.file), "utf8")
      );
      const consumer = await new SourceMapConsumer(mapContents);
      const newMap = new SourceMapGenerator({
        file: entry.file,
      });

      const contentFor = makeSourceContentFor();
      consumer.eachMapping(
        ({
          generatedLine,
          generatedColumn,
          originalLine,
          originalColumn,
          source,
        }) => {
          const sourceFile = contentFor(source);

          /** @type {import('source-map').Position} */
          let generated;
          /** @type {import('source-map').Position} */
          let original;
          // keep line start mappings
          if (generatedColumn === 0 && originalColumn === 0) {
            generated = { line: generatedLine, column: 0 };
            original = {
              line: originalLine,
              column: 0,
            };
          } else {
            // fix if column is at newline
            // by moving to next line
            generated = generatedFile.fix(generatedLine, generatedColumn);
            original = sourceFile.fix(originalLine, originalColumn);
          }
          newMap.addMapping({
            generated,
            original,
            source,
          });
        }
      );

      writeFileSync(resolve(entry.map), newMap.toString());
    }
  }
}

function readDist() {
  const files = readdirSync(distPath);

  /** @type {Map<string,string>}  */
  const fileToMap = new Map();
  /** @type {Map<string, { file: string, base: string, ext: string, map: string | undefined }>}  */
  const filenames = new Map();

  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (ext === ".map") {
      fileToMap.set(base, file);
    }
    filenames.set(file, { file, base, ext, map: undefined });
  }

  for (const file of files) {
    const parsed = filenames.get(file);
    if (parsed !== undefined) {
      parsed.map = fileToMap.get(parsed.file);
    }
  }
  return filenames;
}

function makeSourceContentFor() {
  /** @type {Map<string, SourceFile>} */
  const cache = new Map();

  return contentFor;

  /** @param {string} file */
  function contentFor(file) {
    let sourceFile = cache.get(file);
    if (sourceFile === undefined) {
      sourceFile = new SourceFile(file, readFileSync(resolve(file), "utf8"));
      cache.set(file, sourceFile);
    }
    return sourceFile;
  }
}
