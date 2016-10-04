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

/*
let worker = function(input, done) {





  try {
    console.log('in worker thread');
    console.log(input);

    if (typeof this.dbi == 'undefined') {
      console.log('first run');



      this.vpconfig = require(input.app_base_path + '/lib/config.js');
      this.db = new PouchDB('http://localhost:5984/viapx-photos.db');
      this.dbi = new databaseInterface.DatabaseInterfaceNodeTick(this.db);

    }


    this.dbi.addFileSync(input.path);

    done("Done! with " + input.path);

  } catch (e) {
    console.log(e);

  }
}*/
