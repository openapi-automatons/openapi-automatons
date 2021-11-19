import fs from "fs-extra";
import path from "path";

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

export default {
  build: resolve('dist')
};
