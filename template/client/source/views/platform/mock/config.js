const configs = {
    "data": [{
        "id": "com.zving.platform",
        "name": "基础平台",
        "configs": [{ "id": "Platform.AdminUserName", "name": "系统管理员的用户名", "dataType": "ShortText", "controlType": "Text", "value": "admin" }, {
            "id": "com.zving.platform.config.DefaultTheme",
            "name": "默认主题",
            "dataType": "ShortText",
            "controlType": "Select",
            "value": "zvingflat",
            "options": [{ "key": "zvingclassic", "value": "经典蓝色" },
                { "key": "zvinggreen", "value": "清新绿色" },
                { "key": "zvingdeep", "value": "雅致深色" },
                { "key": "zvingred", "value": "庄重红色" },
                { "key": "zvingpurple", "value": "优雅紫色" },
                { "key": "zvingflat", "value": "明快扁平" }
            ]
        }, { "id": "Platform.UpdateServerURLs", "name": "更新服务器地址(多个地址以换行隔开)", "dataType": "LargeText", "controlType": "TextArea", "value": "http://release.update.zving.com/\nhttp://beta.update.zving.com/" }, { "id": "Platform.MenuOrder", "name": "菜单顺序", "dataType": "ShortText", "controlType": "TextArea", "value": "333dd6666" }, { "id": "Platform.SlowSQLThreshold", "name": "慢SQL阈值", "dataType": "Long", "controlType": "Text", "value": "12" }, { "id": "Platform.APIIPRanges", "name": "允许调用API的IP地址范围", "dataType": "LargeText", "controlType": "TextArea", "value": "5345345" }, { "id": "BackupFilterTable", "name": "数据库备份过滤表", "dataType": "ShortText", "controlType": "Text", "value": null }, {
            "id": "Platform.RecordUserOperateLog",
            "name": "记录用户操作日志",
            "dataType": "ShortText",
            "controlType": "Radio",
            "value": "N",
            "options": [{ "key": "Y", "value": "是" },
                { "key": "N", "value": "否" }
            ]
        }, { "id": "Platform.Mail.Host", "name": "邮件 SMTP 服务器地址", "dataType": "ShortText", "controlType": "Text", "value": null }, { "id": "Platform.Mail.Port", "name": "邮件 SMTP 服务器端口", "dataType": "ShortText", "controlType": "Text", "value": null }, { "id": "Platform.Mail.FromUser", "name": "邮件 SMTP 发信人邮件地址<br/>（格式为 \"userName&lt;user@domain.com&gt;\"，也可以只填地址）", "dataType": "ShortText", "controlType": "Text", "value": null }, { "id": "Platform.Mail.UserName", "name": "邮件 SMTP 身份验证用户名", "dataType": "ShortText", "controlType": "Text", "value": null }, { "id": "Platform.Mail.Password", "name": "邮件 SMTP 身份验证密码", "dataType": "ShortText", "controlType": "Text", "value": null }, {
            "id": "Platform.Mail.SecurityType",
            "name": "邮件 SMTP 安全类型",
            "dataType": "ShortText",
            "controlType": "Select",
            "value": null,
            "options": [{ "key": "none", "value": "无" },
                { "key": "ssl_tls", "value": "SSL/TLS" },
                { "key": "starttls", "value": "STARTTLS" }
            ]
        }]
    }, {
        "id": "com.zving.search",
        "name": "全文检索支持",
        "configs": [{
            "id": "IsMaxWordLength",
            "name": "搜索分词是否使用最大切分",
            "dataType": "ShortText",
            "controlType": "Radio",
            "value": "N",
            "options": [{ "key": "Y", "value": "是" },
                { "key": "N", "value": "否" }
            ]
        }, { "id": "Search.WordImportAddr", "name": "通用词典导入上传地址", "dataType": "ShortText", "controlType": "Text", "value": null }, { "id": "SearchAbstractMaxLength", "name": "搜索正文摘要最大长度", "dataType": "Long", "controlType": "Text", "value": null }, {
            "id": "SingleChineseCharacterEnable",
            "name": "索引分词时是否逐汉字切分",
            "dataType": "ShortText",
            "controlType": "Radio",
            "value": "Y",
            "options": [{ "key": "Y", "value": "是" },
                { "key": "N", "value": "否" }
            ]
        }, {
            "id": "QueryTermAndRelation",
            "name": "查询词之间是否为与关系",
            "dataType": "ShortText",
            "controlType": "Radio",
            "value": null,
            "options": [{ "key": "Y", "value": "是" },
                { "key": "N", "value": "否" }
            ]
        }, { "id": "SynonymWeight", "name": "同义词权重", "dataType": "Double", "controlType": "Text", "value": null }]
    }],
    "status": 1,
    "message": ""
};


axiosMock.onGet('/api/configs').reply(200, configs);

axiosMock.onPut('/api/configs/saved').reply(200, {
  status: 1,
  message:'保存成功！'
});
