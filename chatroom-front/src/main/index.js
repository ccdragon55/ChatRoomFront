import { app, shell, BrowserWindow, ipcMain,screen,globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// import { tr } from 'element-plus/es/locale/index.mjs'
const NODE_ENV = process.env.NODE_ENV
import { initWs } from './wsClient'
import { createTable } from './database/ADB'
import { config } from 'process'
import { addUserSetting } from './database/UserSettingModel'
import store from './store'
import { selectUserSessionList,delChatSession, setTopSession,clearNoReadCount } from './database/ChatSessionModel'

// 引入 vue-devtools
// const vueDevtools = require('vue-devtools');

let login_width=400;
let login_height=300;
let register_width=400;
let register_height=400;
let homePage_width=400;
let homePage_height=400;

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
    resizable:false,
    frame:true,
    transparent:true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true, 
      contextIsolation:false,
      devTools:true,
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
    mainWindow.webContents.closeDevTools();
    mainWindow.webContents.openDevTools();
  }
  // mainWindow.webContents.openDevTools();

  // 注册一个快捷键（Ctrl+Shift+I / Cmd+Option+I）
  globalShortcut.register('Ctrl+Shift+I', () => {
    console.log("Ctrl+Shift+I");
    // mainWindow.webContents.openDevTools();
      //打开控制台
    if (NODE_ENV === 'development') {
      // mainWindow.webContents.closeDevTools();
      console.log("development");
      mainWindow.webContents.openDevTools();
    }
  });
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle("ChatRoom")
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
  }

  ipcMain.on("loginSuccess",(e,userId)=>{
    console.log("loginSuccess")
    mainWindow.setResizable(true);
    mainWindow.setSize(homePage_width,homePage_height);//不能乘小数
    mainWindow.center();
    mainWindow.setResizable(false);
    // addUserSetting(userId,email);
    store.initUserId(userId);
    console.log(userId);
    initWs(config,e.sender);
  })

  ipcMain.on("changeWindowSizeToLogin",(e)=>{
    console.log("loginSuccess")
    mainWindow.setResizable(true);
    mainWindow.setSize(login_width,login_height);
    mainWindow.setResizable(false);
  })

  ipcMain.on("changeWindowSizeToRegister",(e)=>{
    console.log("RegisterSuccess")
    mainWindow.setResizable(true);
    mainWindow.setSize(register_width,register_height);
    mainWindow.setResizable(false);
  })

  ipcMain.on("setLocalStore",(e,{key,value})=>{
    store.setData(key,value);
  })

  ipcMain.on("getLocalStore",(e,key)=>{
    e.sender.send("getLocalStoreReturn",store.getDate(key));
  })

  ipcMain.on("loadChatSessionData",async (e)=>{
    console.log("loadChatSessionData")
    const data=await selectUserSessionList()
    console.log("loadChatSessionDataReturn:"+data)
    e.sender.send("loadChatSessionDataReturn",data)
  })

  ipcMain.on("setTopSession",(e,{contactId,topType})=>{
    setTopSession(contactId,topType);
  });

  ipcMain.on("deleteSession",(e,contactId)=>{
    console.log("contactId:"+contactId);
    delChatSession(contactId);
  });

  ipcMain.on("clearNoReadCount",(e,sessionId)=>{
    clearNoReadCount(sessionId);
  })
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

  login_width=Math.ceil(screen.getPrimaryDisplay().workAreaSize.width*0.3);
  login_height=Math.ceil(screen.getPrimaryDisplay().workAreaSize.height*0.4);
  register_width=login_width;
  register_height=Math.ceil(screen.getPrimaryDisplay().workAreaSize.height*0.55);
  homePage_width=Math.ceil(screen.getPrimaryDisplay().workAreaSize.width*0.8);
  homePage_height=Math.ceil(screen.getPrimaryDisplay().workAreaSize.height*0.8);

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
