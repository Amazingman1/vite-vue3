/*
 * @Author: 王璇 xuan.wang@vonechain.com
 * @Date: 2022-07-17 00:21:02
 * @LastEditors: 王璇 xuan.wang@vonechain.com
 * @LastEditTime: 2023-09-18 09:57:24
 * @FilePath: /metavers-tourism-app/src/router/routes/modules/common.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router'

// 路由规则
const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      // <van-icon name="label" />
      icon: 'wap-home'
    },
    component: () => import('../../../views/HomePage.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'label'
    },
    component: () => import('../../../views/LoginPage.vue')
  }
]

export default routes
