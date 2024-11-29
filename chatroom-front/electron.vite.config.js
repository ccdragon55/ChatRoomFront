import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// import { optimizer } from '@electron-toolkit/utils'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    //代理
    server: {
      port: 8080,
      open: true,
      hmr: true
    }
    // server:{
    //   hmr:true,
    //   port:10000,
    //   proxy:{

    //   }
    // }
  }
  // ,optimizeDeps: {
  //   include: ['path']
  // }
  // ,plugins: [
  //   optimizer({
  //     electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`
  //   }),
  // ]
})
