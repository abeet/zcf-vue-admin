
/* pluginName：自定义插件：'插入栏目链接'
 * codeDate：2013.11.11
 * author：zhangshaoliu
*/

UE.plugins['zcatalog'] = function () {
  var editor = this;//UE.Editor
  editor.commands['zcatalog'] = {
    execCommand: function () {
      var url =  "./editorDialog.html?resourceType=catalogSelect";
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
        editor: editor,
        iframeUrl: url
        , width: 350
        , height: 400
        , title: '选择栏目',
        buttons: [
          {
            className: "edui-cancelbutton",
            label: editor.getLang("cancel"),
            editor: editor,
            onclick: function () {
              dialog.close(false);
            }
          },
          {
            className: "edui-okbutton",
            label: editor.getLang("ok"),
            editor: editor,
            onclick: function(){
              dialog.onok()
            }
          },
        ]
      });
      dialog.open();
    }
  };
};

// addStyle('.edui-toolbar div.edui-for-zcatalog .edui-icon' + '{background:url("' + UEditorPath + 'icon_catalog.gif") center no-repeat;}');

