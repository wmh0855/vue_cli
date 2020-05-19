const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const dllPath = "build/library";
module.exports = {
  entry: {
    library: ["vue", "vue-router", "vuex", "axios",'lodash']
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: "[name]_[hash].dll.js",
    library: "[name]_[hash]"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "production"
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, "[name]-manifest.json"),
      name: "[name]_[hash]",
      context: process.cwd()
    })
  ]
};
