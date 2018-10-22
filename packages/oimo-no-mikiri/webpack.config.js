const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const config = require("../../package.json").config.sokontokoro;
const isProduction = process.env.NODE_ENV === "production";

const htmlParams = {
  title: "DEVELOPMENT おいものみきり！",
  noIndex: true,
  trackingCode: config.trackingCode.dev,
  description:
    "まるの大事なおいもが狙われている！押し寄せる敵より早く、タップでおいもを捕まえるブラウザゲームです！そこんところ工房のファンゲームです。",
  ogpUrl: "https://games.sokontokoro-factory.net/oimo/",
  ogpImageUrl: "https://games.sokontokoro-factory.net/oimo/assets/image/ogp.png"
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
  new CopyWebpackPlugin([
    { context: "src/assets", from: "**/*", to: "assets" }
  ]),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new UglifyJsPlugin({
      compress: {
        drop_console: true
      },
      comments: false
    })
  );
}

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, "src/js/index.ts")
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  devtool: "source-map",
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
  // https://github.com/pixijs/pixi-sound/issues/28
  // Resolve node fs module for pixi-sound.
  node: { fs: "empty" },
  plugins: plugins,
  devServer: {
    port: 8000
  }
};
