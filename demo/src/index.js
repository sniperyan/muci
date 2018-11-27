/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "ReactEcharts" }]*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './scripts/Main';
// import ReactEcharts from 'echarts-for-react';
import mobileAdaption from './scripts/util/mobileAdaption';
//是否启用px2rem插件
if (process.env.px2rem) {
  mobileAdaption();
}

ReactDOM.render(<Main />, document.getElementById('app'));



