const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV まるてん!",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description: "まるがよしこを堕天させるゲームです。(?)2015そこんところ工房",
  keyword:
    "ラブライブ！サンシャイン!!,LoveLive！,国木田花丸, はなまる, 津島善子, よしこ, ヨハネ,ゲーム,フリゲ,フリーゲーム",
  ogUrl: "https://games.sokontokoro-factory.net/maruten/",
  ogImage:
    "https://games.sokontokoro-factory.net/maruten/img/TITLE_LOGO_HANAMARU.png",
};

isProduction &&
  Object.assign(htmlParams, {
    title: "まるてん！ver.1.1 -そこんところ工房-",
    trackingCode: config.trackingCode.pro,
    noIndex: false,
  });

const plugins = [
  new HtmlWebpackPlugin({
    templateParameters: htmlParams,
    template: "src/index.ejs",
    hash: true,
  }),
  new CopyWebpackPlugin([
    { context: "src/fonts", from: "**/*", to: "fonts" },
    { context: "src/img", from: "**/*", to: "img" },
    { context: "src/sound", from: "**/*", to: "sound" },
  ]),
];

module.exports = {
  mode: isProduction ? "production" : "development",

  entry: {
    app: path.resolve(__dirname, "src/js/main.js"),
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },

  devtool: isProduction ? "none" : "source-map",

  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        // Inject "window" to this called in create.js
        test: require.resolve("createjs/builds/1.0.0/createjs.js"),
        use: "imports-loader?this=>window",
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.svg$/, loader: "url-loader?mimetype=image/svg+xml" },
      { test: /\.woff$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.eot$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.ttf$/, loader: "url-loader?mimetype=application/font-woff" },
      {
        // Inject "window" to this called in alertify.js
        test: require.resolve("alertify/lib/alertify"),
        use: "imports-loader?this=>window",
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },

  plugins,

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" },
};
