const fs = require('fs-extra');
const path = require('path');
const paths = require('../config/paths');

fs.removeSync(paths.build);
fs.copySync(paths.templates, path.resolve(paths.build, 'templates'), {dereference: true});
