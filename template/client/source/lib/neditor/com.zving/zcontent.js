
/* pluginName：自定义插件：'插入文章链接'
 * codeDate：2013.11.06
 * author：zhangshaoliu
*/
UE.plugins['zcontent'] = function () {
  var editor = this
  editor.commands['zcontent'] = {
    execCommand: function () {
      var url =  './editorDialog.html?resourceType=contentSelect&currentID=' +
        editor.options.ID + '&catalogID=' + editor.options.catalogID

      var Dialog = baidu.editor.ui.Dialog

      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 1260,
         height: 540,
         title: '选择内容',
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

      var dlgOnOk = function () {
        var arr = $DW.$N('SelectedID'),
          title, url, html = ''
        for (var i = 0; arr && i < arr.length; i++) {
          if (arr[i].checked) {
            title = arr[i].getAttribute('title')
            url = arr[i].getAttribute('link')
            html += '<p><a href="' + url + '" articlerela="' + arr[i].value + '" target="_blank">' + title + '</a></p>'
          }
        }
        editor.execCommand('insertHTML', html)
        dialog.close()
      }
      dialog.open()
    }
  }
}
// addStyle('.edui-toolbar div.edui-for-zcontent .edui-icon{background:url("' + UEditorPath + 'icon_content.gif") center no-repeat;} .top-dialog')
