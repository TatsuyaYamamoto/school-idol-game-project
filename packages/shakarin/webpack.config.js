const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "しゃかりん！ -DEVELOPMENT-",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description:
    "ひたすら凛ちゃんがマラカスをしゃかしゃかするゲームです。(?)2015そこんところ工房",
  ogpUrl: "https://games.sokontokoro-factory.net/shakarin/",
  ogpImageUrl:
    "https://games.sokontokoro-factory.net/honocar/img/TITLE_LOGO.png",
};

isProduction &&
  Object.assign(htmlParams, {
    title: "しゃかりん！ -そこんところ工房-",
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
    { context: "src/img", from: "**/*", to: "img" },
    { context: "src/sound", from: "**/*", to: "sound" },
  ]),
];
module.exports = {
  mode: isProduction ? "production" : "development",

  entry: {
    app: resolve(__dirname, "src/js/main.js"),
  },

  output: {
    path: resolve(__dirname, "dist/"),
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
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },

      {
        test: /\.(woff)$/,
        use: [{ loader: "url-loader" }],
      },

      {
        // Inject "window" to this called in create.js
        test: require.resolve("createjs/builds/1.0.0/createjs.js"),
        use: "imports-loader?this=>window",
      },
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
