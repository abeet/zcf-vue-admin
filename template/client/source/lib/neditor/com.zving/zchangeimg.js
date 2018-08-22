/**
 *修改图片
 @Params
 	editor:编辑器对象
 	model:1为更换图片,2为更换背景图片
 **/
var replaceImg = function(editor,model){
  var node = editor.selection.getStart();
  // console.log(node,'node')
  var url = './editorDialog.html' +
      '?resourceType=image&imageWidth=' +
      (editor.options.resourceProps.imageWidth || 500) + '&imageHeight=' +
      (editor.options.resourceProps.imageHeight || 500) + '&dataType=' + editor.options.dataType
      url += '&catalogID=' + editor.options.catalogID
      url += '&multiUpload=N'
      url += '&contentType=change'
      url += '&node='+node
      var Dialog = baidu.editor.ui.Dialog
			var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
        width: 800,
        height: 450,
        title: model==1?"更换图片":"更换背景图片",
        buttons: [
          {
            className: "edui-cancelbutton",
            label: editor.getLang("cancel"),
            editor: editor,
            onclick: function() {
              dialog.close(false);
            }
          },
          {
            className: "edui-okbutton",
            label: editor.getLang("ok"),
            editor: editor,
            onclick: function(){
              UE.dom.domUtils.remove(node,true)
              dialog.onok()
            }
          },
        ]
      });
			dialog.open();
}
UE.plugins['replaceimg'] = function(){
	var me = this,editor = this;
    me.commands['replaceimg'] = {
      execCommand : function() {
        replaceImg(editor,1);
      }
    };
};
addStyle('.edui-default  div.edui-for-replaceimg .edui-icon{background:url("'+UEditorPath+'mobilecontenteditor/images/image-replace.png") center no-repeat;}');
