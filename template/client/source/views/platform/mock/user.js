const users = [
  {
    id: 1,
    userName: 'admin',
    realName: '超级管理员',
    status: true,
    branch: { id: 1, name: '总公司' },
    roles: [
      { id: 1, name: '管理组', roleCode: 'admin' }
    ],
    lastChangePasswordDate: '',
    email: 'admin@zving.com',
    tel: '',
    phone: '',
    remark: ''
  }, {
    id: 2,
    userName: 'test',
    realName: 'test',
    status: false,
    branch: { id: 1, name: '总公司' },
    roles: [
      { id: 1, name: '管理组', roleCode: 'admin' },
      { id: 3, name: '所有用户组', roleCode: 'everyone' }
    ],
    lastChangePasswordDate: '',
    email: 'test@zving.com',
    tel: '88880000',
    phone: '13888888888',
    remark: '备注'
  }, {
    id: 3,
    userName: 'audit',
    realName: '审核',
    status: true,
    branch: { id: 1, name: '总公司' },
    roles: [
      { id: 2, name: '审核组', roleCode: 'audit' },
      { id: 3, name: '编辑组', roleCode: 'edit' }
    ],
    lastChangePasswordDate: '',
    email: 'audit@zving.com',
    tel: '',
    phone: '',
    remark: ''
  }, {
    id: 4,
    userName: 'edit',
    realName: '编辑',
    status: true,
    branch: { id: 1, name: '总公司' },
    roles: [
      { id: 3, name: '编辑组', roleCode: 'edit' }
    ],
    lastChangePasswordDate: '',
    email: 'edit@zving.com',
    tel: '',
    phone: '',
    remark: ''
  }, {
    id: 5,
    userName: 'shanghaiadmin',
    realName: '上海分公司管理员',
    status: true,
    branch: { id: 3, name: '上海分公司' },
    roles: [
      { id: 1, name: '上海管理组', roleCode: 'edit' },
      { id: 2, name: '所有用户组', roleCode: 'everyone' }
    ],
    lastChangePasswordDate: '2016-10-28 19:13:17',
    email: 'shanghai@zving.com',
    tel: '',
    phone: '',
    remark: ''
  }
];

axiosMock.onGet('/api/users').reply(200, {
  data: users,
  status: 1,
  message: ''
});

axiosMock.onDelete(/api\/users\/.+$/).reply(200, {
  data: null,
  status: 1,
  message: '删除成功'
});

axiosMock.onPut(/api\/users\/modify\/.+$/).reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPut(/api\/users\/.+$/).reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPut(/api\/users\/.+\/permissions$/).reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPut(/api\/users\/disable\/.+$/).reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPut('/api/users/password').reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPut('/api/users').reply(200, {
  data: null,
  status: 1,
  message: '操作成功'
});

axiosMock.onPost('/api/users').reply(200, {
  data: null,
  status: 1,
  message: '添加成功'
});

axiosMock.onGet('/api/users/permissions/types').reply(200, {
  data: [
    {id: 1, code: 'menuPermission', name: '菜单权限'},
    {id: 2, code: 'sitePermission', name: '站点权限'},
    {id: 3, code: 'docPermission', name: '文档权限'}
  ],
  status: 1,
  message: ''
});

axiosMock.onGet(/api\/users\/.+\/permissions\/menus$/).reply(200, {
  data: {
    value: ['site1', 'site5', 'my1', 'docs3'],
    tree: [
      {
        id: 1, name: '文档列表', code: 'docs', items: [
        {id: 2, name: '文档权限一', code: 'docs1'},
        {id: 2, name: '文档权限二', code: 'docs2'},
        {id: 3, name: '文档权限三', code: 'docs3'},
        {id: 4, name: '文档权限四', code: 'docs4'},
      ]
      }, {
        id: 5, name: '我的工作台', code: 'my', items: [
          {id: 6, name: '权限一', code: 'my1'},
          {id: 7, name: '权限二', code: 'my2'},
          {id: 8, name: '权限三', code: 'my3'}
        ]
      }, {
        id: 9, name: '站点配置', code: 'site', children: [
          {id: 10, name: '栏目列表', code: 'siteColumn',
            items: [
              {id: 11, name: '权限一', code: 'site1'},
              {id: 12, name: '权限二', code: 'site2'},
              {id: 13, name: '权限三', code: 'site3'}
            ]
          }, {
            id: 14, name: '站点管理', code: 'siteMange',
            items: [
              {id: 15, name: '权限一', code: 'site4'},
              {id: 16, name: '权限二', code: 'site5'},
              {id: 17, name: '权限三', code: 'site6'}
            ]

          }
        ]
      }, {
        id: 18, name: '会员管理', code: 'member', children: [
          {id: 19, name: '会员信息', code: 'memberInfo',
            items: [
              {id: 20, name: '权限一', code: 'member1'},
              {id: 21, name: '权限二', code: 'member2'},
              {id: 22, name: '权限三', code: 'member3'}
            ]
          }, {
            id: 23, name: '会员等级', code: 'memberLevel',
            items: [
              {id: 24, name: '权限一', code: 'member4'},
              {id: 25, name: '权限二', code: 'member5'},
              {id: 26, name: '权限三', code: 'member6'}
            ]

          }
        ]
      }
    ]
  },
  message: '',
  status: 1
});

axiosMock.onPut(/api\/users\/.+\/permissions\/menus$/).reply(200, {
  data: null,
  message: '操作成功！',
  status: 1
});

axiosMock.onGet(/api\/users\/.+\/permissions\/sites$/).reply(200, {
  data: [
    {id: 1, name: 'Zving News', edit: false, template: true, file: false, delete: true, export: true, extend: true, publish: true, permission: true, block: true},
    {id: 2, name: '泽元新闻(ZCMS2.x演示站)', edit: false, template: true, file: true, delete: true, export: true, extend: true, publish: true, permission: true, block: true}
  ],
  message: '',
  status: 1
});

axiosMock.onPut(/api\/users\/.+\/permissions\/sites$/).reply(200, {
  data: null,
  message: '操作成功！',
  status: 1
});

axiosMock.onGet(/api\/users\/.+\/permissions\/docs\/.+$/).reply(200, {
  data: [
    {id: 1, name: '泽元 News', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false, children: [
      {id: 2, name: 'News 1', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
      {id: 3, name: 'News 2', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
      {id: 4, name: 'News 3', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
    ]},
    {id: 5, name: '泽元新闻(ZCMS2.x演示站)', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false, children: [
      {id: 6, name: '演示站 1', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
      {id: 7, name: '演示站 2', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
      {id: 8, name: '演示站 3', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false, children: [
        {id: 9, name: '演示站 3-1', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
        {id: 10, name: '演示站 3-2', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
        {id: 11, name: '演示站 3-3', edit: false, template: false, file: false, delete: false, export: false, extend: false, publish: false, permission: false, block: false},
      ]},
    ]}
  ],
  message: '',
  status: 1
});

axiosMock.onPut(/api\/users\/.+\/permissions\/docs\/.+$/).reply(200, {
  data: null,
  message: '操作成功！',
  status: 1
});
