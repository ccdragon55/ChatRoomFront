<script setup>
// import Versions from './components/Versions.vue'
import {ref,reactive,getCurrentInstance,nextTick} from 'vue'
const {proxy} =getCurrentInstance()
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// import Sider from './views/sider.vue'
// const isLogin=ref(true);

const locale=zhCn
const config=reactive({
  max:1
})

// 在渲染进程中的 JavaScript 代码 (例如 Vue 或 React 中)

window.addEventListener('beforeunload', () => {
  // 清空 localStorage 中的内容
  localStorage.clear();
});
</script>

<template>
  <el-config-provider :locale="locale" :message="config">
    <!-- <div class="container">
      <sider class="sider" v-if="isLogin"></sider>
      <router-view></router-view>
    </div> -->
    <router-view></router-view>
  </el-config-provider>
</template>

<style lang="less">
//@import './assets/css/styles.less';

</style>
