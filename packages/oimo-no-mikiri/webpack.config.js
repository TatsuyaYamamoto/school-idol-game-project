const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEVELOPMENT おいものみきり！",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description:
    "まるの大事なおいもが狙われている！押し寄せる敵より早く、タップでおいもを捕まえるブラウザゲームです！そこんところ工房のファンゲームです。",
  keyword:
    "ラブライブ！サンシャイン!!,LoveLive！,国木田花丸, はなまる, 黒澤ルビィ, るびぃ, すいぽ, おいも, ゲーム, フリゲ, フリーゲーム",
  ogUrl: "https://games.sokontokoro-factory.net/oimo/",
  ogImage: "https://games.sokontokoro-factory.net/oimo/assets/image/ogp.png"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "おいものみきり！ -そこんところ工房-",
    trackingCode: config.trackingCode.pro,
    noIndex: false
  });

const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.ejs",
    templateParameters: htmlParams,
    hash: true
  }),
  new CopyWebpackPlugin([{ context: "src/assets", from: "**/*", to: "assets" }])
];

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: {
    app: path.resolve(__dirname, "src/js/index.ts")
  },

  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].bundle.js"
  },

  devtool: isProduction ? "none" : "source-map",

  resolve: {
    extensions: [".js", ".ts"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }]
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(woff|ttf)$/, loader: "url-loader" }
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

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" },

  plugins: plugins
};
