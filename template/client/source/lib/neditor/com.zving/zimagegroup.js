
/* pluginName：自定义插件：'插入组图'
 * codeDate：2013.11.12
 * author：zhangshaoliu
*/

UE.plugins['zimagegroup'] = function () {
  var me = this, editor = this
  // 创建要插入的字符串
  var creatInsertStr = function (id, prefix, path, toCode) {
    return !toCode
      ? "<img class=\"edui-faked-imagegroup\" _id=\"" + id + "\" _prefix=\"" + prefix + "\" _path=\"" + path + "\" src=\"" + UEditorPath + "images/spacer.gif\" style=\"display:block; background:url(" + UEditorPath + "images/imagegroupholder.png) no-repeat center center; border:1px dashed #ccc; height:50px;width: 98%;margin:0 auto;\">"
      : "<span id=\"imagegroupjs_" + id + "\" _prefix=\"" + prefix + "\" _id=\"" + id + "\" _path=\"" + path + "\" ztype=\"zimagegroup\" class=\"edui-faked-imagegroup\"><script language=\"javascript\" src=\"" + path + "\"></script></span>"
  }

  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchImgAndCode = function (root, img2Code) {
    if (!root) return;
    var selectNode=root.getNodesByTagName(img2Code ? 'img' : 'span')
    UE.utils.each(selectNode, function (node) {
      if (node.getAttr('class') == 'edui-faked-imagegroup') {
        var html = creatInsertStr(node.getAttr('_id'), node.getAttr('_prefix'), node.getAttr('_path'), img2Code)
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

  me.commands['zimagegroup'] = {
    execCommand: function (cmd, name) {
      var editor = this
      var url = './editorDialog.html?&resourceType=imageGroup&catalgoID=' + me.options.catalogID + '&contentType=Image&Type=Default,Link'
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 900,
         height: 540,
         title: '组图',
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

//addStyle('.edui-toolbar div.edui-for-zimagegroup .edui-icon' + '{background:url("' + UEditorPath + 'icon_imagegroup.gif") center no-repeat;}')
