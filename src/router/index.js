import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/books',
    meta: { title: '图书查询', icon: 'el-icon-s-management' },
    children: [{
      path: 'books',
      name: 'Books',
      component: () => import('@/views/book/Books'),
      meta: { title: '图书列表', icon: 'el-icon-s-management' }
    }, {
      path: 'book',
      name: 'Book',
      component: () => import('@/views/book/index'),
      meta: { title: '图书详情', icon: 'el-icon-s-management' },
      hidden: true
    }]
  },



  {
    path: '/borrow',
    component: Layout,
    redirect: '/borrow/preserve',
    name: 'Borrow',
    meta: { title: '图书借阅', icon: 'table' },
    children: [
      /*{
        path: 'preserve',
        name: 'Preserve',
        component: () => import('@/views/borrow/index'),
        meta: { title: '借阅记录', icon: 'table', roles: ['user', 'admin', 'super'] }
      },*/
      {
        path: 'postpone',
        name: 'Postpone',
        component: () => import('@/views/borrow/Postpone'),
        meta: { title: '借阅延期', icon: 'el-icon-user-solid', roles: ['user', 'admin', 'super'] }
      }
    ]
  },

  {
    path: '/history',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'History',
        component: () => import('@/views/borrow/index'),
        meta: { title: '借阅记录', icon: 'table', roles: ['user', 'admin', 'super'] }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/book-manage',
    component: Layout,
    redirect: '/book-manage',
    children: [{
      path: 'book-manage',
      name: 'BookManage',
      component: () => import('@/views/book-m/index'),
      meta: { title: '图书管理', icon: 'el-icon-s-management', roles: ['admin', 'super'] }
    }]
  },

  {
    path: '/borrow-manage',
    component: Layout,
    redirect: '/borrow-manage/table',
    name: 'BorrowManage',
    meta: { title: '借阅记录管理', icon: 'table' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/borrow-m/index'),
        meta: { title: '借阅记录管理', icon: 'table', roles: ['admin', 'super'] }
      }
    ]
  },

  {
    path: '/user-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'UserManage',
        component: () => import('@/views/user-m/index'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid', roles: ['admin', 'super'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes // .concat(asyncRoutes)
})

const router = createRouter()// .addRoutes(asyncRouterMap)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
