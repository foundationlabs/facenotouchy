'use strict'

import { app, BrowserWindow, powerMonitor } from 'electron'
import path from 'path'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = IS_DEV
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: IS_DEV ? 1200 : 760,
    icon: path.join(__dirname, 'static/icons/facenotouchy.icns'),
    // alwaysOnTop: true,
    // y: 0,
    // x: 0,i
    // minimizable: false,
    // frame: false,
    // titleBarStyle: 'hidden',
    // type: 'desktop',
    title: 'FaceNoTouchy',
    show: IS_DEV ? 'desktop' : false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// app.on('ready', createWindow)

app.on('ready', () => {
  createWindow()
  powerMonitor.on('suspend', () => {
    console.log('The system is going to sleep')
  })
  powerMonitor.on('resume', () => {
    console.log('resume')
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
