<template>
  <div :class="'app-wrap'+ (navbarCollapsed?' navbar-is-open':'')">
    <div class="navbar navbar-color-bg select-disable">
      <div class="navbar-header">
        <el-button type="text" @click="toggleNavbar" class="navbar-toggle">
          <i class="fa fa-align-justify"></i>
        </el-button>
        <a class="logo">
          <img src="../assets/images/product/logo_zh-cn.png" width="200" />
        </a>
      </div>
      <div class="buttons-left">
        当前站点：<tree-select class="site-selector" width="214" site top :value.sync="currentSiteID" :items="siteListTreeData"></tree-select>
      </div>
      <div class="buttons-right">
        <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
           <a class="fa fa-sign-out" @click="logout"></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
           <a class="fa fa-arrows-alt" @click="handleFullscreen"></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="锁屏" placement="bottom">
           <a class="fa fa-lock" @click="lockScreen"></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="个人设置" placement="bottom">
           <a class="fa fa-cog" @click="showUserSetting"></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="消息" placement="bottom">
          <a class="ringer-on-navbar" @click="getMessage">
            <i class="fa fa-bell-o"></i>
            <span class="badge msg-count" :style="message.count ? '':'opacity: 0.5'">\{{message.count}}</span>
          </a>
        </el-tooltip>
        <el-dropdown @command="handleCommand" style="cursor:pointer;">
          <span class="el-dropdown-link">
            \{{userName}}
            <img :src="avatorPath" class="img-circle b-a b-lter" style="max-width:36px;max-height:36px;" onerror="this.src='./assets/images/picture404.png';this.onerror=null;" />
            <i class="el-icon-arrow-down f12"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="passwd">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="vertical-navbar select-disable">
      <div :class="'navbar-collapse'+ (navbarCollapsed?' is-open':'')" @mouseenter="expandNavbar" @mouseleave="collapseNavbar">
        <el-menu theme="primary" :default-active="activeMenu">
          <template v-for="menu in menus">
            <el-menu-item v-if="menu.meta && menu.meta.title" :index="menu.path" :key="menu.path" @click="onSelectMenun(menu)">
              <i :class="menu.meta.icon" class="menu-icon"></i>
              <span class="menu-title">\{{menu.meta.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>

      </div>
    </div>
    <router-view :key="routerName"></router-view>

     <el-dialog title="修改密码" :visible.sync="modifyPasswordModal">
      <el-form :model="temp" :rules="tempRules" ref="modifyPasswordForm" label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input type="password" v-model="temp.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="temp.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="repeatPassword">
          <el-input type="password" v-model="temp.repeatPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="modifyPasswordModal = false">取 消</el-button>
        <el-button type="primary" @click="modifyPasswordHandler" :loading="handlerLoading">确 定</el-button>
      </div>
    </el-dialog>
   <!-- 短消息列表dialog -->
    <msg-dialog :messageShow.sync="messageShow"></msg-dialog>
    <!-- 锁屏 -->
    <lock-screen :show-unlock.sync="showUnlock"></lock-screen>

    <!-- 个人设置dialog -->
    <user-setting :showDialog.sync="userSettingShow" :isBanner="isBanner"></user-setting>
  </div>
</template>

<script>
import userSetting from './platform/userSettingTabs.vue'
import message from './platform/message/message.vue'
import routes from '../router/routes.js'
import TreeSelect from '../components/TreeSelect.vue'
import LockScreen from './lockScreen.vue'
import util from '../common/util.js'

export default {
  data () {
    let routePath = location.hash.substr(1)
    if (routePath && routePath.split('/').length > 2) {
      routePath = routePath
        .split('/')
        .slice(0, 2)
        .join('/')
    }
    return {
      userName: localStorage.userName || 'anonymous',
      routerName: this.$route.name || '/',
      menus: routes,
      systemMenus: {},
      activeMenu: routePath,
      navbarCollapsed: false, // 导航是否展开
      modifyPasswordModal: false,
      handlerLoading: false,
      messageShow: false,
      userSettingShow: false,
      isBanner: true,
      temp: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      tempRules: {
        oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 32, message: '密码最少6位，最多32位', trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, message: '请重复输入一次新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.temp.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      currentSiteID: 0,
      currentSiteName: '',
      siteListTreeData: [], // 站点列表树数据
      message: {
        count: 0
      },
      fullscreened: false, // 是否为全屏
      showUnlock: localStorage.locking === '1' // 显示解锁屏幕
    }
  },
  computed: {
    avatorPath () {
      return util.url.join(window.SERVER, '/avatar/' + this.userName)
    }
  },
  components: {
    'user-setting': userSetting,
    'msg-dialog': message,
    'tree-select': TreeSelect,
    'lock-screen': LockScreen
  },
  async created () {
    let self = this
    // 监听全屏切换事件
    let spprtFllScrn = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    spprtFllScrn = !!spprtFllScrn
    document.addEventListener('fullscreenchange', function () {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('mozfullscreenchange', function () {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('webkitfullscreenchange', function () {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('msfullscreenchange', function () {
      self.fullscreened = !self.fullscreened
    })

    // 监听个人设置打开事件
    window.openUserSettingDialog = new Event('openusersettingdialog')
    document.addEventListener('openusersettingdialog', function () {
      self.isBanner = false
      self.userSettingShow = true
    })
    // 监听个人设置关闭事件
    window.closeUserSettingDialog = new Event('closeusersettingdialog')
    document.addEventListener('closeusersettingdialog', function () {
      self.userSettingShow = false
    })

    let res = await axios.get('/api/sites')
    this.currentSiteID = res.data.siteID
    this.currentSiteName = res.data.siteName
    this.siteListTreeData = res.data.data
    res = await axios.get('/api/message/unread')
    this.message = res.data.data
  },
  watch: {
    '$route.name' (val, oldVal) {
      this.routerName = this.$route.name || '/'
    },
    async currentSiteID (val, oldVal) {
      if (oldVal !== 0) {
        let res = await axios.put('/api/sites/change', {siteID: val})
        if (res.data.status === 1) {
          this.$root.siteID = val
          window.location.reload()
        } else {
          util.showNotification(res.data)
        }
      }
    }
  },
  methods: {
    // 切换全屏
    handleFullscreen () {
      var bd = document.body
      this.fullscreened ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen() : bd.requestFullscreen ? bd.requestFullscreen() : bd.mozRequestFullScreen ? bd.mozRequestFullScreen() : bd.webkitRequestFullScreen ? bd.webkitRequestFullScreen() : bd.msRequestFullscreen && bd.msRequestFullscreen()
    },
    // 锁屏
    lockScreen () {
      this.showUnlock = true
    },
    onSelectMenun (menu) {
      let hash = (menu.children && menu.children[0].path) || ''
      if (hash.charAt(0) !== '/') {
        hash = '/' + hash
      }
      if (hash.indexOf(menu.path) === -1) {
        hash = menu.path + hash
      }
      window.location.hash = hash
      localStorage.lastRoutePath = hash
    },
    toggleNavbar () {
      this.navbarCollapsed = !this.navbarCollapsed
    },
    expandNavbar () {
      let self = this
      this.hoverIntent = setTimeout(_ => {
        self.navbarCollapsed = true
      }, 200)
    },
    collapseNavbar () {
      if (this.hoverIntent) {
        clearTimeout(this.hoverIntent)
      }
      this.navbarCollapsed = false
    },
    async logout () {
      await axios.get('/api/logout')
      localStorage.removeItem('logined')
      localStorage.removeItem('realName')
      localStorage.removeItem('adminUserName')
      location.href = 'login.html'
    },
    async handleCommand (cmd) {
      if (cmd == 'logout') {
        this.logout()
      }
      if (cmd == 'passwd') {
        this.temp = {
          oldPassword: '',
          password: '',
          repeatPassword: ''
        }
        this.modifyPasswordModal = true
      }
    },
    getMessage () {
      this.messageShow = true
    },
    showUserSetting () {
      this.isBanner = true
      this.userSettingShow = true
    },
    async modifyPasswordHandler () {
      try {
        await util.validateForm(this.$refs['modifyPasswordForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.handlerLoading = false
        return
      }
      this.handlerLoading = true
      let data = await axios.put('/api/application/password', this.temp)
      if (data.data.status === 1) {
        this.modifyPasswordModal = false
        this.temp = {
          oldPassword: '',
          password: '',
          repeatPassword: ''
        }
      }
      this.handlerLoading = false
      util.showNotification(data)
    }

  }
}
</script>

<style scoped>
.app-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  background-color: #f6f7f9;
}
.vertical-navbar {
  position: fixed;
  left: 0;
  top: 50px;
  bottom: 0;
  z-index: 103;
  background-color: #426299;
  /* box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.1), inset -1px 0 2px rgba(0, 0, 0, 0.1); */
}
.vertical-navbar .navbar-collapse {
  position: relative;
  padding: 0;
  width: 50px;
  overflow: hidden;
  transition: width ease 0.3s;
}
.vertical-navbar .el-menu {
  border-right: 0 none;
  background-color: transparent;
}
.vertical-navbar .el-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 14px;
  font-size: 14px;
}
.vertical-navbar .el-menu .el-menu-item,
.vertical-navbar .el-menu .el-menu-item i {
  color: #A3B1CC;
}
.vertical-navbar .el-menu .el-menu-item:hover,
.vertical-navbar .el-menu .el-menu-item:hover i,
.vertical-navbar .el-menu .el-menu-item.is-active,
.vertical-navbar .el-menu .el-menu-item.is-active i {
  color: #fff;
}
.navbar-collapse .menu-icon{
  width: 20px;
}
.navbar-collapse .menu-title {
  visibility: hidden;
}
.vertical-navbar .el-menu .el-menu-item:hover,.vertical-navbar .el-menu .el-menu-item:focus {
  background-color: #409eff;
  border-bottom: 0px solid #1a80ce;
}
.vertical-navbar .el-menu .el-menu-item.is-active:hover,
.vertical-navbar .el-menu .el-menu-item.is-active {
  border-bottom: 0px solid #1a80ce;
}

.navbar-collapse.is-open {
  width: 150px;
}
.navbar-collapse.is-open .menu-title {
  visibility: visible;
}

.navbar {
  height: 50px;
  line-height: 50px;
  padding: 0;
  border: 0;
  border-radius: 0;
  position: relative;
  /* box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.1); */
  z-index: 101;
}

.logo {
  padding-left: 0;
  width: 210px;
  max-width: 210px;
  display: inline-block;
  height: 50px;
  vertical-align: middle;
  font-size: 0px;
  display: table-cell;
  border-radius: 0;
}
.buttons-left {
  float: left;
  position: relative;
  z-index: 103;
  padding-left: 46px;
}
.buttons-right {
  text-align: right;
  float: right;
  position: relative;
  z-index: 103;
  padding-right: 15px;
}

.buttons-right > a,
.buttons-right button {
  padding: 8px;
}
.buttons-right .fa {
  font-size: 124%;
}
@media (max-width: 576px) {
  .navbar-collapse {
    z-index: 102;
    transition: all 0.3s;
  }
  .logo {
    background-color: transparent;
  }
  .buttons-right {
    display: none;
  }
  .navbar-toggle {
    width: 55px;
    line-height: 30px;
  }
  .navbar-collapse.is-open .el-menu--horizontal .el-menu-item {
    float: none;
    border-bottom-width: 1px;
  }
}

@media (min-width: 576px) {
  .navbar-toggle {
    display: none;
  }
}

.visible-on-mobile.el-menu .el-menu-item {
  padding-left: 40px;
}
.msg-count {
  background-color: #ff6f4b;
  position: relative;
  top: -10px;
  left: -10px;
  margin-right: -5px;
  font-weight: 400;
  transform: scale(0.75, 0.75);
}
.el-dropdown-link {
  padding: 10px 0;
}
</style>
<style>
.navbar-is-open .layout-row-main {
  left: 150px;
}
.site-selector {
  margin-right: 10px;
}
.site-selector .el-input__inner {
  background-color: transparent;
  border-color: #bfcbd9;
  color: #eef;
  border-radius: 20px;
  height: 28px;
  font-size: 12px;
}
</style>
