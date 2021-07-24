const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlParams = {};

const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.ejs",
    templateParameters: htmlParams,
    hash: true,
  }),
];

module.exports = {
  mode: "development",

  // https://github.com/TypeStrong/ts-loader#devtool--sourcemaps
  devtool: "inline-source-map",

  entry: "./src/index.ts",

  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },

  plugins,

  devServer: {
    contentBase: path.join(__dirname, "public"),
  },
};
