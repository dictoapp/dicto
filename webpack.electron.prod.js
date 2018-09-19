const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack');

module.exports = {

    mode: 'production',

    target: 'electron-main',

    entry: './app/src/renderer_process.js',

    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react']
                },
                exclude: [/node_modules/]
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'url-loader'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'sass-loader'],
                  }),
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            disable: false,
            allChunks: true
        })
    ],

    resolve: {
      extensions: ['.js', '.json', '.jsx']
    }

}