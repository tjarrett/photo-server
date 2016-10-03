const APP_BASE_PATH = global.APP_BASE_PATH;
const path = require('path');
const nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({file: path.join(APP_BASE_PATH, 'lib', 'config.json')});

exports.get = (field) => {
  "use strict";
  return nconf.get(field);
}
