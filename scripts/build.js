#!/usr/bin/env node

/* eslint-disable no-sync, @typescript-eslint/explicit-function-return-type */
/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * script to build (transpile) files.
 * By default it transpiles js files for all packages and writes them
 * into `build/` directory.
 * Non-js files not matching IGNORE_PATTERN will be copied without transpiling.
 *
 * Example:
 *  node ./scripts/build.js
 *  node ./scripts/build.js /users/123/jest/packages/jest-111/src/111.js
 *
 * NOTE: this script is node@6 compatible
 */

"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const makeDir = require("make-dir");

const babel = require("@babel/core");
const chalk = require("chalk");
const micromatch = require("micromatch");
const prettier = require("prettier");
const { getPackages, adjustToTerminalWidth } = require("./buildUtils");
const logger = require("./logger");
// const browserBuild = require('./browserBuild');

const SILENT = true;
const SRC_DIR = "src";
const BUILD_DIR = "build";
// const BUILD_ES5_DIR = "build-es5";
const JS_FILES_PATTERN = "**/*.js";
const TS_FILES_PATTERN = "**/*.ts";
const IGNORE_PATTERN = "**/__{tests,mocks}__/**";
const PACKAGES_DIR = path.resolve(__dirname, "../packages");

const transformOptions = require("../babel.config.js");

const prettierConfig = prettier.resolveConfig.sync(__filename);
prettierConfig.trailingComma = "none";
prettierConfig.parser = "babel";

function getPackageName(file) {
  return path.relative(PACKAGES_DIR, file).split(path.sep)[0];
}

function getBuildPath(file, buildFolder) {
  const pkgName = getPackageName(file);
  const pkgSrcPath = path.resolve(PACKAGES_DIR, pkgName, SRC_DIR);
  const pkgBuildPath = path.resolve(PACKAGES_DIR, pkgName, buildFolder);
  const relativeToSrcPath = path.relative(pkgSrcPath, file);

  return path
    .resolve(pkgBuildPath, relativeToSrcPath)
    .replace(/\.ts$/, ".js");
}

function buildNodePackage(p) {
  const srcDir = path.resolve(p, SRC_DIR);
  const pattern = path.resolve(srcDir, "**/*");
  const files = glob.sync(pattern, { nodir: true });

  process.stdout.write(adjustToTerminalWidth(`${path.basename(p)}\n`));

  files.forEach(file => buildFile(file, SILENT));

  process.stdout.write(`${logger.OK}\n`);
}

// function buildBrowserPackage(p) {
//   const srcDir = path.resolve(p, SRC_DIR);
//   const pkgJsonPath = path.resolve(p, "package.json");

//   if (!fs.existsSync(pkgJsonPath)) {
//     return;
//   }

//   const browser = require(pkgJsonPath).browser;
//   if (browser) {
//     if (browser.indexOf(BUILD_ES5_DIR) !== 0) {
//       throw new Error(
//         `browser field for ${pkgJsonPath} should start with "${BUILD_ES5_DIR}"`
//       );
//     }
//     let indexFile = path.resolve(srcDir, "index.js");

//     if (!fs.existsSync(indexFile)) {
//       indexFile = indexFile.replace(/\.js$/, ".ts");
//     }

//     browserBuild(
//       p.split("/").pop(),
//       indexFile,
//       path.resolve(p, browser)
//     )
//       .then(() => {
//         process.stdout.write(
//           adjustToTerminalWidth(`${path.basename(p)}\n`)
//         );
//         process.stdout.write(`${logger.OK}\n`);
//       })
//       .catch(e => {
//         console.error(e);

//         process.exit(1);
//       });
//   }
// }

function buildFile(file, silent) {
  const destPath = getBuildPath(file, BUILD_DIR);

  if (micromatch.isMatch(file, IGNORE_PATTERN)) {
    silent ||
      process.stdout.write(
        chalk.dim("  \u2022 ") +
          path.relative(PACKAGES_DIR, file) +
          " (ignore)\n"
      );
    return;
  }

  makeDir.sync(path.dirname(destPath));
  if (
    !micromatch.isMatch(file, JS_FILES_PATTERN) &&
    !micromatch.isMatch(file, TS_FILES_PATTERN)
  ) {
    fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
    silent ||
      process.stdout.write(
        chalk.red("  \u2022 ") +
          path.relative(PACKAGES_DIR, file) +
          chalk.red(" \u21D2 ") +
          path.relative(PACKAGES_DIR, destPath) +
          " (copy)" +
          "\n"
      );
  } else {
    const options = Object.assign({}, transformOptions);

    const transformed = babel.transformFileSync(file, options).code;
    const prettyCode = prettier.format(transformed, prettierConfig);

    fs.writeFileSync(destPath, prettyCode);

    silent ||
      process.stdout.write(
        chalk.green("  \u2022 ") +
          path.relative(PACKAGES_DIR, file) +
          chalk.green(" \u21D2 ") +
          path.relative(PACKAGES_DIR, destPath) +
          "\n"
      );
  }
}

const files = process.argv.slice(2);

if (files.length) {
  files.forEach(file => buildFile(file));
} else {
  const packages = getPackages();

  logger.heading("Building Packages");
  logger.$n();

  packages.forEach(buildNodePackage);
  logger.$n();

  // process.stdout.write(chalk.inverse(' Building browser packages \n'));
  // packages.forEach(buildBrowserPackage);
}
