const menus = {
  'data': [{
    'id': 'ECM.Public',
    'parentID': '',
    'name': '公共库',
    'icon': 'fa fa-share-alt font16',
    'url': '#/library/public',
    'order': '0001',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'ECM.team',
    'parentID': '',
    'name': '团队库',
    'icon': 'fa fa-cubes font16',
    'url': '#/library/team',
    'order': '0002',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'ECM.Personal',
    'parentID': '',
    'name': '个人库',
    'icon': 'fa fa-user font16',
    'url': '#/library/personal',
    'order': '0003',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'ECM.classified',
    'parentID': '',
    'name': '机密库',
    'icon': 'fa fa-lock font16',
    'url': '#/library/classified',
    'order': '0004',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'ECM.Share',
    'parentID': '',
    'name': '分享',
    'icon': 'fa fa-share font16',
    'url': '#/share',
    'order': '0005',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'ECM.Search',
    'parentID': '',
    'name': '检索',
    'icon': 'fa fa-search font16',
    'url': '#/search',
    'order': '0006',
    'description': '',
    'pluginid': 'com.zving.ecmsearch',
    'pluginname': 'ECM搜索',
    'haschild': false
  },
  {
    'id': 'ECM.encryptionKey',
    'parentID': '',
    'name': '密钥',
    'icon': 'fa fa-key font16',
    'url': '#/encryptionKey',
    'order': '0007',
    'description': '',
    'pluginid': 'com.zving.ecmcore',
    'pluginname': 'ECM Core',
    'haschild': false
  },
  {
    'id': 'Platform.System',
    'parentID': '',
    'name': '设置',
    'icon': 'fa fa-cogs font16',
    'url': '#/system/info',
    'order': '9900',
    'description': '@{Platform.Plugin.System.Description}',
    'pluginid': 'com.zving.platform',
    'pluginname': '@{Platform.PluginName}',
    'haschild': true
  }
  ],
  'status': 1,
  'message': ''
}
const routers = {
  'data': [{
    path: '/',
    url: '/library/public'
  },
  {
    path: '/library',
    url: '/library/public'
  },
  {
    path: '/library/public',
    name: 'public',
    meta: { title: '公共库' },
    url: '/library/public.vue'
  },
  {
    path: '/library/team',
    name: 'team',
    meta: { title: '团队库' },
    url: '/library/team.vue'
  },
  {
    path: '/library/personal',
    name: 'personal',
    meta: { title: '个人库' },
    url: '/library/personal.vue'
  },
  {
    path: '/library/classified',
    name: 'classified',
    meta: { title: '机密库' },
    url: '/library/public.vue'
  },
  {
    path: '/share',
    meta: { title: '分享' },
    url: '/share/index.vue'
  },
  {
    path: '/search',
    meta: { title: '搜索' },
    url: '/search/index.vue'
  },
  {
    path: '/system',
    meta: { title: '系统' },
    url: '/system/index.vue',
    children: [{
      path: 'info',
      meta: { title: '系统信息' },
      url: '/system/info.vue'
    },
    {
      path: 'branch',
      meta: { title: '组织机构' },
      url: '/system/branch.vue'
    },
    {
      path: 'role',
      meta: { title: '角色管理' },
      url: '/system/role.vue'
    },
    {
      path: 'user',
      meta: { title: '用户管理' },
      url: '/system/user.vue'
    },
    {
      path: 'security',
      meta: { title: '账户安全' },
      url: '/system/security.vue'
    },
    {
      path: 'code',
      meta: { title: '代码管理' },
      url: '/system/code.vue'
    },
    {
      path: 'config',
      meta: { title: '配置项管理' },
      url: '/system/config.vue'
    },
    {
      path: 'metadata',
      meta: { title: '元数据管理' },
      url: '/system/metadata.vue'
    },
    {
      path: 'schedule',
      meta: { title: '定时任务' },
      url: '/system/schedule.vue'
    },
    {
      path: 'menu',
      meta: { title: '菜单管理' },
      url: '/system/menu.vue'
    },
    {
      path: 'plugin',
      meta: { title: '插件管理' },
      url: '/system/plugin.vue'
    },
    {
      path: 'backup',
      meta: { title: '数据备份' },
      url: '/system/backup.vue'
    },
    {
      path: 'log',
      meta: { title: '系统日志' },
      url: '/system/log.vue'
    }
    ]
  },
  {
    path: '/encryptionKey',
    meta: { title: '密钥' },
    url: '/encryptionKey/index.vue'
  },
  {
    path: '/*',
    meta: { title: '未找到页面' },
    url: '/404.vue'
  }
  ],
  'status': 1,
  'message': ''
}

axiosMock.onGet('/api/application/topmenus').reply(200, menus)
axiosMock.onGet('/api/application/routers').reply(200, routers)
