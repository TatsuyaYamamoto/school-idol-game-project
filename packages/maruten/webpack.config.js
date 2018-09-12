const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV まるてん!",
  noIndex: true,
  trackingCode: "UA-64858827-8",
  description: "まるがよしこを堕天させるゲームです。(?)2015そこんところ工房"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "まるてん！ver.1.1 -そこんところ工房-",
    trackingCode: "UA-64858827-5",
    noIndex: false
  });

const plugins = [
  new HtmlWebpackPlugin({
    templateParameters: htmlParams,
    template: "src/index.ejs",
    hash: true
  }),
  new CopyWebpackPlugin([
    { context: "src/fonts", from: "**/*", to: "fonts" },
    { context: "src/img", from: "**/*", to: "img" },
    { context: "src/sound", from: "**/*", to: "sound" }
  ])
];

module.exports = {
  mode: "development",

  entry: {
    bundle: path.resolve(__dirname, "src/js/main.js")
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  module: {
    rules: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.svg$/, loader: "url-loader?mimetype=image/svg+xml" },
      { test: /\.woff$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.eot$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.ttf$/, loader: "url-loader?mimetype=application/font-woff" }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },

  plugins
};
