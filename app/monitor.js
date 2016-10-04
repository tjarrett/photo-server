const APP_BASE_PATH = global.APP_BASE_PATH;
const EventEmitter = require('events');
const path = require('path');
const vpconfig = require(path.join(APP_BASE_PATH, 'lib', 'config.js'));

/**
 * Class for listening for, and reacting to, file system changes.
 */
class Monitor extends EventEmitter {
  /**
   * Create a monitor
   * @param {array} dirs                   A string of arrays representing the paths to monitor
   * @param {PouchDB} database             The pouchdb to update
   * @param {function} databaseInterface
   */
  constructor(dirs, database, databaseInterfaceClassName) {
    super();
    this._dirs = dirs;
    this._database = database;
    this._databaseInterface = new databaseInterfaceClassName(this._database);
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

      this._watcher.on('ready', () => {
        this._watcher
          .on('add', (path) => {
            this._databaseInterface.addFile(path);

          })
          .on('change', (path, stats) => {
            this._databaseInterface.updateFile(path);
          })
          .on('unlink', (path) => {
            this._databaseInterface.removeFile(path);
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

exports.Monitor = Monitor;
