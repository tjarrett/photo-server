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

/**
 * Class for listening for, and reacting to, file system changes.
 */
class Monitor extends EventEmitter {
  /**
   * Create a monitor
   * @param {array} dirs        A string of arrays representing the paths to monitor
   * @param {PouchDB} database  The pouchdb to update
   */
  constructor(dirs, database) {
    super();
    this._dirs = dirs;
    this._database = database;
    this._databaseInterface = new DatabaseInterface(this._database);
    this._chokidar = require('chokidar');
    this._watcher = null;
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

      let _watcher = this._watcher;

      this._watcher.on('ready', () => {
        this._watcher
          .on('add', (path) => {
            console.log(`File ${path} has been added`);
            this._databaseInterface.addFile(path);

          })
          .on('change', (path, stats) => {
            console.log(`File ${path} as been changed ${stats}`);
            this._databaseInterface.updateFile(path);
          })
          .on('unlink', (path) => {
            console.log(`File ${path} as been removed`);
            this._databaseInterface.removeFile(path);
          })
          .on('addDir', (path) => {
            console.log(`Directory ${path} as been added`);
            //_watcher.watch(path);
            console.log("Now watching " + path);
          })
          .on('unlinkDir', (path) => {
            console.log(`Directory ${path} as been removed`);
            //_watcher.unwatch(path);
            console.log("No longer watching " + path);
          });

      });

      this._watcher.on('all', () => {
        this.emit.apply(arguments);
      });
    }
  }

  stop() {
    this._watcher.close();
    this._watcher = null;
  }
}

function ThreadHandleFileSystemChanges()
{
  //"use strict";
  //const vpconfig = require(path.join(__dirname, '..', 'lib', 'config.js'));
  //postMessage("Data dir is " + vpconfig.get('dataDir'));
  postMessage("hi");
  this.onmessage = function(event) {
    postMessage('Hi ' + event.data);
    self.close();
  }





}

class DatabaseInterface {
  constructor(database) {
    this._database = database;
  }

  addFile(path) {
    let promiseResolveReject = {};
    let promise = null;
    let callback = null;

    if (arguments.length > 1 && typeof arguments[arguments.length-1] == 'function') {
      callback = arguments[arguments.length-1];

    } else {
      promiseResolveReject = {};
      promise = new Promise((resolve, reject) => {
        promiseResolveReject = {resolve: resolve, reject: reject};
      });

    }

    process.nextTick(() => {
      try {
        this.addFileSync(path);
        if (promise) {
          promiseResolveReject.resolve("Done adding " + path);

        }

        if (callback) {
          callback(null, "Done adding " + path);
        }

      } catch (e) {
        if (promise) {
          promiseResolveReject.reject({path: path, error: e});

        }

        if (callback) {
          callback(e, path);
        }

        console.log(e);
      }
    });

    return promise;

  }

  addFileSync(path) {
    console.log("Adding " + path + " to the database");
  }

  removeFile(path) {
    let promiseResolveReject = {};
    let promise = null;
    let callback = null;

    if (arguments.length > 1 && typeof arguments[arguments.length-1] == 'function') {
      callback = arguments[arguments.length-1];

    } else {
      promiseResolveReject = {};
      promise = new Promise((resolve, reject) => {
        promiseResolveReject = {resolve: resolve, reject: reject};
      });

    }

    process.nextTick(() => {
      try {
        this.removeFileSync(path);
        if (promise) {
          promiseResolveReject.resolve("Done removing " + path);

        }

        if (callback) {
          callback(null, "Done removing " + path);
        }

      } catch (e) {
        if (promise) {
          promiseResolveReject.reject({path: path, error: e});

        }

        if (callback) {
          callback(e, path);
        }

        console.log(e);
      }
    });

    return promise;
  }

  removeFileSync(path) {
    console.log("Removing " + path + " from the database.");
  }

  updateFile(path) {
    let promiseResolveReject = {};
    let promise = null;
    let callback = null;

    if (arguments.length > 1 && typeof arguments[arguments.length-1] == 'function') {
      callback = arguments[arguments.length-1];

    } else {
      promiseResolveReject = {};
      promise = new Promise((resolve, reject) => {
        promiseResolveReject = {resolve: resolve, reject: reject};
      });

    }

    process.nextTick(() => {
      try {
        this.updateFileSync(path);
        if (promise) {
          promiseResolveReject.resolve("Done updating " + path);

        }

        if (callback) {
          callback(null, "Done updating " + path);
        }

      } catch (e) {
        if (promise) {
          promiseResolveReject.reject({path: path, error: e});

        }

        if (callback) {
          callback(e, path);
        }

        console.log(e);
      }
    });

    return promise;

  }

  updateFileSync(path) {
    console.log("Updating " + path + " into the database.");
  }

}

exports.Scanner = Scanner;
