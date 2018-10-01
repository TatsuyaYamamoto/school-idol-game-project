const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.ejs",
    hash: true
  })
];

module.exports = {
  mode: "development",

  devtool: "source-map",

  entry: "./app/ts/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }]
  },

  plugins
};
