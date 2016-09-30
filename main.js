const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Module for interfacing with the window via ipc
const ipcMain = electron.ipcMain;

// Module for interfacing with the tray
const Tray = electron.Tray;

//Get the path
const path = require('path');

//The path to the assets directory
const assetsDirectory = path.join(__dirname, 'assets');

//The platform (
const platform = ( process.platform == 'darwin' ) ? 'macos' : process.platform;

let tray = undefined
let mainWindow = undefined

// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
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
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  //const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  //const y = Math.round(trayBounds.y + trayBounds.height)

  return {x: trayBounds.x-2, y: trayBounds.y};

  //return {x: x, y: y}
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
