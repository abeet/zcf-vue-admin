const roles = [
  { id: 1, name: '管理组', roleCode: 'glz', memo: '管理组'},
  { id: 2, name: '审核组', roleCode: 'shz', memo: ''},
  { id: 3, name: '编辑组', roleCode: 'bjz', memo: ''}
];

axiosMock.onGet('/api/roles').reply(200, {
  status: 1,
  message: '',
  data: roles
});

axiosMock.onGet(/api\/roles\/.+\/users$/, { params: { optional: true } }).reply(200, {
  status: 1,
  message: '',
  data: [
    { id: 7, userName: 'admin88', fullname: '超级管理员88', roles: [
      { id: 1, name: '管理组', memo: '管理组'}
    ]
    },
    { id: 8, userName: 'test88', fullname: 'test88', roles: [] },
    { id: 9, userName: 'audit88', fullname: '审核88', roles: [] }
  ]
});

axiosMock.onGet(/api\/roles\/.+\/users$/).reply(200, {
  status: 1,
  message: '',
  data: [
    { id: 1, userName: 'admin', fullname: '超级管理员', roles: [
        { id: 1, name: '管理组', memo: '管理组'}
      ]
    },
    { id: 2, userName: 'test', fullname: 'test', roles: [] },
    { id: 3, userName: 'audit', fullname: '审核', roles: [] }
  ]
});

axiosMock.onPost('/api/roles').reply(200, {
  role: {
    id: Math.round(Math.random() * 10000)
    //...
  },
  message: '操作成功',
  status: 1
});

axiosMock.onPut(/api\/roles\/.+$/).reply(200, {
  message: '操作成功',
  status: 1
});

axiosMock.onDelete(/api\/roles\/.+$/).reply(200, {
  message: '操作成功',
  status: 1
});
