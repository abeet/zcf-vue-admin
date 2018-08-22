
/* pluginName：自定义插件：'文字纠错'
 * codeDate：2013.11.07
 * author：zhangshaoliu
*/

(function () {
  // 载入外部错别字数据
  importJS(Zving.CONTEXTPATH + '/api/wrongwords/dic')

  var parseHtmlArr = [] // 把字符串按正则进行拆分为普通字符串及html标签两种类型

  function isArray (v) {
    return !!v && Object.prototype.toString.apply(v) === '[object Array]'
  }

  // 把字符串按正则进行拆分为普通字符串及html标签两种类型

  function parseHtml (str) {
    var arr
    arr = splitArray([str], /<!--[\s\S]*?-->/img, /^<!--/)
    arr = splitArray(arr, /<script[^>]*>[\s\S]*?<\/script[^>]*>/img, /^<script/i)
    arr = splitArray(arr, /<style[^>]*>[\s\S]*?<\/style[^>]*>/img, /^<style/i)
    arr = splitArray(arr, /<\/?\w[^>]*>/img)
    return arr
  }
  // 对数组里可继续拆分的项按特定的正则进行拆分

  function splitArray (strArray, splitRe, beginRe) {
    for (var i = strArray.length - 1; i >= 0; i--) {
      var item = strArray[i]
      if (item) {
        if (typeof item === 'string') {
          var item2arr = splitString(item, splitRe)
          for (var j = item2arr.length - 1; j >= 0; j--) {
            item2arr[j] = item2arr[j].trim()
            if (!item2arr[j]) {
              item2arr.splice(j, 1)
            }
          }
          item2arr = markTag(item2arr, beginRe)
          Array.prototype.splice.apply(strArray, [i, 1].concat(item2arr))
        }
      } else {
        strArray.splice(i, 1)
      }
    }
    return strArray
  }
  // 字符串特定的正则进行拆分

  function splitString (str, splitRe) {
    var resultArray = []
    var match = str.match(splitRe)
    var index = 0
    if (match) {
      for (var i = 0; i < match.length; i++) {
        var matchStr = match[i]
        var matchIndex = str.indexOf(matchStr)
        resultArray.push(str.substring(0, matchIndex).trim())
        resultArray.push(matchStr)
        index = matchIndex + matchStr.length
        str = str.substring(index)
      }
      resultArray.push(str)
    } else {
      resultArray = [str]
    }
    return resultArray
  }
  // 把拆分开的数组项标记是否不再需要拆分

  function markTag (arr, beginRe) {
    for (var i = arr.length - 1; i >= 0; i--) {
      var item = arr[i]
      if (item) {
        if (beginRe && beginRe.test(item) || !beginRe && item.indexOf('<') === 0) {
          arr[i] = {
            tag: true,
            html: item
          }
        }
      } else {
        arr.splice(i, 1)
      }
    }
    return arr
  }
  // 在已经拆分html标签的数组里，查找有没有错词，并返回错词列表（键值对格式）

  function findWordInArray (preArr, wrongWords) {
    var str = preArr.join('|ZVING|')
    var finedWrongWords = []
    for (var i = 0, l = wrongWords.length; i < l; i++) {
      if (str.indexOf(wrongWords[i][0]) != -1) {
        finedWrongWords.push(wrongWords[i])
      }
    }
    return finedWrongWords
  }

  function replaceWordInArray (preArr, finedWords) {
    var str = preArr.join('|ZVING|')
    for (var i = 0, l = finedWords.length; i < l; i++) {
      var reg = new RegExp(finedWords[i][0], 'ig')
      str = str.replace(reg, finedWords[i][1])
    }
    var replacedArr = str.split('|ZVING|')
    for (var i = 0, l = preArr.length; i < l; i++) {
      if (replacedArr[i] == '[object Object]') {
        replacedArr[i] = preArr[i].html
      }
    }
    return replacedArr
  }

  function makeWordInArray (preArr, finedWords) {
    var str = preArr.join('|ZVING|')
    for (var i = 0, l = finedWords.length; i < l; i++) {
      var reg = new RegExp(finedWords[i][0], 'ig')
      str = str.replace(reg, '<span class="edui-faked-checkword" style="background: #ffc; color: #600; border-bottom: #f33 1px dotted;">' + finedWords[i][0] + '</span>')
    }
    var replacedArr = str.split('|ZVING|')
    for (var i = 0, l = preArr.length; i < l; i++) {
      if (replacedArr[i] == '[object Object]') {
        replacedArr[i] = preArr[i].html
      }
    }
    return replacedArr
  }

  UE.plugins['zcheckwords'] = function () {
    var me = this,editor = this

    // 源码视图转为设计视图的规则
    me.addInputRule(function (root) {
      if (!root) return;
      UE.utils.each(root.getNodesByTagName('span'), function (node) {
        if (node.getAttr('class') == 'edui-faked-checkword') {
          node.setAttr({
            'style': 'border-bottom:#f33 1px dotted;'
          })
        }
      })
    })

    // 设计视图转为源码视图的规则
    me.addOutputRule(function (root) {
      if (!root) return;
      UE.utils.each(root.getNodesByTagName('span'), function (node) {
        if (node.getAttr('class') == 'edui-faked-checkword') {
          node.setAttr({
            'style': ''
          })
        }
      })
    })

    editor.commands['zcheckwords'] = {
      execCommand: function (cmd, name) {
        var str = me.getContent()
        if (!str) {
          return
        }
        var n = 0
        var words = [
          ['按装', '安装'],
          ['针贬', '针砭'],
          ['泊来品', '舶来品'],
          ['脉博', '脉搏'],
          ['松驰', '松弛'],
          ['精萃', '精粹'],
          ['重迭', '重叠'],
          ['渡假村', '度假村'],
          ['防碍', '妨碍'],
          ['幅射', '辐射'],
          ['一幅对联', '一副对联'],
          ['气慨', '气概'],
          ['粗旷', '粗犷'],
          ['震憾', '震撼'],
          ['凑和', '凑合'],
          ['侯车室', '候车室'],
          ['既使', '即使'],
          ['挖墙角', '挖墙脚'],
          ['峻工', '竣工'],
          ['打腊', '打蜡'],
          ['兰天白云', '蓝天白云'],
          ['老俩口', '老两口'],
          ['了望', '瞭望'],
          ['水笼头', '水龙头'],
          ['杀戳', '杀戮'],
          ['痉孪', '痉挛'],
          ['罗唆', '啰嗦'],
          ['沉缅', '沉湎'],
          ['名信片', '明信片'],
          ['大姆指', '大拇指'],
          ['凭添', '平添'],
          ['修茸', '修葺'],
          ['亲睐', '青睐'],
          ['入场卷', '入场券'],
          ['发韧', '发轫'],
          ['搔痒病', '瘙痒病'],
          ['欣尝', '欣赏'],
          ['追朔', '追溯'],
          ['迁徒', '迁徙'],
          ['九宵', '九霄'],
          ['渲泄', '宣泄'],
          ['寒喧', '寒暄'],
          ['弦律', '旋律'],
          ['膺品', '赝品'],
          ['脏款', '赃款'],
          ['醮水', '蘸水'],
          ['蜇伏', '蛰伏'],
          ['装祯', '装帧'],
          ['坐阵', '坐镇'],
          ['九洲', '九州'],
          ['编篡', '编纂'],
          ['做月子', '坐月子'],
          ['我得', '我的'],
          ['我地', '我的']
        ]
        if (window.words_often_wronged) {
          if (words_often_wronged.length && words_often_wronged.length >= words.length) {
            words = words_often_wronged
          } else if (words_often_wronged.Columns && words_often_wronged.Values) { // 这是一个DataTable
            for (var i = 0; i < words_often_wronged.Values.length; i++) {
              words[i] = [words_often_wronged.Values[i][1], words_often_wronged.Values[i][2]]
            }
            words_often_wronged = words
          }
        }
        parseHtmlArr = parseHtml(str)
        var finedWords = findWordInArray(parseHtmlArr, words)
        var Dialog = baidu.editor.ui.Dialog
        if (finedWords.length) {
          var wordsHtml = []
          for (var i = 0; i < finedWords.length; i++) {
            wordsHtml.push('<span style="display:inline-block;margin-right:6px;">')
            wordsHtml.push('<span style="background: #ffc; color: #600; border-bottom: #f33 1px dotted;">' + finedWords[i][0] + '</span>')
            wordsHtml.push('<br><span style="background: #efc; color: #390;">' + finedWords[i][1] + '</span>')
            wordsHtml.push('</span>')
          }
          var dialog = new Dialog({
            editor: editor,
            title: '发现可疑错别字',
            icon: 'icon_query',
            content: '<div class="el-dialog__body">发现可疑错别字:<div style="min-width:400px;max-width:600px;padding-left:10px;">' + wordsHtml.join('') + '</div>',
            buttons: [
              {
                className: 'edui-cancelbutton',
                label: '手动修改',
                editor: editor,
                onclick: function () {
                  var replacedArr = makeWordInArray(parseHtmlArr, finedWords)
                  me.setContent(replacedArr.join(''))
                  dialog.close()
                }
              },
              {
                className: 'edui-okbutton',
                label: '自动替换',
                editor: editor,
                onclick: function () {
                  var replacedArr = replaceWordInArray(parseHtmlArr, finedWords)
                  me.setContent(replacedArr.join(''))
                  dialog.close()
                }
              },
            ]
          })
          dialog.open()
        } else {
          alert('没有发现可疑错别字。')
        }
      }
    }
  }
})()

// addStyle('.edui-toolbar div.edui-for-zcheckwords .edui-icon' + '{background:url("' + UEditorPath + 'icon_checkwords.gif") center no-repeat;}')
