const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV ランキング",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description: "そこんところ工房のゲームランキング",
  keyword:
    "ラブライブ！,LoveLive！,ラブライブ！サンシャイン!!,スクールアイドル,μ’s,ミューズ,Aqours,アクア,ゲーム,ミニゲーム,ランキング",
  ogUrl: "https://games.sokontokoro-factory.net/ranking/",
  ogImage: "https://games.sokontokoro-factory.net/rankig/img/ogp.png"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "スコアランキング -そこんところ工房-",
    trackingCode: config.trackingCode.pro,
    noIndex: false
  });

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.ejs",
    templateParameters: htmlParams,
    hash: true
  })
];

module.exports = {
  mode: isProduction ? "production" : "development",

  devtool: isProduction ? "none" : "source-map",

  entry: "./app/ts/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  },

  plugins,

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" }
};
