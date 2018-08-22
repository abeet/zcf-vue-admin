/**
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
           佛祖保佑       永无霸葛
           心外无法       法外无心
**/
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

window.axiosMock = window.axiosMock || new AxiosMockAdapter(axios, { delayResponse: 1000 })

// 路由设置
const routes = [
  {
    path: '/',
    redirect: '/platform/systemInfo'
  },
  {
    path: '/settings',
    meta: { title: '栏目配置', icon: 'fa fa-list' },
    component: 'settings/index',
    children: [{
        path: '/settings/catalog',
        meta: { title: '栏目列表', icon: 'fa fa-list' },
        component: 'settings/catalog'
      },
      {
        path: '/settings/dimens',
        meta: { title: '分类管理', icon: 'fa fa-sitemap' },
        component: 'settings/dimension'
      }
    ]
  },
  {
    path: '/platform',
    meta: { title: '系统管理', icon: 'fa fa-wrench' },
    component: 'platform/index',
    children: [
      {
        path: '/platform/systemInfo',
        meta: { title: '系统信息', icon: 'fa fa-info-circle' },
        component: 'platform/systemInfo'
      },
      // {
      //   path: '/platform/detector',
      //   meta: { title: '系统检测', icon: 'fa fa-file-text-o' },
      //   component: 'platform/detector'
      // },
      {
        path: '/platform/branch',
        meta: { title: '组织机构', icon: 'fa fa-users' },
        component: 'platform/branch'
      },
      {
        path: '/platform/role',
        meta: { title: '角色管理', icon: 'fa fa-users' },
        component: 'platform/role'
      },
      {
        path: '/platform/user',
        meta: { title: '用户管理', icon: 'fa fa-users' },
        component: 'platform/user'
      },
      {
        path: '/platform/security',
        meta: { title: '账户安全', icon: 'fa fa-unlock-alt' },
        component: 'platform/security'
      },
      {
        path: '/platform/code',
        meta: { title: '代码管理', icon: 'fa fa-file-code-o' },
        component: 'platform/code'
      },
      {
        path: '/platform/config',
        meta: { title: '配置项管理', icon: 'fa fa-toggle-on' },
        component: 'platform/config'
      },
      {
        path: '/platform/metadata',
        meta: { title: '元数据管理', icon: 'fa fa-database' },
        component: 'platform/metadata'
      },
      {
        path: '/platform/schedule',
        meta: { title: '定时任务', icon: 'fa fa-clock-o' },
        component: 'platform/schedule'
      },
      {
        path: '/platform/menu',
        meta: { title: '菜单管理', icon: 'fa fa-list' },
        component: 'platform/menu'
      },
      {
        path: '/platform/plugin',
        meta: { title: '插件管理', icon: 'fa fa-file-code-o' },
        component: 'platform/plugin'
      },
      {
        path: '/platform/backup',
        meta: { title: '数据备份', icon: 'fa fa-database' },
        component: 'platform/backup'
      },
      {
        path: '/platform/log',
        meta: { title: '系统日志', icon: 'fa fa-heartbeat' },
        component: 'logs/log'
      },
      {
        path: '/platform/api',
        meta: { title: 'API接口', icon: 'fa fa-plug' },
        component: 'platform/api'
      }
    ]
  },
  {
    path: '/_samples',
    component: '_samples/index',
    children: [
      {
        path: '/_samples/vueditor',
        meta: { title: 'UEditor使用' },
        component: '_samples/vueditor'
      }
    ]
  },
  {
    path: '/*',
    component: 'error/notFound404'
  }
]
window.routes = routes

export default routes
