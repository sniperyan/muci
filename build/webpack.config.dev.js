
'use strict';

const fs = require('fs');
const path = require('path');
// const resolve = require('resolve');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('../dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('../dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('../dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('../dev-utils/getCSSModuleLocalIdent');
// const getClientEnvironment = require('./env');
// const paths = require('./paths');
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleNotFoundPlugin = require('../dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const typescriptFormatter = require('../dev-utils/typescriptFormatter');
const config = require('../config');
// @remove-on-eject-begin
// const getCacheIdentifier = require('../dev-utils/getCacheIdentifier');
// @remove-on-eject-end

const utils = require('./utils');
function resolve(dir) {
    return utils.resolve(dir);
}

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = config.dev.publicPath;
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = config.dev.publicUrl;
// Get environment variables to inject into our app.
// const env = getClientEnvironment(publicUrl);
const env = utils.getClientEnvironment(config.dev.publicUrl);
env.stringified["process.env"].px2rem = config.dev.px2rem;
env.stringified["process.env"].port = config.dev.port;

// // Check if TypeScript is setup
// const useTypeScript = fs.existsSync(paths.appTsConfig);


// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;


// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
    ];
    if(config.dev.px2rem){
        loaders.push({
                loader: 'px2rem-loader',
                // options here
                options: config.dev.px2remOptions
        });
    }
    loaders.push({
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                }),
            ],
        },
    })
    if (preProcessor) {
        loaders.push(require.resolve(preProcessor));
    }
    return loaders;
};

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
    mode: 'development',
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebook/create-react-app/issues/343
    devtool: config.dev.devtool,
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: [
        // Include an alternative client for WebpackDevServer. A client's job is to
        // connect to WebpackDevServer by a socket and get notified about changes.
        // When you save a file, the client will either apply hot updates (in case
        // of CSS changes), or refresh the page (in case of JS changes). When you
        // make a syntax error, this client will display a syntax error overlay.
        // Note: instead of the default WebpackDevServer client, we use a custom one
        // to bring better experience for Create React App users. You can replace
        // the line below with these two lines if you prefer the stock client:
        // require.resolve('webpack-dev-server/client') + '?/',
        // require.resolve('webpack/hot/dev-server'),
        require.resolve('../dev-utils/webpackHotDevClient'),
        // Finally, this is your app's code:
        config.dev.entry,
        // We include the app code last so that if there is a runtime error during
        // initialization, it doesn't blow up the WebpackDevServer client, and
        // changing JS code would still trigger a refresh.
    ],
    output: {
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: utils.assetsPath('js/[name].js'),
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: utils.assetsPath('js/[name].chunk.js'),
        // This is the URL that app is served from. We use "/" in development.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
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
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebook/create-react-app/issues/253
        // modules: ['node_modules'].concat(
        //     // It is guaranteed to exist because we tweak it in `env.js`
        //     process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        // ),
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebook/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: ['.js', '.jsx', '.json'],
        alias: config.dev.alias,
        plugins: [
            // Adds support for installing with Plug'n'Play, leading to faster installs and adding
            // guards against forgotten dependencies and such.
            PnpWebpackPlugin,
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            new ModuleScopePlugin(resolve('src'), [resolve('package.json')]),
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

            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|mjs|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: require.resolve('../dev-utils/eslintFormatter'),
                            eslintPath: require.resolve('eslint'),
                            // @remove-on-eject-begin
                            baseConfig: {
                                extends: [require.resolve('eslint-config-react-app')],
                                settings: { react: { version: '999.999.999' } },
                            },
                            ignore: false,
                            useEslintrc: false,
                            // @remove-on-eject-end
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: resolve('src'),
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [resolve('src')],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
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
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
                test: cssRegex,
                exclude: cssModuleRegex,
                use: getStyleLoaders({
                    importLoaders: 1,
                }),
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
                test: cssModuleRegex,
                use: getStyleLoaders({
                    importLoaders: 1,
                    modules: true,
                    getLocalIdent: getCSSModuleLocalIdent,
                }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // Chains the sass-loader with the css-loader and the style-loader
            // to immediately apply all styles to the DOM.
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
                test: sassRegex,
                exclude: sassModuleRegex,
                use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader'),
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
                test: sassModuleRegex,
                use: getStyleLoaders(
                    {
                        importLoaders: 2,
                        modules: true,
                        getLocalIdent: getCSSModuleLocalIdent,
                    },
                    'sass-loader'
                ),
            },

            //less
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: getStyleLoaders({ importLoaders: 2 }, 'less-loader'),
            },

            {
                test: lessModuleRegex,
                use: getStyleLoaders(
                    {
                        importLoaders: 2,
                        modules: true,
                        getLocalIdent: getCSSModuleLocalIdent,
                    },
                    'less-loader'
                ),
            },
        ],
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: config.dev.appHtml,
        }),
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        // This gives some necessary context to module not found errors, such as
        // the requesting resource.
        new ModuleNotFoundPlugin(resolve('./')),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(
            env.stringified
        ),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebook/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebook/create-react-app/issues/186
        new WatchMissingNodeModulesPlugin(resolve('node_modules')),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: publicPath,
        }),

    ].filter(Boolean),

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
