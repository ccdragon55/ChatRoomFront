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

const os = require('os')
const userDir = os.homedir()
console.log(userDir)
// const dbFolder=userDir+(NODE_ENV==="development"?"/.easychattest/":"/.easychat/");
// const fileFolder=userDir+"/.easychattest/";
// if(!fs.existsSync(fileFolder)){
//     fs.mkdirSync(fileFolder);
// }

const addUserSetting = async (userId, email) => {
  let sql = 'select max(server_port) server_port from user_setting'
  let { serverPort } = await queryOne(sql, [])
  if (serverPort == null) {
    serverPort = 10240
  } else {
    serverPort++
  }
  const sysSetting = {
    localFileFolder: userDir + '\\.easychat\\fileStorage\\'
  }
  sql = 'select * from user_setting where user_id=?'
  const userInfo = await queryOne(sql, [userId])

  let resultServerPort = null
  let loaclFileFolder = sysSetting.localFileFolder + userId
  if (userInfo) {
    await update('user_setting', { email: email }, { userId: userId })
    resultServerPort = userInfo.serverPort
    loaclFileFolder = JSON.parse(userInfo.sysSetting).loaclFileFolder + userId
  } else {
    await insertOrIgnore('user_setting', {
      userId: userId,
      email: email,
      sysSetting: JSON.stringify(sysSetting),
      contactNoRead: 0,
      serverPort: serverPort
    })
    resultServerPort = serverPort
    0
  }
  //启动本地服务
  store.setUserData('localServerPort', resultServerPort)
  store.setUserData('localFileFolder', localFileFolder)
}

export { addUserSetting }
