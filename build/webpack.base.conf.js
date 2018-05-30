'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');

function resolve(dir) {
  return utils.resolve(dir);
}

const createLintingRule = () => ({
  test: /\.(js|jsx)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay,
  },
});

module.exports = {
  context: resolve('./'),   //基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  entry: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing')
    ? config.build.entry
    : config.dev.entry,
  output: {
    path: config.build.assetsRoot,   //output 目录对应一个绝对路径。
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: utils.assetsPath('js/[name].js'),  
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: utils.assetsPath('js/[name].chunk.js'),  
    publicPath: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing')
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
     
    },
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
