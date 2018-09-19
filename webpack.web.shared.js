/**
 * Webpack configuration base for handling the application's source code
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  node:{
    child_process: 'empty',
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!dot-prop)\/*/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          extends: path.join(process.cwd(), './.babelrc'),
          cacheDirectory: true
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
         use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name:'assets/[name].[ext]'
              }
            }
          },
        {
          loader: 'image-webpack-loader',
          options: {
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: true,
              },
              optipng: {
                optimizationLevel: 7,
              }
            }
          }
        }]
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
  ],
};