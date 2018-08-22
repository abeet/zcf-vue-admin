# {{ name }}
### 概述
{{ description }}  
前端使用用Vue及ElementUI框架，后端实现RESTful规范的接口与前端进行交互。  
前端工程要配合后端工程提供的接口来使用。

### 运用到的工具、框架或库：
- **[VueJS 2.x](https://github.com/vuejs/vue)**
- [Vue-router](https://github.com/vuejs/vue-router)
- [axios](https://github.com/mzabriskie/axios)
- **[Element UI 2.x](https://github.com/ElemeFE/element)**
- [Babel](https://babeljs.io/)
- [Webpack](https://github.com/webpack/webpack)
- [gulp](https://gulpjs.com/)

## 开发流程：
1. 克隆本脚手架前端工程、后端工程，配置数据库，导入示例数据。
1. 根据项目实际需求，配置路由和菜单，准备各路由所对应的vue文件，vue文件内容为空白，待分配给项目成员实现。
1. 实现vue文件的界面部分，暂时使用axios-mock-adapter来拦截ajax请求，返回mock数据，注意mock数据的字段和数据库表设计有关。
1. 后端实现RESTful接口，并维护接口文档（在doc目录下维护raml格式接口文档或使用 http://apizza.cc 在线文档服务）
1. 前端取消axios-mock-adapter拦截，调试后端接口。

## 注意事项
1. JS风格使用`JavaScript Standard Style`，建议使用VSCode作为js/vue的编辑器，并安装以下插件`EditorConfig for VSCode` , `Prettier-Standard - JavaScript formatter` , `JavaScript Standard Style` , `stylefmt` , `Vetur`。
  并且vscode的配置里要加下面的命令，防止格式化时自动加分号。   
  `  "prettier.singleQuote": true,`  
  `  "prettier.semi": false,`  
1. 在开发界面时使用ElementUI提供的栅格系统（24列），对界面进行响应式布局，以便移动端访问。
1. ZCMS3.0的界面布局参考ZCMS2.4扁平风格，因为使用第三方控件库，所以不要求界面完全相同，但要布局类似（主要是控件的位置，和控件间的留白）。
1. 不要使用ElementUI提供的图标组件，使用Font Awesome 图标。
1. 后端接口符合RESTful规范
1. 注意后端返回前端的数据，字段名同数据库中的字段名，并转为小写字母开头的驼峰式命名（2017年11月底对框架3.0作的调整，用 java.beans.Introspector.decapitalize 方法处理了字段名），构造mock数据时也要注意这一点。
1. 工程编译时，`source`目录下的`lib`、`assets`目录下的文件会被直接复制到`dist`目录下。
1. 为了便于维护，对话框、页签等如果里面的内容比较多（超过30行），要独立成vue组件，尽量不要让一个vue组件的代码太多（超过500行超过20K）,尽量把vue文件里的js移到单独的文件，便于使用编辑器的js校验/js格式化功能。vue文件中css代码行数较多时（超过50行），亦可将css移到单独的css文件。模板部分要保持在vue文件里，以使用Vetur插件的模板语法校验功能。
1. 从后台请求的数据有分页的情况下，Request参数的约定：`pageIndex` 第几页（从第1页开始）；`pageSize` 每页返回多少行。Response中返回数据除了有列表外，还要有`total`供分页条显示总记录数。特定的api也可以支持 `startIndex` 从第几行记录开始,`count` 返回多少行记录。

## 目录说明
目录结构类似 https://github.com/kenberkeley/vue-demo/tree/master/src 但有简化、调整。

```
source
│  index.html              主入口静态页
│  app.js                  主入口js
│  login.html              登录页静态页
│  login.js                登录页js
│  config.js               一些全局配置
│  
├─router                   路由配置
├─directives               自定义指令
├─filters                  自定义过滤器
├─mixins                   公共mixins
├─store                    公共状态管理
├─common                   公共js工具方法/类
│      util.js               工具类
│      ......
├─components               公共组件
│      toolbar.vue
│      ......
├─lib                      第三方库，供页面用<script>引入，不会编译，直接复制到发布目录
│      vue.min.js
│      vue-router.min.js
│      axios.min.js
│      ......
├─assets                   资源目录，不会编译，直接复制到发布目录
│  ├─css                   公共样式及第三方样式库，页面用<link>引入
│  ├─fonts                 图标字体
│  └─images                图片
└─views                    所有页面视图
   │   app.vue                app主视图组件
   │
   ├─catalog                  对应一级菜单“栏目配置”
   │      ......
   ├─plugins                  对应一级菜单“功能组件”
   │      ......
   ├─member                   对应一级菜单“会员管理”
   │      ......
   ├─platform                 对应一级菜单“系统管理”
   │  ├─mock                  “系统管理”模块下各子模块的mock数据配置
   │  ├─components            “系统管理”模块下各子模块的共用组件
   │  ├─mixins                “系统管理”模块下各子模块的共用mixins
   │  └─store                 “系统管理”模块下各子模块的共用状态管理
   │      index.vue              “系统管理”主视图组件
   │      systemInfo.vue         对应二级菜单“系统信息”
   │      branch.vue             对应二级菜单“组织机构”
   │      role.vue               对应二级菜单“角色管理”
   │      user.vue               对应二级菜单“用户管理”
   │      config.vue             对应二级菜单“配置项管理”
   │      menu.vue               对应二级菜单“菜单管理”
   │      plugin.vue             对应二级菜单“插件管理”
   │      backup.vue             对应二级菜单“数据备份”
   │      log.vue                对应二级菜单“系统日志”
   │      ......
   └─error                    404、505等错误提示视图
```

## 开发与构建命令
建议使用`yarn`最新版本，下载地址 https://yarnpkg.com/latest.msi  
建议使用淘宝的npm仓库镜像，安装npm包速度更快：  
``` bash
# 使用淘宝的npm仓库镜像   
npm config set registry https://registry.npm.taobao.org

```

``` bash
# 安装依赖   
yarn install

# 进入开发模式，启动前台应用，localhost:3000 。监听vue文件改动自动刷新浏览器  
yarn run dev

# 构建文件到dist目录供发布  
yarn run build

```

## 链接
JavaScript Standard 代码规范  
https://github.com/standard/standard/blob/master/docs/README-zhcn.md  
  
VUE 2 文档  
https://cn.vuejs.org/v2/api/  
  
Vue Router 2 文档  
https://router.vuejs.org/zh-cn/  
  
Element-UI 文档  
http://element.eleme.io/#/zh-CN/component/layout  
  
axios 介绍  
https://github.com/mzabriskie/axios/blob/master/README.md  
  
Font Awesome 图标  
~~http://fontawesome.io/icons/~~  
https://www.thinkcmf.com/font/font_awesome/icons.html   
  
RAML 1.0 文档  
https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md  
  
  