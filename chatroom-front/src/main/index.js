import { app, shell, BrowserWindow, ipcMain, screen, globalShortcut } from 'electron'
import { join } from 'path'
// const path = require('path');
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// import { tr } from 'element-plus/es/locale/index.mjs'
const NODE_ENV = process.env.NODE_ENV
import { initWs } from './wsClient'
import { createTable } from './database/ADB'
import { config } from 'process'
import { addUserSetting } from './database/UserSettingModel'
import store from './store'
import {
  selectUserSessionList,
  delChatSession,
  setTopSession,
  clearNoReadCount
} from './database/ChatSessionModel'
import {
  onLoginSuccess,
  onChangeWindowSizeToLogin,
  onChangeWindowSizeToRegister,
  onSetLocalStore,
  onGetLocalStore,
  onLoadChatSessionData,
  onSetTopSession,
  onDeleteSession,
  onClearNoReadCount,
  onSaveSendMessage,
  onUpdateChatSessionWhenSendMessage,
  onGetTotalMessageCount,
  onLoadChatMessageData,
  onLogout,
  onShowChatSession,
  onAddNoReadCount,
  onSearchChatSessionByCondition,
  onSaveSelfAvatar
} from './ipc'

// 引入 vue-devtools
// const vueDevtools = require('vue-devtools');

let login_width = 400
let login_height = 300
let register_width = 400
let register_height = 400
let homePage_width = 400
let homePage_height = 400

// let mainWindow;

function createWindow() {
  // Create the browser window.
  // const mainWindow = new BrowserWindow({
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    width: login_width,
    height: login_height,
    show: false,
    autoHideMenuBar: true,
    // titleBarStyle:'hidden',
    resizable: false,
    frame: true,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
      // nodeIntegration: false,
      // contextIsolation:true
    }
  })

  // mainWindow.loadURL('http://localhost:8080'); // 或者是你的 Vue 应用的 URL

  // if (process.env.NODE_ENV === 'development') {
  //   // 通过 Vue DevTools 启用开发者工具
  //   // vueDevtools.connect(); // 开启 vue-devtools
  //   mainWindow.webContents.openDevTools(); // 打开 DevTools
  // }

  //打开控制台
  if (NODE_ENV === 'development') {
    mainWindow.webContents.closeDevTools()
    mainWindow.webContents.openDevTools()
  }
  // mainWindow.webContents.openDevTools();

  // 注册一个快捷键（Ctrl+Shift+I / Cmd+Option+I）
  globalShortcut.register('Ctrl+Shift+I', () => {
    console.log('Ctrl+Shift+I')
    // mainWindow.webContents.openDevTools();
    //打开控制台
    if (VITE_ENV === 'development') {
      // mainWindow.webContents.closeDevTools();
      console.log('development')
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle('ChatRoom')
    // mainWindow.webContents.openDevTools();
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    // mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  let newWindow
  function createNewWindow() {
    // 创建一个新的窗口
    newWindow = new BrowserWindow({
      width: 400,
      height: 300,
      parent: mainWindow,  // 将新窗口设置为主窗口的子窗口
      modal: true,  // 让新窗口成为模态窗口
      show: false,  // 初始不显示，直到窗口加载完成
      webPreferences: {
        nodeIntegration: true
      }
    });
  
    // 加载新窗口的 HTML 文件
    newWindow.loadFile('newWindow.html');
  
    // 当新窗口关闭时，销毁它
    newWindow.on('closed', () => {
      newWindow = null;
    });
  
    // 显示新窗口
    newWindow.once('ready-to-show', () => {
      newWindow.show();
    });
  }

  onLoginSuccess(mainWindow, homePage_width, homePage_height)
  onChangeWindowSizeToLogin(mainWindow, login_width, login_height)
  onChangeWindowSizeToRegister(mainWindow, register_width, register_height)
  onSetLocalStore()
  onGetLocalStore()
  onLoadChatSessionData()
  onSetTopSession()
  onDeleteSession()
  onClearNoReadCount()
  onSaveSendMessage()
  onUpdateChatSessionWhenSendMessage()
  onGetTotalMessageCount()
  onLoadChatMessageData()
  onShowChatSession()
  onAddNoReadCount()
  onSearchChatSessionByCondition()
  onSaveSelfAvatar()

  onLogout()
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  login_width = Math.ceil(screen.getPrimaryDisplay().workAreaSize.width * 0.3)
  login_height = Math.ceil(screen.getPrimaryDisplay().workAreaSize.height * 0.4)
  register_width = login_width
  register_height = Math.ceil(screen.getPrimaryDisplay().workAreaSize.height * 0.55)
  homePage_width = Math.ceil(screen.getPrimaryDisplay().workAreaSize.width * 0.8)
  homePage_height = Math.ceil(screen.getPrimaryDisplay().workAreaSize.height * 0.8)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
