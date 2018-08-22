/**
 * 设置编辑器图片为文章引导图
 * @author lwy@zving.com
 */
UE.plugins['articlelogo'] = function(){
	var me=this, editor = this
    me.commands['articlelogo'] = {
        execCommand : function(cmd,name) {
          var node = editor.selection.getStart();
          var imagerela=node.getAttribute("imagerela")
          if(!imagerela) {
            return;
          }
          var src = node.getAttribute("src");
          // src = Url.parseUrl(src).pathname;
          var fileName = src.substring(src.lastIndexOf("/") + 1);
          if(fileName.indexOf("_") > -1) {
            fileName = fileName.substring(0, fileName.lastIndexOf("_")) + fileName.substring(fileName.lastIndexOf("."));
          }
          if(fileName.indexOf("?") > -1) {
            fileName = fileName.substring(0, fileName.indexOf("?"));
          }
          src = src.substring(0, src.lastIndexOf("/") + 1) + fileName;

          if(document.getElementById('logoSrc')) {
            document.getElementById('logoSrc').setAttribute('src', src);
          }
          if(src.startsWith(document.getElementById("previewPrefix"))) {
            src = src.substring(document.getElementById("previewPrefix").length);
          }
          var pre = "preview";
          if(src.indexOf(pre)>-1){
            src = src.substring(src.indexOf(pre)+pre.length+1);
            src = src.substring(src.indexOf("/")+1);
          }
          me.options.logoFile=src
          editor.fireEvent("changeOptions");
          // document.getElementById('logoFile').value = src; //网络图片
          // document.getElementById('logoFileRelaID').value = node.getAttribute("imagerela");
        },
        // queryCommandState : function(){
        // 	var node = editor.selection.getStart();
        //     return !this.highlight && node && node.tagName == 'IMG'&& !/^http/gi.test(node.getAttribute('_src')) ?  0 : -1;
        // }
    };
};
addStyle('.edui-default  div.edui-for-setlogo .edui-icon{background:url("'+CONTEXTPATH+'image-logo.gif") center no-repeat;}')
// addStyle('.edui-default  div.edui-for-zimageplayer .edui-icon{background:url("' + UEditorPath + 'icon_image-player.png") center no-repeat;}')
