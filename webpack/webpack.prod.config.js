'use strict'

var path = require('path')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../client')
var utils = require('./utils')

module.exports = {
  entry: [
    path.join(__dirname, '../client/main.js')
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js'),
    publicPath: '/'
  },
  devtool: '#source-map',
  resolve: {
    extensions: ['', '.js'],
    fallback: [path.join(__dirname, '../node_modules')]
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      $: 'zepto/dist/zepto.min.js'
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: require.resolve('zepto'),
        loader: 'exports?window.Zepto!script'
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
