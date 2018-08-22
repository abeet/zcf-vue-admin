axiosMock.onGet('/api/logs/tree').reply(200, {
  data: [{
    id: 'RealTimeLog', name: '实时日志'
  }, {
    id: 'SQLLog', name: 'SQL日志'
  }, {
    id: 'SecurityLog', name: '安全日志'
  }, {
    id: 'CronLog', name: '安全日志'
  }, {
    id: 'UserLog', name: '用户日志'
  }, {
    id: 'UserLoginLog', name: '用户登陆日志'
  }, {
    id: 'DownLog', name: '日志下载'
  }, {
    id: 'UserOperateLog', name: '用户操作日志'
  }],
  message: '',
  status: 1
});

axiosMock.onGet('/api/logs/realtimelog').reply((res) => {
  if(res.params.lastid === 0){
    return [200, {
      data: {
        lastid: Math.round(Math.random() * 1000000),
        log: 'init real time log \n'
      },
      status: 1,
      message: ''
    }];
  }

  return [200, {
    data: {
      lastid: Math.round(Math.random() * 1000000),
      log: `lastid: ${res.params.lastid}, \n`
    },
    status: 1,
    message: ''
  }];
});

const sqlLogs = {
  logs: [
    {id: 1, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 2, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 3, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 4, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 5, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 6, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 7, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 8, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 9, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'},
    {id: 10, date: '2017-08-09 17:01:18', ip: 'localhost', userName: 'admin', ms: 120, message: 'CostTime=7739'}
  ],
  total: 182
};

axiosMock.onGet('/api/logs/sqllog').reply(200, {
  data: sqlLogs,
  status: 1,
  message: ''
});

const securityLogs = {
  logs: [
    {id: 1, date: '2017-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 2, date: '2016-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 3, date: '2015-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 4, date: '2014-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 5, date: '2013-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 6, date: '2012-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 7, date: '2011-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 8, date: '2010-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 9, date: '2009-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'},
    {id: 10, date: '2008-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info'}
  ],
  total: 93
};

axiosMock.onGet('/api/logs/securitylog').reply(200, {
  data: securityLogs,
  status: 1,
  message: ''
});

const cronLogs = {
  logs: [
    {id: 1, date: '2017-08-09 17:01:18', message: 'message info cron logs'},
    {id: 2, date: '2016-08-09 17:01:18', message: 'message info cron logs'},
    {id: 3, date: '2015-08-09 17:01:18', message: 'message info cron logs'},
    {id: 4, date: '2014-08-09 17:01:18', message: 'message info cron logs'},
    {id: 5, date: '2013-08-09 17:01:18', message: 'message info cron logs'},
    {id: 6, date: '2012-08-09 17:01:18', message: 'message info cron logs'},
    {id: 7, date: '2011-08-09 17:01:18', message: 'message info cron logs'},
    {id: 8, date: '2010-08-09 17:01:18', message: 'message info cron logs'},
    {id: 9, date: '2009-08-09 17:01:18', message: 'message info cron logs'},
    {id: 10, date: '2008-08-09 17:01:18', message: 'message info cron logs'}
  ],
  total: 47
};

axiosMock.onGet('/api/logs/cronlog').reply(200, {
  data: cronLogs,
  status: 1,
  message: ''
});

const userLogs = {
  logs: [
    {id: 1, date: '2017-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 2, date: '2016-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 3, date: '2015-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 4, date: '2014-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 5, date: '2013-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 6, date: '2012-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 7, date: '2011-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 8, date: '2010-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 9, date: '2009-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'},
    {id: 10, date: '2008-08-09 17:01:18', userName: 'admin', ip: 'localhost', message: 'message info', memo: 'memo'}
  ],
  total: 28
};

axiosMock.onGet('/api/logs/userlog').reply(200, {
  data: userLogs,
  status: 1,
  message: ''
});

axiosMock.onGet('/api/logs/userloginlog').reply(200, {
  data: userLogs,
  status: 1,
  message: ''
});

const downlogs = {
  logs: [
    {id: 1, lastmodifiedtime: '2017-08-09 17:01:18', fileName: 'logs-1.log', size: '1.1KB'},
    {id: 2, lastmodifiedtime: '2016-08-09 17:01:18', fileName: 'logs-2.log', size: '1.2KB'},
    {id: 3, lastmodifiedtime: '2015-08-09 17:01:18', fileName: 'logs-3.log', size: '1.3KB'},
    {id: 4, lastmodifiedtime: '2014-08-09 17:01:18', fileName: 'logs-4.log', size: '1.4KB'},
    {id: 5, lastmodifiedtime: '2013-08-09 17:01:18', fileName: 'logs-5.log', size: '1.5KB'},
    {id: 6, lastmodifiedtime: '2012-08-09 17:01:18', fileName: 'logs-6.log', size: '1.6KB'},
    {id: 7, lastmodifiedtime: '2011-08-09 17:01:18', fileName: 'logs-7.log', size: '1.7KB'},
    {id: 8, lastmodifiedtime: '2010-08-09 17:01:18', fileName: 'logs-8.log', size: '1.8KB'},
    {id: 9, lastmodifiedtime: '2009-08-09 17:01:18', fileName: 'logs-9.log', size: '1.9KB'},
    {id: 10, lastmodifiedtime: '2008-08-09 17:01:18', fileName: 'logs-10.log', size: '2.0KB'}
  ],
  total: 10
};

axiosMock.onGet('/api/logs/downlog').reply(200, {
  data: downlogs,
  status: 1,
  message: ''
});

const userOperateLogs = {
  logs: [
    {id: 1, date: '2017-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 2, date: '2016-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 3, date: '2015-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 4, date: '2014-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 5, date: '2013-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 6, date: '2012-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 7, date: '2011-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 8, date: '2010-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 9, date: '2009-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'},
    {id: 10, date: '2008-08-09 17:01:18', userName: 'admin', operateitem: '设置', memo: 'memo'}
  ],
  total: 64
};

axiosMock.onGet('/api/logs/useroperatelog').reply(200, {
  data: userOperateLogs,
  status: 1,
  message: ''
});
