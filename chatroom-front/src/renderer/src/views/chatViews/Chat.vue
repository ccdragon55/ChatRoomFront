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
      <el-input
        class="conditionInput"
        v-model="conditionValue"
        placeholder=""
        size="small"
        :prefix-icon="Search"
        clearable
      ></el-input>
      <el-button class="button-search" type="primary" @click="searchChatSessionByCondition()"
        >搜索</el-button
      >
    </div>
    <div class="div-chat-record">
      <el-scrollbar>
        <div
          v-for="(item, index) in chatSessionList"
          :key="item.sessionId"
          class="div-chat-record-item"
          @click="clickChat(item.sessionId, index)"
          @contextmenu.stop="onContextMenu(item, index, $event)"
          @mouseover="hoverItem(index)"
          @mouseleave="resetHover"
          :style="getItemStyle(index)"
        >
          <div class="div-chat-avatar">
            <el-avatar class="user-avatar" :src="item.url" icon="el-icon-user-solid"></el-avatar>
          </div>
          <div class="div-chat-record-name">
            <el-text style="color: black" truncated>{{ item.contactName }}</el-text>
            <br />
            <el-text size="small" truncated style="margin-top: 4%">{{ item.lastMessage }}</el-text>
          </div>
          <div class="div-chat-record-dateBox">
            <!-- <el-text size="small" style="padding-top: 20%;">11111111</el-text> -->
            <div class="div-chat-record-date">{{ formatDate(item.lastReceiveTime) }}</div>
            <div style="margin-top: 8%; margin-right: 10%; text-align: right">
              <el-badge :value="item.noReadCount" :max="99" :show-zero="false"></el-badge>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div class="div-chat" v-if="isSelected()">
    <el-empty style="width: 100%; height: 100%; margin: auto" description="空空如也" />
  </div>
  <div class="div-chat" v-else>
    <!-- <div class="div-chat-name">{{ (selectedSessionIndex===null)?0:chatSessionList[selectedSessionIndex].contactName }}</div> -->
    <div class="div-chat-name">{{ chatSessionList[selectedSessionIndex].contactName }}</div>
    <!-- <el-scrollbar> -->
    <div class="div-chat-dialogue">
      <el-scrollbar style="width: 100%" ref="dialogueScrollbar" @scroll="handleScroll">
        <div style="width: 100%; overflow-x: hidden">
          <div
            v-for="(item, index) in messageList"
            :key="item.messageId"
            style="margin: 0; width: 100%"
          >
            <!-- <div>{{lastDate}}</div> -->
            <div style="width: 100%; text-align: center" v-if="notSameDate(item.sendTime, index)">
              <!-- <el-text style="color: grey; text-align: right">{{ lastDateDisplay }}</el-text> -->
              <el-text style="color: grey; text-align: right">{{ item.date }}</el-text>
            </div>
            <div style="width: 100%" v-if="sendUser(item.sendUserId) == 1">
              <div class="div-chat-message-item-self">
                <div class="div-chat-message-name" style="margin-right: 0; width: 100%">
                  <div style="width: 100%; margin-right: 0; text-align: right">
                    <el-text style="color: black; text-align: right; width: 100%"
                      >{{ formatDate(item.sendTime) }} {{ item.sendUserNickName }}</el-text
                    >
                  </div>
                  <div style="display: flex; justify-content: right">
                    <div
                      style="
                        margin: 5px;
                        margin-right: 0;
                        padding: 5px;
                        background-color: deepskyblue;
                        border-radius: 10px;
                        max-width: 96%;
                      "
                    >
                      <el-text
                        size="small"
                        style="margin-top: 4%; text-align: right; width: 100%; color: white"
                        >{{ item.messageContent }}</el-text
                      >
                    </div>
                  </div>
                </div>
                <div class="div-chat-message-avatar" style="margin-right: 0">
                  <el-avatar
                    class="user-avatar"
                    :src="item.url"
                    icon="el-icon-user-solid"
                  ></el-avatar>
                </div>
              </div>
            </div>

            <div style="width: 100%; text-align: center" v-else-if="sendUser(item.sendUserId) == 0">
              <el-text style="color: grey; text-align: right">{{ item.messageContent }}</el-text>
            </div>

            <div class="div-chat-message-item-other" style="width: 100%" v-else>
              <div class="div-chat-message-avatar" style="margin-left: 0; text-align: right">
                <el-avatar
                  class="user-avatar"
                  :src="item.url"
                  icon="el-icon-user-solid"
                ></el-avatar>
              </div>
              <div class="div-chat-message-name">
                <div>
                  <el-text style="color: black"
                    >{{ item.sendUserNickName }} {{ formatDate(item.sendTime) }}</el-text
                  >
                </div>
                <div style="display: flex; justify-content: left">
                  <div
                    style="
                      margin: 5px;
                      margin-left: 0;
                      padding: 5px;
                      background-color: gainsboro;
                      border-radius: 10px;
                      max-width: 96%;
                    "
                  >
                    <el-text size="small" style="color: black">{{ item.messageContent }}</el-text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- </el-scrollbar> -->
    <div class="div-chat-input">
      <!-- <el-scrollbar> -->
      <el-button style="height: 2%; width: 2%" @click="call"
        ><el-icon><Phone /></el-icon
      ></el-button>
      <el-input
        ref="inputRef"
        v-model="chatInputContext"
        class="el-input-chat-input"
        :rows="5"
        type="textarea"
        input-style="border:none;"
      ></el-input>
      <!-- </el-scrollbar> -->
      <el-button class="div-chat-send" type="primary" @click="sendMessage()">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  onUnmounted,
  computed,
  nextTick
} from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, messageTypes } from 'element-plus'
import router from '../../router'
import { Phone } from '@element-plus/icons-vue'
// import moment from 'moment/moment';
import moment from 'moment'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import instance from '../../axios'
const { proxy } = getCurrentInstance()
const { ipcRenderer } = require('electron')
const conditionValue = ref('搜索聊天')

const userId = localStorage.getItem('userId')

const selectedSessionId = ref(null)
const selectedSessionIndex = ref(null)
// selectedSessionId.value=localStorage.getItem('selectedSessionId');

const chatSessionList = ref([])
const currentChatSession = ref({})

let currentPage = 0
const pageSize = 10
let totalMessage = 0
let startTime = 0
const messageList = ref([])

const lastDate = ref('1970')
let lastDateDisplay = '1970'

const dialogueScrollbar = ref(null)

// messageList.value = [
//   {
//     sendUserId: '1000',
//     sendUserNickName: 'tj',
//     sendTime: 132478465,
//     messageContent: 'test11111111'
//   },
//   { sendUserId: '1001', sendUserNickName: 'wjc', sendTime: 132448894, messageContent: 'test2' },
//   { sendUserId: '1002', sendUserNickName: 'yy', sendTime: 132474987, messageContent: 'test3' },
//   { sendUserId: '1000', sendUserNickName: 'tj', sendTime: 132478465, messageContent: 'test1' },
//   { sendUserId: '1001', sendUserNickName: 'wjc', sendTime: 132448894, messageContent: 'test2' },
//   { sendUserId: '1002', sendUserNickName: 'yy', sendTime: 132474987, messageContent: 'test3' },
//   { sendUserId: '1000', sendUserNickName: 'tj', sendTime: moment(), messageContent: 'test1' },
//   { sendUserId: '1001', sendUserNickName: 'wjc', sendTime: 132448894, messageContent: 'test2' },
//   { sendUserId: '1002', sendUserNickName: 'yy', sendTime: 132474987, messageContent: 'test3' },
//   { sendUserId: '1000', sendUserNickName: 'tj', sendTime: 132478465, messageContent: 'test1' },
//   { sendUserId: '1001', sendUserNickName: 'wjc', sendTime: 132448894, messageContent: 'test2' },
//   { sendUserId: '1002', sendUserNickName: 'yy', sendTime: 132474987, messageContent: 'test3' }
// ]

const hoveredIndex = ref(null)
const inputRef = ref(null)
// const chatInput=ref("");
const chatInput = reactive({})
// const chatInput=ref({})

// function chatInputContext(sessionId){
//   return sessionId?chatInput[sessionId]:'';
// }

const chatInputContext = computed({
  get() {
    // console.log("get chatInput[selectedSessionId.value]:"+chatInput[selectedSessionId.value])
    return selectedSessionId.value != null ? chatInput[selectedSessionId.value] : ''
  },
  set(value) {
    // console.log("setChatInput")
    // console.log(selectedSessionId.value)
    if (selectedSessionId.value != null) {
      chatInput[selectedSessionId.value] = value
      // console.log("chatInput[selectedSessionId.value]:"+chatInput[selectedSessionId.value])
      // console.log("value:"+value)
    }
  }
})

// 通过 computed 实现 chatInput 和 input 的双向绑定
// const chatInputContext = computed({
//   get() {
//     // 当 selectedSessionId 或 chatInput 改变时，返回对应的会话内容
//     console.log("get chatInput[selectedSessionId.value]:", chatInput[selectedSessionId.value]);
//     return chatInput[selectedSessionId.value] || '';
//   },
//   set(value) {
//     // 当输入框的值改变时，更新 chatInput 中对应会话的内容
//     console.log("set chatInput[selectedSessionId.value]:", value);
//     chatInput[selectedSessionId.value] = value;
//   }
// });

// 监听 selectedSessionId 变化，切换时自动更新输入框内容
watch(
  () => selectedSessionId.value,
  (newValue) => {
    // console.log('Selected session changed to:', newValue);
    // 当 selectedSessionId 变化时，自动更新输入框内容
    if (newValue) {
      chatInputContext.value = chatInput[newValue] // 这会触发 input 更新
    }
  }
)

const handleScroll = () => {
  const scrollTop = dialogueScrollbar.value.$el.querySelector('.el-scrollbar__wrap').scrollTop
  if (scrollTop === 0) {
    console.log('Scrolled to the top')
    console.log(currentPage)
    console.log(totalMessage)
    if (currentPage < totalMessage) {
      loadChatMessageData(selectedSessionId.value)
    }
  }
}

function sendUser(sendUserId) {
  if (sendUserId == null) {
    return 0
  } else if (sendUserId == userId) {
    return 1
  } else {
    return -1
  }
}

const items = reactive([
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' },
  // { id: 1, name: 'Item 1' },
  // { id: 2, name: 'Item 2' },
  // { id: 3, name: 'Item 3' }
])

// 快捷键事件处理函数
const handleKeydown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    sendMessage()
  }
}

// initChat(null);
// initChat(selectedId.value);
// onMounted(()=>{
//   selectedId.value = localStorage.getItem('selectedChatId');
// // clickChat(-1);
//   clickChat(selectedId.value);
// })
//在页面加载时，从 localStorage 中读取上次选中的 ID
onMounted(async () => {
  onReciveMessage()
  onLoadChatSessionData()
  onGetTotalMessageCount()
  onLoadChatMessageData()
  onShowChatSession()
  onReciveSingleMessageUpdateChatSession()
  onReciveSingleMessage()
  onSearchChatSessionByCondition()
  onReceiveNewSession()
  onReciveSessionAndMessage()
  loadChatSession()
  window.addEventListener('keydown', handleKeydown)
  // await onReciveMessage();
  // await onLoadChatSessionData();
  // await loadChatSession();
  // const storedId = Number(localStorage.getItem('selectedSessionId'));
  const storedId = localStorage.getItem('selectedSessionId')
  console.log('storedId' + storedId)
  // const storedId = localStorage.getItem('selectedChatId');
  if (storedId != null) {
    // selectedId.value = storedId;  // 设置选中的 ID
    // initChat(null);
    console.log('init')
    totalMessage = 0
    currentPage = 0
    startTime = Date.now()
    ipcRenderer.send('getTotalMessageCount', storedId)
    loadChatMessageData(storedId)
    initChat(storedId)

    // getItemStyle(storedId);
    // changeStyle(storedId);
  }
  // 从 localStorage 中获取字符串
  const storeChatInput = localStorage.getItem('chatInput')

  // 如果 userString 存在，则解析回对象
  chatInput.value = storeChatInput ? JSON.parse(storeChatInput) : null
  // selectedSessionIndex.value=0
  nextTick(() => {
    const scrollbarElement = dialogueScrollbar.value.$el.querySelector('.el-scrollbar__wrap')
    scrollbarElement.scrollTop = scrollbarElement.scrollHeight // 滚动到最底部
  })
})

onUnmounted(() => {
  console.log('onUnmounted')
  localStorage.setItem('chatInput', JSON.stringify(chatInput.value))
  ipcRenderer.removeAllListeners('reciveMessage')
  ipcRenderer.removeAllListeners('loadChatSessionDataReturn')
  ipcRenderer.removeAllListeners('getTotalMessageCountReturn')
  ipcRenderer.removeAllListeners('getLoadChatMessageDataReturn')
  ipcRenderer.removeAllListeners('showChatSessionReturn')
  ipcRenderer.removeAllListeners('reciveSingleMessageUpdateChatSession')
  ipcRenderer.removeAllListeners('reciveSingleMessage')
  ipcRenderer.removeAllListeners('searchChatSessionByConditionReturn')
  ipcRenderer.removeAllListeners('receiveNewSession')
  ipcRenderer.removeAllListeners('reciveSessionAndMessage')
  window.removeEventListener('keydown', handleKeydown)
})

const onReciveMessage = () => {
  ipcRenderer.on('reciveMessage', (e, message) => {
    if (message.messageType == 0) {
      loadChatSession()
    }
  })
}

const onLoadChatSessionData = () => {
  ipcRenderer.on('loadChatSessionDataReturn', (e, data) => {
    chatSessionList.value = data
    console.log('loadChatSessionDataReturn')
    console.log(chatSessionList.value[0])
    console.log(chatSessionList.value[1])
    console.log(chatSessionList.value[2])
    chatSessionSort()
    const storeSessionId = localStorage.getItem('selectedSessionId')
    if (storeSessionId) {
      findSelectedSessionIndex(storeSessionId)
    }
  })
}

const loadChatSession = () => {
  ipcRenderer.send('loadChatSessionData')
}

// const onLoadChatMessageData=()=>{
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
// }

const onGetTotalMessageCount = () => {
  ipcRenderer.on('getTotalMessageCountReturn', (e, data) => {
    console.log('totalMessage' + data)
    totalMessage = Math.ceil(data / pageSize)
  })
}

const loadChatMessageData = (sessionId) => {
  console.log('loadChatMessageData')
  ipcRenderer.send('loadChatMessageData', {
    sessionId: sessionId,
    currentPage: currentPage,
    pageSize: pageSize,
    stratTime: startTime
  }) //分页查询消息
  currentPage++
}

const onLoadChatMessageData = () => {
  ipcRenderer.on('loadChatMessageDataReturn', (e, data) => {
    console.log('loadChatMessageDataReturn:')
    console.log(data)
    messageList.value.unshift(...data)
    // messageList.value.push(...data)
    console.log(messageList.value)
    for (let i = 0; i < messageList.value.length; ++i) {
      messageList.value[i].date = formatDate(messageList.value[i].sendTime)
    }
    if (currentPage == 1) {
      nextTick(() => {
        console.log(dialogueScrollbar.value)
        const scrollbarElement = dialogueScrollbar.value.$el.querySelector('.el-scrollbar__wrap')
        scrollbarElement.scrollTop = scrollbarElement.scrollHeight // 滚动到最底部
      })
    }
  })
}

const onShowChatSession = () => {
  ipcRenderer.on('showChatSessionReturn', (e, data) => {
    console.log('showChatSessionReturn')
    console.log(data)
    selectedSessionId.value = data.sessionId
    localStorage.setItem('selectedSessionId', selectedSessionId.value)
    if (!findSelectedSessionIndex(data.sessionId)) {
      chatSessionList.value.push(data)
      chatSessionSort()
      findSelectedSessionIndex(data.sessionId)
    }
    // totalMessage = 0
    // currentPage = 0
    // startTime = Date.now()
    // messageList.value.length = 0
    // ipcRenderer.send('getTotalMessageCount', selectedSessionId.value)
    // loadChatMessageData(selectedSessionId.value)
  })
}

const onReciveSingleMessageUpdateChatSession = () => {
  ipcRenderer.on('reciveSingleMessageUpdateChatSession', (e, data) => {
    const newChatSessionId = data.sessionId
    if (newChatSessionId != selectedSessionId.value) {
      ipcRenderer.send('addNoReadCount', data.contactId)
      let flag = true
      for (let i = 0; i < chatSessionList.value.length; ++i) {
        if (chatSessionList.value[i].sessionId == newChatSessionId) {
          chatSessionList.value[i].lastMessage = data.lastMessage
          chatSessionList.value[i].lastReceiveTime = data.lastReceiveTime
          chatSessionList.value[i].noReadCount++
          flag = false
        }
      }
      if (flag) {
        data.noReadCount++
        chatSessionList.value.push(data)
        chatSessionSort()
        findSelectedSessionIndex(newChatSessionId)
      }
    } else {
      chatSessionList.value[selectedSessionIndex.value].lastMessage = data.lastMessage
      chatSessionList.value[selectedSessionIndex.value].lastReceiveTime = data.lastReceiveTime
    }
  })
}

const onReciveSingleMessage = () => {
  ipcRenderer.on('reciveSingleMessage', (e, data) => {
    console.log('reciveSingleMessage')
    console.log(data)
    console.log('selectedSessionId')
    console.log(selectedSessionId.value)
    console.log('data.sessionId')
    console.log(data.sessionId)
    if (selectedSessionId.value == data.sessionId) {
      data.date = formatDate(data.sendTime)
      messageList.value.push(data)
    }
  })
}

const onReciveSessionAndMessage = () => {
  ipcRenderer.on('reciveSessionAndMessage', (e, newSession, newMessage) => {
    const newChatSessionId = newSession.sessionId
    if (newChatSessionId != selectedSessionId.value) {
      let flag = true
      for (let i = 0; i < chatSessionList.value.length; ++i) {
        if (chatSessionList.value[i].sessionId == newChatSessionId) {
          chatSessionList.value[i].lastMessage = newSession.lastMessage
          chatSessionList.value[i].lastReceiveTime = newSession.lastReceiveTime
          chatSessionList.value[i].noReadCount++
          flag = false
        }
      }
      if (flag) {
        newSession.noReadCount++
        chatSessionList.value.push(newSession)
        chatSessionSort()
        findSelectedSessionIndex(newChatSessionId)
      }
    } else {
      chatSessionList.value[selectedSessionIndex.value].lastMessage = newSession.lastMessage
      chatSessionList.value[selectedSessionIndex.value].lastReceiveTime = newSession.lastReceiveTime
      newMessage.date = formatDate(newMessage.sendTime)
      messageList.value.push(newMessage)
    }
  })
}

const searchChatSessionByCondition = () => {
  // if(conditionValue.value.trim()==''){
  //   return;
  // }
  selectedSessionId.value = null
  selectedSessionIndex.value = null
  localStorage.setItem('selectedSessionId', null)
  // console.log(conditionValue.value.trim())
  ipcRenderer.send('searchChatSessionByCondition', conditionValue.value.trim())
}

const onSearchChatSessionByCondition = () => {
  ipcRenderer.on('searchChatSessionByConditionReturn', (e, data) => {
    chatSessionList.value = data
  })
}

const onReceiveNewSession = () => {
  ipcRenderer.on('receiveNewSession', (e, data) => {
    chatSessionList.value.push(data)
    console.log("receiveNewSession")
    chatSessionSort()
    if (selectedSessionId.value) {
      findSelectedSessionIndex(selectedSessionId.value)
    }
  })
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

function chatSessionSort() {
  chatSessionList.value.sort((a, b) => {
    // 先比较 x 属性的值
    if (a.topType !== b.topType) {
      return b.topType - a.topType // 按照 x 升序排序
    }
    return b.lastReceiveTime - a.lastReceiveTime
    // if (a.lastReceiveTime !== b.lastReceiveTime) {
    //   return b.lastReceiveTime - a.lastReceiveTime;  // 按照 x 升序排序
    // }
    // // 如果 x 相同，则按 y（字符串）进行升序排序
    // return a.contactName.localeCompare(b.contactName);  // 字符串排序，升序
  })
}

function findSelectedSessionIndex(sessionId) {
  for (let i = 0; i < chatSessionList.value.length; ++i) {
    if (chatSessionList.value[i].sessionId == sessionId) {
      selectedSessionIndex.value = i
      break
    }
  }
  return false
}

function findSelectedSessionByContactId(contactId) {
  for (let i = 0; i < chatSessionList.value.length; ++i) {
    if (chatSessionList.value[i].contactId == contactId) {
      selectedSessionId.value = chatSessionList.value[i].sessionId
      localStorage.setItemz('selectedSessionId', selectedSessionId.value)
      selectedSessionIndex.value = i
      break
    }
  }
  return false
}

// changeStyle(selectedId.value);
const isSelected = () => {
  if (selectedSessionIndex.value == null) return true
  return false
}

function initChat(id) {
  selectedSessionId.value = id // 将点击的 item id 记录下来
}

function clickChat(sessionId, index) {
  if (selectedSessionId.value == sessionId) {
    return
  }
  selectedSessionId.value = sessionId
  selectedSessionIndex.value = index // 将点击的 item id 记录下来
  localStorage.setItem('selectedSessionId', selectedSessionId.value)
  localStorage.setItem('selectedSessionIndex', selectedSessionIndex.value)
  chatSessionList.value[index].noReadCount = 0
  ipcRenderer.send('clearNoReadCount', sessionId)
  totalMessage = 0
  currentPage = 0
  startTime = Date.now()
  messageList.value.length = 0
  ipcRenderer.send('getTotalMessageCount', sessionId)
  loadChatMessageData(sessionId)
  // const scrollElement = dialogueScrollbar.value.$el;  // 获取 el-scrollbar 的 DOM 元素
  // scrollElement.scrollTop = scrollElement.scrollHeight;  // 滚动到最底部
  nextTick(() => {
    console.log('scrollbar')
    console.log(dialogueScrollbar.value)
    // dialogueScrollbar.value.scrollTo(0, dialogueScrollbar.value.scrollHeight);  // 滚动到最底部
    // 通过 dialogueScrollbar.value.$el 访问实际的 DOM 元素
    const scrollbarElement = dialogueScrollbar.value.$el.querySelector('.el-scrollbar__wrap')
    scrollbarElement.scrollTop = scrollbarElement.scrollHeight // 滚动到最底部
  })
  // dialogueScrollbar.value.scrollTo(0, dialogueScrollbar.value.scrollHeight);  // 滚动到最底部
  // console.log(id);
  // if(sessionId)
  //   inputRef.value.focus();
}

// 鼠标悬停时
function hoverItem(index) {
  if (selectedSessionIndex.value !== index) {
    // 如果不是选中的项，则允许改变背景颜色
    hoveredIndex.value = index
  }
}
// 鼠标离开时
function resetHover() {
  hoveredIndex.value = null
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
    return { backgroundColor: 'deepskyblue' } // 选中的项背景颜色
  } else if (hoveredIndex.value === index) {
    return { backgroundColor: 'lightgrey' } // 悬停时的背景颜色
  }
  return {} // 默认背景
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
  const timestampTime = moment(timestamp) // 使用 moment 解析时间戳
  const now = moment() // 当前时间
  const deltsDays = now.diff(timestampTime, 'days') // 计算日期差（单位：天）

  if (deltsDays === 0) {
    // 今天的时间，显示时分
    return timestampTime.format('HH:mm')
  } else if (deltsDays >= 1 && deltsDays < 7) {
    // 过去 1 到 6 天之间，显示星期几
    return timestampTime.format('dddd')
  } else {
    // 超过 7 天，显示年月日
    return timestampTime.format('YY/MM/DD')
  }
}

function notSameDate(timestamp, index) {
  if (index == 0 || messageList.value[index].date != messageList.value[index - 1].date) {
    return true
  }
  return false
  // const temp = formatDate(timestamp)
  // if (temp != lastDateDisplay) {
  //   lastDateDisplay = temp
  //   lastDate.value = temp
  //   return true
  // }
  // return false
}

function setTopSession(contactId, topType) {
  ipcRenderer.send('setTopSession', { contactId: contactId, topType: topType })
}

function deleteSessionList(contactId) {
  chatSessionList.value = chatSessionList.value.filter((item) => {
    return item.contactId !== contactId
  })
}

function deleteSession(contactId) {
  deleteSessionList(contactId)
  ipcRenderer.send('deleteSession', contactId)
}

function onContextMenu(data, index, e) {
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: data.topType == 0 ? '置顶' : '取消置顶',
        onClick: () => {
          console.log('置顶')
          ContextMenu.closeContextMenu()
          chatSessionList.value[index].topType = chatSessionList.value[index].topType == 0 ? 1 : 0
          chatSessionSort()
          findSelectedSessionIndex(selectedSessionId.value)
          setTopSession(data.contactId, chatSessionList.value[index].topType)
        }
      },
      {
        label: '删除聊天',
        onClick: () => {
          console.log('删除聊天')
          ElMessageBox.confirm('确定删除?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            customClass: 'my-custom-message-box' // 添加自定义类
          }).then(() => {
            if (index == selectedSessionIndex.value) {
              selectedSessionId.value = null
              localStorage.setItem('selectedSessionId', null)
              selectedSessionIndex.value = null
            } else if (index < selectedSessionIndex.value) {
              --selectedSessionIndex.value
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

async function sendMessage() {
  if (selectedSessionId.value == null) {
    return
  }
  if (chatInput[selectedSessionId.value].trim() == '') {
    return
  }
  const index = selectedSessionIndex.value
  const data = {
    userId: localStorage.getItem('userId'),
    sessionId: selectedSessionId.value,
    messageType: 2,
    messageContent: chatInput[selectedSessionId.value],
    contactType: chatSessionList.value[selectedSessionIndex.value].contactType,
    sendUserId: localStorage.getItem('userId'),
    sendUserNickName: localStorage.getItem('nickName'),
    sendTime: Date.now(),
    status: 1
  }
  try {
    const response = await instance.post(
      '/chat/sendMessage',
      {
        contactId: chatSessionList.value[selectedSessionIndex.value].contactId,
        messageType: data.messageType,
        messageContent: data.messageContent
        // contactType:data.contactType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      }
    )
    // console.log("sendMessage:"+response);
    // console.log(response)
    // console.log(response.data.data.messageId)
    data.messageId = response.data.data.messageId
    // console.log(data[messageId])
    ipcRenderer.send('saveSendMessage', data)
    // console.log("ipcRenderer.send(saveSendMessage,data);")
    ipcRenderer.send('updateChatSessionWhenSendMessage', {
      contactId: chatSessionList.value[index].contactId,
      lastMessage: data.messageContent,
      lastReceiveTime: data.sendTime
    })
    // console.log("chatInput.value[data.sessionId]"+chatInput[data.sessionId])
    // console.log("updateChatSessionWhenSendMessage")
    chatInput[data.sessionId] = '' // 清空对应会话的内容
    chatSessionList.value[index].lastMessage = data.messageContent
    chatSessionList.value[index].lastReceiveTime = data.sendTime
    chatSessionSort()
    findSelectedSessionIndex(data.sessionId)
    data.date = formatDate(data.sendTime)
    data.url = localStorage.getItem('selfAvatarUrl')
    messageList.value.push(data)
  } catch {
    ElMessage.error('发送失败')
  }
}
</script>

<style lang="less" scoped>
.div-chatList {
  // display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: rgb(137, 147, 150);
  background-color: rgb(231, 233, 235);
  width: 25%;
  color: rgb(122, 158, 191);
  padding: 0;
}

.div-search {
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

.conditionInput {
  width: 70%;
  height: 75%;
  margin-left: 6%;
  margin-top: auto;
  margin-bottom: auto;
}

.button-search {
  width: 15%;
  height: 24px;
  margin-left: 3%;
  margin-right: 5%;
  margin-top: auto;
  margin-bottom: auto;
}

.div-chat-avatar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  margin-left: 6%;
  padding: auto;
  // width: 20%;
}

.div-chat-record-name {
  margin-top: auto;
  margin-bottom: auto;
  width: 45%;
  // max-width: 45%;
}

.div-chat-record-dateBox {
  margin: 0;
  width: 29%;
}

.div-chat-record-date {
  margin-top: 8%;
  margin-right: 10%;
  font-size: small;
  text-align: right;
  color: gray;
}

.user-avatar {
  // margin: auto,auto,auto,100px;
  margin: 0;
  // margin-left: auto;
}

.div-chat-record {
  // display: flex;
  height: 92%;
  overflow-y: auto; /* 只显示垂直滚动条 */
  overflow-x: hidden;
}

.div-chat-record-item {
  display: flex;
}

// .div-chat-record-item:hover{
//   background-color: rgb(209, 208, 208) !important;
// }

.div-chat {
  // display: flex;
  // background-color: rgb(178, 219, 139);
  background-color: white;
  width: 69%;
}

.div-chat-name {
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
  border-bottom: solid silver;
  // border-bottom: ;
}

.div-chat-dialogue {
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

.div-chat-input {
  padding-top: 0;
  padding-bottom: 2%;
  padding-left: 2%;
  padding-right: 2%;
  margin: 0;
  border-top: solid silver;
  height: 40%;
  overflow: hidden;
}

.el-input-chat-input {
  width: 100%;
  height: auto;
  border: none;
}

.div-chat-send {
  height: 10%;
  width: 10%;
  margin-top: 2%;
  margin-bottom: auto;
  // padding-top: auto;
  // padding-bottom: auto;
  margin-left: 90%;
}

.my-custom-message-box .el-message-box__btns {
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

.div-chat-message-item-self {
  display: flex;
  // display: inline-block;
  //width: 80vw;
  // width: 100%;
  margin-right: 0;
  // margin-left: 30%;
  margin-top: 10px;
  margin-bottom: 10px;
  // margin-left: auto;
  // padding-left: auto;
  // padding-right: auto;
  // flex-shrink: 0;   /* 防止容器缩小 */
  // flex-basis: 100%; /* 初始宽度为父元素的宽度 */
  width: 100%; /* 容器宽度不小于父元素宽度 */
  justify-content: right;
}
.div-chat-message-item-other {
  display: flex;
  // width: 80%;
  // margin-left: 40%;
  // margin-top: 10px;
  // margin-bottom: 10px;
  // display: flex;

  margin-left: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: left;
}

.div-chat-message-avatar {
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  // margin: 10px;
  margin-top: 1%;
  margin-left: 10px;
  margin-right: 10px;
  // margin-left: 6%;
  padding: auto;
  padding-right: 0;
  width: 8%;
}

.div-chat-message-name {
  margin-top: auto;
  margin-bottom: auto;
  max-width: 50%;
  overflow: hidden;
  // width: 45%;
  // max-width: 45%;
}
</style>
