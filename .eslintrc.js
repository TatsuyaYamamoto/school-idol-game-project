module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    node: true,
    browser: true,
  },
  overrides: [
    // typescript/no-var-requires should only be enabled on ts/tsx files
    // https://github.com/Shopify/eslint-plugin-shopify/issues/159#issuecomment-485813838
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  settings: {
    // https://stackoverflow.com/questions/55198502/using-eslint-with-typescript-unable-to-resolve-path-to-module
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // https://stackoverflow.com/questions/59265981/typescript-eslint-missing-file-extension-ts-import-extensions
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md#disallow-variable-declarations-from-shadowing-variables-declared-in-the-outer-scope-no-shadow
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],

    "no-underscore-dangle": ["error", { allowAfterThis: true }],

    "no-console": "off",
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
  },
};
