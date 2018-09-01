const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV ほのCar!",
  noIndex: true,
  trackingCode: "UA-64858827-8",
  description:
    "ひたすら穂乃果ちゃんが車を避けるゲームです。(?)2015そこんところ工房"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "ほのCar!ver1.1 -そこんところ工房-",
    trackingCode: "UA-64858827-2",
    noIndex: false
  });

const plugins = [
  new HtmlWebpackPlugin({
    templateParameters: htmlParams,
    template: "app/index.ejs",
    hash: true
  }),
  new CopyWebpackPlugin([
    { context: "app/img", from: "**/*", to: "img" },
    { context: "app/sound", from: "**/*", to: "sound" }
  ])
];

const config = {
  mode: isProduction ? "production" : "development",

  entry: resolve(__dirname, "app/js/main.js"),

  output: {
    path: resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },

  resolve: {
    extensions: [".js", ".ts"]
  },

  module: {
    rules: [
      {
        test: /\.css/,
        use: ["style-loader", { loader: "css-loader", options: { url: false } }]
      }
    ]
  },

  plugins: plugins
};

module.exports = config;
