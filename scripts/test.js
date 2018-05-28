const shell = require("shelljs");
const path = require('path');
const buildJs = path.join(__dirname, '..', 'build/build.js');
// spawn.sync(
//   'node',
//   [buildJs],
//   { stdio: 'inherit' }
// );
shell.exec(`cross-env NODE_ENV=testing node ${buildJs}`);