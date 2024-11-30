<template>
  <!-- <div>login</div> -->
  <div class="login-form">
    <div class="drag">登录</div>
    <el-form ref="form" label-width="80px" @submit.prevent="handleSubmit">
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="email"
          type="text"
          placeholder="请输入邮箱"
          required
          clearable
          style="width: 80%"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="password"
          type="password"
          placeholder="密码"
          required
          show-password
          clearable
          style="width: 80%"
        ></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="mini" @click="handleSubmit">登录</el-button>
      </el-form-item>

      <div class="tips" style="float: left; margin-left: 20%">
        <el-link underline="true" @click="retrievePWD">忘记密码</el-link>
      </div>
      <div class="tips" style="float: right; margin-right: 15%">
        <el-link @click="regis">还没有账号？点击注册</el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import router from '../router'
import md5 from 'crypto-js/md5'
import { ElMessage, ElLoading } from 'element-plus'
import instance from '../axios'
import api from '../utils/Api'
const { proxy } = getCurrentInstance()
const { ipcRenderer } = require('electron')

// import {window} from 'electron'

const email = ref('')
const password = ref('')
const token = ref('')
const permission = ref('')
const uid = ref('')

// const loadingInstance = ElLoading.service({ fullscreen: true });

// 定义提交处理函数
const handleSubmit = async () => {
  // router.push('/home/chat');
  // // const screenWidth=window.srceen.width;
  // // const screenHeight=window.srceen.Height;
  // // window.ipcRenderer.send("loginSuccess",{
  // //   screenWidth:screenWidth,
  // //   screenHeight:screenHeight
  // // })
  // ipcRenderer.send("changeWindowSizeToHomePage")
  const loadingInstance = ElLoading.service({ fullscreen: true })
  try {
    console.log(email.value)
    console.log(password.value)
    const newPwd = md5(password.value).toString()
    console.log(newPwd)
    const response = await instance.post(
      '/account/login',
      {
        email: email.value,
        password: newPwd
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const data = response.data.data
    console.log(data)
    localStorage.clear()
    localStorage.setItem('admin', data.admin)
    localStorage.setItem('contactStatus', data.contactStatus)
    localStorage.setItem('joinType', data.joinType)
    localStorage.setItem('nickName', data.nickName)
    localStorage.setItem('personalSignature', data.personalSignature)
    localStorage.setItem('sex', data.sex)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    loadingInstance.close()

    const avatarUrl = await instance.post(
      '/file/getAvatar',
      {
        userId: data.userId
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('selfAvatarUrl')
    console.log(avatarUrl)
    localStorage.setItem('selfAvatarUrl', avatarUrl.data.data)
    ipcRenderer.send('saveSelfAvatar', { id: data.userId, url: avatarUrl.data.data })
    router.push('/home/chat')
    ipcRenderer.send('loginSuccess', { userId: data.userId, token: data.token })
  } catch (error) {
    ElMessage('网络错误')
    loadingInstance.close()
    localStorage.clear()
    //localStorage.setItem('userId', '1000')

    //router.push('/home/chat')
    //ipcRenderer.send('loginSuccess', { userId: '1000', token: 123456 })
  }
}

const retrievePWD = () => {
  router.push('/forgetpassword')
}

const regis = () => {
  router.push('/register')
  ipcRenderer.send('changeWindowSizeToRegister')
}

const init = () => {
  // ipcRenderer.send("setLocalStore",{key:'prodDomain',value:proxy.Api.prodDomain})
  // ipcRenderer.send("setLocalStore",{key:'devDomain',value:proxy.Api.devDomain})
  // ipcRenderer.send("setLocalStore",{key:'prodWsDomain',value:proxy.Api.prodWsDomain})
  // ipcRenderer.send("setLocalStore",{key:'devWsDomain',value:proxy.Api.devWsDomain})
  ipcRenderer.send('setLocalStore', { key: 'prodDomain', value: api.prodDomain })
  ipcRenderer.send('setLocalStore', { key: 'devDomain', value: api.devDomain })
  ipcRenderer.send('setLocalStore', { key: 'prodWsDomain', value: api.prodWsDomain })
  ipcRenderer.send('setLocalStore', { key: 'devWsDomain', value: api.devWsDomain })
}

onMounted(() => {
  init()
})
</script>

<style lang="less">
.login-form {
  // margin: 150px auto;
  // padding: 60px;
  // width: 350px;
  // border: 1px solid #e0e0e0;
  // border-radius: 10px;
  // background-color: #ffffff;
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding-right: 20%;
  width: 100vw;
  height: 100vh;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333333;
}

input {
  width: 100%;
  // padding: 10px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

input:focus {
  border-color: #007bff;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  outline: none;
}

button {
  width: 80%;
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004085;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.tips {
  margin-top: 2%;
  font-size: 14px;
}

.tips el-link {
  color: #000000;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}

.drag {
  -webkit-app-region: drag;
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
