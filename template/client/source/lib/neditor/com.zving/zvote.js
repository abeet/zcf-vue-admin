
/* pluginName：自定义插件：'插入调查'
 * codeDate：2013.11.12
 * author：zhangshaoliu
*/

UE.plugins['zvote'] = function () {
  var me = this, editor = this
  var fullContextPath = Zving.CONTEXTPATH
  if (!/^\w+:\/\//.test(Zving.CONTEXTPATH)) { // 如果地址没有带协议及主机，要加上
    fullContextPath = location.protocol + '//' + location.host + Zving.CONTEXTPATH
  }
  // 创建要插入的字符串
  var creatInsertStr = function (voteJsId, path, toCode) {

    var previewPath = "";
    if(path){
      previewPath = path.substring(0,path.indexOf('upload/vote'))
    }
    return !toCode
      ? '<img class="edui-faked-vote" _id="' + voteJsId + '" _jsonpath="' + path + '" src="' + UEditorPath + 'images/spacer.gif" style="display:block; background:url(' + UEditorPath + 'images/voteholder.png) no-repeat center center; border:1px dashed #ccc; height:50px;width: 98%;margin:0 auto;' + '" />'
      :      '<span id="votejs_' + voteJsId + '" _jsonpath="' + path + '" _id="' + voteJsId + '" ztype="zvote" class="edui-faked-vote"><script language="javascript" data="' + path + '" src="'+previewPath+'js/voteFront.js"></script></span>'
  }
  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchImgAndCode = function (root, img2Code) {
    if (!root) return;
    UE.utils.each(root.getNodesByTagName(img2Code ? 'img' : 'span'), function (node) {
      if (node.getAttr('class') == 'edui-faked-vote') {
        var html = creatInsertStr(node.getAttr('_id'), node.getAttr('_jsonpath'), img2Code)
        node.parentNode.replaceChild(UE.uNode.createElement(html), node)
      }
    })
  }

  // 设计视图转为源码视图的规则
  me.addOutputRule(function (root) {
    switchImgAndCode(root, true)
  })

  // 源码视图转为设计视图的规则
  me.addInputRule(function (root) {
    switchImgAndCode(root)
  })

  me.commands['zvote'] = {
    execCommand: function (cmd, name) {
      var url = './editorDialog.html?resourceType=voteSelect'
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 700,
         height: 400,
         title: '调查',
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

// addStyle('.edui-toolbar div.edui-for-zvote .edui-icon' + '{background:url("' + UEditorPath + 'icon_vote.gif") center no-repeat;}')
