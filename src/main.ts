/*
 * @Author: wangxuan wangxuan
 * @Date: 2024-08-19 13:17:10
 * @LastEditors: wangxuan wangxuan
 * @LastEditTime: 2024-08-19 13:48:54
 * @FilePath: /vite-vue3/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupRouter } from './router'

const app = createApp(App)
// import VueRouter from 'vue-router'

// app.use(VueRouter)
setupRouter(app)
app.use(ElementPlus)
app.mount('#app')