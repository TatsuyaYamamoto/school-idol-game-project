const { resolve } = require("path");
const webpack = require("webpack");
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
  ]),
  new webpack.DefinePlugin({
    "process.env": JSON.stringify(process.env)
  })
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

module.exports = config;
