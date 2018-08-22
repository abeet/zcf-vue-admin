axiosMock.onGet('/api/securitys').reply(200, {"data":{"Platform.AppDataPath":"${Parent}/wwwroot_release/.data/","IsOpenThreeSecurity":false},"status":1,"message":""});


axiosMock.onPut('/api/securitys/all').reply(200, {"status":1,"message":"操作成功"});
