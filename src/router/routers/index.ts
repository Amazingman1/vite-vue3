import type { RouteRecordRaw } from 'vue-router'

// 获取modules中的路由规则
// https://cn.vitejs.dev/guide/features.html#glob-import
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

// modules路由规则
const routes: RouteRecordRaw[] = []

Object.keys(modules).forEach(key => {
  const modulesRoutes =(modules[key] as { default: RouteRecordRaw[]}).default || { }
  let modRoutesList = []
  if (Array.isArray(modulesRoutes)) {
    modRoutesList = [...modulesRoutes]
  } else {
    modRoutesList = [modulesRoutes]
  }
  routes.push(...modRoutesList)

})

// 根目录路由规则
const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'root',
  redirect: '/home'
}
// 404页面路由规则
const notFoundPage: RouteRecordRaw = {
  // vue-router@4的变化，舍弃*通配符
  path: '/:pathMatch(.*)*',
  name: '404',
  component: () => import('../../views/common/404Page.vue')
}

export default [rootRoute, ...routes, notFoundPage]
