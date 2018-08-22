/**
 * pluginName：自定义插件：控制内容显示模式（横排或竖排）
 * @codeDate：2014.3.21
 * @author：lzc
 */
UE.plugins['zwritingmode'] = function () {
  // console.log( UEditorPath + 'icon_tbrl.png','xxxxx')
  var me = this, editor = this

  // var prefix='writing-mode-';
  // 编辑器默认排版模式（横排或竖排）
  me.writingMode = UEDITOR_CONFIG.writingMode || 'lrtb'// 当前模式

  me.commands['zwritingmode'] = {
    execCommand: function () {
      if (me.writingMode == 'tbrl') {
        // 切换到横排模式

        editor.autoHeightEnabled = true
        editor.setContent(editor.getContent().replace(/<div[^>]+writing-mode-controller[^>]+>\s*<div[^>]+>/, '').replace(/<\/div>\s*<\/div>/, ''))
        me.writingMode = 'lrtb'
        me.body.setAttribute('contenteditable', 'true')
      } else {
        // 横排切换到竖排

        editor.autoHeightEnabled = false
        editor.setContent('<div class="writing-mode-controller writing-mode-tbrl" contenteditable="true"><div class="writing-mode-paddingWrapper">' + editor.getContent() + '</div></div>')
        me.writingMode = 'tbrl'
        me.body.removeAttribute('contenteditable')
      }

      fixHeight()
    },
    queryCommandState: function () {
      let className=editor.body&&editor.body.firstChild&&editor.body.firstChild.className?editor.body.firstChild.className:''
      if (/writing-mode-controller/i.test(className)) {
        me.writingMode = 'tbrl'
      }
      return me.writingMode == 'tbrl' ? 1 : 0
    }
  }

  me.addInputRule(function (root) { // 添加排版模式控制器（横向或竖向）
    if (!root) return;
    if (me.writingMode == 'tbrl') {
      root.traversal(function (node) {
        var className = node ? (node.getAttr('class') || '') : ''
        if (/writing-mode-controller/i.test(className)) {
          controller = node
        }
      })
      controller.setAttr('contenteditable', 'true')
    }
  })

  me.addOutputRule(function (root) {
    if (!root) return;
    var paddingWrapper
    if (me.writingMode == 'tbrl') {
      root.traversal(function (node) {
        var className = node ? (node.getAttr('class') || '') : ''
        if (/writing-mode-controller/i.test(className)) {
          controller = node
        }
      })
      controller.setAttr('contenteditable', 'false')
    }
  })

  var getWritingMode = function () {
    return me.writingMode
  }

  var autoHeightEnabledBak
  var fixHeight = function () {
    let queryCommandState=editor.body&&editor.body.firstChild&&editor.body.firstChild.className?editor.body.firstChild.className:''
    if (/writing-mode-controller/i.test(queryCommandState)) {
      me.writingMode = 'tbrl'
    }
    // 竖排时不调整高度，且把页面高度调为100%编辑区高度，以避免出现垂直滚动条
    if (me.writingMode == 'tbrl') {
      autoHeightEnabledBak = me.autoHeightEnabled// 备份
      me.disableAutoHeight()
      // var nodeList=Array.prototype.slice.call(editor.document.getElementsByTagName('*'),0);
      var nodeList = UE.dom.domUtils.getElementsByTagName(editor.document, '*')
      // className中包含view的元素高度设为100%；因为在.view定义了样式90%,以实现自动调整高度
      UE.dom.domUtils.filterNodeList(nodeList, function (node) {
        if (UE.dom.domUtils.hasClass(node, 'view')) {
          // 添加样式覆盖，这个地方如果直接设置style.height不太好，这会导致切换到横排时，view中的高度无效，还得
          // 通过style.height过来，而这样此处的代码就和.view样式的定义耦合太紧
          UE.dom.domUtils.addClass(node, 'writing-mode-vertical')
          UE.dom.domUtils.removeClasses(node, 'writing-mode-horizontal')
          me.body.setAttribute('contenteditable', 'false')
          me.body.firstChild.setAttribute('contenteditable', 'true')
          return true
        };
      }, true)
      editor.document.documentElement.style.height = '100%'
    } else {
      // $(editor.window.frameElement).attr('scrolling','no');
      // var frameSizeController=editor.window.frameElement.parentNode;
      // var heightFix=parseInt(this.body.style.marginTop||0)+parseInt(this.body.style.marginBottom||0);

      var nodeList = UE.dom.domUtils.getElementsByTagName(editor.document, '*')
      UE.dom.domUtils.filterNodeList(nodeList, function (node) {
        if (UE.dom.domUtils.hasClass(node, 'view')) {
          UE.dom.domUtils.removeClasses(node, 'writing-mode-vertical')
          UE.dom.domUtils.addClass(node, 'writing-mode-horizontal')
          me.body.setAttribute('contenteditable', 'true')
          return true
        };
      }, true)

      me.setHeight(editor.body.scrollHeight, true)
      editor.document.documentElement.style.height = '90%'
      if (autoHeightEnabledBak) {
        editor.enableAutoHeight()
      }
    }
  }
  // 由于插件的queryCommandState方法的调用在编辑器获取到焦点后，须在初始化时调整高度，否则横排时会出现多余滚动条
  // if(me.writingMode=='tbrl'){
  me.ready(fixHeight)
  // }
}

addStyle('.edui-toolbar div.edui-for-zwritingmode .edui-icon {background:url("' + UEditorPath + 'icon_tbrl.png") center no-repeat;}')
