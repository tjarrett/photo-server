const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

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
  tray = new Tray(path.join(assetsDirectory, '/macos/tray-icon.png'))
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', toggleWindow);
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  //const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  //const y = Math.round(trayBounds.y + trayBounds.height)

  return {x: trayBounds.x, y: trayBounds.y};

  //return {x: x, y: y}
}

const createWindow = () => {
  window = new BrowserWindow({
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
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Open the DevTools.
  //window.webContents.openDevTools()

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const toggleWindow = () => {
  if (window.isVisible()) {
    tray.setHighlightMode('never');
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  console.log(position);
  window.setPosition(position.x, position.y, false)

  var js = "  var body = window.document.body; var html = window.document.documentElement; var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );";

  //var contents = window.webContents;
  //console.log(contents);
  /*contents.executeJavascript(js, true, (result)=>{
    "use strict";
    alert(result);

  });*/


  window.show()
  tray.setHighlightMode('always');
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})
