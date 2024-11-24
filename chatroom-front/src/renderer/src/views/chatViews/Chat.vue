<template>
    <!-- <div class="div-chatList">
    <div class="div-search">
      <el-input class="conditionInput" v-model="conditionValue" placeholder="" size="small" :prefix-icon="Search" clearable></el-input>
      <el-button class="button-search" type="primary" @click="searchByCondition">搜索</el-button>
    </div>
    <div class="div-chat-record">
      <el-scrollbar>
        <div v-for="item in items" :key="item.id" class="div-chat-record-item" @click="clickChat(item.id)" @contextmenu.stop="onContextMenu(item,$event)" @mouseover="hoverItem(item.id)" @mouseleave="resetHover" :style="getItemStyle(item.id)">
          <div class="div-chat-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
          <div class="div-chat-record-name">
            <el-text style="color: black;" truncated>{{ item.name }}11111111111111111111111111</el-text>
            <el-text size="small" truncated style="margin-top: 4%;">123111111111111111111111</el-text>
          </div>
          <div class="div-chat-record-dateBox">
            <!-- <el-text size="small" style="padding-top: 20%;">11111111</el-text> --
            <div class="div-chat-record-date">11111111</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div class="div-chat" v-if="isSelected()">
    <el-empty style="width: 100%; height: 100%; margin: auto;" description="空空如也" />
  </div>
  <div class="div-chat" v-else>
    <div class="div-chat-name">{{ (selectedId===null)?0:items[selectedId-1].name }}</div>
    <div class="div-chat-dialogue">"dio"</div>
    <div class="div-chat-input">
      <!-- <el-scrollbar> --
        <el-input ref="inputRef" v-model="chatInput" class="el-input-chat-input" :rows="5" type="textarea" input-style="border:none;"></el-input>
      <!-- </el-scrollbar> --
       <el-button class="div-chat-send" type="primary">发送</el-button>
    </div>
  </div> -->

  <div class="div-chatList">
    <div class="div-search">
      <el-input class="conditionInput" v-model="conditionValue" placeholder="" size="small" :prefix-icon="Search" clearable></el-input>
      <el-button class="button-search" type="primary" @click="searchByCondition">搜索</el-button>
    </div>
    <div class="div-chat-record">
      <el-scrollbar>
        <div v-for="(item, index) in chatSessionList" :key="item.sessionId" class="div-chat-record-item" @click="clickChat(item.sessionId,index)" @contextmenu.stop="onContextMenu(item,index,$event)" @mouseover="hoverItem(index)" @mouseleave="resetHover" :style="getItemStyle(index)">
          <div class="div-chat-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
          <div class="div-chat-record-name">
            <el-text style="color: black;" truncated>{{ item.contactName }}</el-text>
            <br/>
            <el-text size="small" truncated style="margin-top: 4%;">{{ item.lastMessage }}</el-text>
          </div>
          <div class="div-chat-record-dateBox">
            <!-- <el-text size="small" style="padding-top: 20%;">11111111</el-text> -->
            <div class="div-chat-record-date">{{ formatDate(item.lastReceiveTime) }}</div>
            <div style="margin-top: 8%; margin-right: 10%; text-align: right;"><el-badge :value="item.noReadCount" :max="99" :show-zero="false"></el-badge></div>
          </div>  
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div class="div-chat" v-if="isSelected()">
    <el-empty style="width: 100%; height: 100%; margin: auto;" description="空空如也" />
  </div>
  <div class="div-chat" v-else>
    <!-- <div class="div-chat-name">{{ (selectedSessionIndex===null)?0:chatSessionList[selectedSessionIndex].contactName }}</div> -->
    <div class="div-chat-name">{{ chatSessionList[selectedSessionIndex].contactName }}</div>
    <!-- <el-scrollbar> -->
      <div class="div-chat-dialogue">
        <el-scrollbar style="flex:1;overflow-x: hidden;width: 100%;">
        <div v-for="item in messageList" :key="item.messageId" style="flex:1;margin: 0;width: 70%;">
          <!-- <div>{{lastDate}}</div> -->
          <div style=" width:100%;text-align: center;" v-if="notSameDate(item.sendTime)"><el-text style="color: grey;text-align: right;">{{ lastDateDisplay }}</el-text></div>
          <div class="div-chat-message-item-self" v-if="item.sendUserId==userId">
            <div class="div-chat-message-name" style="margin-right: 0;width: 100%;">
              <div style="width: 100%; margin-right: 0;text-align: right; "><el-text style="color: black;text-align: right; width: 100%;">{{ formatDate(item.sendTime) }} {{ item.sendUserNickName }}</el-text></div>
              <div style="padding: 5px; background-color: skyblue;"><el-text size="small" style="margin-top: 4%;text-align: right; width: 100%;">{{ item.messageContent }}</el-text></div>
            </div>
            <div class="div-chat-message-avatar" style="margin-right: 0;"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
          </div>
          <div class="div-chat-message-item-other" style="width: 100%;" v-else>
            <div class="div-chat-message-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
            <div class="div-chat-message-name">
              <div><el-text style="color: black;">{{ item.sendUserNickName }} {{ formatDate(item.sendTime) }}</el-text></div>
              <div><el-text size="small" style="margin-top: 4%;">{{ item.messageContent }}</el-text></div>
            </div>
          </div>
        </div>
        </el-scrollbar>
      </div>
    <!-- </el-scrollbar> -->
    <div class="div-chat-input">
      <!-- <el-scrollbar> -->
        <el-input ref="inputRef" v-model="chatInput[selectedSessionId]" class="el-input-chat-input" :rows="5" type="textarea" input-style="border:none;"></el-input>
      <!-- </el-scrollbar> -->
       <el-button class="div-chat-send" type="primary" @click="sendMessage()">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref,reactive,getCurrentInstance,onMounted,watch, onUnmounted } from 'vue';
import { Search} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
import router from '../../router';
// import moment from 'moment/moment';
import moment from 'moment';
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
const {proxy} =getCurrentInstance()
const {ipcRenderer}=require('electron')
const conditionValue=ref("搜索聊天");

const userId=localStorage.getItem("userId");

const selectedSessionId=ref(null);
const selectedSessionIndex=ref(null);
// selectedSessionId.value=localStorage.getItem('selectedSessionId');

const chatSessionList=ref([]);
const currentChatSession=ref({});
const messageList=ref([]);

const lastDate=ref("1970");
let lastDateDisplay="1970";

messageList.value=[
  {sendUserId:"1000",sendUserNickName:"tj",sendTime:132478465,messageContent:"test1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},
  {sendUserId:"1001",sendUserNickName:"wjc",sendTime:132448894,messageContent:"test2"},
  {sendUserId:"1002",sendUserNickName:"yy",sendTime:132474987,messageContent:"test3"},
  {sendUserId:"1000",sendUserNickName:"tj",sendTime:132478465,messageContent:"test1"},
  {sendUserId:"1001",sendUserNickName:"wjc",sendTime:132448894,messageContent:"test2"},
  {sendUserId:"1002",sendUserNickName:"yy",sendTime:132474987,messageContent:"test3"},
  {sendUserId:"1000",sendUserNickName:"tj",sendTime:moment(),messageContent:"test1"},
  {sendUserId:"1001",sendUserNickName:"wjc",sendTime:132448894,messageContent:"test2"},
  {sendUserId:"1002",sendUserNickName:"yy",sendTime:132474987,messageContent:"test3"},
  {sendUserId:"1000",sendUserNickName:"tj",sendTime:132478465,messageContent:"test1"},
  {sendUserId:"1001",sendUserNickName:"wjc",sendTime:132448894,messageContent:"test2"},
  {sendUserId:"1002",sendUserNickName:"yy",sendTime:132474987,messageContent:"test3"},
]


const hoveredIndex=ref(null);
const inputRef=ref(null);
// const chatInput=ref("");
const chatInput=ref({});

const items=reactive([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]);

// initChat(null);
// initChat(selectedId.value);
// onMounted(()=>{
//   selectedId.value = localStorage.getItem('selectedChatId');
// // clickChat(-1);
//   clickChat(selectedId.value);
// })
//在页面加载时，从 localStorage 中读取上次选中的 ID
onMounted(async() => {
  await onReciveMessage();
  await onLoadChatSessionData();
  await loadChatSession();
  // const storedId = Number(localStorage.getItem('selectedSessionId'));
  const storedId = localStorage.getItem('selectedSessionId');
  console.log("storedId"+storedId)
  // const storedId = localStorage.getItem('selectedChatId');
  if (storedId!=null) {
    // selectedId.value = storedId;  // 设置选中的 ID
    // initChat(null);
    console.log("init")
    initChat(storedId);
    // getItemStyle(storedId);
    // changeStyle(storedId);
  }
  // 从 localStorage 中获取字符串
  const storeChatInput = localStorage.getItem('chatInput');

  // 如果 userString 存在，则解析回对象
  chatInput.value = storeChatInput ? JSON.parse(storeChatInput) : null;
});

onUnmounted(()=>{
  console.log("onUnmounted")
  localStorage.setItem("chatInput",JSON.stringify(chatInput.value))
  ipcRenderer.removeAllListeners("reciveMessage")
  ipcRenderer.removeAllListeners("loadChatSessionDataReturn")
})

const onReciveMessage=()=>{
  ipcRenderer.on("reciveMessage",(e,message)=>{
    if(message.messageType==0){
      loadChatSession();
    }
  })
}

const onLoadChatSessionData=()=>{
  ipcRenderer.on("loadChatSessionDataReturn",(e,data)=>{
    chatSessionList.value=data;
    console.log("loadChatSessionDataReturn");
    console.log(chatSessionList.value);
    chatSessionSort();
    const storeSessionId=localStorage.getItem("selectedSessionId");
    if(storeSessionId){
      findSelectedSessionIndex(storeSessionId);
    }
  })
}

const loadChatSession=()=>{
  ipcRenderer.send("loadChatSessionData")
}

const onLoadChatMessageData=()=>{
  // ipcRenderer.on("loadChatSessionDataReturn",(e,data)=>{
  //   chatSessionList.value=data;
  //   console.log("loadChatSessionDataReturn");
  //   console.log(chatSessionList.value);
  //   chatSessionSort();
  //   const storeSessionId=localStorage.getItem("selectedSessionId");
  //   if(storeSessionId){
  //     findSelectedSessionIndex(storeSessionId);
  //   }
  // })
}

// const changeStyle = (id) => {
//   items.forEach
//   items.value.forEach(item => {
//     if (item.id === id) {
//       item.style = { backgroundColor: 'deepskyblue' }; // 选中项变色
//     } else {
//       item.style = {}; // 其他项恢复默认样式
//     }
//   });
// };

  function chatSessionSort(){
    chatSessionList.value.sort((a, b) => {
      // 先比较 x 属性的值
      if (a.topType !== b.topType) {
        return b.topType - a.topType;  // 按照 x 升序排序
      }
      return b.lastReceiveTime - a.lastReceiveTime;
      // if (a.lastReceiveTime !== b.lastReceiveTime) {
      //   return b.lastReceiveTime - a.lastReceiveTime;  // 按照 x 升序排序
      // }
      // // 如果 x 相同，则按 y（字符串）进行升序排序
      // return a.contactName.localeCompare(b.contactName);  // 字符串排序，升序
    });
  }
 
  function findSelectedSessionIndex(sessionId) {
    for(let i=0;i<chatSessionList.value.length;++i){
      if(chatSessionList.value[i].sessionId==sessionId){
        selectedSessionIndex.value=i;
        break;
      }
    }
  }

  // changeStyle(selectedId.value);
  const isSelected=()=>{
    if(selectedSessionIndex.value==null)
      return true;
    return false;
  }

  function initChat(id){
    selectedSessionId.value = id; // 将点击的 item id 记录下来
  }

  function clickChat(sessionId,index){
    selectedSessionId.value=sessionId
    selectedSessionIndex.value = index; // 将点击的 item id 记录下来
    localStorage.setItem('selectedSessionId',selectedSessionId.value);
    localStorage.setItem('selectedSessionIndex',selectedSessionIndex.value);
    chatSessionList.value[index].noReadCount=0;
    ipcRenderer.send("clearNoReadCount",sessionId);
    // console.log(id);
    // if(sessionId)
    //   inputRef.value.focus();
  }
   
  // 鼠标悬停时
  function hoverItem(index) {
    if (selectedSessionIndex.value !== index) { // 如果不是选中的项，则允许改变背景颜色
      hoveredIndex.value = index;
    }
  }
    // 鼠标离开时
  function resetHover() {
    hoveredIndex.value = null;
  }

  // // 动态设置背景颜色
  // function getItemStyle(id) {
  //   return {
  //     backgroundColor: selectedId.value === id ? 'deepskyblue' : 'transparent' // 根据 selectedId 判断背景颜色
  //   };
  // }
  // 根据悬停的id设置样式
  function getItemStyle(index) {
    if (selectedSessionIndex.value === index) {
      return { backgroundColor: 'deepskyblue' }; // 选中的项背景颜色
    } else if (hoveredIndex.value === index) {
      return { backgroundColor: 'lightgrey' }; // 悬停时的背景颜色
    }
    return {}; // 默认背景
  }

  // function formatDate(timestamp){
  //   const timestampTime=moment(timestamp);
  //   const deltsDays=Number.parseInt(moment().format("YYYYMMDD"))-Number.parseInt(timestampTime.format("YYYYMMDD"));
  //   if(deltsDays==0){
  //     return timestampTime.format("HH:mm")
  //   }else if(2<=deltsDays&&deltsDays<7){
  //     return timestampTime.format("dddd");
  //   }else{
  //     return timestampTime.format("YY/MM/DD");
  //   }
  // }

  function formatDate(timestamp) {
    const timestampTime = moment(timestamp);  // 使用 moment 解析时间戳
    const now = moment(); // 当前时间
    const deltsDays = now.diff(timestampTime, 'days'); // 计算日期差（单位：天）

    if (deltsDays === 0) {
      // 今天的时间，显示时分
      return timestampTime.format("HH:mm");
    } else if (deltsDays >= 1 && deltsDays < 7) {
      // 过去 1 到 6 天之间，显示星期几
      return timestampTime.format("dddd");
    } else {
      // 超过 7 天，显示年月日
      return timestampTime.format("YY/MM/DD");
    }
  }

  function notSameDate(timestamp){
    const temp=formatDate(timestamp);
    if(temp!=lastDateDisplay){
      lastDateDisplay=temp;
      lastDate.value=temp;
      return true;
    }
    return false;
  }

  function setTopSession(contactId,topType){
    ipcRenderer.send("setTopSession",{contactId:contactId,topType:topType});
  }

  function deleteSessionList(contactId){
    chatSessionList.value=chatSessionList.value.filter((item)=>{
      return item.contactId!==contactId;
    })
  }

  function deleteSession(contactId){
    deleteSessionList(contactId);
    ipcRenderer.send("deleteSession",contactId);
  }

  function onContextMenu(data,index,e){
    ContextMenu.showContextMenu({
      x:e.x,
      y:e.y,
      items:[
        {
          label:data.topType==0?'置顶':'取消置顶',
          onClick:()=>{
            console.log("置顶")
            ContextMenu.closeContextMenu();
            chatSessionList.value[index].topType=(chatSessionList.value[index].topType==0)?1:0;
            chatSessionSort();
            findSelectedSessionIndex(selectedSessionId.value);
            setTopSession(data.contactId,chatSessionList.value[index].topType)
            
          }
        },{
          label:'删除聊天',
          onClick:()=>{
            console.log("删除聊天")
            ElMessageBox.confirm(
              '确定删除?',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info', 
                customClass: 'my-custom-message-box' // 添加自定义类
              }
            )
            .then(() => {
              if(index==selectedSessionIndex.value){
                selectedSessionId.value=null;
                localStorage.setItem("selectedSessionId",null);
                selectedSessionIndex.value=null;
              }else if(index<selectedSessionIndex.value){
                --selectedSessionIndex.value;
              }
              deleteSession(data.contactId)
            })
            // proxy.Confirm({
            //   message:'确定删除?',
            //   okfun:()=>{
            //     deleteSession(data.contactId)
            //   }
            // })
          }
        }
      ]
    })
  }

  function sendMessage(){

  }
</script>

<style lang="less" scoped>
.div-chatList{
// display: flex; 
justify-content: space-between;
align-items: center;
// background-color: rgb(137, 147, 150);
background-color: rgb(231, 233, 235); 
width: 25%;
color: rgb(122, 158, 191);
padding: 0;
}

.div-search{
display: flex; 
justify-content: space-between;
align-items: center;
// background-color: rgb(137, 147, 150);
background-color: rgb(248, 248, 245);
color: rgb(122, 158, 191);
// padding: 0;
// margin-top: 5%;
// margin-bottom: 5%;
padding-top: 5%;
padding-bottom: 5%;
margin: 0;
}

.conditionInput{
  width: 70%;
  height: 75%;
  margin-left: 6%;
  margin-top: auto;
  margin-bottom: auto;
}

.button-search{
  width: 15%;
  height: 24px;
  margin-left: 3%;
  margin-right: 5%;
  margin-top: auto;
  margin-bottom: auto;
}

.div-chat-avatar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-left: 6%;
    padding: auto;
    // width: 20%;
}

.div-chat-record-name{
  margin-top: auto;
  margin-bottom: auto;
  width: 45%;
  // max-width: 45%;
}

.div-chat-record-dateBox{
  margin: 0;
  width: 29%;
}

.div-chat-record-date{
  margin-top: 8%;
  margin-right: 10%; 
  font-size: small;
  text-align: right;
  color: gray;
}

.user-avatar{
    // margin: auto,auto,auto,100px;
    margin: 0;
    // margin-left: auto;
}

.div-chat-record{
  // display: flex; 
  height: 92%;
  overflow-y: auto; /* 只显示垂直滚动条 */
  overflow-x: hidden;
}

.div-chat-record-item{
  display: flex; 
}

// .div-chat-record-item:hover{
//   background-color: rgb(209, 208, 208) !important;
// }

.div-chat{
  // display: flex;
  // background-color: rgb(178, 219, 139); 
  background-color: white;
  width: 69%;
}

.div-chat-name{
  // height: 10%;
  // padding: 0;
  // // margin-top: 5%;
  // // margin-bottom: 5%;
  // margin: 0;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 2%;
  margin: 0;
  // border-color: black;
  // border-width: 2px;
  border-bottom:solid silver;
  // border-bottom: ;
}

.div-chat-dialogue{
  padding-top: 2%;
  padding-bottom: 2%;
  // padding-left: 2%;
  // padding-right: 2%;
  height: 55%;
  margin: 0;
  width: 100%;
  overflow-y: auto; /* 只显示垂直滚动条 */
  overflow-x: hidden;
  display: flex;
//   display: grid;
// //   grid-template-columns: 1fr 1fr 1fr;
//   grid-template-columns: 1fr; /* 创建 3 列，每列占 1fr 的宽度 */
//   // gap: 20px;
//   align-items: center; /* 垂直居中 */
//   justify-items: center; /* 水平居中 */
}

.div-chat-input{
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 2%;
  padding-right: 2%;
  margin: 0;
  border-top:solid silver;
  height: 40%;
  overflow: hidden;
}

.el-input-chat-input{
  width: 100%;
  height: auto;
  border: none;

}

.div-chat-send{
  height: 10%;
  width: 10%;
  margin-top: 2%;
  margin-bottom: auto;
  // padding-top: auto;
  // padding-bottom: auto;
  margin-left: 90%;

}

.my-custom-message-box .el-message-box__btns{
  display: flex;
}

.my-custom-message-box .el-button {
  /* background-color: #009688 !important; */
  width: 40%;
}

.my-custom-message-box .el-button--primary {
  /* background-color: #009688 !important; */
  margin-left: auto;
  width: 40%;
}

.div-chat-message-item-self{
  display: flex;
  //width: 80vw;
  width: 100%;
  margin-right: 0;
  margin-left: 30%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.div-chat-message-item-other{
  display: flex;
  width: 80%;
  margin-left: 40%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.div-chat-message-avatar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-right: 0;
    // margin-left: 6%;
    padding: auto;
    padding-right: 0;
    width: 5%;
}

.div-chat-message-name{
  margin-top: auto;
  margin-bottom: auto;
  max-width: 50%;
  overflow: hidden;
  // width: 45%;
  // max-width: 45%;
}
</style>