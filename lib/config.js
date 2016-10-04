const path = require('path');
const nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({file: path.join(__dirname, 'config.json')});

exports.get = (field) => {
  "use strict";
  return nconf.get(field);
}

exports.getRegex = (field) => {
  "use strict";

  let value = nconf.get(field);

  if (typeof value == 'string') {
    return new RegExp(value);

  } else {
    let returnValues = [];
    for (let key in value) {
      returnValues[key] = new RegExp(value[key]);
    }

    console.log(returnValues);

    return returnValues;
  }

  return value;

}
