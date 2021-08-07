import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import summary from "rollup-plugin-summary";
import typescript from "@rollup/plugin-typescript";

const plugins = [
  resolve(),
  terser({
    ecma: 2020,
    module: true,
    warnings: true,
  }),
  summary(),
  typescript({
    tsconfig: `${__dirname}/../tsconfig.json`,
  }),
];

const targets = [`sf-guide-before-launch`, `sf-twitter-share-button`];

export default targets.map((target) => ({
  input: `${__dirname}/${target}.ts`,
  output: {
    format: "iife",
    file: `${__dirname}/dist/${target}.bundle.js`,
  },
  plugins,
}));
