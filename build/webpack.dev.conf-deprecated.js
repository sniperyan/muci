'use strict';
const fs = require('fs');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf-deprecated');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('../dev-utils/InterpolateHtmlPlugin');
const portfinder = require('portfinder');
const ManifestPlugin = require('webpack-manifest-plugin');
const loaders = utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true });


// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function(name) {
//   baseWebpackConfig.entry[name] = [__dirname + '/dev-client'].concat(baseWebpackConfig.entry[name]);
// });

const env = utils.getClientEnvironment(config.dev.publicUrl);


module.exports = merge(baseWebpackConfig, {
  //Possible values for mode are: none, development or production(default).
  mode: 'development',
  module: {
    rules: loaders,
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  optimization: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      // filename: 'index.html',
      template: config.dev.appHtml, // Generates an `index.html` file with the <script> injected.
      inject: true,
      // favicon: config.dev.favicon,
    }),
    
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // // Add module names to factory functions so they appear in browser profiler.
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./utils.js`.
    new webpack.DefinePlugin(env.stringified),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),appPublic
    // new webpack.NoEmitOnErrorsPlugin(),appPublic
    // Watcher doesn't work well if you mistyappPublicpe casing in a path so we use
    // a plugin that prints an error when youappPublic attempt to do this.
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
    


    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: utils.resolve('./static'),
    //     to: config.dev.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ]),
    // new FriendlyErrorsPlugin(),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),  // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: config.dev.publicPath,
    }),
  ],
});
