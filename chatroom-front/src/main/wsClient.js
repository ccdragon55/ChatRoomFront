import WebSocket from 'ws'
const NODE_ENV = process.env.NODE_ENV

import store from './store'

import {
  addChatSession,
  getChatSessionByContactId,
  getChatSessionStatus,
  saveOrUpdateChatSessionBatch4Init,
  saveSession,
  selectSessionBySessionId,
  showChatSession,
  updateChatSessionLastInfo,
  updateChatSessionLastInfoAndShow
} from './database/ChatSessionModel'
import { saveChatMessageBatch, saveMessage } from './database/ChatMessageModel'
import { saveAvatar } from './database/AvatarModel'

let ws = null
let maxReconnectTimes = null
let wsUrl = null
let sender = null
let needReconnect = null
let reconnectLock = null

const initWs = (config, _sender) => {
  // wsUrl=`${NODE_ENV !=='development'?store.getDate("prodWsDomain"):store.getDate("devWsDomain")}?token=${config.token}`;
  // wsUrl="ws://10.29.61.159:5051/ws"
  // wsUrl=`ws://10.29.61.159:5051/ws?token=${config.token}`

  wsUrl = `ws://10.29.61.159:5051/ws?token=${store.getData('token')}`
  sender = _sender
  needReconnect = true
  maxReconnectTimes = 5
  reconnectLock = false
  createWs()
}

const createWs = () => {
  if (wsUrl == null) {
    return null
  }
  ws = new WebSocket(wsUrl)

  ws.onopen = function () {
    // console.log("客户端连接成功");
    console.log('onopen')
    ws.send('heart beat')
    maxReconnectTimes = 5
  }

  ws.onmessage = async function (e) {
    const message = JSON.parse(e.data)
    // console.log("onmessage message:"+message);
    console.log('----------------------')
    console.log(message.messageType)
    console.log('onmessage e:' + e.data)
    const messageType = message.messageType
    switch (messageType) {
      case 0: //ws连接成功
        console.log('连接成功')
        await saveOrUpdateChatSessionBatch4Init(message.extendData.chatSessionList) //保存会话信息
        await saveChatMessageBatch(message.extendData.chatMessageList) //保存消息
        sender.send('reciveMessage', { messageType: message.messageType })
        // sender.send("");
        break
      case 1: {
        //同意好友申请
        console.log('同意好友申请')
        const newAvatar = {
          contactId: message.contactId,
          url: message.avatarUrl
        }
        await saveAvatar(newAvatar)
        const newSession = {
          contactId: message.contactId,
          contactType: message.contactType,
          sessionId: message.sessionId,
          status: message.status,
          contactName: message.contactName,
          sendUserId: message.sendUserId,
          lastMessage: message.lastMessage,
          lastReceiveTime: message.sendTime
        }
        await addChatSession(newSession)
        const newMessage = {
          // "contactId": message.contactId,
          contactType: message.contactType,
          // "lastMessage": message.lastMessage,
          messageContent: message.messageContent,
          messageId: message.messageId,
          messageType: message.messageType,
          sendTime: message.sendTime,
          sendUserId: message.sendUserId,
          sessionId: message.sessionId,
          status: message.status
        }
        await saveMessage(newMessage)
        newSession.url = message.avatarUrl
        newSession.topType = 0
        sender.send('receiveNewSession', newSession)
        sender.send('addNewFriend', {
          contactId: message.contactId,
          contactName: message.contactName,
          avatarUrl: message.avatarUrl
        })
        break
      }
      case 2: {
        //普通聊天信息
        console.log('普通聊天信息')
        if (message.contactType==1&&message.sendUserId == store.getUserId()) {
          return
        }
        await updateChatSessionLastInfoAndShow(
          message.contactId,
          message.messageContent,
          message.sendTime
        )
        const sessionData = await getChatSessionByContactId(message.contactId)
        sender.send('reciveSingleMessageUpdateChatSession', sessionData)
        // if((await getChatSessionStatus(message.data.contactId).status)==0){
        //     await showChatSession(message.date.contactId);
        // }
        const avatarUrl = message.avatarUrl
        const keysToRemove = [
          'extendData',
          'contactName',
          'lastMessage',
          'memberCount',
          'lastMessage',
          'avatarUrl'
        ]

        // 使用 Object.entries 和 filter 过滤掉不需要的 key，然后用 fromEntries 生成新对象
        const newMessage = Object.fromEntries(
          Object.entries(message).filter(([key]) => !keysToRemove.includes(key))
        )
        console.log('newMessage:')
        console.log(newMessage)
        await saveMessage(newMessage)
        newMessage.url = avatarUrl
        sender.send('reciveSingleMessage', newMessage)
        break
      }
      case 3: {
        //创建群聊
        console.log('创建群聊')
        const groupSession = Object.assign({}, message.extendData)

        addChatSession(groupSession)
        const groupMessage = {
          // "contactId": message.contactId,
          contactType: message.contactType,
          // "lastMessage": message.lastMessage,
          messageContent: message.messageContent,
          messageId: message.messageId,
          messageType: message.messageType,
          sendTime: message.sendTime,
          sessionId: message.sessionId,
          status: message.status
        }
        saveMessage(groupMessage)
        sender.send('reciveSingleMessage', groupMessage)
        //sender.send("addNewGroup",{contactId:message.contactId,contactName:message.contactName,avatarUrl:message.avatarUrl})
        break
      }
      case 4: {
        //好友申请
        console.log('好友申请')
        sender.send('receiveNewApply')
        break
      }
      case 9: {
        //同意加入群组
        console.log('同意加入群组')
      //   {
      //     "avatarUrl": "http://10.29.61.159:5050/images/group.jpg",
      //     "contactId": "G0c92643a68",
      //     "contactName": "test3",
      //     "contactType": 1,
      //     "extendData": null,
      //     "fileName": null,
      //     "fileSize": null,
      //     "fileType": null,
      //     "lastMessage": "def鍔犲叆浜嗙兢缁?",
      //     "memberCount":2,
      //     "messageContent":"def鍔犲叆浜嗙兢缁?",
      //     "messageId": 144,
      //     "messageType": 9,
      //     "sendTime": 1732889832540,
      //     "sendUserId": null,
      //     "sendUserNickName": null,
      //     "sessionId": "ad9cb277dee0d0386e7247753a40dd24",
      //     "status": 1
      // }
        const newAvatar = {
          contactId: message.contactId,
          url: message.avatarUrl
        }
        await saveAvatar(newAvatar)
        const session = await selectSessionBySessionId(message.sessionId)
        console.log("ws9,session:")
        console.log(session)
        const newSession = {
          contactId: message.contactId,
          contactType: message.contactType,
          sessionId: message.sessionId,
          status: message.status,
          contactName: message.contactName,
          lastMessage: message.lastMessage,
          lastReceiveTime: message.sendTime
        }
        await saveSession(newSession)
        const newMessage = {
          // "contactId": message.contactId,
          contactType: message.contactType,
          // "lastMessage": message.lastMessage,
          messageContent: message.messageContent,
          messageId: message.messageId,
          messageType: message.messageType,
          sendTime: message.sendTime,
          sessionId: message.sessionId,
          status: message.status
        }
        await saveMessage(newMessage)
        if (session.length == 0) {
          console.log("addNewGroup")
          sender.send('addNewGroup', {
            contactId: message.contactId,
            contactName: message.contactName,
            avatarUrl: message.avatarUrl
          })
        }
        if (session.length == 0 || session.status == 0) {
          console.log("receiveNewSession")
          newSession.url = message.avatarUrl
          newSession.topType = 0
          console.log(newSession)
          sender.send('receiveNewSession', newSession)
        }
        sender.send('reciveSingleMessage', newMessage)
        break
      }
      case 10: {
        //更新群昵称
        console.log('更新群昵称')
        const newSession = {
          contactId: message.contactId,
          contactType: message.contactType,
          sessionId: message.sessionId,
          status: message.status,
          contactName: message.contactName,
          lastMessage: message.lastMessage,
          lastReceiveTime: message.sendTime
        }
        await saveSession(newSession)
        const newMessage = {
          // "contactId": message.contactId,
          contactType: message.contactType,
          // "lastMessage": message.lastMessage,
          messageContent: message.messageContent,
          messageId: message.messageId,
          messageType: message.messageType,
          sendTime: message.sendTime,
          sessionId: message.sessionId,
          status: message.status
        }
        await saveMessage(newMessage)
        sender.send('reciveSessionAndMessage', newSession, newMessage)
        sender.send('changeGroupName', {
          contactId: message.contactId,
          contactName: message.contactName
        })
        break
      }
      case 11: //退出群聊
        console.log('退出群聊')
        break
    }
  }

  ws.onclose = function () {
    console.log('客户端close重连')
    reconnect()
  }

  ws.onerror = function () {
    console.log('客户端error重连')
    reconnect()
  }

  setInterval(() => {
    if (ws != null && ws.readyState == 1) {
      // console.log("heart beat");
      ws.send('heart beat')
    }
  }, 5000)
}

const closeWs = () => {
  needReconnect = false
  ws.close()
}

const reconnect = () => {
  if (!needReconnect) {
    console.log('用户退出')
    return
  }
  if (ws != null) {
    ws.close()
  }
  if (reconnectLock) {
    return
  }
  reconnectLock = true
  if (maxReconnectTimes > 0) {
    --maxReconnectTimes
    console.log('剩余重连次数:' + maxReconnectTimes, new Date().getTime())
    setTimeout(() => {
      createWs()
      ws.send('heart beat')
    }, 5000)
  } else {
    console.log('连接超时')
  }
}

export { initWs, closeWs }
