
/* pluginName：自定义插件：'插入批注'
 * codeDate：2018.05.07
 * author：xujunhao
*/

UE.plugins['insertpostil'] = function () {
  var me = this
  // 创建要插入的字符串
  var creatInsertStr = function (uName, selection, toCode, description) {
    let range = selection.getRange()
    let wholeContent = range.document.body.innerHTML
    let index  = Math.round(Math.random()*999999)
    let dfg = range.cloneContents()
    let insertContent = ''
    if(dfg){
      let tmpDiv = document.createElement("div")
      tmpDiv.appendChild(dfg)
      insertContent =  tmpDiv.innerHTML
      range.select()

    }
    if((insertContent.indexOf('<span class="art-postil') === 0)){
      alert('所选内容已包含部分批注！')
      return ''
      // insertContent = insertContent.substring(insertContent.indexOf('>')+1)
    }
    return '<span class="art-postil art-postil-'+index+'">'+insertContent+'</span>'
  }

  // 代码视图和设计视图切换时进行相应元素节点的替换
  var switchImgAndCode = function (root, img2Code) {
    if (!root) return;
    UE.utils.each(root.getNodesByTagName(img2Code ? 'span' : 'cke_postil'), function (node) {
      if (node.getAttr('class') == 'z-edui-postil') {
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
    UE.utils.cssRule('insertpostil',
    '.art-postil{border-bottom:1px dashed red;}'+
    '.art-postil.selected{background-color: red;border: 1px solid red;}'+
    '.art-postil .hidden{display:none;}'
    , me.document)
  })

  me.commands['insertpostil'] = {
    execCommand: function (cmd, name) {
      var selection = this.selection
      var userName = document.getElementById('UserName') || ''
      if (userName.value) {
        userName = userName.value + ' '
      }
      var str = creatInsertStr(userName, selection)
      me.execCommand('insertHTML', str, true)
    }
  }
}

// addStyle('.edui-toolbar div.edui-for-insertpostil .edui-icon' + '{background:url("' + UEditorPath + 'icon_postil.gif") center no-repeat;}')
