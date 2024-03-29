const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  // Add hot reloading in development
  entry: [
    'webpack-hot-middleware/client?reload=true',
    // Dev server client for web socket transport, hot and live reload logic
    //  'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    path.resolve(process.cwd(), 'src', 'root.js'), // Start with js/root.js
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  stats: {
    children: true
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new HtmlWebpackPlugin({
      title: process.env.APP_NAME,
      base: '/',
      template: path.join(process.cwd(), 'public', 'index.html'),
      filename: 'index.html',
      showErrors: true,
     // chunks: ['src'],
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      favicon: path.join(process.cwd(),'public', 'favicon.ico'),
      scriptLoading: 'defer', // Add this line to defer loading of the script
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        'theme-color': '#4285f4'
        // Will generate: <meta name="theme-color" content="#4285f4">
      }
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
  ].filter(Boolean),
});