'use strict'

const { ProvidePlugin } = require('webpack')
const path = require('path')

const SOURCE_DIR = path.join(__dirname, 'src')
const BUILD_DIR = path.resolve(__dirname, 'dist/')

const config = {
  context: SOURCE_DIR,
  entry: './index.js',
  output: {
    path: BUILD_DIR,
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js(x)?$/,
      exclude: /(node_modules)/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },
  devServer: {
    historyApiFallback: true
  }
}

module.exports = config
