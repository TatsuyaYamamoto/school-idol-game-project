const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.ejs",
    hash: true
  })
];

module.exports = {
  mode: "development",

  // https://github.com/TypeStrong/ts-loader#devtool--sourcemaps
  devtool: "inline-source-map",

  entry: {
    app: path.resolve(__dirname, "app/index.ts")
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

  devServer: {
    contentBase: path.join(__dirname, "app/assets")
  },

  plugins: plugins
};
