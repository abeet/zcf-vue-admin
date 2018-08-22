var apis = {
  data: [
    {
      id: 'userinfo',
      name: '用户信息接口',
      sourceplugin: 'com.zving.platform',
      inputparameters: [
        {
          name: 'userName',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '用户名'
        },
        {
          name: 'columns',
          type: 'String',
          isarray: 'false',
          allownull: 'true',
          memo: '字段列表'
        }
      ],
      outputparameters: [
        {
          name: 'DataTable',
          type: 'Unknown',
          isarray: 'false',
          allownull: 'false',
          memo: '数据表',
          children: [
            {
              name: 'UserName',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '用户名',
              children: []
            },
            {
              name: 'RealName',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '数据表',
              children: []
            },
            {
              name: 'Password',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '用户密码',
              children: []
            },
            {
              name: 'BranchInnerCode',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '所属机构内部编码',
              children: []
            },
            {
              name: 'IsBranchAdmin',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '是否为机构管理员',
              children: []
            },
            {
              name: 'Status',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '用户状态',
              children: []
            },
            {
              name: 'Type',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '用户类型',
              children: []
            },
            {
              name: 'Email',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '邮箱地址',
              children: []
            },
            {
              name: 'Tel',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '联系电话',
              children: []
            },
            {
              name: 'Mobile',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '手机',
              children: []
            },
            {
              name: 'LastLoginTime',
              type: 'DateTime',
              isarray: 'false',
              allownull: 'true',
              memo: '上次登录时间',
              children: []
            },
            {
              name: 'LastLoginIP',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '上次登录IP',
              children: []
            },
            {
              name: 'Prop1',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Prop2',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Prop3',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Prop4',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Prop5',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Prop6',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备用属性',
              children: []
            },
            {
              name: 'Memo',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '备注',
              children: []
            },
            {
              name: 'AddTime',
              type: 'DateTime',
              isarray: 'false',
              allownull: 'false',
              memo: '添加时间',
              children: []
            },
            {
              name: 'AddUser',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '添加人',
              children: []
            },
            {
              name: 'ModifyTime',
              type: 'DateTime',
              isarray: 'false',
              allownull: 'true',
              memo: '最后修改时间',
              children: []
            },
            {
              name: 'ModifyUser',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '修改用户',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'changepassword',
      name: '修改用户密码接口',
      sourceplugin: 'com.zving.platform',
      inputparameters: [
        {
          name: 'userName',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '用户名'
        },
        {
          name: 'newpassword',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '新密码'
        }
      ],
      outputparameters: []
    },
    {
      id: 'addUser',
      name: '添加用户接口',
      sourceplugin: 'com.zving.platform',
      inputparameters: [
        {
          name: 'addUser',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '添加人'
        },
        {
          name: 'userName',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '用户名'
        },
        {
          name: 'userpassword',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '密码'
        },
        {
          name: 'confirmpassword',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '两次输入密码必须相同'
        },
        {
          name: 'branchInnerCode',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '机构编码'
        },
        {
          name: 'email',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '电子邮箱'
        },
        {
          name: 'roleCode',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '角色代码'
        }
      ],
      outputparameters: [
        {
          name: 'Mapx',
          type: 'Unknown',
          isarray: 'false',
          allownull: 'false',
          memo: '键值对',
          children: [
            {
              name: 'userrolecode',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '角色编码',
              children: []
            },
            {
              name: 'userrolename',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '角色名称',
              children: []
            },
            {
              name: 'islogin',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '是否登录',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'updateuser',
      name: '修改用户信息接口',
      sourceplugin: 'com.zving.platform',
      inputparameters: [
        {
          name: 'modifyUser',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '修改用户'
        },
        {
          name: 'userName',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '用户名'
        },
        {
          name: 'branchInnerCode',
          type: 'String',
          isarray: 'false',
          allownull: 'false',
          memo: '机构编码'
        },
        {
          name: 'email',
          type: 'String',
          isarray: 'false',
          allownull: 'true',
          memo: '电子邮箱'
        },
        {
          name: 'roleCode',
          type: 'String',
          isarray: 'false',
          allownull: 'true',
          memo: '角色代码'
        }
      ],
      outputparameters: [
        {
          name: 'Mapx',
          type: 'Unknown',
          isarray: 'false',
          allownull: 'false',
          memo: '键值对',
          children: [
            {
              name: 'userrolecode',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '角色编码',
              children: []
            },
            {
              name: 'userrolename',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '角色名称',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'site',
      name: '站点数据接口',
      sourceplugin: 'com.zving.contentcore',
      inputparameters: [
        {
          name: 'columns',
          type: 'String',
          isarray: 'false',
          allownull: 'true',
          memo: '字段列表'
        }
      ],
      outputparameters: [
        {
          name: 'DataTable',
          type: 'Unknown',
          isarray: 'false',
          allownull: 'false',
          memo: '数据表',
          children: [
            {
              name: 'ID',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '站点ID',
              children: []
            },
            {
              name: 'ParentID',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '父站点ID',
              children: []
            },
            {
              name: 'Name',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '站点名称',
              children: []
            },
            {
              name: 'URL',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '站点URL',
              children: []
            },
            {
              name: 'BranchInnerCode',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '所属机构内部编码',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'contentType',
      name: '内容类型的数据接口',
      sourceplugin: 'com.zving.contentcore',
      inputparameters: [],
      outputparameters: [
        {
          name: 'List',
          type: 'Unknown',
          isarray: 'false',
          allownull: 'false',
          memo: '数据表',
          children: [
            {
              name: 'ID',
              type: 'String',
              isarray: 'false',
              allownull: 'false',
              memo: '内容类型ID',
              children: []
            },
            {
              name: 'Name',
              type: 'String',
              isarray: 'false',
              allownull: 'true',
              memo: '内容类型',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'publishcontent',
      name: '内容发布接口',
      sourceplugin: 'com.zving.contentcore',
      inputparameters: [
        {
          name: 'contentID',
          type: 'Long',
          isarray: 'false',
          allownull: 'true',
          memo: '内容ID'
        }
      ],
      outputparameters: []
    }
  ],
  status: 1,
  message: ''
}

axiosMock.onGet('/api/apis').reply(200, apis)
