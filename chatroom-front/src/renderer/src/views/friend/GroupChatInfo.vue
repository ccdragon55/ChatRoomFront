<template>
  <div class="div-group">
    <div class="div-group-name">{{ (selectedId===null)?0:items[selectedId-1].name }}</div>
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
          <div v-for="item in items" :key="item.id" class="div-group-record-item">
            <div class="div-group-avatar"><el-avatar class="user-avatar" icon="el-icon-user-solid"></el-avatar></div>
            <div class="div-group-record-name"><el-text truncated>{{ item.name }}</el-text></div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="div-group-sendMessage">
        <el-button class="div-group-sendButton" type="success">发送消息</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue';
import { Search} from '@element-plus/icons-vue'
import router from '../../router';
const conditionValue=ref("搜索聊天");

const selectedId=ref(null)
//在页面加载时，从 localStorage 中读取上次选中的 ID
onMounted(() => {
    const storedGroupId = Number(localStorage.getItem('selectedGroupId'));
    if (storedGroupId) {
        selectedId.value=storedGroupId;
    }
});


const inputRef=ref(null);
const chatInput=ref("");

const items=reactive([
        { id: 1, name: 'Item 1111111111111111111111' },
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
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        ]);

</script>

<style lang="less" scoped>
.div-chatList{
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

.div-group-avatar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    // margin-left: 6%;
    padding: auto;
}

.div-group-record-name{
margin-top: auto;
margin-bottom: auto;
white-space: nowrap; /* 文字保持在一行 */
}

.user-avatar{
    // margin: auto,auto,auto,100px;
    margin: 0;
    // margin-left: auto;
}

.div-group-record{
// display: flex; 
height: 92%;
overflow-y: auto; /* 只显示垂直滚动条 */
}

.div-group-record-item{
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

.div-group{
// display: flex;
// background-color: rgb(178, 219, 139); 
background-color: white;
width: 69%;
}

.div-group-name{
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

.div-group-member{
    // display: flex;
    // display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
    // grid-template-columns: repeat(5, 1fr); /* 创建 3 列，每列占 1fr 的宽度 */
    // gap: 20px;
    // align-items: center; /* 垂直居中 */
    // justify-items: center; /* 水平居中 */
    padding-top: 2%;
    padding-bottom: 2%;
    padding-left: 2%;
    padding-right: 2%;
    height: 70%;
    margin: 0;
}

.div-group-memberList{
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

.div-group-sendMessage{
padding-top: 2%;
padding-bottom: 2%;
padding-left: 2%;
padding-right: 2%;
margin: 0;
height: 30%;
overflow: hidden;
}

.el-input-group-input{
width: 100%;
height: auto;
border: none;

}

.div-group-sendButton{
height: 20%;
width: 20%;
margin-left: 40%;
margin-right: 40%;

}
</style>