const branches = {
  'data': [{
    'branchInnerCode': '0001',
    'branchCode': '0001',
    'parentInnerCode': '0001',
    'type': '1',
    'orderFlag': 1,
    'name': '总公司a',
    'treeLevel': 1,
    'isLeaf': 'N',
    'phone': 'aaa',
    'fax': 'aaa',
    'leader1': '',
    'leader2': '',
    'prop1': '0',
    'prop2': '',
    'prop3': '',
    'prop4': '2010-06-25 00:00:00',
    'memo': '',
    'addTime': 1277361197000,
    'addUser': 'F88B6279E7F740A78FA6590B33EDDBC0',
    'modifyTime': 1501142874000,
    'modifyUser': 'admin',
    'managers': [{
      'userName': 'edit',
      'realName': '编辑'
    },
    {
      'userName': 'admin',
      'realName': '系统管理员'
    }
    ],
    'children': [{
      'branchInnerCode': '00010021',
      'branchCode': '0002',
      'parentInnerCode': '0001',
      'type': '0',
      'orderFlag': 2,
      'name': '北京分公司sfds',
      'treeLevel': 2,
      'isLeaf': 'N',
      'phone': '',
      'fax': '',
      'leader1': '',
      'leader2': '',
      'prop1': '',
      'prop2': '',
      'prop3': '',
      'prop4': '',
      'memo': '',
      'addTime': 1330066652000,
      'addUser': 'admin',
      'modifyTime': 1501154571000,
      'modifyUser': 'admin',
      'managers': [{
        'userName': 'edit',
        'realName': '编辑'
      }],
      'children': [{
        'branchInnerCode': '000100210014',
        'branchCode': 'bbbdd',
        'parentInnerCode': '00010021',
        'type': '0',
        'orderFlag': 3,
        'name': 'aaa',
        'treeLevel': 3,
        'isLeaf': 'N',
        'phone': '123123',
        'fax': '123123',
        'leader1': null,
        'leader2': null,
        'prop1': null,
        'prop2': null,
        'prop3': null,
        'prop4': null,
        'memo': null,
        'addTime': 1501140425000,
        'addUser': 'admin',
        'modifyTime': 1501155857000,
        'modifyUser': 'admin',
        'managers': [],
        'children': []
      }]
    }]
  },
  {
    'branchInnerCode': '0012',
    'branchCode': 'aaa',
    'parentInnerCode': '0',
    'type': '0',
    'orderFlag': 9,
    'name': 'aaa',
    'treeLevel': 1,
    'isLeaf': 'Y',
    'phone': '',
    'fax': '',
    'leader1': null,
    'leader2': null,
    'prop1': null,
    'prop2': null,
    'prop3': null,
    'prop4': null,
    'memo': null,
    'addTime': 1501139786000,
    'addUser': 'admin',
    'modifyTime': null,
    'modifyUser': null,
    'managers': [],
    'children': []
  },
  {
    'branchInnerCode': '0013',
    'branchCode': '123123',
    'parentInnerCode': '0',
    'type': '0',
    'orderFlag': 10,
    'name': '天伦租',
    'treeLevel': 1,
    'isLeaf': 'Y',
    'phone': '111',
    'fax': '111',
    'leader1': null,
    'leader2': null,
    'prop1': null,
    'prop2': null,
    'prop3': null,
    'prop4': null,
    'memo': null,
    'addTime': 1501139824000,
    'addUser': 'admin',
    'modifyTime': null,
    'modifyUser': null,
    'managers': [],
    'children': []
  },
  {
    'branchInnerCode': '0014',
    'branchCode': '3423423',
    'parentInnerCode': '0',
    'type': '0',
    'orderFlag': 11,
    'name': '234324',
    'treeLevel': 1,
    'isLeaf': 'Y',
    'phone': '4324',
    'fax': '43242',
    'leader1': null,
    'leader2': null,
    'prop1': null,
    'prop2': null,
    'prop3': null,
    'prop4': null,
    'memo': null,
    'addTime': 1501139860000,
    'addUser': 'admin',
    'modifyTime': null,
    'modifyUser': null,
    'managers': [],
    'children': []
  }
  ],
  'status': 1,
  'message': ''
}

axiosMock.onGet('/api/branches').reply(200, branches)

axiosMock.onPut(/api\/branches\/.+$/).reply(200, { status: 1, message: '编辑成功' })

axiosMock.onDelete(/api\/branches\/.+$/).reply(200, { status: 1, message: '删除成功' })

axiosMock.onPost('/api/branches').reply(200, { status: 1, message: '添加成功' })

const permissions = {
  menus: [
    ['permission1'],
    ['permission1', 'permission2'],
    ['permission1', 'permission2', 'permission3'],
    ['permission1', 'permission2', 'permission3', 'permission4']
  ],
  roles: [
    ['permission1'],
    ['permission1', 'permission2'],
    ['permission1', 'permission2', 'permission3'],
    ['permission1', 'permission2', 'permission3', 'permission4']
  ]
}
axiosMock.onGet(/api\/branches\/.+\/permissions$/).reply(200, {
  data: permissions,
  status: 1,
  message: ''
})

axiosMock.onPut(/api\/branches\/.+\/permissions\/.+$/).reply(200, { status: 1, message: '编辑成功' })

axiosMock.onPost(/api\/branches\/.+\/permissions\/.+$/).reply(200, {
  status: 1,
  message: '操作成功！'
})
