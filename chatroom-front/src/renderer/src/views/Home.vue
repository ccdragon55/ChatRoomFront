<script setup>
import Sider from './sider.vue'
</script>

<template>
  <div class="container">
    <Sider class="sider"></Sider>
    <!-- <router-view name="homePage"></router-view> -->
    <router-view></router-view>
  </div>
</template>

<style lang="less">
body{
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.container{
  display: flex;
  // margin: 0px 0px 0px 0px;
  // padding: 0px 0px 0px 0px;
  width: 100vw;
  height: 100vh;
}

.sider{
  margin: 0px 0px 0px 0px;
  padding: 0;
  width: 6%;
  // height: 100%;
  height: auto;
}
</style>