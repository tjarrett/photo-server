const path = require('path');
const vpconfig = require(path.join(APP_BASE_PATH, 'lib', 'config.js'));

class AbstractDatabaseInterface {
  constructor(database) {
    this._database = database;
    if (new.target === AbstractDatabaseInterface) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  addFile(path) {
    throw "addFile should be considered abstract and should be overridden by your own method";
  }

  addFileSync(path) {
    console.log("Adding " + path + " to the database");
  }

  removeFile(path) {
    throw "removeFile should be considered abstract and should be overridden by your own method";
  }

  removeFileSync(path) {
    console.log("Removing " + path + " from the database.");
  }

  updateFile(path) {
    throw "updateFile should be considered abstract and should be overridden by your own method";
  }

  updateFileSync(path) {
    console.log("Updating " + path + " into the database.");
  }

  isImage(path) {
    var regexs = vpconfig.getRegex('imageFiles');
    for (let i=0; i<regexs.length; i++) {
      if (path.match(regexs[i])) {
        return true;
      }
    }
    return false;
  }

}

class DatabaseInterfaceNodeTick extends AbstractDatabaseInterface {
  constructor(database) {
    console.log('In DatabaseInterfaceNodeTick constructor');
    super(database);
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

}

exports.AbstractDatabaseInterface = AbstractDatabaseInterface;
exports.DatabaseInterfaceNodeTick = DatabaseInterfaceNodeTick;
