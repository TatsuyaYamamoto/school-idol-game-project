const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV そこんところ工房ゲームス ポータル",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description: "そこんところ工房ゲームス ポータル",
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

  entry: {
    app: "./app/ts/index.tsx"
  },

  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js"
  },

  devtool: isProduction ? "none" : "source-map",

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

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },

  plugins,

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" }
};
