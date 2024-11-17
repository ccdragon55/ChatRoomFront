<template>
  <!-- <div>login</div> -->
  <div class="login-form">
    <div>Chatroom</div>
    <el-form ref="form" label-width="80px" @submit.prevent="handleSubmit">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="username" type="text" placeholder="请输入用户名" required clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="password" type="password" placeholder="密码" required show-password clearable></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="mini" @click="handleSubmit">登录</el-button>
      </el-form-item>

      <div class="tips" style="float:left;">
        <el-link underline="true" @click="retrievePWD">忘记密码</el-link>
      </div>
      <div class="tips" style="float:right;">
        <el-link @click="regis">还没有账号？点击注册</el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import {ref,reactive,getCurrentInstance,nextTick} from 'vue'
const {proxy} =getCurrentInstance()

const username = ref('');
const password = ref('');
const token = ref('');
const permission = ref('')
const uid = ref('')

// 定义提交处理函数
const handleSubmit = async () => {

};

const retrievePWD = () => {

};

const regis = () => {

};
</script>

<style lang="less">
.login-form {
  margin: 150px auto;
  padding: 60px;
  width: 350px;
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
  padding: 10px;
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
  width: 100%;
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
  margin-top: 20px;
  font-size: 14px;
}

.tips el-link {
  color: #000000;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>