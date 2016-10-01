const nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({file: __dirname + '/config.json'});

exports.get = (field) => {
  "use strict";
  return nconf.get(field);
}
