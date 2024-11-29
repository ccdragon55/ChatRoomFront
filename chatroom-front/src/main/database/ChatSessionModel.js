import {
  run,
  queryAll,
  queryOne,
  queryCount,
  insert,
  insertOrReplace,
  insertOrIgnore,
  update,
  createTable
} from './ADB'
import store from '../store'
import { addChatAvatar, selectUserAvatarByContactId, updateChatAvatar } from './AvatarModel'

const updateChatSession = (sessionInfo) => {
  const paramData = {
    userId: store.getUserId(),
    contactId: sessionInfo.contactId
  }
  const updateInfo = Object.assign({}, sessionInfo)
  updateInfo.userId = null
  updateInfo.contactId = null
  return update('chat_session_user', updateInfo, paramData)
}

const saveOrUpdateChatSessionBatch4Init = (chatSessionList) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < chatSessionList.length; ++i) {
        const sessionInfo = chatSessionList[i]
        sessionInfo.status = 1
        let avatarData = await selectUserAvatarByContactId(sessionInfo.contactId)
        console.log('sessionInfo.avatarUrl')
        console.log(sessionInfo.avatarUrl)
        if (sessionInfo.avatarUrl) {
          if (avatarData) {
            console.log('avatarData')
            console.log(avatarData)
            console.log('updateChatAvatar')
            await updateChatAvatar(sessionInfo.contactId, sessionInfo.avatarUrl)
          } else {
            console.log('addChatAvatar')
            await addChatAvatar(sessionInfo.contactId, sessionInfo.avatarUrl)
          }
        }
        // if (avatarData) {
        //     if(sessionInfo.avatar){
        //         await updateChatAvatar(sessionInfo.contactId,sessionInfo.avatarUrl)
        //     }
        // } else {
        //     await addChatAvatar(sessionInfo.contactId,sessionInfo.avatarUrl)
        // }
        sessionInfo.avatarUrl = null
        let sessionData = await selectUserSessionByContactId(sessionInfo.contactId)
        if (sessionData) {
          await updateChatSession(sessionInfo)
        } else {
          await addChatSession(sessionInfo)
        }
      }
      resolve()
    } catch (error) {
      resolve()
    }
  })
}

const saveSession = (data) => {
  data.userId = store.getUserId()
  return insertOrReplace('chat_session_user', data)
}

const selectUserSessionByContactId = (contactId) => {
  let sql = 'select * from chat_session_user where user_id=? and contact_id=?'
  return queryOne(sql, [store.getUserId(), contactId])
}

const addChatSession = (sessionInfo) => {
  sessionInfo.userId = store.getUserId()
  insertOrIgnore('chat_session_user', sessionInfo)
}

//更新未读数
const updateNoReadCount = (contactId, noReadCount) => {
  let sql =
    'update chat_session_user set no_read_count=no_read_count+? where user_id=? and contact_id=?'
  return run(sql, [noReadCount, store.getUserId(), contactId])
}

const selectUserSessionList = () => {
  let sql =
    'select * from chat_session_user csu left join avatar a on csu.contact_id = a.id where user_id=? and status=1'
  return queryAll(sql, [store.getUserId()])
  // return queryAll(sql,[1000]);
}

const showChatSession = (contactId) => {
  const param = {
    userId: store.getUserId(),
    contactId: contactId
  }
  const info = {
    status: 1
  }
  return update('chat_session_user', info, param)
}

const delChatSession = (contactId) => {
  const param = {
    userId: store.getUserId(),
    contactId: contactId
  }
  const info = {
    status: 0
  }
  return update('chat_session_user', info, param)
}

const getChatSessionStatus = (contactId) => {
  let sql = 'select status from chat_session_user where user_id=? and contact_id=?'
  return queryOne(sql, [store.getUserId(), contactId])
}

const getChatSessionByContactId = (contactId) => {
  let sql = 'select * from chat_session_user csu left join avatar a on csu.contact_id = a.id where user_id=? and contact_id=?'
  return queryOne(sql, [store.getUserId(), contactId])
}

const searchChatSessionByCondition = (condition) => {
  console.log('searchChatSessionByCondition')
  console.log(condition)
  console.log(store.getUserId())
  let sql = `select * from chat_session_user csu left join avatar a on csu.contact_id = a.id where user_id=? and status=1 and contact_name LIKE '%${condition.split(' ').join('%')}%'`
  // let sql=`select * from chat_session_user where user_id=? and status=1 and contact_name LIKE '%${condition}%'`;
  console.log(sql)
  return queryAll(sql, [store.getUserId()])
}

const selectSessionBySessionId = (sessionId) => {
  let sql = `select * from chat_session_user csu left join avatar a on csu.contact_id = a.id where user_id=? and session_id=?`
  console.log(sql)
  return queryAll(sql, [store.getUserId(), sessionId])
}

const updateChatSessionLastInfo = (contactId, lastMessage, lastReceiveTime) => {
  const param = {
    userId: store.getUserId(),
    contactId: contactId
  }
  const info = {
    lastMessage: lastMessage,
    lastReceiveTime: lastReceiveTime
  }
  // console.log(info);
  return update('chat_session_user', info, param)
}

const updateChatSessionLastInfoAndShow = (contactId, lastMessage, lastReceiveTime) => {
  const param = {
    userId: store.getUserId(),
    contactId: contactId
  }
  const info = {
    lastMessage: lastMessage,
    lastReceiveTime: lastReceiveTime,
    status: 1
  }
  // console.log(info);
  return update('chat_session_user', info, param)
}

const setTopSession = (contactId, topType) => {
  const param = {
    userId: store.getUserId(),
    contactId: contactId
  }
  const info = {
    topType: topType
  }
  return update('chat_session_user', info, param)
}

const clearNoReadCount = (sessionId) => {
  const param = {
    userId: store.getUserId(),
    sessionId: sessionId
  }
  const info = {
    noReadCount: 0
  }
  return update('chat_session_user', info, param)
}

export {
  updateChatSession,
  addChatSession,
  saveOrUpdateChatSessionBatch4Init,
  saveSession,
  updateNoReadCount,
  selectUserSessionList,
  showChatSession,
  delChatSession,
  getChatSessionStatus,
  getChatSessionByContactId,
  searchChatSessionByCondition,
  selectSessionBySessionId,
  updateChatSessionLastInfo,
  updateChatSessionLastInfoAndShow,
  setTopSession,
  clearNoReadCount
}
