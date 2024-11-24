import{
    run,
    queryAll,
    queryOne,
    queryCount,
    insert,
    insertOrReplace,
    insertOrIgnore,
    update,
    createTable
} from "./ADB"
import store from "../store";
import { updateNoReadCount } from "./ChatSessionModel";

const saveMessage=(data)=>{
    data.userId=store.getUserId();
    return insertOrReplace("chat_message",data);
}

const saveChatMessageBatch=(chatMessageList)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const chatSessionCountMap={};
            chatMessageList.foreach(item=>{
                let contactId=item.contactType==1?item.contactId:item.sendUserId;
                let noReadCount=chatSessionCountMap[contactId];
                if(!noReadCount){
                    chatSessionCountMap[contactId]=1;
                }else{
                    chatSessionCountMap[contactId]=noReadCount+1;
                }
            });
            //更新未读数
            for(let item in chatSessionCountMap){
                await updateNoReadCount({contactId:item,noReadCount:chatSessionCountMap[item]});
            }
            //插入数据
            chatMessageList.foreach(async item=>{
                await saveMessage(item);
            });
            resolve();
        }catch(error){
            resolve();
        }
    })
}

export{
    saveChatMessageBatch
}