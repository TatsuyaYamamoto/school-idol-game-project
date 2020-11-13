const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.ejs",
    hash: true
  }),
  new CopyPlugin([{ from: "app/assets", to: "assets" }])
];

module.exports = {
  mode: "development",

  // https://github.com/TypeStrong/ts-loader#devtool--sourcemaps
  devtool: "inline-source-map",

  entry: {
    app: path.resolve(__dirname, "app/src/index.ts")
  },

  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].bundle.js"
  },

  resolve: {
    extensions: [".js", ".ts"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }]
      }
    ]
  },

  plugins: plugins
};
