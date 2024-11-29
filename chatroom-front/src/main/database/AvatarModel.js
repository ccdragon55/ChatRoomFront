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

const selectUserAvatarByContactId = (contactId) => {
  let sql = 'select * from avatar where id=?'
  return queryOne(sql, [contactId])
}

const updateChatAvatar = (contactId, url) => {
  const paramData = {
    id: contactId
  }
  const updateInfo = {
    url: url
  }
  return update('avatar', updateInfo, paramData)
}

const addChatAvatar = (contactId, url) => {
  insertOrIgnore('avatar', { id: contactId, url: url })
}

const saveAvatar = (data) => {
  //data对象包含contactId和url
  return insertOrReplace('avatar', data)
}

export { selectUserAvatarByContactId, updateChatAvatar, addChatAvatar, saveAvatar }
