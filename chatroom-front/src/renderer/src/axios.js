// src/axios.ts
import axios from 'axios'
// import JSONbig from 'json-bigint'

// const JSONbigToString = JSONbig({ storeAsString: true })

const instance = axios.create({
  //   baseURL: 'https://api.javaee.hirrao.cn', // 你的API基础URL
  //baseURL: 'http://localhost:8088', // 你的API基础URL
  baseURL: 'http://10.29.61.159:5050',
  timeout: 10000, // 请求超时的时间限制
  headers: { 'Content-Type': 'application/json' }
  //   transformResponse: [
  //     function (data) {
  //       try {
  //         // 转换
  //         return JSONbigToString.parse(data)
  //       } catch (error) {
  //         // 转换失败按元数据返回
  //         return data
  //       }
  //     }
  //   ]
})

// 请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // 从 localStorage 获取 token
//     const token = localStorage.getItem('token')
//     console.log('这是全局配置token:', token)
//     if (token !== null) {
//       // 如果 token 存在，直接将 token 添加到请求头中
//       config.headers.Authorization = token
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

export default instance
