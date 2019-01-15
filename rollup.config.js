import sourcemaps from "rollup-plugin-sourcemaps";

export default {
  input: "dist/index.js",
  plugins: [sourcemaps()],
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "RaceCancellation",
      sourcemap: true,
    },
  ],
};
