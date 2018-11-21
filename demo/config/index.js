'use strict';


const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  dev: {

    /**
     * Paths
     */
    //工程入口文件
    entry: resolve('../src/index.js'),
    //静态资源二级目录名称
    assetsSubDirectory: 'static',   
    // CDN 地址
    assetsPublicPath: '/',   
    // // 设置代理  https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
    proxySetup: resolve('../src/setupProxy.js'),
    // proxyTable: {},

    //favicon
    favicon: resolve('../public/favicon.ico'),
    appHtml: resolve('../public/index.html'),

    alias:{
      'react-native': 'react-native-web',
    },
    /**
     * Various Dev Server settings
     */
    // can be overwritten by process.env.HOST
    host: 'localhost', 
    // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    port: 8080, 
    //自动打开浏览器
    autoOpenBrowser: false,   
    //https://webpack.js.org/configuration/dev-server/#devserver-overlay
    errorOverlay: true,   
    // https://www.npmjs.com/package/friendly-errors-webpack-plugin 
    notifyOnErrors: true,  
    // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    poll: false, 
    // 是否使用 Eslint Loader
    useEslint: true,  
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true,  

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-source-map',


    cssSourceMap: true,

    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
    publicUrl: '',
  },


  // build 和 test 共用一个配置
  build: {
    // Template for index.html
    index: resolve('../dist/index.html'),

    /**
     * Paths
     */
    //工程入口文件
    entry: resolve('../src/index.js'),
    //根目录
    assetsRoot: resolve('../dist'),
    //静态资源二级目录名称
    assetsSubDirectory: 'static',
    // CDN 地址
    assetsPublicPath: '/',
    //favicon
    favicon: resolve('../public/favicon.ico'),
    appHtml: resolve('../public/index.html'),

    alias: {
      'react-native': 'react-native-web',
    },
    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    //serviceworker
    useServiceWorker:false,
    SWPrecacheSettings:{
      cacheId: 'my-project',   // service worker cache  unique name
      filename: 'service-worker.js',
      staticFileGlobs: ['dist/**/*.{js,html,css}'],
      minify: true,
      stripPrefix: 'dist/',
      // For unknown URLs, fallback to the index page
      navigateFallback:'/index.html',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    },
    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
    publicUrl: '',
  },
};
