import { ipcMain } from 'electron'
import { closeWs, initWs } from './wsClient'
import { createTable } from './database/ADB'
import { config } from 'process'
import { addUserSetting } from './database/UserSettingModel'
import store from './store'
import {
  getTotalMessageCount,
  saveMessage,
  selectChatMessageByPage
} from './database/ChatMessageModel'
import {
  selectUserSessionList,
  delChatSession,
  setTopSession,
  clearNoReadCount,
  updateChatSession,
  updateChatSessionLastInfo,
  showChatSession,
  getChatSessionByContactId,
  updateNoReadCount,
  searchChatSessionByCondition
} from './database/ChatSessionModel'
import { saveAvatar } from './database/AvatarModel'

const onLoginSuccess = (mainWindow, homePage_width, homePage_height) => {
  ipcMain.on('loginSuccess', (e, { userId, token }) => {
    console.log('loginSuccess')
    mainWindow.setResizable(true)
    mainWindow.setSize(homePage_width, homePage_height) //不能乘小数
    mainWindow.center()
    mainWindow.setResizable(false)
    // addUserSetting(userId,email);
    store.initUserId(userId)
    console.log('login success userId:' + userId)
    if (token) store.setData('token', token)
    console.log(userId)
    // console.log(config);
    initWs(config, e.sender)
  })
}

const onChangeWindowSizeToLogin = (mainWindow, login_width, login_height) => {
  ipcMain.on('changeWindowSizeToLogin', (e) => {
    mainWindow.setResizable(true)
    mainWindow.setSize(login_width, login_height)
    mainWindow.setResizable(false)
  })
}

const onChangeWindowSizeToRegister = (mainWindow, register_width, register_height) => {
  ipcMain.on('changeWindowSizeToRegister', (e) => {
    console.log('RegisterSuccess')
    mainWindow.setResizable(true)
    mainWindow.setSize(register_width, register_height)
    mainWindow.setResizable(false)
  })
}

const onSetLocalStore = () => {
  ipcMain.on('setLocalStore', (e, { key, value }) => {
    store.setData(key, value)
  })
}

const onGetLocalStore = () => {
  ipcMain.on('getLocalStore', (e, key) => {
    e.sender.send('getLocalStoreReturn', store.getDate(key))
  })
}

const onLoadChatSessionData = () => {
  ipcMain.on('loadChatSessionData', async (e) => {
    console.log('loadChatSessionData')
    const data = await selectUserSessionList()
    console.log('loadChatSessionDataReturn:' + data)
    e.sender.send('loadChatSessionDataReturn', data)
  })
}

const onSetTopSession = () => {
  ipcMain.on('setTopSession', (e, { contactId, topType }) => {
    setTopSession(contactId, topType)
  })
}

const onDeleteSession = () => {
  ipcMain.on('deleteSession', (e, contactId) => {
    console.log('contactId:' + contactId)
    delChatSession(contactId)
  })
}

const onClearNoReadCount = () => {
  ipcMain.on('clearNoReadCount', (e, sessionId) => {
    clearNoReadCount(sessionId)
  })
}

const onSaveSendMessage = () => {
  ipcMain.on('saveSendMessage', (e, data) => {
    console.log('saveSendMessage')
    console.log(data)
    saveMessage(data)
  })
}

const onUpdateChatSessionWhenSendMessage = () => {
  ipcMain.on('updateChatSessionWhenSendMessage', (e, data) => {
    updateChatSessionLastInfo(data.contactId, data.lastMessage, data.lastReceiveTime)
  })
}

const onGetTotalMessageCount = () => {
  ipcMain.on('getTotalMessageCount', async (e, sessionId) => {
    const data = await getTotalMessageCount(sessionId)
    e.sender.send('getTotalMessageCountReturn', data)
  })
}

const onLoadChatMessageData = () => {
  ipcMain.on('loadChatMessageData', async (e, { sessionId, currentPage, pageSize, stratTime }) => {
    const data = await selectChatMessageByPage(sessionId, currentPage, pageSize, stratTime)
    data.reverse()
    // console.log('sessionId' + sessionId)
    // console.log('currentPage' + currentPage)
    // console.log('pageSize' + pageSize)
    // console.log('stratTime' + stratTime)
    // console.log('loadChatMessageData' + data)
    e.sender.send('loadChatMessageDataReturn', data)
  })
}

const onShowChatSession = () => {
  ipcMain.on('showChatSession', async (e, contactId) => {
    await showChatSession(contactId)
    const data = await getChatSessionByContactId(contactId)
    e.sender.send('showChatSessionReturn', data)
  })
}

const onAddNoReadCount = () => {
  ipcMain.on('addNoReadCount', (e, contactId) => {
    updateNoReadCount(contactId, 1)
  })
}

const onSearchChatSessionByCondition = () => {
  ipcMain.on('searchChatSessionByCondition', async (e, condition) => {
    const data = await searchChatSessionByCondition(condition)
    e.sender.send('searchChatSessionByConditionReturn', data)
  })
}

const onSaveSelfAvatar = () => {
  ipcMain.on('saveSelfAvatar', (e, data) => {
    console.log('saveAvatar')
    console.log(data)
    saveAvatar(data)
  })
}

const onLogout = () => {
  ipcMain.on('logout', (e) => {
    closeWs()
  })
}

export {
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
  onShowChatSession,
  onAddNoReadCount,
  onSearchChatSessionByCondition,
  onSaveSelfAvatar,
  onLogout
}
