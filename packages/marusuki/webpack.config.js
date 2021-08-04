const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const appPackageJson = require("./package.json");

const appVersion = appPackageJson.version;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "[開発環境] たこ焼きどれくらい好き？",
  noIndex: true,
  appVersion,
  trackingCode: "UA-127664761-2",
  description: "",
  ogpUrl: "https://games.sokontokoro-factory.net/marusuki/",
  ogpImageUrl:
    "https://games.sokontokoro-factory.net/marusuki/assets/images/ogp.jpg",
};

if (isProduction) {
  Object.assign(htmlParams, {
    title: "たこ焼きどれくらい好き？ | そこんところ工房",
    trackingCode: "UA-127664761-1",
    noIndex: false,
  });
}

const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.ejs",
    templateParameters: htmlParams,
    hash: true,
  }),
  new CopyPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
];

module.exports = {
  mode: "development",

  // https://github.com/TypeStrong/ts-loader#devtool--sourcemaps
  devtool: "inline-source-map",

  entry: "./src/index.ts",

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

  devServer: {
    contentBase: path.join(__dirname, "public"),
  },
};
