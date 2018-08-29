const plugins = {
  'data': [
    {
      'id': 'com.zving.framework',
      'name': 'Framework',
      'status': true,
      'version': '2.0',
      'provider': 'Zving Software',
      'author': 'Zving Software',
      'description': '泽元框架插件，提供框架级别的扩展点',
      'requiredplugins': [],
      'derequiredplugins': [
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.search',
          'name': '全文检索支持',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        },
        {
          'id': 'com.zving.audio',
          'name': '音频文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.compress',
          'name': '压缩文件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.product',
          'name': 'Product.PluginName',
          'version': '2.2.12987'
        },
        {
          'id': 'com.zving.ecmsearch',
          'name': 'ECM搜索',
          'version': '1.0'
        },
        {
          'id': 'com.zving.image',
          'name': '图片文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.office',
          'name': 'Office文档插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.text',
          'name': '文本文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.video',
          'name': '视频文件插件',
          'version': '1.0'
        }
      ],
      'extends': {
        'extendservices': [
          {
            'id': 'com.zving.framework.cache.CacheService',
            'description': '缓存提供器注册'
          },
          {
            'id': 'com.zving.framework.schedule.CronTaskManagerService',
            'description': '定时任务管理器注册'
          },
          {
            'id': 'com.zving.framework.schedule.SystemTaskService',
            'description': '系统定时任务注册'
          },
          {
            'id': 'com.zving.framework.data.dbtype.DBTypeService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.URLHandlerService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.castor.CastorService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.ExceptionCatcherService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.json.convert.JSONConvertorService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.ui.zhtml.ZhtmlFunctionService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.ui.zhtml.ZhtmlSourceProcessorService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.ui.zhtml.ZhtmlTagService',
            'description': ''
          },
          {
            'id': 'com.zving.framework.ui.weaver.ZhtmlWeaveService',
            'description': ''
          }
        ],
        'extenditems': [
          {
            'id': 'com.zving.framework.schedule.SystemTaskManager',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.DB2',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.HSQLDB',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.MSSQL2000',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.MySQL',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.Oracle',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.MSSQL',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.Sybase',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.ZhtmlHandler',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.AjaxHandler',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.ActionHandler',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.UploadHandler',
            'description': ''
          },
          {
            'id': 'com.zving.framework.core.ResourceHandler',
            'description': ''
          },
          {
            'id': 'com.zving.framework.misc.FrameworkTask',
            'description': ''
          },
          {
            'id': 'com.zving.framework.security.DefaultPrivExceptionCatcher',
            'description': ''
          },
          {
            'id': 'com.zving.framework.json.convert.DataTableConvertor',
            'description': ''
          },
          {
            'id': 'com.zving.framework.json.convert.DAOSetConvertor',
            'description': ''
          },
          {
            'id': 'com.zving.framework.json.convert.DAOConvertor',
            'description': ''
          },
          {
            'id': 'com.zving.framework.template.TemplateExceptionCather',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.DerbyEmbedded',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.DerbyServer',
            'description': ''
          },
          {
            'id': 'com.zving.framework.expression.function.ParseInt',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.DBConnPoolKeepAliveTask',
            'description': ''
          },
          {
            'id': 'com.zving.framework.cache.CacheSyncTask',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.DM',
            'description': ''
          },
          {
            'id': 'com.zving.framework.data.dbtype.Kingbase',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': [
          {
            'id': 'com.zving.framework.PrivCheck',
            'description': '用于扩展权限检查逻辑',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterSessionCreate',
            'description': '每次Session创建后都会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterCronTaskExecutedAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.BeforeCronTaskExecutedAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.BeforeUIMethodInvoke',
            'description': 'UI类中被@Priv标注过的方法执行之前都会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterUIMethodInvoke',
            'description': 'UI类中被@Priv标注过的方法执行之后都会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.BeforeSessionDestory',
            'description': '每次Session销毁后都会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterSQLExecutedAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterPrivCheckFailedAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterVerifyFailedAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterAllPluginStarted',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterClusteringRefresh',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterZhtmlExecuteAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.AfterDispatchServletServiceAction',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.framework.BeforeDispatchServletServiceAction',
            'description': '',
            'uiflag': false
          }
        ]
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'Framework2.x',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'framework',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'ui',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'weaver',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'ZhtmlWeaveService.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            },
                            {
                              'name': 'zhtml',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'ZhtmlSourceProcessorService.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'ZhtmlTagService.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'ZhtmlFunctionService.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          'name': 'json',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'convert',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'DataTableConvertor.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DAOConvertor.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'JSONConvertorService.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DAOSetConvertor.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          'name': 'data',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'dbtype',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'Oracle.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'MSSQL2000.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'MSSQL.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'MySQL.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'Sybase.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DerbyEmbedded.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DBTypeService.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DM.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DerbyServer.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'DB2.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'HSQLDB.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'Kingbase.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            },
                            {
                              'name': 'DBConnPoolKeepAliveTask.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'extend',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'action',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'AfterDispatchServletServiceAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterZhtmlExecuteAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterCronTaskExecutedAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'BeforeDispatchServletServiceAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterVerifyFailedAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterClusteringRefreshAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterUIMethodInvokeAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'BeforeUIMethodInvokeAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'BeforeSessionDestroyAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterAllPluginStartedAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'PrivExtendAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterSessionCreateAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterPrivCheckFailedAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AfterSQLExecutedAction.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'BeforeCronTaskExecutedAction.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            },
                            {
                              'name': 'plugin',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'FrameworkPlugin.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          'name': 'schedule',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'CronTaskManagerService.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'SystemTaskManager.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'SystemTaskService.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'expression',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'function',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'ParseInt.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          'name': 'core',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'URLHandlerService.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'handler',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'ResourceHandler.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'ActionHandler.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'ZhtmlHandler.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'AjaxHandler.java',
                                  'type': 'file',
                                  'children': []
                                },
                                {
                                  'name': 'UploadHandler.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            },
                            {
                              'name': 'ExceptionCatcherService.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'castor',
                              'type': 'directory',
                              'children': [
                                {
                                  'name': 'CastorService.java',
                                  'type': 'file',
                                  'children': []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          'name': 'security',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'DefaultPrivExceptionCatcher.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'template',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'TemplateExceptionCather.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'cache',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'CacheService.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'CacheSyncTask.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'misc',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'FrameworkTask.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.framework.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'framework.xml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'license.dat',
              'type': 'file',
              'children': []
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.framework.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'log4j.config',
              'type': 'file',
              'children': []
            },
            {
              'name': 'database.xml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'clustering.xml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'charset.config',
              'type': 'file',
              'children': []
            },
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'framework',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'lang',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.framework',
                  'type': 'directory',
                  'children': [
                    {
                      'name': '',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'mimetype.xml',
              'type': 'file',
              'children': []
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'JSCrossDomainProxy.html',
              'type': 'file',
              'children': []
            },
            {
              'name': 'WEB-INF',
              'type': 'directory',
              'children': [
                {
                  'name': 'plugins',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'required',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'com.zving.framework',
                          'type': 'directory',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'framework',
              'type': 'directory',
              'children': []
            },
            {
              'name': 'fonts',
              'type': 'directory',
              'children': [
                {
                  'name': '',
                  'type': 'directory',
                  'children': []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.platform',
      'name': '基础平台',
      'status': true,
      'version': '2.0',
      'provider': 'Zving Software',
      'author': 'Zving Software',
      'description': '泽元业务平台插件，提供通用系统管理功能',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [
        {
          'id': 'com.zving.search',
          'name': '全文检索支持',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        },
        {
          'id': 'com.zving.audio',
          'name': '音频文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.compress',
          'name': '压缩文件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.product',
          'name': 'Product.PluginName',
          'version': '2.2.12987'
        },
        {
          'id': 'com.zving.ecmsearch',
          'name': 'ECM搜索',
          'version': '1.0'
        },
        {
          'id': 'com.zving.image',
          'name': '图片文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.office',
          'name': 'Office文档插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.text',
          'name': '文本文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.video',
          'name': '视频文件插件',
          'version': '1.0'
        }
      ],
      'extends': {
        'extendservices': [
          {
            'id': 'com.zving.platform.service.CodeService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.MenuPrivService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.ConfigService',
            'description': ''
          },
          {
            'id': 'com.zving.logs.service.LogMenuGroupService',
            'description': '日志菜单组注册'
          },
          {
            'id': 'com.zving.logs.service.LogMenuService',
            'description': '日志菜单注册'
          },
          {
            'id': 'com.zving.logs.service.LogTypeService',
            'description': '日志类型注册'
          },
          {
            'id': 'com.zving.platform.service.RecycleBinService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.APIMethodService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataColumnControlTypeServise',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.UserPreferencesService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.APIDataFormatService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.EventTypeService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.EventService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.DataSetupService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.DetectorService',
            'description': ''
          }
        ],
        'extenditems': [
          {
            'id': 'com.zving.platform.pub.PlatformCache',
            'description': ''
          },
          {
            'id': 'com.zving.platform.pub.CodeCache',
            'description': ''
          },
          {
            'id': 'com.zving.platform.pub.MessageCache',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.YesOrNo',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.Enable',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.DataType',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.SystemInfoPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.UserPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.RolePriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.CodePriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.ConfigPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.SchedulePriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.MenuPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.PluginPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.MetadataPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.BranchPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataService',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.SystemPriv',
            'description': ''
          },
          {
            'id': 'com.zving.logs.types.CronLog',
            'description': ''
          },
          {
            'id': 'com.zving.logs.types.SQLLog',
            'description': ''
          },
          {
            'id': 'com.zving.logs.types.SecurityLog',
            'description': ''
          },
          {
            'id': 'com.zving.logs.menus.RealTimeLog',
            'description': ''
          },
          {
            'id': 'com.zving.logs.menus.SystemGroup',
            'description': ''
          },
          {
            'id': 'com.zving.logs.menus.SQLLogMenu',
            'description': ''
          },
          {
            'id': 'com.zving.logs.menus.SecurityLogMenu',
            'description': ''
          },
          {
            'id': 'com.zving.logs.menus.CronLogMenu',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.RecycleBinPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.type.UserLog',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.menu.UserLogMenu',
            'description': ''
          },
          {
            'id': 'com.zving.platform.pub.AuthCodeURLHandler',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.DBBackupTask',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataTextColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataTextAreaColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataRadioColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataCheckboxColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataDateColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataDateTimeColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataTimeColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataSelectColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.meta.MetadataRichTextColumn',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.AdminUserName',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.DefaultTheme',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.UpdateServerURLs',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MenuOrder',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.SlowSQLThreshold',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.APIIPRanges',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.BackupFilterTable',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.RecordUserOperateLog',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailHost',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailPort',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailFromUser',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailUserName',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailPassword',
            'description': ''
          },
          {
            'id': 'com.zving.platform.config.MailSecurityType',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.LogPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.BackupPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.ShortcutPreference',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.StyleResourceHandler',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.method.UserInfoGetAPIMethod',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.method.UserChangePasswordAPIMethod',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.BranchListTreeLevel',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.method.UserAddAPIMethod',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.method.UserUpdateAPIMethod',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.menu.UserLoginLogMenu',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.format.JSONFormat',
            'description': ''
          },
          {
            'id': 'com.zving.platform.api.format.XMLFormat',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.menu.DownLogMenu',
            'description': '系统异常日志菜单扩展'
          },
          {
            'id': 'com.zving.platform.code.SuccessOrFail',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.ApiPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.Theme',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.type.OperateLog',
            'description': ''
          },
          {
            'id': 'com.zving.platform.log.menu.UserOperateLogMenu',
            'description': '测试日志菜单'
          },
          {
            'id': 'com.zving.platform.log.type.UserOperateLog',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.InstallDataFileImportMode',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.OverLoginCountType',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.NotIncludeUserInfo',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.AccountConfigPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.SpecifyOverTimeLock',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.PasswordCharacterSpecification',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.IsOpenThreeSecurity',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.ChangePasswordType',
            'description': ''
          },
          {
            'id': 'com.zving.platform.code.DetectorShowType',
            'description': ''
          },
          {
            'id': 'com.zving.platform.privilege.DetectorPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.OSDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.CpuDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.MemoryDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.JVMMemoryDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.DiskDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.ImageDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.VideoDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.FastStartDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.item.PlatformDetector',
            'description': ''
          },
          {
            'id': 'com.zving.platform.user.AvatarHandler',
            'description': ''
          }
        ],
        'extendactions': [
          {
            'id': 'com.zving.platform.PrivExtend',
            'description': '扩展Platform的权限检查逻辑，包括菜单权限和功能权限'
          },
          {
            'id': 'com.zving.platform.PrivUIExtend',
            'description': '扩展Platform的权限管理UI界面，包括菜单权限和功能权限'
          },
          {
            'id': 'com.zving.platform.InitCodeAction',
            'description': 'Platform.Plugin.InitCodeAction'
          },
          {
            'id': 'com.zving.logs.extend.AferSQLExecuted',
            'description': ''
          },
          {
            'id': 'com.zving.logs.extend.AfterCronTaskExecuted',
            'description': ''
          },
          {
            'id': 'com.zving.logs.extend.AfterPrivCheckFailed',
            'description': ''
          },
          {
            'id': 'com.zving.logs.extend.AfterVerifyFailed',
            'description': ''
          },
          {
            'id': 'com.zving.platform.extend.BeforeLocalUpdateAction',
            'description': ''
          },
          {
            'id': 'com.zving.platform.extend.UserPreferencesUIAction',
            'description': ''
          },
          {
            'id': 'com.zving.platform.extend.APIPriv',
            'description': ''
          },
          {
            'id': 'com.zving.platform.extend.AfterClusteringRefreshExtend',
            'description': ''
          },
          {
            'id': 'com.zving.platform.action.BeforeCronTaskExecuted',
            'description': ''
          }
        ],
        'extendpoints': [
          {
            'id': 'com.zving.Platform.AfterBranchAdd',
            'description': '新增机构后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.Platform.AfterBranchModify',
            'description': '修改机构后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.Platform.AfterBranchDelete',
            'description': '删除机构后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterInstall',
            'description': '不同产品、插件、项目可以通过扩展此扩展点实现各自的系统初始化逻辑',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.PrivUI',
            'description': 'Platform.Plugin.PrivUI',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.BranchAddUI',
            'description': '机构添加/编辑页面扩展点',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.UserAddUI',
            'description': '用户添加/编辑页面扩展点',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.BeforeMetaModelSave',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.BeforeMetaModelDelete',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterSSOLogin',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.UserPreferencesUI',
            'description': '',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.AfterGetNewMessage',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.ApplicationScript',
            'description': '',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.ApplicationToolbar',
            'description': '',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.AfterRoleAdd',
            'description': '新增角色后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterRoleModify',
            'description': '修改角色后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterRoleDelete',
            'description': '删除角色后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterUserAdd',
            'description': '新增用户后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterUserModify',
            'description': '修改用户后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.AfterUserDelete',
            'description': '删除用户后会调用本扩展点',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.BeforeLocalUpdate',
            'description': '',
            'uiflag': false
          },
          {
            'id': 'com.zving.platform.ApplicationWelcome',
            'description': '',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.PluginExtendPointUI',
            'description': '插件页面扩展点',
            'uiflag': true
          },
          {
            'id': 'com.zving.platform.point.AfterLogin',
            'description': '将在用户登录后调用，用于向User对象中加入数据项。',
            'uiflag': false
          }
        ]
      },
      'menus': [
        {
          'id': 'Platform.System',
          'parentID': '',
          'name': '设置',
          'children': [
            {
              'id': 'Platform.SystemInfo',
              'parentID': 'Platform.System',
              'name': '系统信息',
              'children': [],
              'url': 'info|/system/info.vue'
            },
            {
              'id': 'Platform.Branch',
              'parentID': 'Platform.System',
              'name': '组织机构',
              'children': [],
              'url': 'branch|/system/branch.vue'
            },
            {
              'id': 'Platform.Role',
              'parentID': 'Platform.System',
              'name': '角色管理',
              'children': [],
              'url': 'role|/system/role.vue'
            },
            {
              'id': 'Platform.User',
              'parentID': 'Platform.System',
              'name': '用户管理',
              'children': [],
              'url': 'user|/system/user.vue'
            },
            {
              'id': 'Platform.AccountSecurity',
              'parentID': 'Platform.System',
              'name': '账户安全',
              'children': [],
              'url': 'security|/system/security.vue'
            },
            {
              'id': 'Platform.Code',
              'parentID': 'Platform.System',
              'name': '代码管理',
              'children': [],
              'url': 'code|/system/code.vue'
            },
            {
              'id': 'Platform.Config',
              'parentID': 'Platform.System',
              'name': '配置项管理',
              'children': [],
              'url': 'config|/system/config.vue'
            },
            {
              'id': 'Platform.Metadata',
              'parentID': 'Platform.System',
              'name': '元数据管理',
              'children': [],
              'url': 'metadata|/system/metadata.vue'
            },
            {
              'id': 'Platform.Schedule',
              'parentID': 'Platform.System',
              'name': '定时任务',
              'children': [],
              'url': 'schedule|/system/schedule.vue'
            },
            {
              'id': 'Platform.Menu',
              'parentID': 'Platform.System',
              'name': '菜单管理',
              'children': [],
              'url': 'menu|/system/menu.vue'
            },
            {
              'id': 'Platform.Plugin',
              'parentID': 'Platform.System',
              'name': '插件管理',
              'children': [],
              'url': 'plugin|/system/plugin.vue'
            },
            {
              'id': 'Platform.Backup',
              'parentID': 'Platform.System',
              'name': '数据备份',
              'children': [],
              'url': 'backup|/system/backup.vue'
            },
            {
              'id': 'Platform.Log',
              'parentID': 'Platform.System',
              'name': '系统日志',
              'children': [],
              'url': 'log|/system/log.vue'
            }
          ],
          'url': '/system#/system/info|/system/index.vue'
        }
      ],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'schema',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'ZDConfig.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDPrivilege.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDDistrict.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDUserLog.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDSchedule.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMessage.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDUserOperateLog.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMaxNo.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMetaValue.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMetaModel.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDAPIToken.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDBranch.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDUserPreferences.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDPasswordRecord.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDCode.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDUserRole.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMetaColumn.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDModelTemplate.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDMetaColumnGroup.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDRole.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZDUser.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    },
                    {
                      'name': 'platform',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'lang',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.platform',
                  'type': 'directory',
                  'children': [
                    {
                      'name': '',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.platform.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'platform',
              'type': 'directory',
              'children': []
            },
            {
              'name': 'application.js',
              'type': 'file',
              'children': []
            },
            {
              'name': 'application.zhtml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'logs',
              'type': 'directory',
              'children': [
                {
                  'name': 'log.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'userLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'downSystemLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'errorLogDialog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'SQLLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'securityLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'cronLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'realTime.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'userOperateLog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'logDialog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'userOperateLogDialog.zhtml',
                  'type': 'file',
                  'children': []
                },
                {
                  'name': 'userLoginLog.zhtml',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'install.zhtml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'licenseRequest.zhtml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'userLoginEditPwdDialog.zhtml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'maximizeController.html',
              'type': 'file',
              'children': []
            },
            {
              'name': 'icons',
              'type': 'directory',
              'children': []
            },
            {
              'name': 'include',
              'type': 'directory',
              'children': []
            },
            {
              'name': 'login.zhtml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'WEB-INF',
              'type': 'directory',
              'children': [
                {
                  'name': 'plugins',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'required',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'com.zving.platform',
                          'type': 'directory',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'javascriptConfig.js',
              'type': 'file',
              'children': []
            },
            {
              'name': 'style',
              'type': 'directory',
              'children': []
            }
          ]
        },
        {
          'name': 'DB',
          'type': 'directory',
          'children': [
            {
              'name': 'Platform.zdm',
              'type': 'file',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.search',
      'name': '全文检索支持',
      'status': true,
      'version': '1.0',
      'provider': 'Zving Software',
      'author': 'Zving Software',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        },
        {
          'id': 'com.zving.compress',
          'name': '压缩文件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmsearch',
          'name': 'ECM搜索',
          'version': '1.0'
        }
      ],
      'extends': {
        'extendservices': [
          {
            'id': 'com.zving.search.service.SearchService',
            'description': '全文检索类型注册'
          },
          {
            'id': 'com.zving.search.service.AnalyzerProviderService',
            'description': ''
          }
        ],
        'extenditems': [
          {
            'id': 'com.zving.search.index.IndexTask',
            'description': ''
          },
          {
            'id': 'com.zving.search.service.SearchWordStatTask',
            'description': ''
          },
          {
            'id': 'com.zving.search.service.SearchWordCancelTopTask',
            'description': ''
          },
          {
            'id': 'com.zving.search.config.IsMaxWordLength',
            'description': ''
          },
          {
            'id': 'com.zving.search.code.DicWordType',
            'description': ''
          },
          {
            'id': 'com.zving.search.code.DicWordStatus',
            'description': ''
          },
          {
            'id': 'com.zving.search.privilege.GeneralWordPriv',
            'description': ''
          },
          {
            'id': 'com.zving.search.privilege.WeightsConfigPriv',
            'description': ''
          },
          {
            'id': 'com.zving.search.code.WeightsConfigType',
            'description': ''
          },
          {
            'id': 'com.zving.search.code.WeightsConfigRangeType',
            'description': ''
          },
          {
            'id': 'com.zving.search.config.WordImportAddr',
            'description': ''
          },
          {
            'id': 'com.zving.platform.service.ConfigService',
            'description': ''
          },
          {
            'id': 'com.zving.search.config.SingleChineseCharacterEnable',
            'description': ''
          },
          {
            'id': 'com.zving.search.config.QueryTermAndRelation',
            'description': ''
          },
          {
            'id': 'com.zving.search.config.SynonymWeight',
            'description': ''
          },
          {
            'id': 'com.zving.search.event.DicCompileEvent',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': [
          {
            'id': 'com.zving.search.AfterContentIndex',
            'description': '',
            'uiflag': false
          }
        ]
      },
      'menus': [
        {
          'id': 'Search.DicManager',
          'parentID': 'MainMenus.AdminWorkspace',
          'name': '检索词汇管理',
          'children': [],
          'url': 'search/dicManager.zhtml'
        },
        {
          'id': 'Search.WeightsConfig',
          'parentID': 'MainMenus.AdminWorkspace',
          'name': '检索权重设置',
          'children': [],
          'url': 'search/weightsConfigTabs.zhtml'
        }
      ],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'schema',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'ZCSearchWord.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZCSearchStat.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZSWeightsConfig.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZSDocQueryConfig.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZSDictionary.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    },
                    {
                      'name': 'search',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.search.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'lang',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.search',
                  'type': 'directory',
                  'children': [
                    {
                      'name': '',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'name': 'DB',
          'type': 'directory',
          'children': [
            {
              'name': 'Search.zdm',
              'type': 'file',
              'children': []
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'WEB-INF',
              'type': 'directory',
              'children': [
                {
                  'name': 'plugins',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'required',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'com.zving.search',
                          'type': 'directory',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'search',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.ecmcore',
      'name': 'ECM Core',
      'status': true,
      'version': '2.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.search',
          'name': '全文检索支持',
          'version': '1.0'
        }
      ],
      'derequiredplugins': [
        {
          'id': 'com.zving.audio',
          'name': '音频文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.compress',
          'name': '压缩文件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmsearch',
          'name': 'ECM搜索',
          'version': '1.0'
        },
        {
          'id': 'com.zving.image',
          'name': '图片文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.office',
          'name': 'Office文档插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.text',
          'name': '文本文件插件',
          'version': '1.0'
        },
        {
          'id': 'com.zving.video',
          'name': '视频文件插件',
          'version': '1.0'
        }
      ],
      'extends': {
        'extendservices': [
          {
            'id': 'com.zving.ecmcore.FileFormatService',
            'description': ''
          },
          {
            'id': 'com.zving.ecmcore.service.CatalogPrivService',
            'description': ''
          },
          {
            'id': 'com.zving.ecmcore.service.SitePrivService',
            'description': ''
          },
          {
            'id': 'com.zving.ecmcore.service.FileCategoryService',
            'description': ''
          }
        ],
        'extenditems': [
          {
            'id': 'com.zving.ecmcore.util.ECMCoreCache',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [
        {
          'id': 'ECM.Public',
          'parentID': '',
          'name': '公共库',
          'children': [],
          'url': '/library/public|/library/public.vue'
        },
        {
          'id': 'ECM.Personal',
          'parentID': '',
          'name': '个人库',
          'children': [],
          'url': '/library/personal|/library/personal.vue'
        },
        {
          'id': 'ECM.Share',
          'parentID': '',
          'name': '分享',
          'children': [],
          'url': '/share|/share/index.vue'
        },
        {
          'id': 'ECM.team',
          'parentID': '',
          'name': '团队库',
          'children': [],
          'url': '/library/team|/library/team.vue'
        },
        {
          'id': 'ECM.classified',
          'parentID': '',
          'name': '机密库',
          'children': [],
          'url': '/library/classified|/library/public.vue'
        },
        {
          'id': 'ECM.encryptionKey',
          'parentID': '',
          'name': '密钥',
          'children': [],
          'url': '/encryptionKey|/encryptionKey/index.vue'
        }
      ],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'schema',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'ZEFile.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZEExternalUser.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZECatalog.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZEFileExtend.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZEShare.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZEFileHistory.java',
                          'type': 'file',
                          'children': []
                        },
                        {
                          'name': 'ZESite.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    },
                    {
                      'name': 'ecmcore',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'lang',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.ecmcore',
                  'type': 'directory',
                  'children': [
                    {
                      'name': '',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.ecmcore.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'DB',
          'type': 'directory',
          'children': [
            {
              'name': 'ECMCore.zdm',
              'type': 'file',
              'children': []
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'ecmcore',
              'type': 'directory',
              'children': []
            },
            {
              'name': 'formats',
              'type': 'directory',
              'children': [
                {
                  'name': '',
                  'type': 'directory',
                  'children': []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.audio',
      'name': '音频文件插件',
      'status': true,
      'version': '1.0',
      'provider': 'Zving Software',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.audio.item.AudioFileCategory',
            'description': ''
          },
          {
            'id': 'com.zving.audio.item.Mp3Format',
            'description': ''
          },
          {
            'id': 'com.zving.audio.item.WmaFormat',
            'description': ''
          },
          {
            'id': 'com.zving.audio.item.WavFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'audio',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'item',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'Mp3Format.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'AudioFileCategory.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'WavFormat.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'AudioPlugin.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.audio.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'audio',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.compress',
      'name': '压缩文件',
      'status': false,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.search',
          'name': '全文检索支持',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.compress.CompressFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.compress.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'compress',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'compress',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.product',
      'name': 'Product.PluginName',
      'status': true,
      'version': '2.2.12987',
      'provider': 'Zving Software',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [
        {
          'id': 'com.zving.ecmsearch',
          'name': 'ECM搜索',
          'version': '1.0'
        }
      ],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.product.privilege.AdminWorkspacePriv',
            'description': ''
          },
          {
            'id': 'com.zving.product.privilege.DataChannelPriv',
            'description': ''
          },
          {
            'id': 'com.zving.product.privilege.ModulesPriv',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'WEB-INF',
              'type': 'directory',
              'children': [
                {
                  'name': 'plugins',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'required',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'com.zving.product',
                          'type': 'directory',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'product',
              'type': 'directory',
              'children': []
            }
          ]
        },
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.product.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'org',
              'type': 'directory',
              'children': [
                {
                  'name': '',
                  'type': 'directory',
                  'children': []
                }
              ]
            },
            {
              'name': 'lang',
              'type': 'directory',
              'children': [
                {
                  'name': 'lang.i18n',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'product',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.ecmsearch',
      'name': 'ECM搜索',
      'status': true,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.search',
          'name': '全文检索支持',
          'version': '1.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        },
        {
          'id': 'com.zving.product',
          'name': 'Product.PluginName',
          'version': '2.2.12987'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.ecmsearch.item.ECMIndexType',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [
        {
          'id': 'ECM.Search',
          'parentID': '',
          'name': '检索',
          'children': [],
          'url': '/search|/search/index.vue'
        }
      ],
      'pluginfiles': [
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'ecmsearch',
              'type': 'directory',
              'children': [
                {
                  'name': '',
                  'type': 'directory',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.ecmsearch.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            },
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'ecmsearch',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.image',
      'name': '图片文件插件',
      'status': true,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.image.item.ImageFileCategory',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.JpegFormat',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.TiffFormat',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.GifFormat',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.PngFormat',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.PsdFormat',
            'description': ''
          },
          {
            'id': 'com.zving.image.item.BmpFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'image',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'item',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'JpegFormat.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.image.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'image',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.office',
      'name': 'Office文档插件',
      'status': true,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.office.item.PDFFormat',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.WordFormat',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.ExcelFormat',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.PowerPointFormat',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.RTFFormat',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.OfficeFileCategory',
            'description': ''
          },
          {
            'id': 'com.zving.office.item.VisioFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'office',
                      'type': 'directory',
                      'children': []
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.office.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'license.xml',
              'type': 'file',
              'children': []
            },
            {
              'name': 'office',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.text',
      'name': '文本文件插件',
      'status': true,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '纯文本、HTML、XML、各种编程语言',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.text.item.TextFileCategory',
            'description': ''
          },
          {
            'id': 'com.zving.text.item.PureTextFormat',
            'description': ''
          },
          {
            'id': 'com.zving.text.item.ProgrameCodeFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'text',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'TextPlugin.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.text.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'text',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    },
    {
      'id': 'com.zving.video',
      'name': '视频文件插件',
      'status': true,
      'version': '1.0',
      'provider': '',
      'author': '',
      'description': '',
      'requiredplugins': [
        {
          'id': 'com.zving.framework',
          'name': 'Framework',
          'version': '2.0'
        },
        {
          'id': 'com.zving.platform',
          'name': '基础平台',
          'version': '2.0'
        },
        {
          'id': 'com.zving.ecmcore',
          'name': 'ECM Core',
          'version': '2.0'
        }
      ],
      'derequiredplugins': [],
      'extends': {
        'extendservices': [],
        'extenditems': [
          {
            'id': 'com.zving.video.item.VideoFileCategory',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.FlvFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.Mp4Format',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.$3gpFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.AviFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.MkvFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.MovFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.MpegFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.RmFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.RmvbFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.WmvFormat',
            'description': ''
          },
          {
            'id': 'com.zving.video.item.AsfFormat',
            'description': ''
          }
        ],
        'extendactions': [],
        'extendpoints': []
      },
      'menus': [],
      'pluginfiles': [
        {
          'name': 'JAVA',
          'type': 'directory',
          'children': [
            {
              'name': 'com',
              'type': 'directory',
              'children': [
                {
                  'name': 'zving',
                  'type': 'directory',
                  'children': [
                    {
                      'name': 'video',
                      'type': 'directory',
                      'children': [
                        {
                          'name': 'item',
                          'type': 'directory',
                          'children': [
                            {
                              'name': 'MkvFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'VideoFileCategory.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'WmvFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': '$3gpFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'Mp4Format.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'RmFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'AviFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'AsfFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'RmvbFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'MovFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'FlvFormat.java',
                              'type': 'file',
                              'children': []
                            },
                            {
                              'name': 'MpegFormat.java',
                              'type': 'file',
                              'children': []
                            }
                          ]
                        },
                        {
                          'name': 'VideoPlugin.java',
                          'type': 'file',
                          'children': []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': 'plugins',
              'type': 'directory',
              'children': [
                {
                  'name': 'com.zving.video.plugin',
                  'type': 'file',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': 'UI',
          'type': 'directory',
          'children': [
            {
              'name': 'video',
              'type': 'directory',
              'children': []
            }
          ]
        }
      ]
    }
  ],
  'status': 1,
  'message': ''
}

axiosMock.onGet('/api/plugins').reply(200, plugins)
