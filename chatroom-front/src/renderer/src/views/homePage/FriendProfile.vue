<template>
  <el-card class="card-homePage">
    <div style="text-align: center; font-size: large; margin: 5%">好友主页</div>
    <div class="div-homePage">
      <div class="div-chat-avatar">
        <el-avatar
          class="user-avatar"
          :src="friendInfo.avatarUrl"
          icon="el-icon-user-solid"
        ></el-avatar>
      </div>
      <div class="div-chat-name-id">
        <el-text style="color: black" truncated>昵称:{{ friendInfo.nickName }}</el-text>
        <br />
        <el-text size="small" truncated style="margin-top: 4%">id:{{ friendInfo.userId }}</el-text>
      </div>
      <div style="margin: auto">性别:</div>
      <div style="margin-top: auto; margin-bottom: auto">{{ friendInfo.sex }}</div>
      <div style="margin: auto">邮箱:</div>
      <div style="margin-top: auto; margin-bottom: auto">{{ friendInfo.email }}</div>
      <div style="margin: auto">个性签名：</div>
      <!-- <el-scrollbar style="grid-row: span 2;"> -->
      <div style="grid-row: span 2; max-width: 100%; max-height: 100px">
        <el-scrollbar
          ><el-text style="max-width: 100%; max-height: 100%">{{
            friendInfo.personalSignature
          }}</el-text></el-scrollbar
        >
      </div>
      <!-- </el-scrollbar> -->
    </div>
    <div class="div-buttonBox">
      <el-button type="success" style="margin-right: 20%; width: 30%" @click="sendMessage"
        >发送消息</el-button
      >
      <el-button type="danger" style="width: 30%" @click="deleteContact">删除好友</el-button>
    </div>
  </el-card>
</template>

<script setup>
// import { onMounted, ref , defineEmits } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import instance from '../../axios'
import router from '../../router'
import { EventBus } from '../../eventBus/eventBus'
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = require('electron')

const friendInfo = ref({})

let friendId = ''
const emit = defineEmits([])

onMounted(async () => {
  EventBus.$on('showFriendInfo', showFriendInfo)
  // const storedContactId = Number(localStorage.getItem('selectedContactId'));
  const storedContactId = localStorage.getItem('selectedFriendId')
  console.log(storedContactId)
  if (storedContactId) {
    friendId = storedContactId
    showFriendInfo(friendId)
  }
})

onUnmounted(() => {
  EventBus.$off('showFriendInfo', showFriendInfo)
})

async function showFriendInfo(contactId) {
  const response = await instance
    .post(
      '/account/getUser',
      {
        userId: contactId
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
  friendInfo.value = Object.assign({}, response.data.data)
}

function sendMessage() {
  const storedContactId = localStorage.getItem('selectedFriendId')
  console.log(friendId)
  console.log(storedContactId)
  if (storedContactId) {
    ipcRenderer.send('showChatSession', storedContactId)
    localStorage.getItem('selectedSessionId', null)
    router.push('/home/chat')
  }
}

async function deleteContact() {
  await instance
    .post(
      '/contact/delContact',
      {
        contactId: friendId
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
  emit('deleteContact')
  router.push('/home/friendsManage')
}
</script>

<style lang="less" scoped>
.card-homePage {
  width: 50%;
  max-height: 90%;
  margin: auto;
}

.div-homePage {
  display: grid; /* 激活 grid 布局 */
  grid-template-columns: minmax(25%, 25%) minmax(75%, 75%); //1fr,4fr;//repeat(5, 1fr);//10%,30%,1fr;
  grid-template-rows: repeat(5, minmax(1fr, 20%)); /* 创建 2 行，每行高度 100px */
  margin-left: 10%;
  margin-right: 10%;
  gap: 10px; /* 设置网格之间的间距 */
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

.div-buttonBox {
  width: 100%;
  display: flex;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 5%;
}
</style>
