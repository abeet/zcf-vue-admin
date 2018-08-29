var menus = {
  data: [
    {
      name: '公共',
      id: 'ECM.Public',
      url: 'ecmcore/file.zhtml?siteID=1',
      source: 'ECM Core',
      hitCount: 10,
      children: [],
      isenable: true
    },
    {
      name: '个人',
      id: 'ECM.Personal',
      url: 'ecmcore/file.zhtml?siteID=2',
      source: 'ECM Core',
      hitCount: 14,
      children: [],
      isenable: true
    },
    {
      name: '共享',
      id: 'ECM.Share',
      url: 'ecmcore/file.zhtml?siteID=3',
      source: 'ECM Core',
      hitCount: 23,
      children: [],
      isenable: true
    },
    {
      name: '检索',
      id: 'ECM.Search',
      url: 'ecmsearch/search.zhtml',
      source: 'ECM搜索',
      hitCount: 25,
      children: [],
      isenable: true
    },
    {
      name: '配置',
      id: 'MainMenus.AdminWorkspace',
      url: '',
      source: 'Product.PluginName',
      hitCount: 0,
      children: [
        {
          name: '栏目管理',
          id: 'ECM.Catalog',
          url: 'ecmcore/catalog.zhtml',
          source: 'Product.PluginName',
          hitCount: 31,
          children: [],
          isenable: true
        },
        {
          name: '检索词汇管理',
          id: 'Search.DicManager',
          url: 'search/dicManager.zhtml',
          source: '全文检索支持',
          hitCount: 40,
          children: [],
          isenable: true
        },
        {
          name: '检索权重设置',
          id: 'Search.WeightsConfig',
          url: 'search/weightsConfigTabs.zhtml',
          source: '全文检索支持',
          hitCount: 33,
          children: [],
          isenable: true
        }
      ],
      isenable: true
    },
    {
      name: '系统管理',
      id: 'Platform.System',
      url: '',
      source: '基础平台',
      hitCount: 0,
      children: [
        {
          name: '系统信息',
          id: 'Platform.SystemInfo',
          url: 'platform/systemInfo.zhtml',
          source: '基础平台',
          hitCount: 41,
          children: [],
          isenable: true
        },
        {
          name: '系统检测',
          id: 'Platform.Detector',
          url: 'platform/detector.zhtml',
          source: '基础平台',
          hitCount: 15,
          children: [],
          isenable: true
        },
        {
          name: '组织机构',
          id: 'Platform.Branch',
          url: 'platform/branch.zhtml',
          source: '基础平台',
          hitCount: 28,
          children: [],
          isenable: true
        },
        {
          name: '角色管理',
          id: 'Platform.Role',
          url: 'platform/roleBranch.zhtml',
          source: '基础平台',
          hitCount: 36,
          children: [],
          isenable: true
        },
        {
          name: '用户管理',
          id: 'Platform.User',
          url: 'platform/user.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '账户安全',
          id: 'Platform.AccountSecurity',
          url: 'platform/accountContent.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '代码管理',
          id: 'Platform.Code',
          url: 'platform/code.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '配置项管理',
          id: 'Platform.Config',
          url: 'platform/config.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '元数据管理',
          id: 'Platform.Metadata',
          url: 'platform/metaModel.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '定时任务',
          id: 'Platform.Schedule',
          url: 'platform/schedule.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '菜单管理',
          id: 'Platform.Menu',
          url: 'platform/menu.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '插件管理',
          id: 'Platform.Plugin',
          url: 'platform/plugin.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '数据备份',
          id: 'Platform.Backup',
          url: 'platform/backup.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '系统日志',
          id: 'Platform.Log',
          url: 'logs/log.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        },
        {
          name: '接口API',
          id: 'Platform.API',
          url: 'platform/api.zhtml',
          source: '基础平台',
          hitCount: 10,
          children: [],
          isenable: true
        }
      ],
      isenable: true
    }
  ],
  status: 1,
  message: ''
}

var getPluginList = {
  data: [
    {
      id: 'com.zving.advertise',
      name: '广告'
    },
    {
      id: 'com.zving.browsepriv',
      name: '浏览权限管理'
    },
    {
      id: 'com.zving.comment',
      name: '评论'
    },
    {
      id: 'com.zving.contentadvance',
      name: '多维分类'
    },
    {
      id: 'com.zving.contentassess',
      name: '内容绩效评估'
    },
    {
      id: 'com.zving.contentcore',
      name: '内容核心'
    },
    {
      id: 'com.zving.contentextend',
      name: '内容字段扩展'
    },
    {
      id: 'com.zving.customform',
      name: '自定义表单'
    },
    {
      id: 'com.zving.dbgather',
      name: '数据库采集'
    },
    {
      id: 'com.zving.imageplayer',
      name: '图片播放器'
    },
    {
      id: 'com.zving.links',
      name: '友情链接'
    },
    {
      id: 'com.zving.member',
      name: '会员'
    },
    {
      id: 'com.zving.message',
      name: '消息模板'
    },
    {
      id: 'com.zving.messageboard',
      name: '留言板'
    },
    {
      id: 'com.zving.pageweaver',
      name: '页面制作器'
    },
    {
      id: 'com.zving.platform',
      name: '基础平台'
    },
    {
      id: 'com.zving.product',
      name: '产品定义'
    },
    {
      id: 'com.zving.search',
      name: '全文检索支持'
    },
    {
      id: 'com.zving.sitegroup',
      name: '网站群管理'
    },
    {
      id: 'com.zving.sitestyle',
      name: '站点风格'
    },
    {
      id: 'com.zving.stat',
      name: '统计分析'
    },
    {
      id: 'com.zving.vote',
      name: '投票'
    },
    {
      id: 'com.zving.weixin',
      name: '微信插件'
    },
    {
      id: 'com.zving.wordmanage',
      name: '内容词汇管理'
    },
    {
      id: 'com.zving.workflow',
      name: '工作流支持'
    },
    {
      id: 'com.zving.workspace',
      name: '我的工作台'
    }
  ],
  status: 1,
  message: ''
}

axiosMock.onGet('/api/menus').reply(200, menus)

axiosMock.onPut('/api/menus').reply((res) => {
  if (res.params && res.params.reset) {
    return [200, {
      data: null,
      status: 1,
      message: '重置成功！'
    }]
  }
})

axiosMock.onPut('/api/menus/status').reply(200, {
  data: null,
  status: 1,
  message: '更新成功'
})

axiosMock.onPut('/api/menus/position').reply(200, {
  data: null,
  status: 1,
  message: '更新成功'
})

axiosMock.onGet('/api/menus/getpluginlist').reply(200, getPluginList)
