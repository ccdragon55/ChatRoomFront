import WebSocket from "ws"
const NODE_ENV =process.env.NODE_ENV

import store from "./store"

import { saveOrUpdateChatSessionBatch4Init } from "./database/ChatSessionModel"
import { saveChatMessageBatch } from "./database/ChatMessageModel"

let ws=null
let maxReconnectTimes=null
let wsUrl=null
let sender=null
let needReconnect=null
let reconnectLock=null

const initWs=(config,_sender)=>{
    // wsUrl=`${NODE_ENV !=='development'?store.getDate("prodWsDomain"):store.getDate("devWsDomain")}?token=${config.token}`;
    // sender=_sender;
    // needReconnect=true;
    // maxReconnectTimes=5;
    // reconnectLock=false;
    // createWs();
}

const createWs=()=>{
    if(wsUrl==null){
        return null;
    }
    ws=new WebSocket(wsUrl);

    ws.onopen=function () {
        console.log("客户端连接成功");
        ws.send("heart beat");
        maxReconnectTimes=5;
    }

    ws.onmessage=async function (e) {
        console.log("收到服务器消息"+e.data);
        const message=JSON.parse(e.data);
        const messageType=message.messageType;
        switch(messageType){
            case 0://ws连接成功
            await saveOrUpdateChatSessionBatch4Init(message.extendData.chatSessionList);//保存会话信息
            await saveChatMessageBatch(message.extendData.chatMessageList)//保存消息
            sender.send("reciveMessage",{messageType:message.messageType});
            // sender.send("");
            break;
        }
    }

    ws.onclose=function () {
        console.log("客户端close重连");
        reconnect();
    }

    ws.onclose=function () {
        console.log("客户端error重连");
        reconnect();
    }

    setInterval(()=>{
        if(ws!=null&&ws.readyState==1){
            console.log("发送心跳");
            ws.send("heart beat");
        }
    },5000);
}

const closeWs=()=>{
    needReconnect=false;
    ws.close();
}

const reconnect=()=>{
    if(!needReconnect){
        console.log("用户退出")
        return ;
    }
    if(ws!=null){
        ws.close();
    }
    if(reconnectLock){
        return ;
    }
    reconnectLock=true;
    if(maxReconnectTimes>0){
        --maxReconnectTimes;
        console.log("剩余重连次数:"+maxReconnectTimes,new Date().getTime());
        setTimeout(()=>{
            createWs();
            ws.send("heart beat")
        },5000);
    }else{
        console.log("连接超时");
    }
}

export{
    initWs
}