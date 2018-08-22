/* global axiosMock localStorage location */
import _ from 'lodash'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import ELEMENT from 'element-ui'

import config from './config.js'
import menus from './router/routes.js'
import menuMap from './router/menuMap.js'
import util from './common/util.js'
import Privilege from './common/privilege.js'
import routes from './router/index.js'
import components from './components/index.js'
import directives from './directives/index.js'
import filters from './filters/index.js'
import MixinELEMENT from './mixins/index.js'

Vue.use(VueRouter)
Vue.use(MixinELEMENT)
Vue.use(ELEMENT)
// Vue.use(VueI18n)
Vue.use(components)
Vue.use(directives)
Vue.use(filters)

import main from './views/app.vue'

if (window.NODE_ENV === 'dev') {
  Vue.config.devtools = true
}
window.SERVER = config.serverURL
_.merge(axios.defaults, config.axios)

axios.interceptors.response.use(res => {
  return res
}, err => {
  if (err.message.includes('code 403')) {
    util.showErrorNotification('用户没有该模块的权限！')
    return
  }
  if (err.message.includes('code 401')) {
    window.location.href = 'login.html'
    return
  }
  if (err.message.includes('code 500')) {
    util.showErrorMessageBox('服务器发生500异常，未获取到数据！')
  }
  if (err.message === 'Network Error') {
    util.showErrorMessageBox('网络错误，请检查网络是否通畅、或者服务器地址设置正确,设置服务器地址可以自行到登录页面设置.')
  }
  return Promise.reject(err)
})

VueRouter.removeMenu = (routePath) => {
  for (let i = menus.length - 1; i >= 0; i--) {
    let menu = menus[i]
    if (menu.path === routePath) {
      menus.splice(i, 1)
    } else if (menu.children) {
      for (let j = menu.length - 1; j >= 0; j--) {
        if (menu[i].path === routePath) {
          menu[i].splice(j, 1)
        }
      }
    }
  }
  for (let i = routes.length - 1; i >= 0; i--) {
    let route = routes[i]
    if (route.path === routePath) {
      routes.splice(i, 1)
    } else if (route.children) {
      for (let j = route.length - 1; j >= 0; j--) {
        if (route[i].path === routePath) {
          route[i].splice(j, 1)
        }
      }
    }
  }
}

VueRouter.insertMenu = (menuConfig, index) => {
  if (!menuConfig.meta) {
    menuConfig.meta = {}
  }
  if (!menuConfig.meta.title && menuConfig.title) {
    menuConfig.meta.title = menuConfig.title
  }
  const routeConfig = menuConfig
  menuConfig = JSON.parse(JSON.stringify(menuConfig))
  menus.splice(index, 0, menuConfig)
  routes.splice(index, 0, routeConfig)
}

VueRouter.insertSubMenus = (menusConfig, parentRoutePath, index) => {
  if (!Array.isArray(menusConfig)) {
    menusConfig = [menusConfig]
  }
  for (let menuConfig of menusConfig) {
    if (!menuConfig.meta) {
      menuConfig.meta = {}
    }
    if (!menuConfig.meta.title && menuConfig.title) {
      menuConfig.meta.title = menuConfig.title
    }
  }
  const routesConfig = menusConfig
  menusConfig = JSON.parse(JSON.stringify(menusConfig))
  const parentMenu = menus.find(item => item.path === parentRoutePath)
  const parentRoute = routes.find(item => item.path === parentRoutePath)
  if (parentMenu && !parentMenu.children) {
    parentMenu.children = []
  }
  if (parentRoute && !parentRoute.children) {
    parentRoute.children = []
  }
  if (parentMenu) {
    parentMenu.children.splice.apply(parentMenu.children, [index, 0].concat(menusConfig))
  }
  if (parentRoute) {
    parentRoute.children.splice.apply(parentRoute.children, [index, 0].concat(routesConfig))
  }
}

window.appInit = async _ => {
  axiosMock.onAny().passThrough()

  let appBeforeInstantiateRouter = document.createEvent('Event')
  appBeforeInstantiateRouter.initEvent('appbeforeinstantiaterouter', true, true)
  document.dispatchEvent(appBeforeInstantiateRouter)
  const router = new VueRouter({
    mode: 'hash',
    routes: routes
  })
  router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
      let t = util.getParentRoutePath(routes, to.path)
      next(t || '/404')
    } else {
      util.title(to.meta.title)
      next()
    }
  })
  router.afterEach((to, from, next) => {
    window.scrollTo(0, 0)
  })

  let res = await axios.get('/api/login')
  res = res.data && res.data.data
  if (!res.installed) {
    window.location.href = 'install.html'
  }
  if (res.userName && res.logined) {
    for (let k in res) {
      localStorage.setItem(k, res[k])
    }
  }

  res = await axios.get('/api/sites')
  let siteID = res.data.siteID || 0
  let prefix = res.data.prefix || ''
  let platformAttributes = res.data.platformAttributes

  res = await axios.get('/api/application/privs')
  let privilege = new Privilege((res && res.data && res.data.data) || {})
  if (!res || !res.data) {
    console.warn('没有通过接口 /api/application/privs 取到当前用户的权限配置', privilege)
  }

  // 非超级管理员，根据当前用户权限进行路由过滤
  if (localStorage.userName !== localStorage.adminUserName) {
    for (let i = menus.length - 1; i >= 0; i--) {
      let menu = menus[i]
      let menuID = menuMap[menu.path]
      if (menuID && !privilege.hasPriv(menuID)) {
        menus.splice(i, 1)
      } else if (menu.children && menu.children.length) {
        for (let j = menu.children.length - 1; j >= 0; j--) {
          let submenu = menu.children[j]
          let routeWithNoParam = submenu.path.replace(/\/:.+/, '')
          let sMenuID = menuMap[routeWithNoParam]
          if (!privilege.hasPriv(sMenuID)) {
            menu.children.splice(j, 1)
          }
        }
      }
    }
  } else {
    // 判断超级管理员是否具有草稿库权限
    let draftMenu = '/workspace'
    var menuID = menuMap[draftMenu]
    let allMenus = window.routes
    let hasDraftPriv = !!privilege.data.keys[menuID]
    for (let index in allMenus) {
      let item = allMenus[index]
      if (item.path === draftMenu && !hasDraftPriv) {
        window.routes.splice(index, 1)
      }
    }
  }

  let i18ns = await axios.get('/api/application/i18ns')
  if (!i18ns || !i18ns.data) {
    console.warn('没有通过接口 /api/application/i18ns 取到当前用户的国际化配置')
  }
  Vue.config.lang = i18ns.data.lang
  const messages = {}
  messages[i18ns.data.lang] = i18ns.data.data

  let i18n = new VueI18n({
    locale: i18ns.data.lang,
    messages
  })
  let appBeforeCreateEvent = document.createEvent('Event')
  appBeforeCreateEvent.initEvent('appbeforecreate', true, true)
  let appCreatedEvent = document.createEvent('Event')
  appCreatedEvent.initEvent('appcreated', true, true)
  let appBeforeMountEvent = document.createEvent('Event')
  appBeforeMountEvent.initEvent('appbeforemount', true, true)
  let appMountedEvent = document.createEvent('Event')
  appMountedEvent.initEvent('appmounted', true, true)

  window.app = new Vue({
    data: {
      siteID,
      prefix,
      platformAttributes
    },
    watch: {
      siteID (val, oldVal) {
        this.$emit('changeCurrentSite', val, oldVal)
      },
      prefix (val, oldVal) {
        this.$emit('changeCurrentPrefix', val, oldVal)
      }
    },
    beforeCreate () {
      window.app = this
      document.dispatchEvent(appBeforeCreateEvent)
    },
    created () {
      document.dispatchEvent(appCreatedEvent)
    },
    beforeMount () {
      document.dispatchEvent(appBeforeMountEvent)
    },
    mounted () {
      document.dispatchEvent(appMountedEvent)
    },
    el: '#app',
    i18n: i18n,
    router: router,
    render: h => h(main)
  })
}
window.addEventListener('load', window.appInit, false)
