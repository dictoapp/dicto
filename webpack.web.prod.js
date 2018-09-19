/**
 * Webpack configuration for handling the applicatino's source code
 * in production mode (standard + minify)
 */
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const sharedConfig = require('./webpack.web.shared');
const homepage = require('./package.json').homepage;

const config = {
  mode: 'production',
  module: sharedConfig.module,
  node: sharedConfig.node,
  plugins: sharedConfig.plugins,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: false
        },
        parallel: true
      })
    ]
  },
  output: {
    path: '/build',
    publicPath: homepage + '/build/'
  }
};

module.exports = config;