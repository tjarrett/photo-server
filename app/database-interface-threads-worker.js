const path = require('path');
const vpconfig = require(path.normalize(path.join(__dirname, "../", "lib", "config.js")));
const PouchDB = require('pouchdb');
const databaseInterface = require(path.join(__dirname, "database-interface.js"));

//Set up the _database
const db = new PouchDB('http://localhost:5984/viapx-photos.db');
const remote = new PouchDB(vpconfig.get('dataDir') + '/viapx-photos.db');
db.sync(remote, {live: true});

let dbi = new databaseInterface.DatabaseInterfaceNodeTick(db);

module.exports = function(input, done) {
  try {
    switch (input.action) {
      case 'add':
        dbi.addFileSync(input.path);
        break;
      case 'remove':
        dbi.removeFileSync(input.path);
        break;
      case 'update':
        dbi.updateFileSync(input.path);
        break;
    }

    done();

  } catch (e) {
    console.log(e);
  }

};
