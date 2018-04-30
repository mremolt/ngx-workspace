const path = require('path');
const glob = require('glob');
const appRoot = require('app-root-path');

const root = (...paths) => path.resolve(appRoot.toString(), ...paths);
const APP_NAME = process.env.APP_NAME || 'default-app';

exports.APP_NAME = APP_NAME;
exports.rootPath = root;
exports.appPath = (appName, ...dirNames) => root('apps', appName, ...dirNames);
exports.libPath = (libName, ...dirNames) => root('libs', libName, ...dirNames);
exports.distPath = name => root('dist', name);
exports.reportsPath = name => root('reports', name);
exports.libs = () => glob.sync(`${root()}/libs/*`);
exports.appRelative = (appName, ...dirNames) => path.join('apps', appName, ...dirNames);
exports.libsRelative = () => glob.sync('libs/*');
