const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("./package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV ほのCar!",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description:
    "ひたすら穂乃果ちゃんが車を避けるゲームです。(?)2015そこんところ工房",
  ogpUrl: "https://games.sokontokoro-factory.net/honocar/",
  // ogpImageUrl: "https://games.sokontokoro-factory.net/honocar/img/ogp.png"
  ogpImageUrl:
    "https://games.sokontokoro-factory.net/honocar/img/TITLE_LOGO_HONOKA.png"
};

isProduction &&
  Object.assign(htmlParams, {
    title: "ほのCar!ver1.1 -そこんところ工房-",
    trackingCode: config.trackingCode.pro,
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
  ]),
  new webpack.DefinePlugin({
    "process.env": JSON.stringify(process.env)
  })
];

const webpackConfig = {
  mode: isProduction ? "production" : "development",

  entry: resolve(__dirname, "app/js/main.js"),

  output: {
    path: resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },

  devtool: isProduction ? "none" : "source-map",

  resolve: {
    extensions: [".js", ".ts"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css/,
        use: ["style-loader", { loader: "css-loader", options: { url: false } }]
      },
      {
        // Inject "window" to this called in create.js
        test: require.resolve("createjs/builds/1.0.0/createjs.js"),
        use: "imports-loader?this=>window"
      },
      {
        // Inject "window" to this called in alertify.js
        test: require.resolve("alertify/lib/alertify"),
        use: "imports-loader?this=>window"
      }
    ]
  },

  plugins: plugins,

  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" }
};

module.exports = webpackConfig;
