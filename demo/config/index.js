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
    publicPath: '/',
    //设置代理 https://webpack.js.org/configuration/dev-server/#devserver-proxy
    proxyTable: {
      proxy: {
        '/proxy': {
          target: 'https://cnodejs.org',
          pathRewrite: {'^/proxy' : ''},
          changeOrigin: true, //The origin of the host header is kept when proxying by default, you can set changeOrigin to true to override this behaviour.
          secure: false,  //A backend server running on HTTPS with an invalid certificate will not be accepted by default
        },
      },
    },

    //do not check the host are vulnerable to DNS rebinding attacks
    disableHostCheck:true,

   
    // Template for index.html
    appHtml: resolve('../public/index.html'),

    alias:{
      'react-native': 'react-native-web',
    },
    /**
     * Various Dev Server settings
     */
    
    host: '0.0.0.0', 
    //use https protocol  
    useHttps:false,
    // if port is in use, a free one will be determined
    port: 8080, 
    // use px2rem
    px2rem:false,
    //https://github.com/songsiqi/px2rem
    px2remOptions:{},  //rem unit value (default: 75)
    //自动打开浏览器
    autoOpenBrowser: false,   

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-source-map',

    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
    publicUrl: '',
  },


  // build 
  build: {

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
    publicPath: '/',

    // Template for index.html
    appHtml: resolve('../public/index.html'),

    alias: {
      'react-native': 'react-native-web',
    },
    // use px2rem
    px2rem:false,
    //https://github.com/songsiqi/px2rem
    px2remOptions:{},
    /**
     * Source Maps   default false
     */
    productionSourceMap: false,   
    

    //serviceworker
    useServiceWorker:false,

    
    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
    publicUrl: '',
  },
};
