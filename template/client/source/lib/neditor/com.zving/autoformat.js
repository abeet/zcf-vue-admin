/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
// 这个插件命令在autotypeset.js中注册配置项，设置了配置项时，会在执行autotypeset命令前，执行这个命令，以清除段落首行开始处的空格
UE.plugins['autoformat'] = function () {
  var editor = this

  editor.commands['autoformat'] = {
    execCommand: function () {
      var str = editor.getContent()
      if (!str) {
        return
      }
      if (str.indexOf('<') !== 0) {
        str = '<p>' + str
      }
      // str = str.replace(/<\/p>/ig, '</p><p>');
      str = str.replace(/<p[^>]*>\s*(&nbsp;)+<\/p>/gi, '')
      str = str.replace(/<p>(\s*)<p>/ig, '<p>')
      str = str.replace(/<div[^>]*>(&nbsp;)+<\/div>/gi, '')
      str = str.replace(/<span[^>]*>(&nbsp;)+<\/span>/gi, '')
      str = str.replace(/(<br[^>]*>(\s*(&nbsp;)*\s*)){1,}/gi, '</p><p>')
      str = str.replace(/<\w\:.*?>.*?<\/\w\:.*?>/gi, '') // word中的自定义标签
      str = str.replace(/<[\s\/]*font.*?>/gi, '') // word中的字体
      str = str.replace(/<[\s\/]*h\d.*?>(.*?)<\/h\d>/gi, '<b>$1</b>') // word中的各号标题
      str = str.replace(/<a name=\"_Toc\d+\">(.*?)<\/a>/gi, '$1') // word中的目录章节
      str = str.replace(/<a name=_Toc\d+>(.*?)<\/a>/gi, '$1')

      var div = document.getElementById('_ZvingAutoFormatDiv')
      if (!div) {
        div = document.createElement('div')
        div.style.display = 'none'
        div.id = '_ZvingAutoFormatDiv'
        document.body.appendChild(div)
      }
      div.innerHTML = str
      try {
        AutoFormat.dealOneNode(div)
      } catch (ex) {
        alert([ex.lineNumber, ex.name, ex.message])
      }
      // 检查第一个P标签是否是空白
      var nodes = div.childNodes
      var firstP = null
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName && nodes[i].tagName.toLowerCase() == 'p') {
          firstP = nodes[i]
          break
        }
      }
      if (firstP) {
        var html = firstP.innerHTML
        html = AutoFormat.trim(html)
        if (html === '') {
          div.removeChild(firstP)
        }
      }
      str = div.innerHTML
      // str = str.replace(new RegExp("http://" + location.host, "g"), "");
      editor.setContent(str)
    }
  }
}

var AutoFormat = {}
AutoFormat.dealOneNode = function (pNode) {
  var list = pNode.childNodes
  for (var i = list.length - 1; i >= 0; i--) {
    var node = list[i]
    if (node.parentNode != pNode) { // IE6下会出现childNode将子节点的子节点也被列出的情况
      continue
    }
    if (node.nodeType == 8) {
      pNode.removeChild(node)
      continue
    }
    if (node.nodeType == 3) {
      var html = node.nodeValue
      html = html.replace(/(^\s*)|(\s*$)/g, '')
      if (html !== '' && html.indexOf('<!--') === 0) {
        pNode.removeChild(node)
        continue
      }
    }
    if (node.tagName) {
      var tag = node.tagName.toLowerCase()
      if (tag == 'script' || tag == 'link' || tag == 'meta' || tag == 'style' || tag.indexOf(':') > 0) {
        pNode.removeChild(node)
        continue
      }
      if (tag == 'p') {
        var c = AutoFormat.dealStart(node)
      } else if (tag == 'br') {
        if (i != list.length - 1) {
          if (list[i + 1].nodeType == 3) {
            AutoFormat.dealStart(list[i + 1])
            continue
          }
        }
      } else {
        if (tag == 'a') {
          if (node.innerHTML === '') {
            pNode.removeChild(node)
            continue
          }
        }
				/*
				if (node.style.cssText) {
					//去掉字体和行间距
					var arr = node.style.cssText.split(";");
					if (arr.length > 0) {
						for (var j = arr.length - 1; j >= 0; j--) {
							var k = arr[j].split(":")[0].toLowerCase();
							k = k.replace(/(^\s*)|(\s*$)/g, "");
							if (k == "line-height" || k.indexOf("font") === 0 || k.indexOf("mso-") === 0) {
								arr.splice(j, 1);
							}
							if (k == "color" && arr[j].split(":")[1] == " windowtext") {
								arr.splice(j, 1);
							}
						}
					}
					var cssText = arr.join(";");
					if (arr.length === 0 || !cssText) {
						node.removeAttribute("style");
					} else {
						node.style.cssText = cssText;
					}
				}
				*/
      }
      node.removeAttribute('lang')
      if (node.className && node.className.indexOf('MsoNormal') === 0) {
        node.className = ''
        node.removeAttribute('class')
      }
      AutoFormat.dealOneNode(node)
    }
  }
}

AutoFormat.dealStart = function (node) { // 处理每个段落的开始,如果是以序号开始的，不缩进
  // 如果是纯文本
  if (node.nodeType == 3) {
    if (node.nodeValue) {
      node.nodeValue = '　　' + node.nodeValue.replace(/(^\s*)|(\s*$)/g, '').replace(/^　+/g, '')
    }
    return
  }
  if (node.getAttribute('align') && node.getAttribute('align').toLowerCase() != 'left') {
    return
  }
  if (node.style.cssText) {
    if (node.style.cssText.indexOf('text-align') >= 0) {
      node.style.cssText = 'text-align:' + node.style.textAlign
      return
    } else {
      node.removeAttribute('style')
    }
  }
  var str = node.textContent ? node.textContent : node.innerText
  str = AutoFormat.trim(str)
  if (!str) {
    return
  }
  var nums = '()（）一二三四五六七八九十0123456789１２３４５６７８９０ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ①②③④⑤⑥⑦⑧⑨⑩⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑'
  var stopChar = ''
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i)
    if (nums.indexOf(c) < 0) {
      if (i === 0) {
        stopChar = ''
        break
      }
      if (c == '.' || c == ',' || c == '、' || c == '\xa0' || c == ' ' || c == '　' || str.indexOf('&nbsp;') == i) {
        stopChar = c
        break
      } else {
        stopChar = ''
        break
      }
    }
  }
  // innerHTML会把空格返回为&nbsp; innerText会返回\x0a(空格字符),所以，如果innerText中的stopChar为\x0a，那在innerHTML中对应的就是&nbsp;
  if (stopChar == '\xa0') {
    stopChar = '&'
  }
  var html = node.innerHTML.trim() // 2013-09-03 如果不清掉空白，innerHTML可能与innerText字符不同
  str = html.replace(/<.*?>/g, function ($0) {
    var len = $0.length
    var arr = []
    for (var i = 0; i < len; i++) {
      arr.push('◎')
    }
    return arr.join('')
  })

  var insertIndex
  var insertStr
  var deleteArr = []
  for (var i = 0; i < str.length;) {
    var c = str.charAt(i)
    if (c != '◎') {
      if (!insertIndex) {
        if (stopChar !== '') {
          if (c == stopChar) { // Word粘贴过来的编号
            if (stopChar == '&') {
              insertIndex = i - 1
              insertStr = '&nbsp;'
              continue
            } else {
              insertIndex = i
              insertStr = '&nbsp;'
              i++
              continue
            }
          }
        } else { // 非编号，段首空格
          if (str.substring(i, i + 1).trim() !== '' && c != '　') {
            insertIndex = i - 1
            // 不处理首行缩进，首行缩进通过autotypeset中的intent配置项控制
            insertStr = ''
          }
        }
      }
      if (str.substring(i, i + 1).match(/^[　\xa0\s]$/)) {
        deleteArr.push([i, i + 1])
        i++
      } else if (c == '&' && str.indexOf('&nbsp;', i) == i) {
        deleteArr.push([i, i + 6])
        i += 6
      } else {
        if (insertIndex) {
          break
        } else {
          i++
        }
      }
    } else {
      i++
    }
  }

  var inserted = false
  var old = html
  if (deleteArr.length > 0) {
    for (var i = deleteArr.length - 1; i >= 0; i--) {
      if (deleteArr[i][1] <= insertIndex + 1 && !inserted) { // 要先插入，否则顺序不对
        html = html.substring(0, insertIndex + 1) + insertStr + html.substring(insertIndex + 1, html.length)
        inserted = true
      }
      html = html.substring(0, deleteArr[i][0]) + html.substring(deleteArr[i][1], html.length)
    }
  }
  if (!inserted) {
    html = AutoFormat.trim(html.substring(0, insertIndex + 1)) + insertStr + html.substring(insertIndex + 1, html.length)
  }
  node.innerHTML = html
  // alert([deleteArr.join('|'),insertIndex,insertStr,str,'\n'+html]);
}

AutoFormat.trim = function (str) {
  if (!str) {
    return str
  }
  str = str.trim()
  while (true) {
    var c = str.charAt(0)
    if (c == '　' || c == '\xa0') {
      str = str.substring(1).trim()
    } else if (str.startsWith('&nbsp;')) {
      str = str.substring(6).trim()
    } else {
      break
    }
  }
  return str
}
