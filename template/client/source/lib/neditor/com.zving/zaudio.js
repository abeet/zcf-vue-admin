
/* pluginName：自定义插件：'插入音频'
 * codeDate：2013.11.08
 * author：zhangshaoliu
*/

UE.plugins['zaudio'] = function () {
  var me = this, editor = this

  // 设计视图转为源码视图的规则
  me.addOutputRule(function (root) {
    switchRule(root, true)
  })

  // 源码视图转为设计视图的规则
  me.addInputRule(function (root) {
    switchRule(root)
  })
  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchRule = function (root, isOutput) {
    if (!root) return;
    var nodes = root.getNodesByTagName(isOutput ? 'img' : 'audio'), html = ''
    if (isOutput) {
      UE.utils.each(nodes, function (node) {
        if (node.getAttr('ztype') !== 'audio') return;

        html = '<audio src="' + node.getAttr('_url') + '" controls="controls" loop="loop" preload="load"></audio>'

        node.parentNode.replaceChild(UE.uNode.createElement(html), node)
      })
    } else {
      UE.utils.each(nodes, function (node) {

        html = '<img ztype="audio" src="' + UEditorPath + 'images/spacer.gif" _url="' + node.getAttr('src') + '"/>'

        node.parentNode.replaceChild(UE.uNode.createElement(html), node)
      })
    }
  }


  me.commands['zaudio'] = {
    execCommand: function (cmd, name) {
      var url = './editorDialog.html?dataType=' + me.options.dataType + '&dataID=' + me.options.dataID + '&catalogID=' + me.options.catalogID + '&resourceType=audio&Suffix=' + me.options.allowAudioType
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
        editor: editor,
        iframeUrl: url,
         width: 800,
         height: 540,
         title: '插入音频',
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
