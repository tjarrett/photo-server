const APP_BASE_PATH = global.APP_BASE_PATH;
const EventEmitter = require('events');
const path = require('path');
const vpconfig = require(path.join(APP_BASE_PATH, 'lib', 'config.js'));


const Monitor = require(path.resolve('app/monitor.js')).Monitor;
const databaseInterface = require(path.resolve(vpconfig.get('databaseInterfaceSourcePath')));
let databaseInterfaceClassName = databaseInterface[vpconfig.get('databaseInterface')];

//const PouchDB = require('pouchdb');

//const db = new PouchDB('http://localhost:5984/viapx-photos.db');
//const remote = new PouchDB(__dirname + '/viapx-photos.db');

//db.sync(remote, {live: true});

/**
 * Class representing our photo and video scanner and monitor
 * @extends EventEmitter
 */
class Scanner extends EventEmitter {
  /**
   * Create a scanner
   * @param {object} options  - At minimum '_dirs' array of string directories to monitor and '_database' pouchdb to
   *                            access
   */
  constructor(options) {
    super();
    this._database = options.database;
    this._dirs = options.dirs;

    this._isMonitoring = false;
    this._monitor = null;

    this._isScanning = false;
    this._isValidating = false;
  }

  /**
   * Start monitoring the file system for changes
   */
  startMonitor() {
    this._monitor = new Monitor(this._dirs, this._database, databaseInterfaceClassName);
    this._monitor.start();

  }

  /**
   * Stop monitoring the file system for changes
   */
  stopMonitor() {
    this._monitor.stop();

  }

  /**
   * Whether (true) or not (false) the file system is currently being monitored for changes
   */
  isMonitoring() {
    return this._isMonitoring;
  }

  /**
   * Start a file system scan. This adds or updates any records based on the current state of
   * the file system. This takes awhile to run (obviously).
   */
  startFileSystemScan() {

  }

  /**
   * Stop (or pause) the current file system scan.
   */
  stopFileSystemScan() {

  }

  /**
   * Whether (true) or not (false) the file system scan is currently ongoing
   */
  isScanningFileSystem() {
    return this._isScanning;
  }

  /**
   * Validates that all the records in the _database are still... valid (go figure). It does this by taking the records
   * in the _database and validating that they are still accurate. If not the record will be either updated or removed
   * as appropriate.
   */
  startValidatingDatabase() {

  }

  /**
   * Pauses the validation of the _database
   */
  stopValidatingDatabase() {

  }

  /**
   * Whether (true) or not (false) a _database validation is in process
   */
  isValidatingDatabase() {
    return this._isValidating;
  }

}

exports.Scanner = Scanner;
