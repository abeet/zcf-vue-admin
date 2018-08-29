const schedules = [
  {
    id: 1,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 2,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 3,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 4,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 5,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 6,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 7,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 8,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 9,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'N',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  },
  {
    id: 10,
    typeCode: 'system',
    typecodename: '系统任务',
    sourceidname: '清空Debug模式下的Session缓存',
    isUsing: 'Y',
    startTime: '2016-01-07 10:30:00',
    nextruntime: '2017-07-07 10:30:00',
    cycle: '1',
    cyclenumber: 1,
    cycleunit: 'Minute',
    cyclecron: '',
    description: 'com.zving.framwork.FrameworkTask'
  }
]

const optionalSchedules = [
  {id: 1, name: '可选任务一', code: 'optional1'},
  {id: 2, name: '可选任务二', code: 'optional2'},
  {id: 3, name: '可选任务三', code: 'optional3'},
  {id: 4, name: '可选任务四', code: 'optional4'}
]

axiosMock.onGet('/api/schedules').reply((req) => {
  if (req.params && req.params.optional === 'Y') {
    return [200, {
      status: 1,
      message: '',
      data: optionalSchedules
    }]
  }

  return [200, {
    status: 1,
    message: '',
    data: schedules
  }]
})

const types = [
  {id: 1, name: '系统任务', code: 'system'},
  {id: 2, name: '数据库采集任务', code: 'DBGather'},
  {id: 3, name: 'Web采集任务', code: 'WebCrawl'}
]

axiosMock.onGet('/api/schedules/types').reply((req) => {
  if (req.params && req.params.usable === 'Y') {
    return [200, {
      status: 1,
      message: '',
      data: types.slice(1)
    }]
  }

  return [200, {
    status: 1,
    message: '',
    data: types
  }]
})

axiosMock.onPost(/api\/schedules$/).reply(200, {
  status: 1,
  message: '添加成功！',
  data: {
    id: Math.round(Math.random() * 10000)
    // ...
  }
})

axiosMock.onPut('/api/schedules/updated').reply(200, { status: 1, message: '更新成功！'})

axiosMock.onDelete('/api/schedules/deleted').reply(200, { status: 1, message: '删除成功！'})

axiosMock.onPost('/api/schedules/executed').reply(200, { status: 1, message: '开始执行！'})
