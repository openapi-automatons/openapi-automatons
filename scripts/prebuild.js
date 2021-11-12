const fs = require('fs-extra');
const paths = require('../config/paths.js');

fs.removeSync(paths.build);
