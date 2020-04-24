const HTMLWebpackPlugin = require('html-webpack-plugin');

// TODO: rename this as a webpack.dev.js and create a production webpack.config.json
module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html?$/i,
        use: 'html-loader',
      }
    ],
  },
  devServer: {
    port: 8080,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.html'],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    })
  ]
};