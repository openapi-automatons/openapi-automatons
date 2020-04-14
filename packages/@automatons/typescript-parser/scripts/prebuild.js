const fs = require('fs-extra');
const paths = require('../config/paths');

fs.removeSync(paths.build);
