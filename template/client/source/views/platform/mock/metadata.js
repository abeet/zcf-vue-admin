const metadatas = [
  { id: 1, name: '领导信息', code: 'leader', ownerType: 1, memo: 'memo', targetTable: 'tmpTable' },
  { id: 2, name: '商品信息', code: 'goods', ownerType: 4, memo: 'memo', targetTable: 'tmpTable' },
  { id: 3, name: '文章信息', code: 'article', ownerType: 5, memo: 'memo', targetTable: 'tmpTable' },
  { id: 4, name: '用户信息', code: 'user', ownerType: 6, memo: 'memo', targetTable: 'tmpTable' }
];

const metadataTypes = [
  { id: 1, name: '系统元数据'},
  { id: 2, name: '会员属性扩展模型'},
  { id: 3, name: '自定义表单模型'},
  { id: 4, name: '栏目扩展模型'},
  { id: 5, name: '内容扩展模型'},
  { id: 6, name: '自定义内容类型'}
];

axiosMock.onGet('/api/metadatas').reply(200, {
  status: 1,
  message: '',
  data: metadatas
});
axiosMock.onGet('/api/metadatas/types').reply(200, {
  status: 1,
  message: '',
  data: metadataTypes
});

axiosMock.onPost(/api\/metadatas$/).reply(200, {
  status: 1,
  message: '添加成功！',
  data: {
    id: Math.round(Math.random() * 10000)
    // ...
  }
});

axiosMock.onPut(/api\/metadatas\/\d+$/).reply(200, { status: 1, message: '更新成功！'});

axiosMock.onDelete(/api\/metadatas\/.+$/).reply(200, { status: 1, message: '删除成功！'});

const groups = [
  {id: 1, name: '分组一', code: 'group1'},
  {id: 2, name: '分组二', code: 'group2'},
  {id: 3, name: '分组三', code: 'group3'}
];

axiosMock.onGet(/api\/metadatas\/\d+\/groups$/).reply(200, {
  status: 1,
  message: '',
  data: groups
});

axiosMock.onPost(/api\/metadatas\/\d+\/groups$/).reply(200, {
  status: 1,
  message: '添加成功！',
  data: {
    id: Math.round(Math.random() * 10000)
    // ...
  }
});

axiosMock.onPut(/api\/metadatas\/\d+\/groups\/\d+$/).reply(200, { status: 1, message: '更新成功！'});

axiosMock.onDelete(/api\/metadatas\/groups\/\d+$/).reply(200, { status: 1, message: '删除成功！'});

const fields = [
  {
    id: 1, name: '字段一', code: 'field1', groupID: 1,
    controlType: 'Text',
    dataType: 'MediumText',
    mandatoryFlag: 'N',
    FVisible: 'N',
    BVisible: 'N',
    defaultValue: '',
    listOptions: '',
    verifyRule: '',
    verifyCondition: '',
    styleClass: '',
    styleText: '',
    memo: ''
  },
  {
    id: 2, name: '字段二', code: 'field2', groupID: 2,
    controlType: 'Text',
    dataType: 'MediumText',
    mandatoryFlag: 'N',
    FVisible: 'N',
    BVisible: 'N',
    defaultValue: '',
    listOptions: '',
    verifyRule: '',
    verifyCondition: '',
    styleClass: '',
    styleText: '',
    memo: ''
  },
  {
    id: 3, name: '字段三', code: 'field3', groupID: 3,
    controlType: 'Text',
    dataType: 'MediumText',
    mandatoryFlag: 'N',
    FVisible: 'N',
    BVisible: 'N',
    defaultValue: '',
    listOptions: '',
    verifyRule: '',
    verifyCondition: '',
    styleClass: '',
    styleText: '',
    memo: ''
  }
];

axiosMock.onGet(/api\/metadatas\/\d+\/columns$/).reply(200, {
  status: 1,
  message: '',
  data: fields
});

axiosMock.onPost(/api\/metadatas\/\d+\/columns$/).reply(200, {
  status: 1,
  message: '添加成功',
  data: {
    id: Math.round(Math.random() * 10000)
  }
});

axiosMock.onPut(/api\/metadatas\/\d+\/columns\/.+$/).reply(200, { status: 1, message: '更新成功！'});

axiosMock.onDelete(/api\/metadatas\/columns\/.+$/).reply(200, { status: 1, message: '删除成功！'});

const controlTypes = [
  {id: 1, value: '文本框', key: 'text'},
  {id: 2, value: '多行文本框', key: 'TextArea'},
  {id: 3, value: '单选框', key: 'Radio'},
  {id: 4, value: '多选框', key: 'Checkbox'},
  {id: 5, value: '日期选择框', key: 'Date'},
  {id: 6, value: '日期时间选择框', key: 'DateTime'},
  {id: 7, value: '下拉框', key: 'Select'}
];

axiosMock.onGet(/api\/metadatas\/\d+\/columns\/controlTypes$/).reply(200, {
  status: 1,
  message: '',
  data: controlTypes
});

const dataTypes = [
  {id: 1, value: '字符串(200)', key: 'MediumText'},
  {id: 2, value: '字符串(50)', key: 'ShortText'},
  {id: 3, value: '字符串(2000)', key: 'LargeText'},
  {id: 4, value: '字符串(不限长度)', key: 'ClobText'},
  {id: 5, value: '长整型', key: 'Long'},
  {id: 6, value: '双字节浮点', key: 'Double'},
  {id: 7, value: '日期时间', key: 'Datetime'}
];

axiosMock.onGet(/api\/metadatas\/\d+\/columns\/dataTypes$/).reply(200, {
  status: 1,
  message: '',
  data: dataTypes
});

const fieldOptionsCodeTypes = [
  { id: 1, codeName: '广告版位审核状态', codeType: 'ADPStatus'},
  { id: 2, codeName: '广告类型', codeType: 'AdvertiseType'},
  { id: 3, codeName: '归档期限', codeType: 'ArchiveTime'},
  { id: 4, codeName: '文档状态', codeType: 'AuditStatus'},
  { id: 5, codeName: '敏感词级别', codeType: 'BadWordLevel'},
  { id: 6, codeName: '文档状态', codeType: 'BlockStatus'},
  { id: 7, codeName: '栏目资源类型', codeType: 'CatalogResourceType'},
  { id: 8, codeName: '变更密码条件', codeType: 'ChangePasswordType'},
  { id: 9, codeName: '评论显示类型', codeType: 'CommentDisplayType'},
  { id: 10, codeName: '评论审核状态', codeType: 'CommentStatus'},
  { id: 11, codeName: '引用复制类型', codeType: 'Content.CopyType'},
  { id: 12, codeName: '分类属性', codeType: 'ContentAttribute'},
  { id: 13, codeName: '文档状态', codeType: 'ContentStatus'},
  { id: 14, codeName: '文档状态', codeType: 'Database.Type'},
  { id: 15, codeName: '数据类型', codeType: 'DataType'},
  { id: 16, codeName: '数据库采集可映射字段', codeType: 'DBGather.MappingColumns'},
  { id: 17, codeName: 'Platform.Detector.ShowType', codeType: 'DetectorShowType'},
  { id: 18, codeName: '是否启用', codeType: 'Enable'},
  { id: 19, codeName: '事件类型', codeType: 'EventType'},
  { id: 20, codeName: '导出站点类型', codeType: 'ExportSiteType'},
  { id: 21, codeName: '性别', codeType: 'Gender'},
  { id: 22, codeName: '热词链接打开方式', codeType: 'HotWordLinkOpenType'},
  { id: 23, codeName: '图片播放器状态', codeType: 'ImagePlayerStatus'},
  { id: 24, codeName: '图片来源', codeType: 'ImageSource'},
  { id: 25, codeName: 'IP限制方式', codeType: 'IPLimitTypeCode'},
  { id: 26, codeName: '是否开启三级等保安全', codeType: 'IsOpenThreeSecurity'},
  { id: 27, codeName: '关键字匹配类型', codeType: 'KeywordMatchType'},
  { id: 28, codeName: '链接检查错误类型', codeType: 'LinkCheckErrorType'},
  { id: 29, codeName: '留言审核类型', codeType: 'MessageVerify'},
  { id: 30, codeName: 'Password.NoIncludeUserInfo', codeType: 'NotIncludeUserInfo'}
];

axiosMock.onGet(/api\/metadatas\/\d+\/columns\/codeTypes$/).reply(200, {
  status: 1,
  message: '',
  data: fieldOptionsCodeTypes
});

const pkDatas = [
  {id: 1, PKValue: '1001', field1: 'a', field2: 'b', field3: 'c' },
  {id: 2, PKValue: '1002', field1: 'b', field2: 'c', field3: 'd' },
  {id: 3, PKValue: '1003', field1: 'c', field2: 'd', field3: 'e' },
  {id: 4, PKValue: '1004', field1: 'd', field2: 'e', field3: 'f' },
  {id: 5, PKValue: '1005', field1: 'e', field2: 'f', field3: 'g' }
];

axiosMock.onGet(/api\/metadatas\/\d+\/datas$/).reply(200, {
  status: 1,
  message: '',
  data: pkDatas
});

axiosMock.onPost(/api\/metadatas\/\d+\/datas$/).reply(200, {
  status: 1,
  message: '添加成功',
  data: {
    id: Math.round(Math.random() * 10000)
  }
});

axiosMock.onPut(/api\/metadatas\/\d+\/datas\/\d+$/).reply(200, { status: 1, message: '更新成功！'});

axiosMock.onDelete(/api\/metadatas\/\d+\/datas\/\d+$/).reply(200, { status: 1, message: '删除成功！'});

axiosMock.onGet(/api\/metadatas\/\d+\/templates$/).reply(200, {
  status: 1,
  message: '',
  data: [
    {
      mmtemplatetypeid: 1,
      name: '模板一',
      template: '<model:fieldgroup code="字段分组Code"></model:fieldgroup><model:field code="字段Code"></model:field>@{FieldGroup.Name}@{FieldGroup.Code}@{Field.Name}@{Field.Code}@{Field.ControlHtml}'
    }, {
      mmtemplatetypeid: 2,
      name: '模板二',
      template: '@{FieldGroup.Name}@{FieldGroup.Code}@{Field.Name}@{Field.Code}@{Field.ControlHtml}'
    }
  ]
});

axiosMock.onPut(/api\/metadatas\/\d+\/templates\/updated$/).reply(200, { status: 1, message: '更新成功！'});

axiosMock.onGet(/api\/metadatas\/fields\/options\/.+$/).reply(200, {
  data: [{
    value: '选项一', key: 'option1'
  }, {
    value: '选项二', key: 'option2'
  }, {
    value: '选项三', key: 'option3'
  }],
  status: 1,
  message: ''
});
