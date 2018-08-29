const info = {
  'data': [{
    'title': '应用信息',
    'data': [{
      'key': 'AppCode',
      'item': '应用代码',
      'value': 'ZECM'
    },
    {
      'key': 'AppName',
      'item': '应用名称',
      'value': 'ZECM企业内容管理系统'
    },
    {
      'key': 'AppVersion',
      'item': '应用版本',
      'value': '2.2.12987'
    },
    {
      'key': 'StartupTime',
      'item': '本次启动时间',
      'value': '2017-07-27 12:45:00'
    },
    {
      'key': 'LastUpdateTime',
      'item': '最后更新时间',
      'value': '安装后从未更新'
    },
    {
      'key': 'LoginCount',
      'item': '当前已登录用户数',
      'value': 1
    },
    {
      'key': 'DebugMode',
      'item': '是否是调试模式',
      'value': 'true'
    }
    ]
  },
  {
    'title': '数据库信息',
    'data': [{
      'key': 'DBType',
      'item': '数据库类型',
      'value': 'MYSQL'
    },
    {
      'key': 'DBAddress',
      'item': '数据库服务器地址',
      'value': 'localhost'
    },
    {
      'key': 'DBPort',
      'item': '数据库服务器端口',
      'value': '3306'
    },
    {
      'key': 'DBName',
      'item': '数据库名称',
      'value': 'zecm'
    },
    {
      'key': 'DBUser',
      'item': '用户名',
      'value': 'root'
    }
    ]
  },
  {
    'title': '语言信息',
    'data': [{
      'key': 'AllLang',
      'item': '系统支持语言',
      'value': '中文(简体)'
    },
    {
      'key': 'CurLang',
      'item': '当前语言',
      'value': 'zh-cn'
    }
    ]
  },
  {
    'title': '基础软件信息',
    'data': [{
      'key': 'OSName',
      'item': '操作系统名称',
      'value': 'Windows 10'
    },
    {
      'key': 'OSVersion',
      'item': '操作系统版本',
      'value': '10.0'
    },
    {
      'key': 'OSPatch',
      'item': '操作系统补丁',
      'value': ''
    },
    {
      'key': 'JDKVendor',
      'item': 'JDK厂商',
      'value': 'Oracle Corporation'
    },
    {
      'key': 'JDKVersion',
      'item': 'JDK版本',
      'value': '1.8.0_111'
    },
    {
      'key': 'JDKHome',
      'item': 'JDK主目录',
      'value': 'D:\\java\\jdk1.8.0_111\\jre'
    },
    {
      'key': 'ContainerName',
      'item': 'Servlet容器名称',
      'value': 'Undertow - 1.3.25.Final'
    },
    {
      'key': 'ContainerUser',
      'item': '启动Servlet容器的用户名',
      'value': 'X220'
    },
    {
      'key': 'MemInfo',
      'item': 'JDK已用内存数/最大可用数',
      'value': '982M/982M'
    },
    {
      'key': 'FileEncoding',
      'item': '文件编码',
      'value': 'UTF-8'
    }
    ]
  },
  {
    'title': '授权信息',
    'data': [{
      'key': 'LicenseTo',
      'item': '授权给',
      'value': 'TrailUser'
    },
    {
      'key': 'ValidEndDate',
      'item': '有效期至',
      'value': '2017-09-30 00:00:00'
    },
    {
      'key': 'LicensedUserCount',
      'item': '授权用户数',
      'value': 100000
    },
    {
      'key': 'LicensedProduct',
      'item': '授权产品代码',
      'value': 'ZECM'
    },
    {
      'key': 'LicensedMac',
      'item': '授权MAC地址',
      'value': '00-50-56-AB-52-F1,00-50-56-AB-7B-1E'
    }
    ]
  }
  ],
  'status': 1,
  'message': ''
}

axiosMock.onGet('/api/info').reply(200, info)

axiosMock.onGet('/api/info/logined').reply(200, {
  data: null,
  status: 1,
  message: '',
  state: true
})

axiosMock.onPut('/api/info/logined').reply(200, {
  data: null,
  message: '启用登录，操作成功',
  status: 1
})

axiosMock.onDelete('/api/info/logined').reply(200, {
  data: null,
  message: '禁用登录，操作成功',
  status: 1
})

axiosMock.onDelete('/api/info/sessions').reply(200, {
  data: null,
  message: '注销所有会话，操作成功',
  status: 1
})

let task = {}

axiosMock.onGet('/api/info/database/backups').reply(() => {
  let id = Math.round(Math.random() * 10000)
  task[id] = {
    progress: 0
  }

  return [200, {
    data: {
      taskid: id
    },
    message: '备份任务创建成功，开始备份',
    status: 1
  }]
})

axiosMock.onGet(/api\/framework\/longtimetasks\/\d+$/).reply((res) => {
  let urlArray = res.url.split('/'),
    id = parseInt(urlArray[3]),
    currentTask = task[id]

  currentTask.progress = (currentTask.progress < 100) ? currentTask.progress + 10 : 100

  return [200, {
    status: 1,
    message: '',
    data: {
      percent: currentTask.progress,
      currentinfo: currentTask.progress === 100 ? '完成' : `表${currentTask.progress}`,
      completeflag: currentTask.progress === 100,
      fileurl: currentTask.progress === 100 ? `http://www.zving.com/upload/products/zving/feature/1348832725870.jpg` : ''
    }
  }]
})

axiosMock.onPost('/api/info/database').reply(() => {
  let id = Math.round(Math.random() * 10000)
  task[id] = {
    progress: 0
  }

  return [200, {
    data: {
      taskid: id
    },
    message: '文件上传成功！',
    status: 1
  }]
})

axiosMock.onPost('/api/info/database/recovery').reply(() => {
  let id = Math.round(Math.random() * 10000)

  task[id] = {
    progress: 0
  }
  console.log(id)

  return [200, {
    data: {
      taskId: id
    },
    message: '恢复数据库任务创建成功，开始恢复数据库',
    status: 1
  }]
})

axiosMock.onGet(/api\/info\/database\/recovery\/\d+$/).reply((res) => {
  let urlArray = res.url.split('/'),
    id = parseInt(urlArray[4]),
    currentTask = task[id]

  currentTask.progress = (currentTask.progress < 100) ? currentTask.progress + 5 : 100

  return [200, {
    status: 1,
    message: currentTask.progress === 100 ? '恢复数据库成功' : '恢复中',
    data: {
      progress: currentTask.progress,
      text: currentTask.progress === 100 ? '恢复数据库成功' : `恢复数据库表${currentTask.progress}`
    }
  }]
})

axiosMock.onPost('/api/info/promotion').reply(() => {
  let id = Math.round(Math.random() * 10000)

  task[id] = {
    progress: 0
  }
  console.log(id)

  return [200, {
    data: {
      taskId: id
    },
    message: '连接服务器成功，开始更新',
    status: 1
  }]
})

axiosMock.onGet(/api\/info\/promotion\/\d+$/).reply((res) => {
  let urlArray = res.url.split('/'),
    id = parseInt(urlArray[3]),
    currentTask = task[id]

  currentTask.progress = (currentTask.progress < 100) ? currentTask.progress + 5 : 100

  return [200, {
    status: 1,
    message: currentTask.progress === 100 ? '更新成功' : '更新中',
    data: {
      progress: currentTask.progress,
      text: currentTask.progress === 100 ? '更新成功' : `更新${currentTask.progress}`
    }
  }]
})
