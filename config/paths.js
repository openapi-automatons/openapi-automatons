const fs = require('fs-extra');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  build: resolve('dist')
};
