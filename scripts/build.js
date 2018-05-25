const spawn = require('cross-spawn');
const path = require('path');
const buildJs = path.join(__dirname, '..', 'build/build.js');
spawn.sync(
  'node',
  [buildJs],
  { stdio: 'inherit' }
);
