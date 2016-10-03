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
    this._monitor = new Monitor(this._dirs, this._database);
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

class Monitor extends EventEmitter {
  constructor(dirs, database) {
    super();
    this._dirs = dirs;
    this._database = database;
    this._chokidar = require('chokidar');
    this._watcher = null;
    this._watcherReady = false;
  }

  start() {
    if (this._watcher == null) {
      try {
        this._watcher = this._chokidar.watch(this._dirs, {
          awaitWriteFinish: true,
          ignored: vpconfig.getRegex('ignoredFiles')
        });

      } catch (e) {
        console.log(e);
      }

      this._watcher.on('ready', () => {
        this._watcherReady = true;

        this._watcher
          .on('add', (path) => {
            console.log(`File ${path} has been added`);
          })
          .on('change', (path, stats) => {
            console.log(`File ${path} as been changed ${stats}`);
          })
          .on('unlink', (path) => {
            console.log(`File ${path} as been removed`);
          })
          .on('addDir', (path) => {
            console.log(`Directory ${path} as been added`);
          })
          .on('unlinkDir', (path) => {
            console.log(`Directory ${path} as been removed`);
          });

      });

      this._watcher.on('all', () => {
        this.emit.apply(arguments);
      });
    }
  }

  stop() {
    this._watcher.close();
    this._watcherReady = false;
    this._watcher = null;
  }
}

exports.Scanner = Scanner;
