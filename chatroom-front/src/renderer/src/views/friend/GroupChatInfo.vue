<template>
  <div class="div-group">
    <div class="div-group-name">
      <div style="width: 94%; padding-top: 2%; padding-bottom: 2%">
        {{ selectedId === null ? 0 : groupInfo.groupName }}
      </div>
      <div class="div-more-groupInfo" @click="openGroupInfo">
        <el-icon><More /></el-icon>
      </div>
    </div>
    <div class="div-group-member">
      <!-- <el-scrollbar>
        <div class="div-group-memberList">
          <div v-for="item in items" :key="item.id" class="div-group-record-item">
            <div class="div-group-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
            <el-scrollbar><div class="div-group-record-name">{{ item.name }}</div></el-scrollbar>
          </div>
        </div>
      </el-scrollbar> -->
      <el-scrollbar>
        <div class="div-group-memberList">
          <div
            v-for="(item, index) in groupInfo.userList"
            :key="index"
            class="div-group-record-item"
          >
            <div class="div-group-avatar">
              <el-avatar
                class="user-avatar"
                :src="item.avatarUrl"
                icon="el-icon-user-solid"
              ></el-avatar>
            </div>
            <div class="div-group-record-name">
              <el-text truncated>{{ item.nickName }}</el-text>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="div-group-sendMessage">
      <el-button class="div-group-sendButton" type="success" @click="sendMessage"
        >发送消息</el-button
      >
    </div>
  </div>

  <el-drawer v-model="drawer" title="群详情" :direction="direction" :before-close="handleClose">
    <el-scrollbar>
      <div class="drawer-div-item">
        <div class="drawer-div-tag">群名:</div>
        <div style="font-size: small">{{ groupInfo.groupName }}</div>
      </div>
      <div class="drawer-div-item">
        <div class="drawer-div-tag">群id:</div>
        <div style="font-size: small">{{ groupInfo.groupId }}</div>
      </div>
      <div class="drawer-div-item">
        <div class="drawer-div-tag">群主:</div>
        <div style="font-size: small">{{ groupInfo.groupOwner }}</div>
      </div>
      <div class="drawer-div-item">
        <div class="drawer-div-tag">群主id:</div>
        <div style="font-size: small">{{ groupInfo.groupOwnerName }}</div>
      </div>
      <div class="drawer-div-item">
        <div class="drawer-div-tag">群公告:</div>
        <div style="width: 80%; max-height: 20%">
          <el-text>{{ groupInfo.groupNotice }}</el-text>
        </div>
        <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" style="width: 80%;" v-model="groupAnnouncement" disabled></el-input> -->
      </div>
      <div style="width: 100%; display: flex; justify-content: center" v-if="isGroupOwner()">
        <el-button type="primary" @click="showDialog">修改群信息</el-button>
      </div>
    </el-scrollbar>
  </el-drawer>

  <el-dialog title="修改群信息" v-model="dialogVisble" width="50%">
    <el-form
      ref="form"
      :model="modifyGroupInfo"
      label-width="150px"
      style="margin-left: auto; margin-right: auto"
    >
      <el-form-item class="dialogInput" label="群头像:" prop="avatar">
        <!-- <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload> -->
        <input type="file" @change="handleFileChange" />
      </el-form-item>
      <el-form-item class="groupName" label="群名称:" prop="groupName">
        <el-input v-model="modifyGroupInfo.groupName" placeholder="请输入群名称"></el-input>
      </el-form-item>
      <el-form-item class="groupAnnouncement" label="群公告:" prop="groupAnnouncement">
        <!-- <el-scrollbar > -->
        <el-input
          v-model="modifyGroupInfo.groupNotice"
          type="textarea"
          maxlength="150"
          show-word-limit
          placeholder="请输入群公告"
        ></el-input>
        <!-- </el-scrollbar>   -->
      </el-form-item>
      <el-form-item align="center">
        <el-button
          type="primary"
          size="small"
          style="width: 30%; margin-right: 25%"
          @click="AddRecord"
          >更改</el-button
        >
        <el-button type="info" size="small" style="width: 30%" @click="CloseDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Search, More } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import router from '../../router'
import instance from '../../axios'

import { EventBus } from '../../eventBus/eventBus'
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = require('electron')
const conditionValue = ref('搜索聊天')

const selectedId = ref(null)
const groupInfo = ref({})
const modifyGroupInfo = ref({})

const dialogVisble = ref(false)

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png']

const imageUrl = ref('')
const modifyAccount = ref({
  groupName: ref(''),
  groupAnnouncement: ref('')
})

//在页面加载时，从 localStorage 中读取上次选中的 ID
onMounted(async () => {
  EventBus.$on('showGroupInfo', showGroupInfo)
  // const storedGroupId = Number(localStorage.getItem('selectedGroupId'));
  const storedGroupId = localStorage.getItem('selectedGroupId')
  if (storedGroupId) {
    selectedId.value = storedGroupId
    showGroupInfo(selectedId.value)
    // const response=await instance.post("/group/getGroupInfo",{
    //   groupId:storedGroupId,
    // },{
    //     headers: {
    //     'Content-Type': 'application/json',
    //     'token' : localStorage.getItem("token")
    //     },
    // }).catch(()=>{
    //   ElMessage.error("网络异常");
    // });
    // groupInfo.value=Object.assign({},response.data.data);
  }
})

onUnmounted(() => {
  EventBus.$off('showGroupInfo', showGroupInfo)
})

async function showGroupInfo(groupId) {
  console.log('groupId')
  const response = await instance
    .post(
      '/group/getGroupInfo',
      {
        groupId: groupId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        }
      }
    )
    .catch(() => {
      ElMessage.error('网络异常')
    })
  console.log(response)
  groupInfo.value = Object.assign({}, response.data.data)
}

const inputRef = ref(null)
const chatInput = ref('')
const drawer = ref(false)
const groupAnnouncement = ref(
  '12311111111111112311111111111111111111111231111111111111123111111111111111111111112311111111111111231111111111111111111111123111111111111112311111111111111111111111231111111111111123111111111111111111111112311111111111111111111111123111111111111111111111111111111111111111111111112311111111111111111111111111111111111111111111111231111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
)

let file
function handleFileChange(event) {
  file = event.target.files[0]
}

// 上传成功后的回调函数
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 上传前的验证函数
const beforeAvatarUpload = (rawFile) => {
  if (!allowedFormats.includes(rawFile.type)) {
    ElMessage.error('格式必须为jpeg、jpg、png!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('大小不能超过10MB!')
    return false
  }
  return true
}

const items = reactive([
  // { id: 1, name: 'Item 1111111111111111111111' },
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

function sendMessage() {
  if (selectedId.value) {
    ipcRenderer.send('showChatSession', selectedId.value)
    localStorage.getItem('selectedSessionId', null)
    router.push('/home/chat')
  }
}

async function AddRecord() {
  if (file) {
    const formdate = new FormData()
    formdate.append('file', file)
    // const response=await instance.post("/file/uploadAvatar",formdate,{
    //   headers:{
    //     'Content-Type':'multipart/form-data',
    //     'token':localStorage.getItem("token")
    //   },
    // }).catch((error)=>{
    //   ElMessage.error(error)
    // })
    // ipcRenderer.send('saveSelfAvatar',{id:localStorage.getItem("userId"),url:response.data.data.avatarUrl})
  }
  await instance
    .post(
      '/group/saveGroup',
      {
        groupName: modifyAccount.value.groupName,
        groupNotice: modifyAccount.value.groupNotice
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
  dialogVisble.value = false
}

function CloseDialog() {
  dialogVisble.value = false
}

function isGroupOwner() {
  return true
}

function showDialog() {
  dialogVisble.value = true
  modifyGroupInfo.value = Object.assign({}, groupInfo.value)
}

async function openGroupInfo() {
  drawer.value = true
  // const response=await instance
  //   .post(
  //     '/group/getGroupInfo',
  //     {
  //       groupId: selectedId.value
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         token: localStorage.getItem('token')
  //       }
  //     }
  //   )
  //   .catch(() => {
  //     ElMessage.error('网络异常')
  //   })
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

.div-group-avatar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  // margin-left: 6%;
  padding: auto;
}

.div-group-record-name {
  margin-top: auto;
  margin-bottom: auto;
  white-space: nowrap; /* 文字保持在一行 */
  text-align: center;
}

.user-avatar {
  // margin: auto,auto,auto,100px;
  margin: 0;
  // margin-left: auto;
}

.div-group-record {
  // display: flex;
  height: 92%;
  overflow-y: auto; /* 只显示垂直滚动条 */
}

.div-group-record-item {
  // display: flex;
  //   display: grid;
  // //   grid-template-columns: 1fr 1fr 1fr;
  //   grid-template-columns: repeat(5, 1fr); /* 创建 3 列，每列占 1fr 的宽度 */
  //   align-items: center; /* 垂直居中 */
  //   justify-items: center; /* 水平居中 */
  max-width: 80%;
  overflow: hidden; /* 如果内容超出列宽，隐藏内容 */
}

// .div-chat-record-item:hover{
//   background-color: rgb(209, 208, 208) !important;
// }

.div-group {
  // display: flex;
  // background-color: rgb(178, 219, 139);
  background-color: white;
  width: 69%;
}

.div-group-name {
  // height: 10%;
  // padding: 0;
  // // margin-top: 5%;
  // // margin-bottom: 5%;
  // margin: 0;
  display: flex;
  // padding-top: 2%;
  // padding-bottom: 2%;
  padding-left: 2%;
  margin: 0;
  // border-color: black;
  // border-width: 2px;
  border-bottom: solid silver;
  // border-bottom: ;
}

.div-group-member {
  // display: flex;
  // display: grid;
  //   grid-template-columns: 1fr 1fr 1fr;
  // grid-template-columns: repeat(5, 1fr); /* 创建 3 列，每列占 1fr 的宽度 */
  // gap: 20px;
  // align-items: center; /* 垂直居中 */
  // justify-items: center; /* 水平居中 */
  // padding-top: 2%;
  // padding-bottom: 2%;
  // padding-left: 2%;
  // padding-right: 2%;
  height: 70%;
  margin: 0;
  margin-bottom: 5%;
}

.div-group-memberList {
  // display: flex;
  display: grid;
  //   grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: repeat(6, 1fr); /* 创建 3 列，每列占 1fr 的宽度 */
  gap: 20px;
  align-items: center; /* 垂直居中 */
  justify-items: center; /* 水平居中 */
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 2%;
  padding-right: 2%;
  height: 90%;
  margin: 0;
}

.div-group-sendMessage {
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 2%;
  padding-right: 2%;
  margin: 0;
  height: 30%;
  overflow: hidden;
}

.el-input-group-input {
  width: 100%;
  height: auto;
  border: none;
}

.div-group-sendButton {
  height: 20%;
  width: 20%;
  margin-left: 40%;
  margin-right: 40%;
}

.div-more-groupInfo {
  width: 6%;
  padding-right: 3%;
  padding-top: 2%;
  padding-bottom: 2%;
  display: grid;
  justify-content: right;
}

.div-more-groupInfo:hover {
  background-color: deepskyblue;
}

.drawer-div-item {
  display: flex;
  margin-top: 5%;
  margin-bottom: 5%;
}

.el-drawer__wrapper {
  width: 100% !important; /* 强制应用宽度 */
}

.el-drawer.rtl.open {
  width: 100% !important; /* 强制应用宽度 */
}
.drawer-div-tag {
  font-size: small;
  width: 20%;
}

.div-avatar-name {
  display: flex;
  justify-content: center;
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

.div-chat-name-id {
  margin-top: auto;
  margin-bottom: auto;
  //   width: 45%;
  // max-width: 45%;
}

.dialogInput {
  width: 70%;
}

.avatar-uploader .avatar {
  width: 10%;
  height: 10%;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  text-align: center;
  border: solid #8c939d 1px;
}

.el-input {
  width: 90%;
}

.el-textarea {
  width: 90%;
}
</style>
