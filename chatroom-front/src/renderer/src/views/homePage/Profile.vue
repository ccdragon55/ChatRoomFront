<template>
  <el-card class="card-homePage">
    <div style="text-align: center; font-size: large; margin: 5%">个人主页</div>
    <div class="div-homePage">
      <div class="div-chat-avatar">
        <el-avatar
          class="user-avatar"
          :src="personalInfo.avatarUrl"
          icon="el-icon-user-solid"
        ></el-avatar>
      </div>
      <div class="div-chat-name-id" style="grid-column: span 3">
        <el-text style="color: black" truncated>{{ personalInfo.nickName }}</el-text>
        <br />
        <el-text size="small" truncated style="margin-top: 4%">{{ personalInfo.userId }}</el-text>
      </div>
      <div style="margin: auto">性别:</div>
      <div style="margin-top: auto; margin-bottom: auto; grid-column: span 3">
        {{ personalInfo.sex }}
      </div>
      <div style="margin: auto">邮箱:</div>
      <div style="margin-top: auto; margin-bottom: auto; grid-column: span 3">
        {{ personalInfo.email }}
      </div>
      <div style="margin: auto">个性签名：</div>
      <!-- <el-scrollbar style="grid-row: span 2;"> -->
      <div style="grid-row: span 2; grid-column: span 3; max-width: 100%; max-height: 100px">
        <el-scrollbar
          ><el-text style="max-width: 100%; max-height: 100%">{{
            personalInfo.personalSignature
          }}</el-text></el-scrollbar
        >
      </div>
      <!-- </el-scrollbar> -->
      <el-button style="grid-column: span 2; margin: auto" @click="showUpdateDialog"
        >修改个人资料</el-button
      >
      <el-button style="grid-column: span 2; margin: auto" @click="showModifyPassword"
        >修改密码</el-button
      >
    </div>
  </el-card>

  <el-dialog title="修改个人资料" v-model="dialogVisble" width="50%">
    <el-form
      ref="form"
      :model="modifyAccount"
      label-width="150px"
      style="margin-left: auto; margin-right: auto"
    >
      <el-form-item class="dialogInput" label="头像" prop="avatar">
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
      <el-form-item class="nickName" label="昵称" prop="nickName">
        <el-input v-model="modifyAccount.nickName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="modifyAccount.sex">
          <el-radio value="男" size="large" label="男">男</el-radio>
          <el-radio value="女" size="large" label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="email" label="邮箱" prop="email">
        <el-input v-model="modifyAccount.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item class="personalSignature" label="个性签名" prop="personalSignature">
        <!-- <el-scrollbar > -->
        <el-input
          v-model="modifyAccount.personalSignature"
          type="textarea"
          maxlength="150"
          show-word-limit
          placeholder="请输入个性签名"
        ></el-input>
        <!-- </el-scrollbar>   -->
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="small" style="width: 20%" @click="AddRecord"
          >更改</el-button
        >
        <el-button type="info" size="small" style="width: 20%" @click="CloseDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog title="修改密码" v-model="passwordDialogVisble" width="50%">
    <el-form
      ref="form"
      :model="modifyAccount"
      label-width="150px"
      style="margin-left: auto; margin-right: auto"
    >
      <el-form-item class="password" label="密码" prop="password">
        <el-input v-model="modifyAccount.email" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="small" style="width: 20%" @click="changePassword"
          >更改</el-button
        >
        <el-button type="info" size="small" style="width: 20%" @click="closePasswordDialog"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import instance from '../../axios'
import md5 from 'crypto-js/md5'
import MD5 from 'crypto-js/md5'
import { EventBus } from '../../eventBus/eventBus'
const { ipcRenderer } = require('electron')

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png']

const imageUrl = ref('')
const modifyAccount = ref({
  nickName: ref(''),
  sex: ref(''),
  email: ref(''),
  personalSignature: ref('')
})
const personalInfo = ref({})
const dialogVisble = ref(false)
const passwordDialogVisble = ref(false)
const newPassword = ref('')

onMounted(async () => {
  const response = await instance
    .post(
      '/account/getUser',
      {
        userId: localStorage.getItem('userId')
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
  personalInfo.value = Object.assign({}, response.data.data)
})

// 上传成功后的回调函数
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 上传前的验证函数
const beforeAvatarUpload = (rawFile) => {
  if (!allowedFormats.includes(rawFile.type)) {
    ElMessage.error('格式必须为jpeg、jpg、png!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('大小不能超过2MB!')
    return false
  }
  return true
}

function showUpdateDialog() {
  modifyAccount.value = Object.assign({}, personalInfo.value)
  dialogVisble.value = true
}

let file
function handleFileChange(event) {
  file = event.target.files[0]
}

async function AddRecord() {
  if (file) {
    const formdate = new FormData()
    formdate.append('file', file)
    const response = await instance
      .post('/file/uploadAvatar', formdate, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: localStorage.getItem('token')
        }
      })
      .catch((error) => {
        ElMessage.error(error)
      })
      // console.log("AddRecord")
      // console.log(response)
    localStorage.setItem('selfAvatarUrl', response.data.data)
    personalInfo.value.avatarUrl = response.data.data
    EventBus.$emit('changeAvatar')
    ipcRenderer.send('saveSelfAvatar', {
      id: localStorage.getItem('userId'),
      url: response.data.data
    })
  }
  await instance
    .post(
      '/account/update',
      {
        userNickName: modifyAccount.value.nickName,
        sex: modifyAccount.value.sex,
        personalSignature: modifyAccount.value.personalSignature
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

function showModifyPassword() {
  passwordDialogVisble.value = true
}

async function changePassword() {
  const temp = newPassword.value.trim()
  if (temp == '') {
    return
  }
  await instance
    .post(
      '/account/updatePassword',
      {
        password: md5(temp).toString()
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
  passwordDialogVisble.value = false
}

function closePasswordDialog() {
  passwordDialogVisble.value = false
}
</script>

<style lang="less" scoped>
.card-homePage {
  width: 50%;
  max-height: 80%;
  margin: auto;
}

.div-homePage {
  display: grid; /* 激活 grid 布局 */
  grid-template-columns: minmax(25%, 25%) minmax(25%, 25%) minmax(25%, 25%) minmax(25%, 25%); //minmax(75%, 75%); //1fr,4fr;//repeat(5, 1fr);//10%,30%,1fr;
  grid-template-rows: repeat(6, minmax(1fr, 16%)); /* 创建 2 行，每行高度 100px */
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
