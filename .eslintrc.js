/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "simple-import-sort",
    "prettier",
    "filenames",
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "sort-imports": "off",
    "import/order": "off",
    "import/no-extraneous-dependencies": "error",
    "import/no-unassigned-import": "error",
    "import/no-duplicates": "error",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "simple-import-sort/sort": "error",
  },
  overrides: [
    {
      env: {
        node: true,
        es6: true,
      },
      files: ["race-cancellation/scripts/*.cjs"],
      rules: {
        "no-undef": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
    {
      parserOptions: {
        project: "./tsconfig.json",
        // allows eslint from any dir
        tsconfigRootDir: __dirname + "/race-cancellation",
        sourceType: "module",
      },
      files: ["race-cancellation/src/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "import/no-unresolved": "off",
        "import/export": "off",
        "filenames/match-regex": "error",
        "filenames/match-exported": "error",
      },
    },
    {
      env: {
        node: true,
        mocha: true,
        es6: true,
      },
      parserOptions: {
        project: "./tsconfig.json",
        // allows eslint from any dir
        tsconfigRootDir: __dirname + "/tests",
        sourceType: "module",
      },
      files: ["tests/**/*.js"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "no-undef": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
    {
      env: {
        node: true,
        es6: true,
      },
      parserOptions: {
        project: "./tsconfig.json",
        // allows eslint from any dir
        tsconfigRootDir: __dirname + "/examples",
        sourceType: "module",
      },
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["examples/**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
