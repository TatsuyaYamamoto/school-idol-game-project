const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEV まるてん!",
  noIndex: true,
  trackingCode: "UA-64858827-8",
  description: "まるがよしこを堕天させるゲームです。(?)2015そこんところ工房",
  keyword:
    "ラブライブ！サンシャイン!!,LoveLive！,国木田花丸, はなまる, 津島善子, よしこ, ヨハネ,ゲーム,フリゲ,フリーゲーム",
  ogUrl: "https://games.sokontokoro-factory.net/maruten/",
  ogImage:
    "https://games.sokontokoro-factory.net/maruten/img/TITLE_LOGO_HANAMARU.png"
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

  devtool: isProduction ? "none" : "source-map",

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
        // Inject "window" to this called in create.js
        test: require.resolve("createjs/builds/1.0.0/createjs.js"),
        use: "imports-loader?this=>window"
      },
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
