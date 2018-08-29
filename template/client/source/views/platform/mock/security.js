axiosMock.onGet('/api/securitys').reply(200, {
  data: {
    IsOpenThreeSecurity: true,
    PasswordMinLength: 6,
    PasswordMaxLength: 30,
    PasswordCharacterSpecification: 1,
    NotIncludeUserInfo: [],
    IsOpenRecentlyCheck: true,
    RepeatCount: 0,
    SpecifyOverTimeLock: true,
    MaxLoginCount: 0,
    OverLoginCountType: '',
    LockTime: 0,
    Expiration: 0,
    NextLoginUpdatePwd: true
  },
  status: 1,
  message: ''
})

axiosMock.onPut('/api/securitys/all').reply(200, {
  status: 1,
  message: '保存成功！'
})
