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
import { updateNoReadCount } from './ChatSessionModel'

const saveMessage = (data) => {
  data.userId = store.getUserId()
  return insertOrReplace('chat_message', data)
}

const saveChatMessageBatch = (chatMessageList) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chatSessionCountMap = {}
      chatMessageList.foreach((item) => {
        let contactId = item.contactType == 1 ? item.contactId : item.sendUserId
        let noReadCount = chatSessionCountMap[contactId]
        if (!noReadCount) {
          chatSessionCountMap[contactId] = 1
        } else {
          chatSessionCountMap[contactId] = noReadCount + 1
        }
      })
      //更新未读数
      for (let item in chatSessionCountMap) {
        await updateNoReadCount({ contactId: item, noReadCount: chatSessionCountMap[item] })
      }
      //插入数据
      chatMessageList.foreach(async (item) => {
        await saveMessage(item)
      })
      resolve()
    } catch (error) {
      resolve()
    }
  })
}

const getTotalMessageCount = (sessionId) => {
  let sql = 'select count(*) from chat_message where user_id=? and session_id=?'
  return queryCount(sql, [store.getUserId(), sessionId])
  // return queryCount(sql,[1000,sessionId]);
}

const selectChatMessageByPage = (sessionId, currentPage, pageSize, stratTime) => {
  let sql =
    'SELECT * from chat_message cm left join avatar a on cm.send_user_id = a.id  where user_id=? and session_id=? and send_time<? ORDER BY send_time DESC limit ?,?'
  return queryAll(sql, [store.getUserId(), sessionId, stratTime, currentPage * pageSize, pageSize])
  // return queryAll(sql,[1000,sessionId,stratTime,currentPage*pageSize,pageSize]);
}

export { saveChatMessageBatch, saveMessage, getTotalMessageCount, selectChatMessageByPage }
