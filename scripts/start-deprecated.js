// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});


const shell = require('shelljs');
const path = require('path');
const buildJs = path.join(__dirname, '..', 'build/dev-server.js');
// const args = process.argv.slice(2);

// if(args[0] === 'pwa'){
//   shell.exec(`cross-env NODE_ENV=development RUN_PWA=true node ${buildJs}`);
// }else {
//   shell.exec(`cross-env NODE_ENV=development node ${buildJs}`);
// }
shell.exec(`cross-env NODE_ENV=development node ${buildJs}`);

