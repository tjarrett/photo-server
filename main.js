//https://discuss.atom.io/t/electron-app-database-file-structure-code-structure/16491/4
//https://forums.plex.tv/discussion/92837/perfect-video-format-encoding
global.APP_BASE_PATH = __dirname;

const electron = require('electron');
const path = require('path');
const vpconfig = require('./lib/config.js');
const Scanner = require('./app/scanner.js').Scanner;
const PouchDB = require('pouchdb');

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Module for interfacing with the window via ipc
const ipcMain = electron.ipcMain;

// Module for interfacing with the tray
const Tray = electron.Tray;

//The path to the assets directory
const assetsDirectory = path.join(__dirname, 'assets');

//The platform (
const platform = ( process.platform == 'darwin' ) ? 'macos' : process.platform;

let tray = undefined;
let mainWindow = undefined;

//Set up the database
const db = new PouchDB('http://localhost:5984/viapx-photos.db');
const remote = new PouchDB(vpconfig.get('dataDir') + '/viapx-photos.db');
db.sync(remote, {live: true});

// Don't show the app in the doc
app.dock.hide();

//Set up the scanner
let scanner = new Scanner({
  dirs: vpconfig.get('photoDirs'),
  database: db
});

app.on('ready', () => {
  createTray();
  createWindow();
  launchScanner();
  launchServer();


})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  scanner.stopMonitor();
  app.quit();
})

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, platform, 'tray-icon.png'))
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', toggleWindow);
}

const getWindowPosition = () => {
  const trayBounds = tray.getBounds()
  return {x: trayBounds.x-2, y: trayBounds.y};
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the mainWindow when it loses focus
  mainWindow.on('blur', () => {
    console.log('blur');
    if (!mainWindow.webContents.isDevToolsOpened()) {
      tray.setHighlightMode('never');
      mainWindow.hide();
    }

  })
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    tray.setHighlightMode('never');
    mainWindow.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  console.log(position);
  mainWindow.setPosition(position.x, position.y, false)

  mainWindow.show()
  tray.setHighlightMode('always');
  mainWindow.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

const launchScanner = () => {
  "use strict";

  scanner.startMonitor();

}

const launchServer = () => {
  "use strict";

}

