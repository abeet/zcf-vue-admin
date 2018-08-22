/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
UE.plugins['zimageplayer'] = function () {
  var imagerela
  var me = this, editor = this
  me.commands['zimageplayer'] = {
    execCommand: function (cmd, name) {
      var node = editor.selection.getStart()
      var relaID=node.getAttribute('imagerela')
      if(!relaID){
        return;
      }
      var url = './editorDialog.html?&resourceType=imagePlayer&catalogID=' + me.options.ID + "&ID="+relaID
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 700,
         height: 400,
         title: '选择图片播放器',
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

      // var dlgOnOk = function () {
      //   var diagWin = $DW
      //   if (diagWin.Verify.hasError()) {
      //     return false
      //   }
      //   var imagePlayerID = diagWin.DataGrid.getSelectedValue('dg1')
      //   if (isEmpty(imagePlayerID)) {
      //     Dialog.warn(editor.lang.zimage.selectplayerfirst)
      //     return false
      //   }
      //   imagerela = node.getAttribute('imagerela')
      //   var dc = { ImagePlayerID: imagePlayerID[0], ArticleID: $V('#ContentID'), Title: $V('#Title'), ImageResourceID: imagerela }
      //   Server.sendRequest('ImagePlayerCKEditor.addToImagePlayer', dc, function (response) {
      //     if (response.Status == 1) {
      //       MsgPop(response.Message)
      //     } else {
      //       Dialog.warn(response.Message)
      //     }
      //   })
      //   this.close(false)
      // }
      dialog.open()
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node && node.tagName == 'IMG' ? 0 : -1
    }
  }
}
addStyle('.edui-default  div.edui-for-zimageplayer .edui-icon{background:url("' + UEditorPath + 'icon_image-player.gif") center no-repeat;}')
