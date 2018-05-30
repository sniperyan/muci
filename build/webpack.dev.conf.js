'use strict';
const fs = require('fs');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('./InterpolateHtmlPlugin');
const portfinder = require('portfinder');
const loaders = utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true });

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = [__dirname + '/dev-client'].concat(baseWebpackConfig.entry[name]);
});

const env = utils.getClientEnvironment(config.dev.publicUrl);


module.exports = merge(baseWebpackConfig, {
  module: {
    rules: loaders,
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  plugins: [
    new InterpolateHtmlPlugin({PUBLIC_URL: config.dev.publicUrl}),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin

    // process.env.RUN_PWA ? new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: config.dev.appHtml, // Generates an `index.html` file with the <script> injected.
    //   inject: true,
    //   favicon: config.dev.favicon,
    //   serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
    //     './service-worker-dev.js'), 'utf-8')}</script>`
    // }) : new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: config.dev.appHtml, // Generates an `index.html` file with the <script> injected.
    //   inject: true,
    //   favicon: config.dev.favicon
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.dev.appHtml, // Generates an `index.html` file with the <script> injected.
      inject: true,
      favicon: config.dev.favicon,
    }),


    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: utils.resolve('./static'),
    //     to: config.dev.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ]),
    new FriendlyErrorsPlugin(),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
});
