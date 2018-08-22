/* global Zving UE $ baidu */
/**
 * @description 粘贴包含图片的Word数据
 * @author wangzhaohui
 */
UE.plugins['zuploadlocalimage'] = function () {
  var me = this
  var clipData
  var confirmDialog
  var Dialog = baidu.editor.ui.Dialog
  // var Message = baidu.editor.ui.Message

  var localServerUrl = 'http://127.0.0.1:10808/'
  var uploadActionUrl = ''
  var userTokenUrl = Zving.CONTEXTPATH + 'api/catalogresources/getusertoken'
  var token
  function uploadLocalImage (evt, data) {
    uploadActionUrl = Zving.CONTEXTPATH + 'api/catalogresources/' + me.options.catalogID + '/uploadfromclient?token=' + token + '&siteID=' + me.options.siteID + '&addUser=' + window.localStorage.userName
    if (!/^\w+:\/\//.test(Zving.CONTEXTPATH)) { // 如果地址没有带协议及主机，要加上
      uploadActionUrl = window.location.protocol + '//' + window.location.host + uploadActionUrl
    }
    var htmlData = data ? data.html : me.getContent()
    if (!/<img[^>]+?src=['"]?file:[^>]+?['"]|<v:imagedata[^>]+?src=['"]?file:[^>]+?['"]/img.test(htmlData)) {
      return
    }
    var installPluginDialog = new Dialog({
      editor: me,
      name: 'installplugindialog',
      cssRules: 'width:400px;height:100px;padding: 2em;',
      content: '检测到您粘贴的内容含有本地图片，上传本地图片需要安装插件，请<a href="./assets/ZvingTools.zip" style="text-decoration:underline;color:blue;">下载浏览器插件</a>并安装。',
      title: ''
    })

    $.ajax({
      url: localServerUrl,
      crossDomain: true, // 允许跨域
      xhrFields: {
        withCredentials: true // 允许携带证书
      }
    }).then(function (res) {
      if (!res || !res.status) {
        installPluginDialog.open()
        return
      }
      if (!confirmDialog || confirmDialog.hidden === true || confirmDialog.isDestroyed === true) {
        confirmDialog = new Dialog({
          editor: me,
          title: '',
          name: 'uploadlocalimageconfirm',
          cssRules: 'width:400px;height:100px;padding: 2em;',
          icon: 'icon_query',
          content: '检测到您粘贴的内容含有本地图片，是否上传本地图片？',
          buttons: [
            {
              className: 'edui-cancelbutton',
              label: '取消',
              editor: me,
              onclick: function () {
                confirmDialog.close()
              }
            },
            {
              className: 'edui-okbutton',
              label: '自动上传图片',
              editor: me,
              onclick: function () {
                replaceImagesList = getLocalImagesInEditor(data)
                var filesLength = 0
                var uploadProgressDialog
                for (var k in replaceImagesList) {
                  filesLength++
                }
                if (filesLength > 2) {
                  uploadProgressDialog = new Dialog({
                    editor: me,
                    name: 'uploadlocalimagetips',
                    cssRules: 'width:200px;height:100px;',
                    content: '图片上传中，请稍候...',
                    title: ''
                  })
                  uploadProgressDialog.open()
                }
                var uploadedFilesLength = 0
                setTimeout(function () {
                  for (var k in replaceImagesList) {
                    uploadFileLocalServer(replaceImagesList[k].localPath, replaceImagesList[k].oldTag, k)
                    ++uploadedFilesLength
                    if (uploadProgressDialog) {
                      uploadProgressDialog.content = '图片上传中，请稍候... ' + uploadedFilesLength + '/' + filesLength
                      uploadProgressDialog.reset()
                    }
                  }
                  if (uploadedFilesLength === filesLength) {
                    uploadProgressDialog && uploadProgressDialog.close()
                    confirmDialog.close()
                  }
                }, 1)
              }
            }
          ]
        })
      }
      confirmDialog.open()
    }, function (res) {
      installPluginDialog.open()
    })
  }
  var replaceImagesList = {}
  function getLocalImagesInEditor (data) {
    var htmlData = data ? data.html : me.getContent()
    // console.log('getLocalImagesInEditor ',htmlData)
    var localImagesList = {}
    var reImgTag = /<img[^>]+?src=['"]?file:(.+?)['"]?[^>]+?>|<v:imagedata[^>]+?src=['"]?file:([^>]+?)['"]?[^>]+?>/img
    var rePath = /\ssrc=(['"]?)file:\/\/\/(.+?)(\1)(\s[\/\w]|\/?>)/i
    var reWidth = /\swidth=(['"]?)(.+?)(\1)(\s[\/\w]|\/?>)/i
    var reHeight = /\sheight=(['"]?)(.+?)(\1)(\s[\/\w]|\/?>)/i
    var res = htmlData.match(reImgTag)
    if (res) {
      for (var i = 0; i < res.length; i++) {
        var oldTag = res[i]
        var matchPath = rePath.exec(oldTag)
        var matchW = reWidth.exec(oldTag)
        var matchH = reHeight.exec(oldTag)
        if (matchPath && matchPath[2]) {
          var isrc = matchPath[2]
          var imgFilePath = isrc.replace(/\//g, '\\')
          var key = imgFilePath.replace(/\W/g, '_')
          if (localImagesList[key] === undefined) { // 用一个列表来存要被替换的Tag字符串
            localImagesList[key] = {}
            localImagesList[key].oldTag = oldTag
            localImagesList[key].localPath = imgFilePath
            localImagesList[key].localFileName = imgFilePath.substring(imgFilePath.lastIndexOf('\\') + 1)
            // 上传完图片宽高可能改变，由图片本身宽度来呈现
            if (matchW && matchW[2]) {
              localImagesList[key].width = matchW[2]
            }
            if (matchH && matchH[2]) {
              localImagesList[key].height = matchH[2]
            }
          }
        }
      }
    }
    return localImagesList
  }
  function replaceImgTags (replaceList, clipData) {
    var htmlData = clipData ? clipData.html : me.getContent()
    if (!htmlData || htmlData.indexOf('file://') === -1) {
      return
    }
    for (var k in replaceList) {
      var opt = replaceList[k]
      // console.log(opt.oldTag,opt.newTag);
      if (opt.uploaded === false) {
        continue
      }
      while (htmlData.indexOf(opt.oldTag) !== -1) {
        htmlData = htmlData.replace(opt.oldTag, '<p align="center">' + opt.newTag + '</p>')
      }
    }
    // console.log('replaceImgTags ',htmlData);
    if (clipData) {
      clipData.html = htmlData
    } else {
      me.setContent(htmlData)
    }
  }

  function uploadFileLocalServer (localFile, oldTag, id) {
    var formData = {
      action: 'localupload',
      param1: localFile,
      sendUrl: uploadActionUrl,
      localSize: 1024,
      localExt: 'gif,jpg,bmp,svg,png'
      // cookie: document.cookie 使用token验证身份，不再用cookie
    }
    // 注意下面声明json和json数据的设置，否则会有错误 415 (Unsupported Media Type)
    $.ajax({
      url: localServerUrl + 'localupload',
      type: 'POST',
      contentType: 'application/json',
      crossDomain: true, // 允许跨域
      xhrFields: {
        withCredentials: true // 允许携带证书
      },
      data: JSON.stringify(formData)
    }).then(function (res) {
      // console.log('图片上传完成 ', res)
      replaceImgLocalServer(id, res)
    }, function (res) {
      console.error('上传图片 ' + localFile + ' 到服务器失败！')
    })
  }

  function replaceImgLocalServer (id, data) {
    if (!data.resourceID) {
      console.error('上传图片 ' + replaceImagesList[id].localFileName + ' 到服务器失败', data)
      return
    }
    var imgTag = ''
    var options = replaceImagesList[id]
    var previewPrefix = data.previewPrefix
    if (data.sPath.indexOf('/preview/') !== -1) {
      previewPrefix = data.sPath.substring(0, data.sPath.indexOf('/preview/')) + data.previewPrefix.substring(data.previewPrefix.indexOf('/preview/'))
    }
    if (data.path) {
      imgTag = '<a href="' + previewPrefix + data.path + '" target="_blank">'
      imgTag += '<img src="' + previewPrefix + data.resourcePath + '" imagerela="' + data.resourceID + '"'
      // if (options.width) {
      //   imgTag += ' width="' + options.width + '"'
      // }
      // if (options.height) {
      //   imgTag += ' height="' + options.height + '"'
      // }
      imgTag += ' border="0"></a>'
    } else {
      imgTag = '<img src="' + previewPrefix + data.resourcePath + '" imagerela="' + data.resourceID + '"'
      imgTag += ' border="0">'
    }
    options.uploaded = true
    options.newTag = imgTag
    // console.log(options.oldTag,' -> ',imgTag)
    isAllImagesUploadedLocalServer()
  }
  function isAllImagesUploadedLocalServer () {
    for (var k in replaceImagesList) {
      var opt = replaceImagesList[k]
      if (opt.uploaded === undefined) {
        return
      }
    }
    replaceImgTags(replaceImagesList)
  }

  me.addListener('afterpaste', function (evt) {
    if (!token) {
      $.ajax({
        url: userTokenUrl,
        contentType: 'application/json',
        crossDomain: true, // 允许跨域
        xhrFields: {
          withCredentials: true // 允许携带证书
        },
        success: function (res) {
          if (res.status === 0) {
            console.error(res.message)
          } else {
            token = res.message
            uploadLocalImage()
          }
        }
      })
    } else {
      uploadLocalImage()
    }
  })
}
