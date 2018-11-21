'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

function resolve(dir) {
  return utils.resolve(dir);
}

const createLintingRule = () => ({
  test: /\.(js|jsx)$/,
  // loader: 'eslint-loader',
  enforce: 'pre',
  use: [
    {
      options: {
        formatter: require('eslint-friendly-formatter'),
        eslintPath: require.resolve('eslint'),
        // // @remove-on-eject-begin
        // baseConfig: {
        //   extends: [require.resolve('eslint-config-react-app')],
        //   settings: { react: { version: '999.999.999' } },
        // },
        // ignore: false,
        // useEslintrc: false,
        // @remove-on-eject-end
      },
      loader: require.resolve('eslint-loader'),
    },
  ],
  include: [resolve('src'), resolve('test')],
  // options: {
  //   formatter: require('eslint-friendly-formatter'),
  //   emitWarning: !config.dev.showEslintErrorsInOverlay,
  // },
});

module.exports = {
  context: resolve('./'),   //基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  entry: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing')
    ? config.build.entry
    : config.dev.entry,
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
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
    alias: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing')
      ? config.build.alias
      : config.dev.alias,
    // Adds support for installing with Plug'n'Play, leading to faster installs and adding
    // guards against forgotten dependencies and such.
    plugins: [
      // Adds support for installing with Plug'n'Play, leading to faster installs and adding
      // guards against forgotten dependencies and such.
      PnpWebpackPlugin,
    ],
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
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
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
};
