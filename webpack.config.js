const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ManifestPlugin = require("webpack-manifest-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")


const dev = process.env.NODE_ENV === "dev"

let config = {
  entry: {
    app: [
      "./src/js/app.js",
      "./src/css/app.css"
    ]
  },
  watch: dev,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: dev ? "[name].js" : "[name].[chunkhash:7].js",
    publicPath: "/dist/"
  },
  devtool: dev ? " cheap-module-eval-source-map" : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            options: {
              minimize: !dev
            }
          }
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(
      {
        filename: dev ? "[name].css" : "[name].[contenthash:7].css",
        disable: dev,

      }
    ),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: "index.html",
      template: "src/index.html"
    })
  ]
}
if (!dev) {
  config.plugins.push(new UglifyJsPlugin({
    parallel: true
  }))
  config.plugins.push(new ManifestPlugin())
  config.plugins.push(new CleanWebpackPlugin(["dist"]))
}

module.exports = config
