/* pluginName：自定义插件：'插入微博直播'
 * codeDate：2013.12.13
 * author：fanmy
*/
UE.plugins['zweiboshow'] = function () {
  var me = this,
    editor = this
  me.commands['zweiboshow'] = {
    execCommand: function (cmd, name) {
      var url =  './editorDialog.html?resourceType=sinaWeibo&currentID=' +
      editor.options.ID + '&catalogID=' + editor.options.catalogID
      var contentid = editor.options.ID
      var _url
      var _height
      var _width
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 960,
         height: 460,
         title: '插入微博直播',
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
        var currentEditor = editor
        var dialogWin = $DW
        var html = '<iframe name="weibo_{ContentID}" style="display: {Display};" frameborder="0" scrolling="no" src="{Src}" width="{Width}" height="{Height}"></iframe>'
        dialogWin.save(function (content) {
          var sjson = content
          if (isEmpty(sjson)) {
            _url = 'http://widget.weibo.com/livestream/listlive.php'
            _width = 280
            _height = 500
          } else {
            var language = sjson.language
            var width = sjson.width
            var framewidth = sjson.framewidth
            var height = sjson.height
            var uid = sjson.uid
            var skin = sjson.skin
            var refer = sjson.refer
            var appkey = sjson.appkey
            var pic = sjson.pic
            var titlebar = sjson.titlebar
            var border = sjson.border
            var _publish = sjson._publish
            var ptopic = sjson.ptopic
            var atalk = sjson.atalk
            var atopic = sjson.atopic
            var dpc = sjson.dpc

            _url = 'http://widget.weibo.com/livestream/listlive.php?language=' + language + '&width=' + width + '&height=' +
              height + '&uid=' + uid + '&skin=' + skin + '&refer=' + refer + '&appkey=' + appkey + '&pic=' + pic + '&titlebar=' + titlebar +
              '&border=' + border + '&publish=' + _publish + '&ptopic=' + ptopic + '&atalk=' + atalk + '&atopic=' + atopic + '&dpc=' + dpc + '&recomm=0&at=0'
            _width = framewidth
            _height = height
          }
          currentEditor.execCommand('insertHTML', html.tmpl({
            ContentID: contentid,
            Display: 'block',
            Src: _url,
            Width: _width,
            Height: _height
          }))
        })
        this.close(false)
      }
      dialog.open()
    }
  }
}
// addStyle('.edui-toolbar div.edui-for-zweiboshow .edui-icon' + '{background:url("' + UEditorPath + 'icon_weibo.png") center no-repeat;}')
