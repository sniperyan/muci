'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')

function resolve (dir) {
  return utils.resolve(dir)
}

const createLintingRule = () => ({
  test: /\.(js|jsx)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: resolve('./'),   //基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  entry: process.env.NODE_ENV === 'production'
  ? config.build.entry
  : config.dev.entry,
  output: {
    path: config.build.assetsRoot,   //output 目录对应一个绝对路径。
    /**
     * 多个入口起点(entry point)、代码拆分(code splitting)或各种插件(plugin)创建多个 bundle，
     * 应该使用以下一种替换方式，来赋予每个 bundle 一个唯一的名称……
     * 使用入口名称：filename: "[name].js"
     */
    filename: '[name].js',  
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
     
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    setImmediate: true,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    // dgram: 'empty',
    // fs: 'empty',
    // net: 'empty',
    // tls: 'empty',
    // child_process: 'empty'
  }
}
