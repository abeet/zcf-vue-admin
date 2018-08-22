
/* pluginName：自定义插件：'插入批注'
 * codeDate：2013.11.13
 * author：zhangshaoliu
*/

UE.plugins['zcomment'] = function () {
  var me = this

  // 创建要插入的字符串
  var creatInsertStr = function (uName, time, toCode, description) {
    return !toCode
      ? '<span class="z-edui-comment" contenteditable="false" edui-comment="true" _uname="' + uName + '" _time="' + time + '"><span _class="description" contenteditable="true">' + description + '</span> -' + uName + time + '<i title="删除批注">×</i></span>' :
      '<cke_comment edui-comment="true" class="z-edui-comment" _uname="' + uName + '" _time="' + time + '"><span style="display:none;"><span _class="description" contenteditable="true">' + description + '</span> -' + uName + time + '<i>×</i></span></cke_comment>'
  }

  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchImgAndCode = function (root, img2Code) {
    if (!root) return;
    UE.utils.each(root.getNodesByTagName(img2Code ? 'span' : 'cke_comment'), function (node) {
      if (node.getAttr('class') == 'z-edui-comment') {
        var description
        node.traversal(function (node) {
          if (!description && node.getAttr('_class')) {
            description = node.innerHTML()||node.innerText()
          }
        })
        var html = creatInsertStr(node.getAttr('_uname'), node.getAttr('_time'), img2Code, description)
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

  me.ready(function () {
    UE.utils.cssRule('zcomment',
      '.z-edui-comment{background: url(\'' +
      UEditorPath +
      'icon_comment.gif\') no-repeat 0 center #ff0;border: 1px dotted #fc3;display: inline-block; padding-left: 18px; color:#cb9;font-weight:normal;}' +
      '.z-edui-comment span{color:#320;}' +
      '.z-edui-comment i{cursor: pointer;display:inline-block;font-size: 16px;line-height: 12px;font-weight: bold;color: #C00;padding: 2px 2px 0;}'
      , me.document)

    // 点击红叉删除当前批注
    $('span.z-edui-comment > i', me.document).click(function () {
      $(this).parent().remove()
    })
  })

  me.commands['zcomment'] = {
    execCommand: function (cmd, name) {
      var range = this.selection.getRange()
      var userName = document.getElementById('UserName') || ''
      if (userName.value) {
        userName = userName.value + ' '
      }
      var str = creatInsertStr(userName, Date.format(new Date(), 'yyyy-MM-dd  HH:mm:ss'), false, '请在此输入批注')
      me.execCommand('insertHTML', str, true)

      setTimeout(function () {
        var $selectEl = $('span.z-edui-comment > span', me.document)
        range.selectNodeContents($selectEl[$selectEl.length - 1]).select()
        // var $commentWrapEl  = $("span.z-edui-comment", me.document);
        // range.setStartAfter($commentWrapEl[$commentWrapEl.length-1]).setCursor(false,true);
      }, 200)

      // 点击红叉删除当前批注
      $('span.z-edui-comment > i', me.document).click(function () {
        $(this).parent().remove()
      })
    }
  }
}

// addStyle('.edui-toolbar div.edui-for-zcomment .edui-icon' + '{background:url("' + UEditorPath + 'icon_comment.gif") center no-repeat;}')
