
/* pluginName：自定义插件：'插入广告'
 * codeDate：2013.12.16
 * author：fanmy
*/

UE.plugins['zatverdise'] = function () {
  var me = this
  var fullContextPath = Zving.CONTEXTPATH
  // 创建要插入的字符串
  var creatInsertStr = function (atverdiseJsId, prefix, jsPath, jsonPath, toCode) {
    return !toCode
      ? '<img class="edui-faked-ap" ' +
      '_id="' + atverdiseJsId +
      '" _prefix="' + prefix +
      '" _jspath="' + jsPath +
      '" _jsonpath="' + jsonPath +
      '" src="' + UEditorPath + 'images/spacer.gif" style="display:block; background:url(' + UEditorPath + 'images/advholder.png) no-repeat center center; border:1px dashed #ccc; height:50px;width: 98%;margin:0 auto;" />'
      : '<span id="apjs_' + atverdiseJsId + '" jspath="' + jsPath + '" prefix="' + prefix + '" jsonpath="' + jsonPath + '" _id="' + atverdiseJsId + '" class="edui-faked-ap"><script language="javascript" src="' + jsPath + '"></script></span>'
  }

  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchAdvAndCode = function (root, adv2Code) {
    if (!root) return;
    UE.utils.each(root.getNodesByTagName(adv2Code ? 'img' : 'span'), function (node) {
      if (node.getAttr('class') == 'edui-faked-ap') {
        var html = creatInsertStr(
          node.getAttr('_id'),
          adv2Code ? node.getAttr('_prefix') : node.getAttr('prefix'),
          adv2Code ? node.getAttr('_jspath') : node.getAttr('jspath'),
          adv2Code ? node.getAttr('_jsonpath') : node.getAttr('jsonpath'),
          adv2Code)
        node.parentNode.replaceChild(UE.uNode.createElement(html), node)
      }
    })
  }

  // 设计视图转为源码视图的规则
  me.addOutputRule(function (root) {
    switchAdvAndCode(root, true)
  })

  // 源码视图转为设计视图的规则
  me.addInputRule(function (root) {
    switchAdvAndCode(root)
  })

  me.commands['zatverdise'] = {
    execCommand: function (cmd, name) {
      var editor = this
      var url = './editorDialog.html?resourceType=adtSelect'
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
         width: 700,
         height: 400,
         title: '插入广告',
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

// addStyle('.edui-toolbar div.edui-for-zatverdise .edui-icon' + '{background:url("' + UEditorPath + 'icon_ap.png") center no-repeat;}')
