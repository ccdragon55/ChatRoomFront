<template>
  <div>个人主页</div>
</template>

<script setup lang="ts">

</script>

<style>
.main-profile {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: transparent;
    color: #ffffff;
}

.card {
    margin: 0;
}
.editor {
    background-color: white;
    overflow: auto;
    resize: both;
    max-width: 99%;
    min-height: 600px;
    color: #000;
}

.profile {
    display: flex;
    margin: 20px;
    align-items: stretch;
}

.profile .sidebar {
    width: 25%;
    background-color: #2b2b2b;
    padding: 20px;
    border-radius: 10px;
}

.intro {
    width: 25%;
    margin: 20px;
    display: flex;
}

.intro .detail h2 {
    margin: 5px;
}

.intro .detail p {
    margin: 5px;
}

.intro img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.profile .sidebar h2 {
    font-size: 20px;
    margin: 10px 0;
}

.profile .sidebar p {
    margin: 5px 0;
}

.profile .sidebar a {
    font-size: large;
    color: #000;
    margin-bottom: 10px;
}

.profile .sidebar button {
    background-color: #9b9b9b;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
}

.profile .main-content {
    width: 70%;
    margin-left: 5%;
    min-height: 500px;
}

.title  {
    max-width: 97%;
}
.stats {
    background-color: #2b2b2b;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}

h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
}

.stats2 {
    background-color: #2b2b2b;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    justify-content: space-between;
}

button {
    background-color: #e08b02;
    color: rgb(7, 1, 1);
    font-weight: bolder;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    width: 20%;
    margin-top: 10px;
}

.fav {
    margin: 10px;
    display: flex;
    align-items: center;
    padding: 20px, 20px;
    justify-content: center;
}

.fav .u {
    text-decoration: none;
}

.fav .sep {
    color: #9b9b9b;
    font-size: 40px;
}

#container {
    width: 90%;
    height: 500px;
    margin: 10px;
    padding: 10px;
}
</style>