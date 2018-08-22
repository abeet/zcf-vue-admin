// 插入图片链接

UE.plugins['zimage'] = function () {
  var me=this,editor = this
  //var articleImageWhetherOriginal = $V('ArticleImageWhetherOriginal')
  //var showImageName = $V('ShowImageName')
  var MultiUpload = 'Y'// 默认支持一次上传多图
  editor.commands['zimage'] = {
    execCommand: function (cmd, name) {
      var url = './editorDialog.html' +
        '?resourceType=image&imageWidth=' +
        (me.options.resourceProps ? (me.options.resourceProps.imageWidth || 500):500) + '&imageHeight=' +
        (me.options.resourceProps ? (me.options.resourceProps.imageHeight || 500):500) + '&dataType=' + me.options.dataType
      url += '&catalogID=' + me.options.catalogID
      url += '&multiUpload=' + MultiUpload
      url += '&contentType='+me.options.dataType
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
        editor: editor,
        width: 800,
        height: 540,
        title: '选择图片',
        buttons: [
          {
            className: 'edui-cancelbutton',
            label: editor.getLang('cancel'),
            editor: editor,
            onclick: function () {
              dialog.close(false)
            }
          },
          {
            className: 'edui-okbutton',
            label: editor.getLang('ok'),
            editor: editor,
            onclick: function(){
              dialog.onok()
            }
          }
        ]
      })
      dialog.open()
    }
  }
}
// addStyle('.edui-toolbar div.edui-for-zimage .edui-icon' + '{background:url("' + UEditorPath + 'icon_image.gif") center no-repeat;}')
