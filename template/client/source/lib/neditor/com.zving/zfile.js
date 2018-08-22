
/* pluginName：自定义插件：'插入文件'
 * codeDate：2013.11.08
 * author：zhangshaoliu
*/

UE.plugins['zfile'] = function () {
  var me = this, editor = this
  me.commands['zfile'] = {
    execCommand: function (cmd, name) {
      var url = './editorDialog.html?dataType=' + me.options.dataType + '&dataID=' + me.options.ID + '&catalogID=' + me.options.catalogID + '&resourceType=file&articleFileDownloadPath=' + me.options.resourceProps.articleFileDownloadPath
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 800,
         height: 540,
         title: '插入文件',
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
          },
        ]
      })

      dialog.open()
    }
  }
}

// addStyle('.edui-toolbar div.edui-for-zfile .edui-icon' + '{background:url("' + UEditorPath + 'icon_file.gif") center no-repeat;}')
