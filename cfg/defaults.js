/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const resolvePath = dir => path.join(__dirname, '..', dir);

const srcPath = resolvePath('app');

module.exports = {
    srcPath: srcPath,
    publicPath: isDev ? '/' : './',
    resolvePath,
    isDev
};
