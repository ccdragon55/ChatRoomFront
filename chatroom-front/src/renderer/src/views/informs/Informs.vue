<template>
  <div class="inform-list-container">
    <!-- <el-row :gutter="20" class="inform-list">
    <el-col v-for="inform in paginatedInforms" :key="inform.id" :span="24">
        <el-card shadow="hover" class="inform-item">
        <div class="inform-content-wrapper" @click="viewInform(inform)">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <!-- <img :src="inform.image" alt="Inform Image" class="inform-image" /> --
            <div class="inform-content">
            <h3>{{ inform.nickName }}</h3>
            <p>{{ inform.applyMessage }}</p>
            </div>
        </div>
        </el-card>
    </el-col>
    </el-row> -->
    <div style="margin-bottom: 3%; font-size: larger; text-align: center">通知</div>
    <div class="div-chat" v-if="informs.length == 0">
      <el-empty style="width: 100%; height: 100%; margin: auto" description="空空如也" />
    </div>
    <div class="div-informs" v-else>
      <el-card
        v-for="(inform, index) in paginatedInforms"
        :key="inform.id"
        shadow="hover"
        class="inform-item"
        @contextmenu.stop="onContextMenu(inform, index, $event)"
      >
        <div class="inform-content-wrapper" @click="viewInform(index)">
          <el-avatar :src="inform.avatarUrl" icon="el-icon-user-solid"></el-avatar>
          <!-- <img :src="inform.image" alt="Inform Image" class="inform-image" /> -->
          <div class="inform-content">
            <el-text style="color: black; font-size: large" truncated>{{
              inform.applyUserNickName
            }}</el-text>
            <br />
            <el-text truncated>{{ inform.applyInfo }}</el-text>
          </div>
          <div v-if="inform.statu == 1">已同意</div>
          <div v-else-if="inform.statu == -1">已拒绝</div>
          <div v-else>未处理</div>
        </div>
      </el-card>
      <div style="display: grid; justify-content: center">
        <el-pagination
          v-model="currentPage"
          :page-size="pageSize"
          :total="informs.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          background
          class="pagination"
        />
        <!-- hide-on-single-page -->
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      width="50%"
      style="max-height: 70%"
      title="消息详情"
      append-to-body
    >
      <!-- <div style="max-height: 10%;"> -->
      <!-- <div class="div-inform-details" v-if="selectedInform"> -->
      <div class="div-inform-details">
        <div style="margin: auto">昵称:</div>
        <!-- <div>{{ selectedInform.nickName }}</div> -->
        <div style="grid-column: span 3; margin-top: auto; margin-bottom: auto">
          {{ informs[selectedInform + (currentPage - 1) * pageSize].applyUserNickName }}
        </div>
        <div>申请信息:</div>
        <div style="grid-row: span 2; grid-column: span 3; max-height: 100%">
          <el-scrollbar style="max-height: 100%">
            <div style="height: 100%">
              {{ informs[selectedInform + (currentPage - 1) * pageSize].applyInfo }}
            </div>
            <!-- <el-text style="height: 30%;" :line-clamp="10">111111111111115651111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</el-text> -->
          </el-scrollbar>
          <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" col style="height: 30%;" disabled>111111111111115651111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</el-input> -->
        </div>
        <el-button
          type="success"
          style="grid-row: 4; grid-column: 2; margin: auto"
          @click="agreeApply"
          >同意</el-button
        >
        <el-button
          type="danger"
          style="grid-row: 4; grid-column: 3; margin: auto"
          @click="rejectApply"
          >拒绝</el-button
        >
      </div>
      <!-- <div class="div-buttonBox">
            <el-button type="success" style="margin-right: 20%;" @click="showUpdateDialog">发送消息</el-button>
            <el-button type="danger" @click="showUpdateDialog">删除好友</el-button>
        </div> -->
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import { ElMessageBox, ElMessage } from 'element-plus'
import instance from '../../axios'
const { ipcRenderer } = require('electron')

const informs = ref([
  // { nickName: 'tj', applyMessage: '123456', statu: 1 },
  // { nickName: 'tj', applyMessage: '123456', statu: 1 },
  // { nickName: 'tj', applyMessage: '123456', statu: 0 },
  // { nickName: 'tj', applyMessage: '123456', statu: 1 },
  // { nickName: 'tj', applyMessage: '123456', statu: 0 },
  // { nickName: 'wjc', applyMessage: '123456', statu: 0 },
  // { nickName: 'wjc', applyMessage: '123456', statu: 1 },
  // { nickName: 'wjc', applyMessage: '123456', statu: 0 },
  // { nickName: 'wjc', applyMessage: '123456', statu: 1 },
  // { nickName: 'wjc', applyMessage: '123456', statu: 0 }
]) // 通知数据数组
const currentPage = ref(1) // 当前页码
const pageSize = 5 // 每页显示的通知数
const dialogVisible = ref(false) // 控制弹窗的可见性
const selectedInform = ref(null) // 选中的通知

// 计算当前页显示的通知
const paginatedInforms = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return informs.value.slice(start, end)
})

// 获取通知列表数据
async function fetchInforms() {
  const response = await instance
    .post(
      '/contact/searchApply',
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
    .catch((error) => {
      ElMessage.error(error)
    })
  console.log(response)
  informs.value.length = 0
  informs.value.push(...response.data.data)
  // try {
  //     const response = await instance.get('/articles')
  //     articles.value = response.data.reverse()
  // } catch (error) {
  //     console.error('获取通知失败', error)
  // }
}

// 在组件挂载时调用API获取数据
onMounted(() => {
  onReceiveNewApply()
  fetchInforms()
})

onUnmounted(() => {
  ipcRenderer.removeAllListeners('receiveNewApply')
})

const onReceiveNewApply = () => {
  ipcRenderer.on('receiveNewApply', (e) => {
    fetchInforms()
  })
  // ipcRenderer.on('receiveNewApply', (e, data) => {
  //   informs.value.unshift(data)
  // })
}

// 切换页面
function handlePageChange(page) {
  currentPage.value = page
}

// 查看详情，弹出弹窗
function viewInform(index) {
  console.log('Inform selected:', index) // 调试输出
  selectedInform.value = index
  dialogVisible.value = true
  console.log('Dialog visible:', dialogVisible.value) // 调试输出
  console.log(informs.value)
  console.log(informs.value[selectedInform.value])
}

function deleteInform(index) {
  // deleteSessionList(informId);
  currentPage.value = 1
  informs.value.splice(index, 1)
  // ipcRenderer.send("deleteSession",contactId);
}

function onContextMenu(data, index, e) {
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: '删除通知',
        onClick: () => {
          console.log('删除通知')
          ElMessageBox.confirm('确定删除?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            customClass: 'my-custom-message-box' // 添加自定义类
          }).then(() => {
            deleteInform(index)
          })
          // proxy.Confirm({
          //   message:'确定删除?',
          //   okfun:()=>{
          //     deleteSession(data.contactId)
          //   }
          // })
        }
      }
    ]
  })
}

async function agreeApply() {
  await instance
    .post(
      '/contact/dealWithApply',
      {
        applyId: informs.value[selectedInform.value + (currentPage.value - 1) * pageSize].applyId,
        ok: '1'
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
  informs.value[selectedInform.value + (currentPage.value - 1) * pageSize].statu = 1
  dialogVisible.value = false
}

async function rejectApply() {
  await instance
    .post(
      '/contact/dealWithApply',
      {
        applyId: informs.value[selectedInform.value + (currentPage.value - 1) * pageSize].applyId,
        ok: '2'
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
  informs.value[selectedInform.value + (currentPage.value - 1) * pageSize].statu = -1
  dialogVisible.value = false
}
</script>

<style lang="less" scoped>
.inform-list-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding: 2%;
  background-color: transparent;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.inform-list {
  margin-top: 20px;
}

.inform-item {
  // cursor: pointer;
  // transition:
  //     transform 0.3s ease,
  //     box-shadow 0.3s ease;
  // margin-bottom: 20px;
  padding: 0%;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.inform-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.inform-content-wrapper {
  display: flex;
  // flex-direction: column;
  align-items: center;
  text-align: center;
}

.inform-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.inform-content {
  padding-left: 3%;
  text-align: left;
  flex: 1;
}

h3 {
  font-size: 22px;
  margin-bottom: 10px;
  color: #333;
}

p {
  color: #777;
  font-size: 16px;
  line-height: 1.6;
}

.pagination {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 100%; /* 设置为100%以占满父容器 */
  text-align: center; /* 确保内容居中 */
  background-color: transparent;
}

.dialog-inform-image {
  width: 40%;
  height: auto;
  object-fit: cover;
  margin-top: 10px;
  margin-left: 250px;
  margin-right: auto;
  margin-bottom: 10px;
  border-radius: 10px;
}

.indented-text {
  text-indent: 2em;
  text-align: center;
}

.div-informs {
  display: grid; /* 激活 grid 布局 */
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, minmax(1fr, 20%)); /* 创建 2 行，每行高度 100px */
  margin-left: 10%;
  margin-right: 10%;
  gap: 10px; /* 设置网格之间的间距 */
}

.el-card__body {
  padding: 0;
  margin: 0;
}

:deep(.el-card__body) {
  padding: 2%;
}

.el-card {
  padding: 0;
}

.el-card.is-hover-shadow.inform-item {
  padding: 0;
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

.div-inform-details {
  display: grid; /* 激活 grid 布局 */
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, minmax(0, 70px)); /* 创建 2 行，每行高度 100px */
  margin-left: 10%;
  margin-right: 10%;
  gap: 10px; /* 设置网格之间的间距 */
  max-height: 30%;
}

.div-buttonBox {
  width: 100%;
  display: flex;
  margin-left: 20%;
  margin-right: 20%;
  margin-top: 5%;
}

:deep(.el-scrollbar__view) {
  max-height: 100%;
}
</style>
