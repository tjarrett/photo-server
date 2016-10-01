const vpconfig = require('../lib/config.js');
const PouchDB = require('pouchdb');

const db = new PouchDB('http://localhost:5984/viapx-photos.db');
const remote = new PouchDB(__dirname + '/viapx-photos.db');

db.sync(remote, {live: true});
