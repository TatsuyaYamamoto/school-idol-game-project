const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const indexPugPath =
  process.env.NODE_ENV === "production"
    ? "src/index.production.pug"
    : "src/index.pug";

const plugins = [
  new HtmlWebpackPlugin({
    template: `!!pug-loader!${indexPugPath}`,
    hash: true
  }),
  new CopyWebpackPlugin([
    { context: "src/assets", from: "**/*", to: "assets" }
  ]),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new UglifyJsPlugin({
      compress: {
        drop_console: true
      },
      comments: false
    })
  );
}

const config = {
  entry: {
    bundle: path.resolve(__dirname, "src/js/index.ts")
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }]
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(woff|ttf)$/, loader: "url-loader" }
    ]
  },
  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" },
  plugins: plugins,
  devServer: {
    port: 8000
  }
};

module.exports = config;
