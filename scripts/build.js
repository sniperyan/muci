
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// // Ensure environment variables are read.
// require('../config/env');
// @remove-on-eject-begin
// Do the preflight checks (only happens before eject).
// const verifyPackageTree = require('./utils/verifyPackageTree');
// if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
//     verifyPackageTree();
// }
// const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');
// verifyTypeScriptSetup();
// // @remove-on-eject-end

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const config = require('../build/webpack.config.prod');
const userconfig = require('../config');
// const paths = require('../config/paths');
const checkRequiredFiles = require('../dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('../dev-utils/formatWebpackMessages');
const printHostingInstructions = require('../dev-utils/printHostingInstructions');
const FileSizeReporter = require('../dev-utils/FileSizeReporter');
const printBuildError = require('../dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const utils = require('../build/utils');
function resolve(dir) {
  return utils.resolve(dir);
}
const useYarn = fs.existsSync(resolve('yarn.lock'));

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
// if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//   process.exit(1);
// }

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('../dev-utils/browsersHelper');
checkBrowsers(resolve('./'), isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(userconfig.build.assetsRoot);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(userconfig.build.assetsRoot);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
                    chalk.underline(chalk.yellow('keywords')) +
                    ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
                    chalk.cyan('// eslint-disable-next-line') +
                    ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        userconfig.build.assetsRoot,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(resolve('package.json'));
      const publicUrl = userconfig.build.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), userconfig.build.assetsRoot);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                    process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(userconfig.build.assetsRoot + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(resolve('public'), userconfig.build.assetsRoot, {
    dereference: true,
    filter: file => file !== userconfig.build.appHtml,
  });
}
