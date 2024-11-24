<template>
  <div class="div-friendsList">
    <div class="div-search">
      <el-input class="conditionInput" v-model="conditionValue" placeholder="" size="small" :prefix-icon="Search" clearable></el-input>
      <el-button class="button-search" type="primary" @click="searchByCondition">搜索</el-button>
    </div>
    <el-scrollbar>
      <div class="div-newFriends">
        <el-button class="el-button-newFriends" type="default" @click="toggleSwitch">加好友/群</el-button>
        <el-button class="el-button-newFriends" :type="friendRequestButton?'primary':'default'" @click="createGroup">创建群聊</el-button>
      </div>
      <div class="div-friends">
        <el-collapse class="el-collapse-div-friends" @change="handleChange">
          <el-collapse-item class="el-collapse-item-div-friends" title="群聊" name="1">
            <div v-for="item in items" :key="item.id" class="div-friends-item" @click="clickGroupInfo(item.id)" @mouseover="hoverItemGroupInfo(item.id)" @mouseleave="resetHoverGroupInfo" :style="getItemStyleGroupInfo(item.id)">
              <div class="div-friends-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
              <div class="div-friends-name">{{ item.name }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item class="el-collapse-item-div-friends" title="  好友" name="2" style="margin-bottom: 50%;">
            <div v-for="item in items" :key="item.id" class="div-friends-item" @click="clickFriendInfo(item.id)" @mouseover="hoverItemFriendInfo(item.id)" @mouseleave="resetHoverFriendInfo" :style="getItemStyleFriendInfo(item.id)">
              <div class="div-friends-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
              <div class="div-friends-name">{{ item.name }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-scrollbar>

    <el-dialog title="创建群聊" v-model="createGroupdialogVisble" width="50%">
      <el-form ref="form" :model="createGroupInfo" label-width="150px" style="margin-left: auto;margin-right: auto;">
          <el-form-item class="createGroupDialogInput" label="群名称" prop="groupName">
              <el-input v-model="createGroupInfo.groupName" placeholder="请输入群名称"></el-input>
          </el-form-item>
          <el-form-item class="createGroupDialogInput" label="群公告" prop="groupNotice" style="width: 90%;">
              <!-- <el-input v-model="createGroupInfo.groupNotice" placeholder="请输入群公告"></el-input> -->
              <el-input ref="inputRef" v-model="createGroupInfo.groupNotice" class="el-input-chat-input" :rows="5" type="textarea" placeholder="请输入群公告"></el-input>
          </el-form-item>

          <el-form-item align="center">
              <el-button type="primary" size="small" @click="createGroupSubmit" style="width: 30%;">创建</el-button>
              <el-button type="info" size="small" @click="ClosecreateGroupDialog" style="width: 30%; margin-left: 25%">取消</el-button>
          </el-form-item>
      </el-form>
  </el-dialog>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Search} from '@element-plus/icons-vue'
import instance from '../../axios';
import { ElMessage } from 'element-plus';
const router = useRouter();
const route = useRoute();
const conditionValue=ref("搜索好友/群");

const selectedGroupId=ref(null);
const hoveredGroupId=ref(null);
const selectedFriendId=ref(null);
const hoveredFriendId=ref(null);
const inputRef=ref(null);
const chatInput=ref("");
const createGroupdialogVisble=ref(false);
const createGroupInfo=ref({
      groupName:ref(''),
      groupNotice:ref(''),
    });

const friendRequestButton=ref(false);

//在页面加载时，从 localStorage 中读取上次选中的 ID
// onMounted(() => {
//     const storedId = Number(localStorage.getItem('selectedId'));
//     if (storedId) {
//         initChat(storedGroupId);
//     }
// });

onMounted(() => {
    const storedGroupId = Number(localStorage.getItem('selectedGroupId'));
    if (storedGroupId) {
      selectedGroupId.value=storedGroupId;
      router.push("/home/friendsManage/groupChatInfo")
    }
    const storedFriendId = Number(localStorage.getItem('selectedFriendId'));
    if (storedFriendId) {
      selectedFriendId.value=storedFriendId;
      router.push("/home/friendsManage/friendProfile")
    }
    console.log("selectedGroupId"+selectedGroupId.value)
    console.log("selectedFriendId"+selectedFriendId.value)
});

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
        ]);

function clickGroupInfo(id){
    selectedGroupId.value = id; // 将点击的 item id 记录下来
    selectedFriendId.value=null;
    localStorage.setItem('selectedGroupId',selectedGroupId.value);
    localStorage.setItem('selectedFriendId',null);
    router.push("/home/friendsManage/groupChatInfo");
}
    
// 鼠标悬停时
function hoverItemGroupInfo(id) {
    if (selectedGroupId.value !== id) { // 如果不是选中的项，则允许改变背景颜色
    hoveredGroupId.value = id;
    }
}
    // 鼠标离开时
function resetHoverGroupInfo() {
    hoveredGroupId.value = null;
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
    return { backgroundColor: 'deepskyblue' }; // 选中的项背景颜色
    } else if (hoveredGroupId.value === id) {
    return { backgroundColor: 'lightgrey' }; // 悬停时的背景颜色
    }
    return {}; // 默认背景
}

function clickFriendInfo(id){
    selectedFriendId.value = id; // 将点击的 item id 记录下来
    selectedGroupId.value=null;
    localStorage.setItem('selectedFriendId',selectedFriendId.value);
    localStorage.setItem('selectedGroupId',null);
    router.push("/home/friendsManage/friendProfile")
}

// 鼠标悬停时
function hoverItemFriendInfo(id) {
    if (selectedFriendId.value !== id) { // 如果不是选中的项，则允许改变背景颜色
    hoveredFriendId.value = id;
    }
}
    // 鼠标离开时
function resetHoverFriendInfo() {
    hoveredFriendId.value = null;
}

// 根据悬停的id设置样式
function getItemStyleFriendInfo(id) {
    if (selectedFriendId.value === id) {
    return { backgroundColor: 'deepskyblue' }; // 选中的项背景颜色
    } else if (hoveredFriendId.value === id) {
    return { backgroundColor: 'lightgrey' }; // 悬停时的背景颜色
    }
    return {}; // 默认背景
}

function toggleSwitch() {
    console.log(friendRequestButton.value)
    friendRequestButton.value = !friendRequestButton.value;
}

function searchByCondition() {
  
}

function handleChange() {
  
}

function createGroup(){
  console.log("createGroup");
  createGroupdialogVisble.value=true;
}

async function createGroupSubmit(){
  console.log(localStorage.getItem("token"))
  console.log(createGroupInfo.value.groupName)
  console.log(createGroupInfo.value.groupNotice)
  await instance.post("/group/saveGroup",{
          groupName:createGroupInfo.value.groupName,
          groupNotice:createGroupInfo.value.groupNotice,
      },{
          headers: {
          'Content-Type': 'application/json',
          'token' : localStorage.getItem("token")
          },
      }).catch((error)=>{
        ElMessage.error(error);
      })
      createGroupdialogVisble.value=false;
}

function ClosecreateGroupDialog(){
  createGroupdialogVisble.value=false
}
</script>

<style lang="less" scoped>
// <style scoped>
.div-friendsList{
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

.div-newFriends{
    display: flex;
    // margin-bottom: 5%;
}

.el-button-newFriends{
    margin: 5%;
}

.div-friends-avatar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-left: 6%;
    padding: auto;
}

.div-friends-name{
margin-top: auto;
margin-bottom: auto;
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
}

.div-friends-item{
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
padding-left: 2%;
padding-right: 2%;
height: 55%;
margin: 0;
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
  background-color: rgb(231, 233, 235);  /* 初始背景颜色 */
}

/* 设置鼠标悬停时的背景颜色 */
:deep( .el-collapse-item__header:hover) {
  background-color: rgb(231, 233, 235);  /* 鼠标悬停时的背景颜色 */
}
:deep(.el-collapse-item__content){
  background-color: rgb(231, 233, 235);
  // padding-bottom: 100px;
}

.createGroupDialogInput{
  width: 70%;
}
</style>