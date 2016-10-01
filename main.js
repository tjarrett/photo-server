//https://discuss.atom.io/t/electron-app-database-file-structure-code-structure/16491/4
//https://forums.plex.tv/discussion/92837/perfect-video-format-encoding

const electron = require('electron');
const path = require('path');
const vpconfig = require('./lib/config.js');
const scann = require('./app/scanner.js');

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

console.log(process.env.NODE_ENV);

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  createTray();
  createWindow();
  launchScanner();
  launchServer();


})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
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

}

const launchServer = () => {
  "use strict";

}

