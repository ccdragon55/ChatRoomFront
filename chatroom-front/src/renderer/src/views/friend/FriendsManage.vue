<template>
  <div class="div-friendsList">
    <div class="div-search">
      <el-input
        class="conditionInput"
        v-model="conditionValue"
        placeholder=""
        size="small"
        :prefix-icon="Search"
        clearable
      ></el-input>
      <el-button class="button-search" type="primary" @click="searchByCondition">搜索</el-button>
    </div>
    <el-scrollbar>
      <div class="div-newFriends">
        <el-button class="el-button-newFriends" type="default" @click="addFriends"
          >加好友/群</el-button
        ><!--@click="toggleSwitch"-->
        <el-button
          class="el-button-newFriends"
          :type="friendRequestButton ? 'primary' : 'default'"
          @click="createGroup"
          >创建群聊</el-button
        >
      </div>

      <!-- <div class="div-newFriends">
        <el-button class="el-button-newFriends" type="default" @click="startRecording"
          >发</el-button
        ><!--@click="toggleSwitch"--
        <el-button
          class="el-button-newFriends"
          :type="friendRequestButton ? 'primary' : 'default'"
          @click="stopRecording"
          >停</el-button
        >
      </div> -->

      <div class="div-friends">
        <el-collapse class="el-collapse-div-friends" v-model="openCollapse" @change="handleChange">
          <el-collapse-item class="el-collapse-item-div-friends" title="群聊" name="群聊">
            <div
              v-for="(item, index) in groupList"
              :key="item.contactId"
              class="div-friends-item"
              @click="clickGroupInfo(item.contactId, index)"
              @mouseover="hoverItemGroupInfo(item.contactId)"
              @mouseleave="resetHoverGroupInfo"
              :style="getItemStyleGroupInfo(item.contactId)"
            >
              <div class="div-friends-avatar">
                <el-avatar
                  class="user-avatar"
                  :src="item.avatarUrl"
                  icon="el-icon-user-solid"
                ></el-avatar>
              </div>
              <div class="div-friends-name">{{ item.contactName }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item
            class="el-collapse-item-div-friends"
            title="好友"
            name="好友"
            style="margin-bottom: 50%"
          >
            <div
              v-for="(item, index) in friendsList"
              :key="item.contactId"
              class="div-friends-item"
              @click="clickFriendInfo(item.contactId, index)"
              @mouseover="hoverItemFriendInfo(item.contactId)"
              @mouseleave="resetHoverFriendInfo"
              :style="getItemStyleFriendInfo(item.contactId)"
            >
              <div class="div-friends-avatar">
                <el-avatar
                  class="user-avatar"
                  :src="item.avatarUrl"
                  icon="el-icon-user-solid"
                ></el-avatar>
              </div>
              <div class="div-friends-name">{{ item.contactName }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-scrollbar>

    <el-dialog title="创建群聊" v-model="createGroupdialogVisble" width="50%">
      <el-form
        ref="form"
        :model="createGroupInfo"
        label-width="150px"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item class="createGroupDialogInput" label="群名称" prop="groupName">
          <el-input v-model="createGroupInfo.groupName" placeholder="请输入群名称"></el-input>
        </el-form-item>
        <el-form-item
          class="createGroupDialogInput"
          label="群公告"
          prop="groupNotice"
          style="width: 90%"
        >
          <!-- <el-input v-model="createGroupInfo.groupNotice" placeholder="请输入群公告"></el-input> -->
          <el-input
            ref="inputRef"
            v-model="createGroupInfo.groupNotice"
            class="el-input-chat-input"
            :rows="5"
            type="textarea"
            placeholder="请输入群公告"
          ></el-input>
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" size="small" @click="createGroupSubmit" style="width: 30%"
            >创建</el-button
          >
          <el-button
            type="info"
            size="small"
            @click="ClosecreateGroupDialog"
            style="width: 30%; margin-left: 25%"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="加好友/群" v-model="addFriendsdialogVisble" width="50%">
      <el-form
        ref="form"
        :model="addFriendsInfo"
        label-width="150px"
        style="margin-left: auto; margin-right: auto"
      >
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="addFriendsInfo.contactType">
            <el-radio value="0" label="好友">好友</el-radio>
            <el-radio value="1" label="群组">群组</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="createGroupDialogInput" label="好友/群id" prop="id">
          <el-input v-model="addFriendsInfo.id" placeholder="请输入好友/群id"></el-input>
        </el-form-item>
        <el-form-item
          class="createGroupDialogInput"
          label="申请信息"
          prop="applyMessage"
          style="width: 90%"
        >
          <el-input
            ref="inputRef"
            v-model="addFriendsInfo.applyMessage"
            class="el-input-chat-input"
            :rows="5"
            type="textarea"
            placeholder="请输入申请信息"
          ></el-input>
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" size="small" @click="addFriendsSubmit" style="width: 30%"
            >发送</el-button
          >
          <el-button
            type="info"
            size="small"
            @click="CloseAddFriendsDialog"
            style="width: 30%; margin-left: 25%"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import instance from '../../axios'
import { ElMessage } from 'element-plus'
const { ipcRenderer } = require('electron')
import { EventBus } from '../../eventBus/eventBus'
const router = useRouter()
const route = useRoute()
const conditionValue = ref('搜索好友/群')

const selectedGroupId = ref(null)
let selectedGroupIndex
const hoveredGroupId = ref(null)
const selectedFriendId = ref(null)
let selectedFriendIndex
const hoveredFriendId = ref(null)
const inputRef = ref(null)
const chatInput = ref('')
const createGroupdialogVisble = ref(false)
const addFriendsdialogVisble = ref(false)
const createGroupInfo = ref({
  groupName: ref(''),
  groupNotice: ref('')
})

const addFriendsInfo = ref({
  id: ref(''),
  contactType: ref('0'),
  applyMessage: ref('')
})

const groupList = reactive([])
const friendsList = reactive([])

let groupListTemp = []
let friendListTemp = []

const openCollapse = ref([])
const friendRequestButton = ref(false)

let alreadyOpen=false

const emit = defineEmits([])

//在页面加载时，从 localStorage 中读取上次选中的 ID
// onMounted(() => {
//     const storedId = Number(localStorage.getItem('selectedId'));
//     if (storedId) {
//         initChat(storedGroupId);
//     }
// });

// // 录音按钮点击事件
// let mediaRecorder;
// let audioChunks = [];
// function startRecording() {
//   console.log("startRecording")
//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//       mediaRecorder = new MediaRecorder(stream);
//       mediaRecorder.ondataavailable = event => {
//         audioChunks.push(event.data);
//       };
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         // 调用后端上传音频
//         uploadAudio(audioBlob);
//         audioChunks = [];
//       };
//       mediaRecorder.start();
//     })
//     .catch(error => {
//       console.error("录音失败:", error);
//     });
// }

// function stopRecording() {
//   console.log("stopRecording")
//   mediaRecorder.stop();
// }

// // 上传音频到服务器
// async function uploadAudio(audioBlob) {
//   const formData = new FormData();
//   formData.append('audio', audioBlob, 'audio.wav');
//   await instance.post("/file/uploadAudio",formData,{
//       headers:{
//         'Content-Type':'multipart/form-data',
//         'token':localStorage.getItem("token")
//       },
//     }).catch((error)=>{
//       ElMessage.error(error)
//     })
//   // fetch('/api/upload_audio', {
//   //   method: 'POST',
//   //   body: formData
//   // })
//   //   .then(response => response.json())
//   //   .then(data => {
//   //     console.log('上传成功:', data);
//   //   })
//   //   .catch(error => {
//   //     console.error('上传失败:', error);
//   //   });
// }

// let mediaRecorder; // 全局变量，管理录音
// let audioChunks = []; // 存储录音的音频数据块

// // 开始录音
// function startRecording() {
//   // 请求音频权限
//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//       mediaRecorder = new MediaRecorder(stream);

//       // 收集录制的音频数据
//       mediaRecorder.ondataavailable = event => {
//         audioChunks.push(event.data);
//       };

//       // 开始录音
//       mediaRecorder.start();
//       console.log("录音已开始");
//     })
//     .catch(error => {
//       console.error("录音失败:", error);
//     });
// }

// // 结束录音并上传
// function stopRecording() {
//   if (!mediaRecorder) {
//     console.error("没有录音正在进行");
//     return;
//   }

//   mediaRecorder.stop(); // 停止录音

//   // 录音停止后触发
//   mediaRecorder.onstop = () => {
//     console.log("录音已结束");

//     // 将录音数据块合并为一个音频文件
//     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//     const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

//     // 清空音频数据
//     audioChunks = [];

//     // 上传音频文件
//     uploadAudio(audioFile);
//   };
// }

// async function uploadAudio(audioBlob) {
//   const formData = new FormData();
//   formData.append('file', audioBlob, 'audio.wav');
//   await instance.post("/file/uploadAudio",formData,{
//       headers:{
//         'Content-Type':'multipart/form-data',
//         'token':localStorage.getItem("token")
//       },
//     }).catch((error)=>{
//       ElMessage.error(error)
//     })
// }

onMounted(() => {
  onAddNewFriend()
  onAddNewGroup()
  onChangeGroupName()
  const storedGroupId = Number(localStorage.getItem('selectedGroupId'))
  if (storedGroupId) {
    selectedGroupId.value = storedGroupId
    router.push('/home/friendsManage/groupChatInfo')
  }
  const storedFriendId = Number(localStorage.getItem('selectedFriendId'))
  if (storedFriendId) {
    selectedFriendId.value = storedFriendId
    router.push('/home/friendsManage/friendProfile')
  }
  console.log('selectedGroupId' + selectedGroupId.value)
  console.log('selectedFriendId' + selectedFriendId.value)
})

onUnmounted(() => {
  ipcRenderer.removeAllListeners('addNewFriend')
  ipcRenderer.removeAllListeners('addNewGroup')
  ipcRenderer.removeAllListeners('changeGroupName')
})

const onAddNewFriend = () => {
  ipcRenderer.on('addNewFriend', (e, data) => {
    friendsList.push(data)
    friendsList.sort((a, b) => a.contactName.localeCompare(b.contactName))
  })
}

const onAddNewGroup=()=>{
  ipcRenderer.on("addNewGroup",(e,data)=>{
    groupList.push(data)
    groupList.sort((a, b) => a.contactName.localeCompare(b.contactName))
  })
}

const onChangeGroupName = () => {
  ipcRenderer.on('changeGroupName', (e, data) => {
    for (let i = 0; i < groupList.length; ++i) {
      if (groupList[i].contactId == data.contactId) {
        groupList[i].contactName = data.contactName
      }
    }
    groupList.sort((a, b) => a.contactName.localeCompare(b.contactName))
  })
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
  // { id: 3, name: 'Item 3' }
])

async function clickGroupInfo(id, index) {
  selectedGroupId.value = id // 将点击的 item id 记录下来
  selectedGroupIndex = index
  selectedFriendId.value = null
  selectedFriendIndex = null
  localStorage.setItem('selectedGroupId', selectedGroupId.value)
  localStorage.setItem('selectedFriendId', null)
  // emit('showGroupInfo',selectedGroupId.value)
  EventBus.$emit('showGroupInfo', selectedGroupId.value)
  router.push('/home/friendsManage/groupChatInfo')
}

// 鼠标悬停时
function hoverItemGroupInfo(id) {
  if (selectedGroupId.value !== id) {
    // 如果不是选中的项，则允许改变背景颜色
    hoveredGroupId.value = id
  }
}
// 鼠标离开时
function resetHoverGroupInfo() {
  hoveredGroupId.value = null
}

// // 动态设置背景颜色
// function getItemStyle(id) {
//   return {
//     backgroundColor: selectedId.value === id ? 'deepskyblue' : 'transparent' // 根据 selectedId 判断背景颜色
//   };
// }
// 根据悬停的id设置样式
function getItemStyleGroupInfo(id) {
  if (selectedGroupId.value === id) {
    return { backgroundColor: 'deepskyblue' } // 选中的项背景颜色
  } else if (hoveredGroupId.value === id) {
    return { backgroundColor: 'lightgrey' } // 悬停时的背景颜色
  }
  return {} // 默认背景
}

async function clickFriendInfo(id, index) {
  // console.log("clickFriendInfo");
  //   const response=await instance.post("/contact/getContact",{
  //     headers: {
  //     'Content-Type': 'application/json',
  //     'token' : localStorage.getItem("token")
  //     },
  //   }).catch(()=>{
  //     ElMessage.error("网络异常");
  //   })
  //   console.log("friendList:")
  //   console.log(response);
  //   friendsList.length=0;
  //   friendsList.push(...response.data.data);
  selectedFriendId.value = id // 将点击的 item id 记录下来
  selectedFriendIndex = index

  selectedGroupId.value = null
  selectedGroupIndex = null
  localStorage.setItem('selectedFriendId', selectedFriendId.value)
  localStorage.setItem('selectedGroupId', null)
  // emit('showFriendInfo',selectedFriendId.value)
  EventBus.$emit('showFriendInfo', selectedFriendId.value)
  router.push('/home/friendsManage/friendProfile')
}

// 鼠标悬停时
function hoverItemFriendInfo(id) {
  if (selectedFriendId.value !== id) {
    // 如果不是选中的项，则允许改变背景颜色
    hoveredFriendId.value = id
  }
}
// 鼠标离开时
function resetHoverFriendInfo() {
  hoveredFriendId.value = null
}

// 根据悬停的id设置样式
function getItemStyleFriendInfo(id) {
  if (selectedFriendId.value === id) {
    return { backgroundColor: 'deepskyblue' } // 选中的项背景颜色
  } else if (hoveredFriendId.value === id) {
    return { backgroundColor: 'lightgrey' } // 悬停时的背景颜色
  }
  return {} // 默认背景
}

// function toggleSwitch() {
//     console.log(friendRequestButton.value)
//     friendRequestButton.value = !friendRequestButton.value;
// }

function searchByCondition() {
  // console.log(conditionValue.value.trim())
  // console.log(groupList)
  // console.log(friendsList)
  selectedFriendId.value = null
  selectedFriendIndex = null
  selectedGroupId.value = null
  selectedGroupIndex = null
  const condition = conditionValue.value.trim()
  if (condition == '') {
    if (groupListTemp.length > 0) {
      groupList.length = 0
      groupList.push(...groupListTemp)
    }
    if (friendListTemp.length > 0) {
      friendsList.length = 0
      friendsList.push(...friendListTemp)
    }
    return
  }
  groupListTemp = []
  friendListTemp = []
  groupListTemp.push(...groupList)
  friendListTemp.push(...friendsList)
  // console.log(groupListTemp);
  // console.log(friendListTemp);
  groupList.length = 0
  groupList.push(...groupListTemp.filter((item) => item.contactName.includes(condition)))
  friendsList.length = 0
  friendsList.push(...friendListTemp.filter((item) => item.contactName.includes(condition)))
  // console.log(groupList)
  // console.log(friendsList)
}

async function handleChange(openCollapse) {
  // console.log("handleChange");
  // console.log(openCollapse)
  // console.log(groupList.length)
  // console.log(friendsList.length)
  // let type;
  // if(openCollapse=="群聊"&&groupList.length==0){
  //   console.log("群聊")
  //   type=0;
  // }else if(openCollapse=="好友"&&friendsList.length==0){
  //   console.log("好友")
  //   type=1;
  // }else{
  //   console.log("return")
  //   return;
  // }
  // if (groupList.length != 0 || friendsList.length != 0) {
  //   return
  // }
  if(alreadyOpen){
    return
  }
  alreadyOpen=true
  console.log(localStorage.getItem('token'))
  const response = await instance
    .post(
      '/contact/getContact',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      }
    )
    .catch((error) => {
      ElMessage.error(error)
    })
  console.log(response)

  friendsList.length = 0
  friendsList.push(...response.data.data.filter((item) => item.contactId[0] == 'U'))
  friendsList.sort((a, b) => a.contactName.localeCompare(b.contactName))
  console.log(response.data.data.filter((item) => item.contactId[0] == 'U'))
  groupList.length = 0
  groupList.push(...response.data.data.filter((item) => item.contactId[0] == 'G'))
  groupList.sort((a, b) => a.contactName.localeCompare(b.contactName))
  console.log(response.data.data.filter((item) => item.contactId[0] == 'G'))
  // if(type){
  //   friendsList.length=0;
  //   friendsList.push(...response.data.data);
  // }else{
  //   groupList.length=0;
  //   groupList.push(...response.data.data);
  // }

  // // 打印当前展开的面板的 name
  // console.log('当前展开的面板:', activeNames);

  // // 如果你想知道当前被点击的面板，可以通过比较 `activeNames` 的变化来判断
  // if (activeNames.length > this.activeNames.length) {
  //   // 新展开的面板
  //   const newPanel = activeNames.find(name => !this.activeNames.includes(name));
  //   console.log('新展开的面板:', newPanel);
  // } else {
  //   // 已收起的面板
  //   const closedPanel = this.activeNames.find(name => !activeNames.includes(name));
  //   console.log('已收起的面板:', closedPanel);
  // }

  // // 更新 activeNames
  // this.activeNames = activeNames;
}

function createGroup() {
  console.log('createGroup')
  createGroupdialogVisble.value = true
}

async function createGroupSubmit() {
  if (createGroupInfo.value.groupName.trim() == '') {
    return
  }
  console.log(localStorage.getItem('token'))
  console.log(createGroupInfo.value.groupName)
  console.log(createGroupInfo.value.groupNotice)
  const response = await instance
    .post(
      '/group/saveGroup',
      {
        groupName: createGroupInfo.value.groupName,
        groupNotice: createGroupInfo.value.groupNotice
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      }
    )
    .catch((error) => {
      ElMessage.error(error)
    })
  console.log(response)
  ipcRenderer.send('saveSelfAvatar', {
    id: response.data.data.groupId,
    url: response.data.data.avatarUrl
  })
  createGroupdialogVisble.value = false
  console.log('---------------')
  console.log(groupList)
  groupList.push({
    contactId: response.data.data.groupId,
    contactName: createGroupInfo.value.groupName,
    groupNotice: createGroupInfo.value.groupNotice,
    avatarUrl: response.data.data.avatarUrl
  })
  console.log('---------------')
  console.log(groupList)
  createGroupInfo.value.groupName = ''
  createGroupInfo.value.groupNotice = ''
  groupList.sort((a, b) => a.contactName.localeCompare(b.contactName))
}

function ClosecreateGroupDialog() {
  createGroupdialogVisble.value = false
}

function addFriends() {
  console.log('addFriends')
  addFriendsdialogVisble.value = true
}

async function addFriendsSubmit() {
  console.log(localStorage.getItem('token'))
  console.log(addFriendsInfo.value.id)
  console.log(addFriendsInfo.value.applyMessage)
  await instance
    .post(
      '/contact/applyAdd',
      {
        contactId: addFriendsInfo.value.id,
        // contactType:addFriendsInfo.value.contactType,
        applyInfo: addFriendsInfo.value.applyMessage
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      }
    )
    .catch((error) => {
      ElMessage.error(error)
    })
  addFriendsInfo.value = {}
  addFriendsdialogVisble.value = false
}

function CloseAddFriendsDialog() {
  addFriendsdialogVisble.value = false
}

const deleteContact = () => {
  friendsList.splice(selectedFriendIndex, 1)
}
</script>

<style lang="less" scoped>
// <style scoped>
.div-friendsList {
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

.div-newFriends {
  display: flex;
  // margin-bottom: 5%;
}

.el-button-newFriends {
  margin: 5%;
}

.div-friends-avatar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  margin-left: 6%;
  padding: auto;
}

.div-friends-name {
  margin-top: auto;
  margin-bottom: auto;
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
}

.div-friends-item {
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
  padding-left: 2%;
  padding-right: 2%;
  height: 55%;
  margin: 0;
}

.div-chat-input {
  padding-top: 2%;
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

.el-menu.el-menu--vertical.el-menu-demo {
  display: flex;
  flex-direction: column;
  height: 90%;
  border-right: none;
  background-color: rgb(137, 147, 150);
}

/* 设置默认背景颜色 */
:deep(.el-collapse-item__header) {
  padding-left: 5%;
  background-color: rgb(231, 233, 235); /* 初始背景颜色 */
}

/* 设置鼠标悬停时的背景颜色 */
:deep(.el-collapse-item__header:hover) {
  background-color: rgb(231, 233, 235); /* 鼠标悬停时的背景颜色 */
}
:deep(.el-collapse-item__content) {
  background-color: rgb(231, 233, 235);
  // padding-bottom: 100px;
}

.createGroupDialogInput {
  width: 70%;
}
</style>
