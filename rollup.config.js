import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";

const plugins = [sourcemaps()];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    terser({
      compress: {
        negate_iife: false,
        sequences: 0,
      },
      mangle: {
        safari10: true,
      },
    })
  );
}

export default {
  input: "dist/index.js",
  plugins,
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "RaceCancellation",
      sourcemap: true,
      sourcemapExcludeSources: true,
    },
  ],
};
