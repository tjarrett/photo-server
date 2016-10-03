const EventEmitter = require('events');

const APP_BASE_PATH = global.APP_BASE_PATH;

const path = require('path');
const vpconfig = require(path.join(APP_BASE_PATH, 'lib', 'config.js'));
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
   * @param {object} options  - At minimum 'dirs' array of string directories to monitor and 'database' pouchdb to
   *                            access
   */
  constructor(options) {
    super();
    this.database = options.database;
    this.dirs = options.dirs;

    this._isScanning = false;
    this._isMonitoring = false;
    this._isValidating = false;
  }

  /**
   * Start monitoring the file system for changes
   */
  startMonitor() {

  }

  /**
   * Stop monitoring the file system for changes
   */
  stopMonitor() {

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
   * Validates that all the records in the database are still... valid (go figure). It does this by taking the records
   * in the database and validating that they are still accurate. If not the record will be either updated or removed
   * as appropriate.
   */
  startValidatingDatabase() {

  }

  /**
   * Pauses the validation of the database
   */
  stopValidatingDatabase() {

  }

  /**
   * Whether (true) or not (false) a database validation is in process
   */
  isValidatingDatabase() {
    return this._isValidating;
  }

}

exports.Scanner = Scanner;
