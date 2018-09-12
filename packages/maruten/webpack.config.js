const path = require("path");
const webpack = require("webpack");

module.exports = {
  debug: true,
  entry: {
    bundle: path.join(__dirname, "src/js/main.js")
  },
  output: {
    path: path.join(__dirname, "dist/development/"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        loader: "babel",
        exclude: /node_modules/,
        test: /\.js[x]?$/,
        query: {
          cacheDirectory: true,
          presets: ["es2015", "stage-0"]
        }
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
    extensions: ["", ".js", ".jsx", ".json"]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
  ]
};
