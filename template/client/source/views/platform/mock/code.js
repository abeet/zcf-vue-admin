const codes = [
  {
    id: 1,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 2,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 3,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: false,
    memo: ''
  },
  {
    id: 4,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 5,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 6,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 7,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 8,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 9,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  },
  {
    id: 10,
    codeType: 'ADPStatus',
    codeName: '广告版位审核状态',
    isfixed: true,
    memo: ''
  }
]

axiosMock.onGet(/api\/codes\?pageIndex=\d+&pageSize=\d+$/).reply(200, {
  data: codes,
  total: 108,
  status: 1
})

axiosMock.onPost('/api/codes').reply(200, {
  status: 1,
  message: '添加成功！',
  code: {
    id: Math.round(Math.random() * 10000)
    // ...
  }
})

axiosMock.onPut(/api\/codes\/.+$/).reply(200, { status: 1, message: '更新成功！'})

axiosMock.onDelete(/api\/codes\/.+$/).reply(200, { status: 1, message: '删除成功！'})

const codeItems = [
  { id: 1, codeType: 'ADPStatus', codeName: '超过一个月', codeValue: 'one_month', isfixed: true, remark: ''},
  { id: 2, codeType: 'ADPStatus', codeName: '超过三个月', codeValue: 'three_month', isfixed: true, remark: ''},
  { id: 3, codeType: 'ADPStatus', codeName: '超过半年', codeValue: 'half_year', isfixed: true, remark: ''},
  { id: 4, codeType: 'ADPStatus', codeName: '超过一年', codeValue: 'one_year', isfixed: false, remark: ''},
  { id: 5, codeType: 'ADPStatus', codeName: '超过二年', codeValue: 'two_year', isfixed: false, remark: ''},
  { id: 6, codeType: 'ADPStatus', codeName: '重未修改', codeValue: 'repeat', isfixed: false, remark: ''}
]

axiosMock.onGet(/api\/codes\/.+\/items$/).reply(200, {
  status: 1,
  data: codeItems
})

axiosMock.onPost(/api\/codes\/.+\/items$/).reply(200, {
  status: 1,
  message: '添加成功！',
  codeItem: {
    id: Math.round(Math.random() * 10000)
    // ...
  }
})

axiosMock.onPut(/api\/codes\/.+\/items\/.+$/).reply(200, { status: 1, message: '更新成功！'})

axiosMock.onDelete(/api\/codes\/.+\/items\/.+$/).reply(200, { status: 1, message: '删除成功！'})
