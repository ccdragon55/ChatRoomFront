import { add_tables, add_index, alter_tables } from './Tables'
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const os = require('os')
const NODE_ENV = process.env.NODE_ENV

const userDir = os.homedir()
console.log(userDir)
// const dbFolder=userDir+(NODE_ENV==="development"?"/.easychattest/":"/.easychat/");
const dbFolder = userDir + '/.easychat/'
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder)
}

const db = new sqlite3.Database(dbFolder + 'local.db')
console.log('path:' + dbFolder + 'local.db')
console.log('db:' + db)

// const queryTest=()=>{
//     return new Promise((resolve,reject)=>{
//         console.log("queryTest")
//         const statement=db.prepare("select * from chat_session_user where user_id=? and status=1");
//         console.log(statement);
//         statement.all(["1000"],function(error,row){
//             if(error){
//                 console.log("queryAll error")
//                 resolve([]);
//             }
//             console.log("row1:"+row)
//             row.forEach((item,index)=>{
//                 row[index]=convertToObj(item);
//             })
//             console.log(row)
//             resolve(row);
//         });
//         statement.finalize();
//     })
// }
// queryTest();

const globalColumnsMap = {} //存储数据库中所有表，驼峰命名在数据库中的对应的名称

// const createTable=()=>{
//     return new Promise(async (resolve,reject)=>{
//         for(const item of add_tables){
//             await db.run(item);
//         }
//         for(const item of add_index){
//             await db.run(item);
//         }
//         for(const item of alter_tables){
//             const fieldList=await queryAll(`PRAGMA table_info(${item.tableName})`,[]);
//             const field=fieldList.some(row=>row.name===item.field);
//             if(!field){
//                 await db.run(sql);
//             }
//         }
//         resolve();
//     })
// }

const createTable = async () => {
  try {
    // console.log("createTable");
    // 依次执行创建表语句
    for (const item of add_tables) {
      await db.run(item)
      // console.log("item:"+item)
    }

    // 依次执行添加索引语句
    for (const item of add_index) {
      await db.run(item)
    }

    // 依次执行表结构修改操作
    for (const item of alter_tables) {
      const fieldList = await queryAll(`PRAGMA table_info(${item.tableName})`, [])
      const field = fieldList.some((row) => row.name === item.field)

      if (!field) {
        // 动态构建 ALTER TABLE 语句
        await db.run(item.sql)
      }
    }
  } catch (error) {
    console.error('Error during table creation and modification:', error)
    throw error // 如果发生错误，则抛出错误，`createTable` 的 Promise 会被拒绝
  }
}

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, function (match, p1) {
    return String.fromCharCode(p1.charCodeAt(0) - 32)
  })
}

const convertToObj = (data) => {
  if (!data) {
    return null
  }
  const bizdata = {}
  // let bizdata=data;
  // bizdata.name=toCamelCase(data.name);
  for (let item in data) {
    bizdata[toCamelCase(item)] = data[item]
  }
  return bizdata
}

const queryAll = (sql, params) => {
  return new Promise((resolve, reject) => {
    const statement = db.prepare(sql)
    // console.log(statement);
    statement.all(params, function (error, row) {
      if (error) {
        // console.log("queryAll error")
        resolve([])
      }
      // console.log("row1:"+row)
      row.forEach((item, index) => {
        row[index] = convertToObj(item)
      })
      // console.log(sql)
      // console.log(params)
      // console.log(row)
      resolve(row)
    })
    statement.finalize()
  })
}

const queryOne = (sql, params) => {
  return new Promise((resolve, reject) => {
    const statement = db.prepare(sql)
    statement.get(params, function (error, row) {
      if (error) {
        resolve({})
      }
      resolve(convertToObj(row))
    })
    statement.finalize()
  })
}

const queryCount = (sql, params) => {
  return new Promise((resolve, reject) => {
    const statement = db.prepare(sql)
    statement.get(params, function (error, row) {
      if (error) {
        resolve(0)
      }
      resolve(Array.from(Object.values(row))[0])
    })
    statement.finalize()
  })
}

const run = (sql, params) => {
  //执行sql
  return new Promise((resolve, reject) => {
    const statement = db.prepare(sql)
    statement.run(params, function (error, row) {
      if (error) {
        resolve('操作失败')
      }
      // row.forEach((item,index)=>{
      //     row[index]=convertToObj(item);
      // })
      resolve(this.changes)
    })
    statement.finalize()
  })
}

const insert = (sqlOp, tableName, data) => {
  const columnsMap = globalColumnsMap[tableName]
  const dbColumns = []
  const params = []
  for (let item in data) {
    if (data[item] != undefined && columnsMap[item] != undefined) {
      dbColumns.push(columnsMap[item])
      params.push(data[item])
    }
  }
  const prepare = '?'.repeat(dbColumns.length).split('').join(',')
  const sql = `${sqlOp} ${tableName} (${dbColumns.join(',')}) values (${prepare})`
  console.log('insert:' + sql)
  return run(sql, params)
}

const insertOrReplace = (tableName, data) => {
  return insert('insert or replace into', tableName, data)
}

const insertOrIgnore = (tableName, data) => {
  return insert('insert or Ignore into', tableName, data)
}

const update = (tableName, data, conditions) => {
  const columnsMap = globalColumnsMap[tableName]
  const dbColumns = []
  const params = []
  const updateConditions = []
  for (let item in data) {
    if (data[item] != undefined && columnsMap[item] != undefined) {
      dbColumns.push(`${columnsMap[item]}=?`)
      params.push(data[item])
    }
  }
  for (let item in conditions) {
    if (conditions[item]) {
      params.push(conditions[item])
      updateConditions.push(`${columnsMap[item]}=?`)
    }
  }
  const sql = `update ${tableName} set ${dbColumns.join(',')} ${updateConditions.length > 0 ? 'where' : ''} ${updateConditions.join(' and ')}`
  console.log('update sql:' + sql)
  return run(sql, params)
}

const initTableColumnsMap = async () => {
  let sql = `select name from sqlite_master where type='table' and name!='sqlite_sequence'`
  let tables = await queryAll(sql, [])
  for (let i = 0; i < tables.length; ++i) {
    sql = `PRAGMA table_info(${tables[i].name})`
    let columns = await queryAll(sql, [])
    const columnMapItem = {}
    for (let j = 0; j < columns.length; ++j) {
      columnMapItem[toCamelCase(columns[j].name)] = columns[j].name
    }
    globalColumnsMap[tables[i].name] = columnMapItem
  }
}

const init = () => {
  console.log('create table')
  db.serialize(async () => {
    await createTable()
    await initTableColumnsMap()
  })
}
init()

export {
  run,
  queryAll,
  queryOne,
  queryCount,
  insert,
  insertOrReplace,
  insertOrIgnore,
  update,
  createTable
}
