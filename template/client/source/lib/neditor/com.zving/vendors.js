(function () {
  var z = window.Zving = window.Zving || {
    version: 2.5
  }
  var getCurrentScript = function (base) {
    if (document.currentScript) {
      return document.currentScript.src // FF,Chrome
    };
    var stack
    try {
      a.b.c() // 强制报错,以便捕获e.stack
    } catch (e) { // safari的错误对象只有line,sourceId,sourceURL
      stack = e.stack
      if (!stack && window.opera) {
        // opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
        stack = (String(e).match(/of linked script \S+/g) || []).join(' ')
      }
    }
    if (stack) {
      stack = stack.split(/[@ ]/g).pop() // 取得最后一行,最后一个空格或@之后的部分
      stack = stack[0] === '(' ? stack.slice(1, -1) : stack.replace(/\s/, '') // 去掉换行符
      return stack.replace(/(:\d+)?:\d+$/i, '') // 去掉行号与或许存在的出错字符起始位置
    }
    var nodes = (base ? document : document.head).getElementsByTagName('script') // 只在head标签中寻找
    for (var i = nodes.length, node; (node = nodes[--i]);) {
      if (node.readyState === 'interactive') {
        return node.src
      }
    }
    node = nodes[nodes.length - 1]
    return node.hasAttribute ? node.src : node.getAttribute('src', 4)
  }

  var jspath = getCurrentScript(true)
  var scripts = document.getElementsByTagName('script')
  var script = document.currentScript || scripts[scripts.length - 1]

  z.UEditorPath = jspath.substr(0, jspath.lastIndexOf('/') + 1)

  // console.log(z.UEditorPath,'z.UEditorPath')
  z.CONTEXTPATH = localStorage.serverURL || script.getAttribute('contextpath')
  z.Config = { namespace: 'window' }

  if (z.UEditorPath.indexOf(window.location.protocol + '//' + window.location.host + '/') === 0) {
    z.UEditorPath = z.UEditorPath.replace(window.location.protocol + '//' + window.location.host, '')
  }
  // 再外部没配置应用路径时才使用默认路径
  if (!z.CONTEXTPATH) {
    z.CONTEXTPATH = z.UEditorPath.replace(/[^/]+\/?$/, '')
    if (z.CONTEXTPATH.indexOf('/preview/') !== -1) {
      z.CONTEXTPATH = z.CONTEXTPATH.substr(0, z.CONTEXTPATH.indexOf('preview/'))
    }
  }
  /**
   异步加载CSS文件
   url:css文件路径，相对于引用js框架的页面，如果要从js框架根目录开始引用需自行加上z.UEditorPath
   **/
  // 往指定的同源页面窗口加载样式文件（求url为相对于win中页面的地址）
  z.loadCSS = z.loadCss = function (url, win) {
    var head = document.getElementsByTagName('head')[0] || document.documentElement
    if (document.createStyleSheet) { // 注意：IE11的不再支持document.createStyleSheet
      document.createStyleSheet(url)
    } else {
      var e = document.createElement('link')
      e.rel = 'stylesheet'
      e.type = 'text/css'
      e.href = url
      head.appendChild(e)
    }
  }
  z.importCSS = z.importCss = function (url, win) {
    if (!/^\/|^\w+:\/\//.test(url)) {
      url = z.UEditorPath + url
    }
    if (!document.body || document.readyState === 'loading') {
      document.write('<link rel="stylesheet" type="text/css" href="' + url + '" />')
    } else {
      z.loadCSS(url)
    }
  }

  z.loadJS = z.loadJs = function (url, onsuccess) {
    var head = document.getElementsByTagName('head')[0] || document.documentElement
    var script = document.createElement('script')
    var done = false
    script.src = url
    script.onerror = script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true
        if (onsuccess) {
          onsuccess()
        }
        script.onerror = script.onload = script.onreadystatechange = null
        // head.removeChild(script);
      }
    }
    head.appendChild(script)
  }
  z.importJS = z.importJs = function (url) {
    if (!/^\/|^\w+:\/\//.test(url)) {
      url = z.UEditorPath + url
    }
    if (!document.body || document.readyState === 'loading') {
      document.write('<script type="text/javascript" src="' + url + '"></script>')
    } else {
      z.loadJS(url)
    }
  }

  /*! core.js
   */
  z.mixinIf = z.mixIf = function (obj, srcObj, recursion) {
    if (!obj) {
      obj = {}
    }
    var p
    for (p in srcObj) {
      if (typeof (obj[p]) === 'undefined') {
        obj[p] = srcObj[p]
      } else if (recursion && typeof (obj[p]) === 'object' && obj[p] !== null && typeof (srcObj[p]) === 'object' && srcObj[p] !== null) {
        obj[p] = z.mixIf(obj[p], srcObj[p], recursion)
      }
    }
    return obj
  }

  var getDom = z.getDom = function (el, doc) {
    if (!el) {
      return el
    }
    if (typeof el === 'string') {
      return (doc || document).getElementById(el.replace(/^#/, ''))
    }
    if (!el.nodeName && el.length && el[0] && el[0].nodeName) { // 如果是一个jquery对象
      return el[0]
    }
    return el
  }

  z.addStyle = function (styleElId, cssStr, win) {
    var document = (win || window).document

    if (!cssStr) {
      cssStr = styleElId
      styleElId = 'style' + z.pageId
    }
    if (!styleElId) {
      styleElId = 'style' + z.pageId
    }

    /* 如果是一个不含{}的字符串，则认为是要载入外部的css */
    if (cssStr.indexOf('{') < 1 && cssStr.indexOf('}') < 1 && /^\S$/.test(cssStr)) {
      return z.loadCSS(cssStr)
    }
    var styleEl = document.getElementById(styleElId)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.type = 'text/css'
      styleEl.id = styleElId
      document.getElementsByTagName('head')[0].appendChild(styleEl)
    }
    if (styleEl.styleSheet) { // 注意：IE11的不再支持style.styleSheet
      styleEl.styleSheet.cssText += cssStr
    } else {
      cssStr = document.createTextNode(cssStr)
      styleEl.appendChild(cssStr)
    }
    return styleEl
  }
/*! Date
 */
 	var DateH = Zving.Date = {};

  DateH.format = function(d, pattern) {
		if(Object.prototype.toString.call(d)!='[object Date]'){
			d=new window.Date(d);
		}
		var i;
		pattern = pattern || "yyyy-MM-dd";
		var y = d.getFullYear();
		var o = {
			"M": d.getMonth() + 1,
			"d": d.getDate(),
			"H": d.getHours(),
			"m": d.getMinutes(),
			"s": d.getSeconds()
		};
		pattern = pattern.replace(/(y+)/ig, function(a, b) {
			var len = Math.min(4, b.length);
			return (y + "").substr(4 - len);
		});
		for (i in o) {
			pattern = pattern.replace(new RegExp("(" + i + "+)", "g"), function(a, b) {
				return (o[i] < 10 && b.length > 1) ? "0" + o[i] : o[i];
			});
		}
		return pattern;
	};
  /*! node.js
   */
  var Node = z.Node = z.Node || {}

  Node.getValue = function (elem) {
    // console.warn('Node.getValue方法将在下次JS框架重构中删除，请改用jQuery的val方法代替。')
    var ele = getDom(elem)
    if (!ele) {
      window.console &&
        console.error(
          window.location.pathname +
          ' - $V : 表单元素"' +
          elem +
          '"不存在 '
        )
      return
    }
    if (!ele.type) {
      return ele.value
    }
    switch (ele.type.toLowerCase()) {
      case 'text':
      case 'textarea':
        return ele.value
      case 'submit':
      case 'hidden':
      case 'password':
      case 'file':
      case 'image':
      case 'select-one':
        return ele.value
      case 'checkbox':
      case 'radio':
        if (ele.checked) {
          return ele.value
        }
        return null
      default:
        return ''
    }
  }
  /*! zRetouch.js
   */

  z.$V = Node.getValue

  var p
  var skipExtra = []
  var extraObject = /^(\$|Object|Class|Array|Date|Function|String|Node|Event|JSON|Storage|Comment)$/
  for (p in z) {
    if (typeof (z[p]) === 'undefined' || /^(id|g|Helper)$/.test(p)) {
      continue
    }
    if (typeof (window[p]) !== 'undefined') {
      if (!extraObject.test(p)) {
        skipExtra.push('zRetouch.js -- ' + p + ' existed in window')
      } else if (extraObject.test(p) && typeof (z[p]) === 'object') { // 如果Zving下对象和原生对象重名，则复制对象下的属性/方法
        z.mixIf(window[p], z[p])
      }
    } else {
      try {
        window[p] = z[p]
      } catch (ex) {
        throw ex
      }
    }
  }
  if (skipExtra.length && console) {
    console.warn(skipExtra.join('\n'))
  }
}())
