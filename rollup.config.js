import sourcemaps from "rollup-plugin-sourcemaps";

export default {
  input: 'dist/index.js',
  plugins: [sourcemaps()],
  output: [{
    file: 'dist/index.cjs.js',
    format: "cjs",
    sourcemap: true
  }]
}
