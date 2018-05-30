const shell = require('shelljs');
const path = require('path');
const buildJs = path.join(__dirname, '..', 'build/build.js');
// const args = process.argv.slice(2);

// if(args[0] === 'pwa'){
//     shell.exec(`cross-env NODE_ENV=testing RUN_PWA=true node ${buildJs}`);
//   }else {
//     shell.exec(`cross-env NODE_ENV=testing node ${buildJs}`);
//   }
// // shell.exec(`cross-env NODE_ENV=testing node ${buildJs}`);
shell.exec(`cross-env NODE_ENV=testing node ${buildJs}`);