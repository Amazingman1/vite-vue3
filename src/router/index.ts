import { createRouter, createWebHashHistory } from "vue-router"
import  type {App} from 'vue'
import routes from './routers/index'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * 路由初始化函数
 * @param app
 */
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router