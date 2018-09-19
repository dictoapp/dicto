/**
 * Webpack configuration for handling the application's source code
 * in development mode (standard)
 */
const webpack = require('webpack');
const sharedConfig = require('./webpack.web.shared');

module.exports = {
  node: sharedConfig.node,
  module: sharedConfig.module,
  plugins: sharedConfig.plugins
};