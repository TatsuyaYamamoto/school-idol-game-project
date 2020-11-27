const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const rootPackageJson = require("../../package.json");
const appPackageJson = require("./package.json");

const appVersion = appPackageJson.version;
const config = rootPackageJson.config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  appVersion,
  trackingCode: config.trackingCode.dev,
  helpUrlJa: "http://games-dev.sokontokoro-factory.net/#/help?language=ja",
  helpUrlEn: "http://games-dev.sokontokoro-factory.net/#/help?language=en",
};

if (isProduction) {
  Object.assign(htmlParams, {
    trackingCode: config.trackingCode.pro,
    helpUrlJa: "http://games.sokontokoro-factory.net/#/help?language=ja",
    helpUrlEn: "http://games.sokontokoro-factory.net/#/help?language=en",
  });
}

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.ejs",
    templateParameters: htmlParams,
    hash: true,
  }),
  new CopyPlugin([{ from: "app/assets", to: "assets" }]),
];

module.exports = {
  mode: "development",

  // https://github.com/TypeStrong/ts-loader#devtool--sourcemaps
  devtool: "inline-source-map",

  entry: {
    app: path.resolve(__dirname, "app/src/index.ts"),
  },

  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].bundle.js",
  },

  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },

  plugins,
};
