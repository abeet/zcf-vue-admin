const permission = {
  data:[
    { code: 'menuPermission', name: '菜单权限' },
    { code: 'sitePermission', name: '站点权限' },
    { code: 'docPermission', name: '文档权限' }
  ],
  status: 1,
  message: ''
};

axiosMock.onGet('/api/permissions/id/none/type/none/types').reply(200, permission);

const menus = {
  data: {
    value: ["Platform.System", "Platform.SystemInfo", "Platform.SystemInfo.ChangeLoginStatus", "Platform.SystemInfo.ForceExit", "Platform.SystemInfo.Export", "Platform.SystemInfo.Import", "Platform.SystemInfo.Update", "Platform.Branch", "Platform.Branch.Add", "Platform.Branch.Edit", "Platform.Branch.Delete", "Platform.Branch.SetPrivRange", "Platform.Role", "Platform.Role.Add", "Platform.Role.Edit", "Platform.Role.Delete", "Platform.Role.SetPriv", "Platform.Role.AddUser", "Platform.Role.RemoveUser", "Platform.User", "Platform.User.Add", "Platform.User.Edit", "Platform.User.Delete", "Platform.User.SetPriv", "Platform.User.ChangePassword", "Platform.User.Disable", "Platform.User.Enable", "Platform.Code", "Platform.Code.Add", "Platform.Code.Edit", "Platform.Code.Delete", "Platform.Config", "Platform.Metadata", "Platform.Metadata.Add", "Platform.Metadata.Delete", "Platform.Metadata.AddData", "Platform.Metadata.EditData", "Platform.Metadata.DeleteData", "Platform.Schedule", "Platform.Schedule.Add", "Platform.Schedule.Edit", "Platform.Schedule.Delete", "Platform.Schedule.ManualExecute", "Platform.Menu", "Platform.Menu.Start", "Platform.Menu.Stop", "Platform.Menu.Reset", "Platform.Menu.Sort", "Platform.Plugin", "Platform.Plugin.Start", "Platform.Plugin.Stop", "Platform.Backup", "Platform.Log"],
    tree: [{
      "code": "Search.DicManager",
      "name": "检索词汇管理",
      "items": [{
        "code": "Search.DicManager.AddGeneralWord",
        "name": "添加"
      }, {"code": "Search.DicManager.EditGeneralWord", "name": "编辑"}, {
        "code": "Search.DicManager.DeleteGeneralWord",
        "name": "删除"
      }, {"code": "Search.DicManager.PublishGeneralWord", "name": "发布"}, {
        "code": "Search.DicManager.ImportGeneralWord",
        "name": "通用词导入"
      }, {"code": "Search.DicManager.ExportGeneralWord", "name": "通用词导出"}, {
        "code": "Search.DicManager.EmptyDB",
        "name": "清空词库"
      }, {
        "code": "Search.DicManager.Recompilation",
        "name": "重新编译词典"
      }, {
        "code": "Search.DicManager.DeleteUserInputNewWord",
        "name": "删除用户输入的新词"
      }, {
        "code": "Search.DicManager.PublishNewWordToGeneralDB",
        "name": "发布新词到通用词库"
      }, {
        "code": "Search.DicManager.ExtractedNewWord",
        "name": "挖掘新词"
      }, {
        "code": "Search.DicManager.PublishExtractedNewWordToGeneralDB",
        "name": "发布挖掘出来的新词到通用词库"
      }, {
        "code": "Search.DicManager.DeleteArticleInputNewWord",
        "name": "删除挖掘出来的新词"
      }, {"code": "Search.DicManager.AddStopWord", "name": "添加停用词"}, {
        "code": "Search.DicManager.EditStopWord",
        "name": "编辑停用词"
      }, {"code": "Search.DicManager.DeleteStopWord", "name": "删除停用词"}, {
        "code": "Search.DicManager.PublishStopWord",
        "name": "发布停用词"
      }, {
        "code": "Search.DicManager.OfflineStopWord",
        "name": "下线停用词"
      }, {
        "code": "Search.DicManager.RecompilationStopWordDic",
        "name": "重新编译停用词典"
      }, {
        "code": "Search.DicManager.UploadAttachmentDic",
        "name": "上传附加词典"
      }, {"code": "Search.DicManager.DeleteAttachmentDic", "name": "删除附加词典"}, {
        "code": "Search.DicManager.Add",
        "name": "搜索词新建"
      }, {"code": "Search.DicManager.Edit", "name": "搜索词编辑"}, {
        "code": "Search.DicManager.Delete",
        "name": "搜索词删除"
      }, {"code": "Search.DicManager.Top", "name": "搜索词置顶"}]
    }, {
      "code": "Search.WeightsConfig",
      "name": "检索权重设置",
      "items": [{
        "code": "Search.WeightsConfig.EditFieldWeights",
        "name": "编辑字段权重"
      }, {
        "code": "Search.WeightsConfig.EditBlanceWeights",
        "name": "编辑均衡权重"
      }, {
        "code": "Search.WeightsConfig.EditDistanceWeights",
        "name": "编辑距离权重"
      }, {
        "code": "Search.WeightsConfig.AddQueryPositionConfig",
        "name": "新建"
      }, {
        "code": "Search.WeightsConfig.EditQueryPositionConfig",
        "name": "编辑"
      }, {
        "code": "Search.WeightsConfig.DeleteQueryPositionConfig",
        "name": "删除"
      }, {
        "code": "Search.WeightsConfig.AddCustomConfig",
        "name": "新建自定义权重"
      }, {
        "code": "Search.WeightsConfig.EditCustomConfig",
        "name": "编辑自定义权重"
      }, {"code": "Search.WeightsConfig.DeleteCustomConfig", "name": "删除自定义权重"}]
    }, {
      "code": "Platform.System",
      "name": "设置",
      "items": [],
      "children": [{
        "code": "Platform.SystemInfo",
        "name": "系统信息",
        "items": [{
          "code": "Platform.SystemInfo.ChangeLoginStatus",
          "name": "允许登录"
        }, {"code": "Platform.SystemInfo.ForceExit", "name": "强制注销所有会话"}, {
          "code": "Platform.SystemInfo.Export",
          "name": "导出数据库"
        }, {"code": "Platform.SystemInfo.Import", "name": "导入数据库"}, {
          "code": "Platform.SystemInfo.Update",
          "name": "在线更新"
        }]
      }, {
        "code": "Platform.Branch",
        "name": "组织机构",
        "items": [{"code": "Platform.Branch.Add", "name": "添加"}, {
          "code": "Platform.Branch.Edit",
          "name": "编辑"
        }, {"code": "Platform.Branch.Delete", "name": "删除"}, {"code": "Platform.Branch.SetPrivRange", "name": "设置权限范围"}]
      }, {
        "code": "Platform.Role",
        "name": "角色管理",
        "items": [{"code": "Platform.Role.Add", "name": "添加"}, {
          "code": "Platform.Role.Edit",
          "name": "编辑"
        }, {"code": "Platform.Role.Delete", "name": "删除"}, {
          "code": "Platform.Role.SetPriv",
          "name": "设置权限"
        }, {"code": "Platform.Role.AddUser", "name": "添加用户到角色"}, {
          "code": "Platform.Role.RemoveUser",
          "name": "从角色中删除用户"
        }]
      }, {
        "code": "Platform.User",
        "name": "用户管理",
        "items": [{"code": "Platform.User.Add", "name": "添加"}, {
          "code": "Platform.User.Edit",
          "name": "编辑"
        }, {"code": "Platform.User.Delete", "name": "删除"}, {
          "code": "Platform.User.SetPriv",
          "name": "设置权限"
        }, {"code": "Platform.User.ChangePassword", "name": "修改密码"}, {
          "code": "Platform.User.Disable",
          "name": "停用"
        }, {"code": "Platform.User.Enable", "name": "启用"}, {
          "code": "Platform.User.LastLoginUpdatePwd",
          "name": "通知修改密码"
        }]
      }, {
        "code": "Platform.AccountSecurity",
        "name": "账户安全",
        "items": [{"code": "Platform.AccountSecurity.Save", "name": "保存"}]
      }, {
        "code": "Platform.Code",
        "name": "代码管理",
        "items": [{"code": "Platform.Code.Add", "name": "添加"}, {
          "code": "Platform.Code.Edit",
          "name": "编辑"
        }, {"code": "Platform.Code.Delete", "name": "删除"}]
      }, {
        "code": "Platform.Config",
        "name": "配置项管理",
        "items": [{"code": "Platform.Config.Save", "name": "保存"}]
      }, {
        "code": "Platform.Metadata",
        "name": "元数据管理",
        "items": [{"code": "Platform.Metadata.Add", "name": "添加"}, {
          "code": "Platform.Metadata.Save",
          "name": "编辑"
        }, {"code": "Platform.Metadata.Delete", "name": "删除"}, {
          "code": "Platform.Metadata.AddData",
          "name": "添加数据"
        }, {"code": "Platform.Metadata.EditData", "name": "修改数据"}, {
          "code": "Platform.Metadata.DeleteData",
          "name": "删除数据"
        }]
      }, {
        "code": "Platform.Schedule",
        "name": "定时任务",
        "items": [{"code": "Platform.Schedule.Add", "name": "添加"}, {
          "code": "Platform.Schedule.Edit",
          "name": "编辑"
        }, {"code": "Platform.Schedule.Delete", "name": "删除"}, {
          "code": "Platform.Schedule.ManualExecute",
          "name": "手动执行"
        }]
      }, {
        "code": "Platform.Menu",
        "name": "菜单管理",
        "items": [{"code": "Platform.Menu.Start", "name": "启用"}, {
          "code": "Platform.Menu.Stop",
          "name": "停用"
        }, {"code": "Platform.Menu.Reset", "name": "重置"}, {"code": "Platform.Menu.Sort", "name": "排序"}]
      }, {
        "code": "Platform.Plugin",
        "name": "插件管理",
        "items": [{"code": "Platform.Plugin.Start", "name": "启动"}, {"code": "Platform.Plugin.Stop", "name": "停用"}]
      }, {
        "code": "Platform.Backup",
        "name": "数据备份",
        "items": [{"code": "Platform.Backup.Backup", "name": "备份数据"}, {
          "code": "Platform.Backup.Restore",
          "name": "恢复数据"
        }, {"code": "Platform.Backup.Delete", "name": "删除文件"}, {"code": "Platform.Backup.Download", "name": "下载"}]
      }, {"code": "Platform.Log", "name": "系统日志", "items": []}]
    }]
  },
  status: 1,
  message: ''
};

axiosMock.onGet(/api\/permissions\/id\/.+\/type\/.+\/menus$/).reply(200, menus);

axiosMock.onPut(/api\/permissions\/id\/.+\/type\/.+\/menus$/).reply(200, {
  status: 1,
  message: '操作成功',
  data: {}
});
