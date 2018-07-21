'use strict';
const path = require('path');
//TODO:npm环境
// const config = path.join(__dirname, '../../../', 'config/');  
const config = path.join(__dirname, '../demo/', 'config/');
module.exports = require(config);
