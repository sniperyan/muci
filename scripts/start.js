const spawn = require('cross-spawn');
const path = require('path');
const buildJs = path.join(__dirname, '..', 'build/webpack.dev.conf.js');
spawn.sync(
  'node_modules/.bin/webpack-dev-server',
  ['--inline', '--progress', '--config', buildJs],
  { stdio: 'inherit' }
);
