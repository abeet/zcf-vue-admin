/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
 */
UE.plugins['zimgcutting'] = function () {
  var me = this, editor = this
  me.commands['zimgcutting'] = {
    execCommand: async function (cmd, name) {
      var node = editor.selection.getStart()
      var imagerela = node.getAttribute('imagerela')
      var path = node.getAttribute('src')
      var resp=await axios.get(`/api/catalogresources/${imagerela}/resourcepath`)
      resp=resp.data
      var resourceSiteID = resp.data.resourceSiteID
      var Dialog = baidu.editor.ui.Dialog
      if (resourceSiteID != me.options.siteID) {
        var error = new Dialog({
          editor: editor,
          iframeUrl: '',
          width: 800,
          height: 540,
          cssRules:"width:600px;height:300px;",
          content:'不能编辑父站点的资源',
          title: '发生错误'
        })
        error.open()
        return
      }

      var url = './editorDialog.html?&resourceType=imgcutting&catalogID=' + resourceSiteID+ "&contentType="+path
      var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
        width: 800,
        height: 540,
        title: '图片裁剪',
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
    },
  }
}
addStyle('.edui-default  div.edui-for-zimgcutting .edui-icon{background:url("' + UEditorPath + 'icon_image-crop.png") center no-repeat;}')
