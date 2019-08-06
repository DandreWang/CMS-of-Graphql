const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = (env, argv) => ({
  output: {
    publicPath: '/',
    filename: argv.mode === 'development' ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'babel-loader',
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: argv.mode === 'development' ? '[name]-[local]--[hash:base64:5]' : '[hash:base64:8]',
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html.ejs',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: require.resolve('./src/utils/serviceWorker.js'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/admin': 'http://localhost:9090/',
    },
  },
});
