<template>
  <div class="sider-nav-container">
    <div class="div-avatar">
      <el-avatar
        class="user-avatar"
        @click="openHomePage"
        :src="avatarUrl"
        icon="el-icon-user-solid"
      ></el-avatar>
    </div>
    <el-menu
      :default-active="currentRoute"
      class="el-menu-demo"
      mode="vertical"
      :ellipsis="false"
      @select="handleSelect"
      unique-opened
      router
    >
      <el-menu-item class="menu-item" index="/home/chat"
        ><el-icon><ChatLineRound /></el-icon
      ></el-menu-item>
      <el-menu-item class="menu-item" index="/home/friendsManage"
        ><el-icon><User /></el-icon
      ></el-menu-item>
      <el-menu-item class="menu-item" index="/home/informs"
        ><el-icon><Bell /></el-icon
      ></el-menu-item>
      <el-menu-item class="menu-item menu-item-bottom" @click="logout"
        ><el-icon><Setting /></el-icon
      ></el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChatLineRound, User, Setting, Bell } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EventBus } from '../eventBus/eventBus'

const { ipcRenderer } = require('electron')
const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)

const currentRoute = computed(() => route.path)

let userName = localStorage.getItem('userName')
const avatarUrl=ref('')
avatarUrl.value = localStorage.getItem('selfAvatarUrl')

onMounted(() => {
  EventBus.$on('changeAvatar', changeAvatar)
  avatarUrl.value = localStorage.getItem('selfAvatarUrl')
  console.log(avatarUrl)
})

onUnmounted(() => {
  EventBus.$off('changeAvatar', changeAvatar)
})

function changeAvatar() {
  avatarUrl.value = localStorage.getItem('selfAvatarUrl')
}

function openHomePage() {
  router.push('/home/profile')
}

function handleSelect(index: string) {
  router.push(index)
}

function logout() {
  // let conf=confirm("是否退出登录")
  // if(conf){
  //   ElMessage("已退出")
  //   router.push("/");
  // }
  ElMessageBox.confirm(
    '您确定要退出登录吗？', // 提示内容
    'logout', // 弹窗标题
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info', // 设置弹窗的类型，可以是 info/warning/error
      customClass: 'my-custom-message-box' // 添加自定义类
    }
  ).then(() => {
    // 确认按钮点击后的回调
    console.log('tui')
    localStorage.clear()
    router.push('/')
    ipcRenderer.send('changeWindowSizeToLogin')
    ipcRenderer.send('logout')
  })
}

function isAdmin() {}

function isParentActive() {
  console.log(route.path)
  return route.path.startsWith('/home/friendsManage') // 检查是否是子路由
}
</script>

<style>
.sider-nav-container {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
  background-color: rgb(137, 147, 150);
  /* background-color: white; */
  color: white;
  padding: 0px 20px;
}

.div-avatar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: auto;
}

.user-avatar {
  margin: auto;
}

nav {
  display: flex;
}

nav a {
  margin-left: 20px;
  text-decoration: none;
  color: white;
}

.el-menu {
  /* --el-menu-bg-color: rgba(20, 1, 1); */
  /* --el-menu-text-color: white; */
}

/* 去掉下划线 */
/* .el-menu.el-menu--vertical.el-menu-demo {
border-right: none;
background-color: rgb(137, 147, 150);
height: 89%;
}

.el-menu-item.menu-item{
  margin: auto;
}

.el-menu-item.menu-item.menu-item-bottom{
  margin: auto;
  margin-bottom: 0;
} */

/* .menu-item{
    margin: 5%;
    background-color: rgb(137, 147, 150);
} */

.el-avatar.el-avatar--icon.el-avatar--circle.user-avatar {
  margin: auto;
}

.el-menu.el-menu--vertical.el-menu-demo {
  display: flex;
  flex-direction: column;
  height: 90%;
  border-right: none;
  background-color: rgb(137, 147, 150);
}

/* 将前两个 menu-item 保持在顶部 */
.el-menu-item.menu-item {
  display: flex;
  flex-direction: column;
  flex-grow: 0; /* 不要扩展 */
  padding-top: auto;
  padding-bottom: auto;
}

/* 将最后一个 menu-item 保持在底部 */
.el-menu-item.menu-item.menu-item-bottom {
  margin-top: auto; /* 将底部的菜单项推到最底部 */
}

/* 确保 el-menu-item 内的内容居中 */
.el-menu-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

/* 确保图标本身居中 */
.icon {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: 100%; /* 确保图标占满父容器的宽度 */
  height: 100%; /* 确保图标占满父容器的高度 */
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
</style>
