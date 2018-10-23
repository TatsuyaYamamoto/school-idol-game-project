const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "やみどり！ -DEVELOPMENT-",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description:
    "ことりちゃんが、あの闇でケーキな鍋を完成させる、、、のを阻止するブラウザゲームです！そこんところ工房のファンゲームです。",
  ogUrl: "https://games.sokontokoro-factory.net/yamidori/",
  ogImage: "https://games.sokontokoro-factory.net/yamidori/assets/image/ogp.jpg"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "やみどり！ -そこんところ工房-",
    trackingCode: config.trackingCode.pro,
    noIndex: false
  });

const plugins = [
  new HtmlWebpackPlugin({
    templateParameters: htmlParams,
    template: "src/index.ejs",
    hash: true
  }),
  new CopyWebpackPlugin([{ context: "src/assets", from: "**/*", to: "assets" }])
];

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: path.resolve(__dirname, "src/js/index.ts"),

  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
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
      { test: /\.woff$/, loader: "url-loader" }
    ]
  },

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" },

  plugins: plugins
};
