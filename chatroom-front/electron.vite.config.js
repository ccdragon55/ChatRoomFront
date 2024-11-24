import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

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
      hmr:true
    }
    // server:{
    //   hmr:true,
    //   port:10000,
    //   proxy:{

    //   }
    // }
  }
})
