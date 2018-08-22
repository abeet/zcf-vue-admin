/* global $ */
(function () {
  var scripts = document.getElementsByTagName('script')
  var script = scripts[scripts.length - 1]
  var jsPath = script.hasAttribute ? script.src : script.getAttribute('src', 4) // ie下通过getAttribute('src', 4)才能获取全路径
  jsPath = jsPath.substr(0, jsPath.lastIndexOf('/') + 1)

  /** ***********************一些公用方法和属性****************************/
  var z = {}
  var toString = Object.prototype.toString
  var ua = navigator.userAgent.toLowerCase()
  z.isWindows = /windows|win32/.test(ua)
  z.isMac = /macintosh|mac os|macintel|mac68k|macppc/.test(ua)
  z.isLinux = /linux/.test(ua)
  z.isIOS = /ipad|iphone|ipod/.test(ua)
  z.isIPad = /ipad/.test(ua)
  z.isAndroid = /android|slik\/\d/.test(ua)
  z.isWPhone = /windows phone/.test(ua)
  z.isDesktop = (z.isMac && !z.isIOS) || (z.isWindows && !z.isWPhone) || (z.isLinux && !z.isAndroid)
  z.isTablet = /ipad|slik\/\d|(playbook).*?tablet/.test(ua) || (z.isAndroid && !/mobile/.test(ua))
  z.isPhone = !z.isDesktop && !z.isTablet
  z.isGecko = /gecko/.test(ua) // 建议主要使用这个。包括Safari、firefox、chrome、IE11+、Opera15+。

  z.ieVersion = /msie|trident/.test(ua) ? parseFloat(/(msie |rv:)([\w.]+)/.exec(ua)[2]) : null
  z.isIE = /msie/.test(ua) && !!window.ActiveXObject
  // 注意：IE11的navigator.userAgent不再有MSIE字样，也不推荐再使用window.ActiveXObject。
  // IE版本不能仅依靠navigator.userAgent判断，因为高版本浏览器可以切换到多个低版本浏览器的渲染模式，所以要使用特性探测
  // isIE6为判断IE6或更低版本，isIE11为判断IE11及更高版本，同时考虑在IE11下仿真低版本浏览器的情况。
  z.isIE6 = z.isIE && !window.XMLHttpRequest // IE6及更低版本
  if (z.isIE6) {
    z.ieVersion = 6
  }
  z.isIE7 = z.isIE && !!window.XMLHttpRequest && !window.XDomainRequest && !/msie 6/.test(ua)
  if (z.isIE7) {
    z.ieVersion = 7
  }
  z.isIE8 = z.isIE && !!window.XDomainRequest && !/msie 7/.test(ua) // 在ie兼容模式下ua会返回msie 7
  if (z.isIE8) {
    z.ieVersion = 8
  }
  z.isIE9 = z.isIE && !!window.performance && !/msie 8/.test(ua)// 注意在IE高版本仿真IE8时window.performance为true
  if (z.isIE9) {
    z.ieVersion = 9
  }
  z.isIE10 = z.isIE && !!window.Worker && !!window.WebSocket && !/msie 9/.test(ua)
  if (z.isIE10) {
    z.ieVersion = 10
  }
  z.isIE11 = z.isTrident && !!window.addEventListener && !!window.getSelection && !/msie 10/.test(ua) // 在IE高版本仿真IE10时window.getSelection、window.addEventListener为true
  if (z.isIE11 && z.ieVersion < 11) {
    z.ieVersion = 11
  }

  z.isBoolean = function (v) {
    return typeof v === 'boolean'
  }
  z.isNumber = function (v) {
    return typeof v === 'number' && isFinite(v)
  }
  z.isObject = function (v) {
    return !!v && typeof v === 'object'
  }
  z.isString = function (str) {
    return typeof str === 'string'
  }
  z.isArray = function (v) {
    return !!v && toString.apply(v) === '[object Array]'
  }
  z.isEmpty = function (v, allowBlank) {
    return v === null || v === undefined || (toString.apply(v) === '[object Array]' && !v.length) || (!allowBlank ? v === '' : false)
  }
  z.isPrimitive = function (v) {
    return z.isString(v) || z.isNumber(v) || z.isBoolean(v)
  }
  z.isIterable = function (v) {
    if (z.isArray(v) || v.callee) { // array or arguments
      return true
    }
    if (/NodeList|HTMLCollection/.test(toString.call(v))) { // node list type
      return true
    }
    // NodeList has an item and length property
    // IXMLDOMNodeList has nextNode method, needs to be checked first.
    return ((typeof v.nextNode !== 'undefined' || v.item) && z.isNumber(v.length))
  }
  z.each = function (array, fn, scope) {
    if (z.isEmpty(array, true)) {
      return
    }
    if (!z.isIterable(array) || z.isPrimitive(array)) {
      array = [array]
    }
    for (var i = 0, len = array.length; i < len; i++) {
      if (fn.call(scope || array[i], array[i], i, array) === false) {
        return i
      }
    }
  }
  z.iterate = function (obj, fn, scope) {
    if (z.isEmpty(obj)) {
      return
    }
    if (z.isIterable(obj)) {
      z.each(obj, fn, scope)
    } else if (z.isObject(obj)) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
            return
          }
        }
      }
    }
  }
  window.getDom = z.getDom = function (el, doc) {
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

  z.restricted = false // 对父窗口的访问是否受限

  if (window !== window.parent) {
    var parentDocument
    var parentAll
    try {
      parentDocument = window.parent.document // 在没权限访问parent中的对象时会出错
      parentAll = window.parent.document.getElementsByTagName('*')
      parentDocument = parentAll = null
    } catch (ex) {
      z.restricted = true
    }
  }

  z.getEvent = function (evt, win) {
    evt = evt || (win || window).event
    if (!evt) {
      var func = arguments.callee.caller
      var i = 0
      for (; func !== null; i++, func = func.caller) {
        evt = func.arguments[0]
        if (evt && typeof evt === 'object' && (/Event/.test(evt) || typeof evt.type === 'string')) {
          // Event对象的toString()方法返回[object Event]或[object MouseEvent]
          return evt
        }
        if (i > 222) { // 如果遇到循环次数太多，可能是在递归调用里死循环，则退出
          return null
        }
      }
    }
    return evt
  }
  z.stopEvent = function (evt) { // 阻止一切事件执行,包括浏览器默认的事件
    evt = z.getEvent(evt)
    if (!evt) {
      return
    }
    if (evt.preventDefault) {
      evt.preventDefault()
      evt.stopPropagation()
    }
    evt.cancelBubble = true
    evt.returnValue = false
  }

  Array.prototype.remove = Array.prototype.remove || function (s, dust) { // 如果dust为ture，则返回被删除的元素
    if (dust) {
      var dustArr = []
      for (var i = 0; i < this.length; i++) {
        if (s === this[i]) {
          dustArr.push(this.splice(i, 1)[0])
        }
      }
      return dustArr
    }
    for (var j = 0; j < this.length; j++) {
      if (s === this[j]) {
        this.splice(j, 1)
      }
    }
    return this
  }

  var $topWindow = function () {
    var parentWin = window
    while (parentWin !== parentWin.parent) {
      if (parentWin.parent.document.getElementsByTagName('FRAMESET').length > 0) {
        break
      }
      parentWin = parentWin.parent
    }
    return parentWin
  }

  z.mix = function (obj, srcObj, defaults) { // 复制对象srcObj的成员到对象obj
    if (!obj) {
      obj = {}
    }
    if (defaults) {
      z.mix(obj, defaults)
    }
    if (obj && srcObj && typeof srcObj === 'object') {
      var p
      for (p in srcObj) {
        if (srcObj.hasOwnProperty(p)) {
          obj[p] = srcObj[p]
        }
      }
    }
    return obj
  }
  z.mixIf = function (obj, srcObj, recursion) {
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
  var emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i
  z.createHtml = function (o) {
    var b = ''
    var cn

    if (z.isString(o)) {
      b = o
    } else if (z.isArray(o)) {
      for (var i = 0; i < o.length; i++) {
        if (o[i]) {
          b += z.createHtml(o[i])
        }
      }
    } else {
      b += '<' + (o.tag = o.tag || 'div')
      z.iterate(o, function (attr, val) {
        if (!/tag|children|cn|html$/i.test(attr)) {
          if (z.isObject(val)) {
            b += ' ' + attr + '="'
            z.iterate(val, function (key, keyVal) {
              b += key + ':' + keyVal + ';'
            })
            b += '"'
          } else {
            b += ' ' + ({
              cls: 'class',
              htmlFor: 'for'
            }[attr] || attr) + '="' + val + '"'
          }
        }
      })
      // Now either just close the tag or try to add children and close the tag.
      if (emptyTags.test(o.tag)) {
        b += '/>'
      } else {
        b += '>'
        cn = o.children || o.cn
        if (cn) {
          b += z.createHtml(cn)
        } else if (o.html) {
          b += o.html
        }
        b += '</' + o.tag + '>'
      }
    }
    return b
  }
  z.tmpl = function (str, obj, st, urlencode) {
    return str.replace(/\{([\w_$]+)\}/g, function (c, $1) {
      var a = obj[$1]
      if (a === undefined || a === null) {
        if (st === undefined || st === null) {
          return ''
        }
        switch (st) {
          case 0:
            return ''
          case 1:
            return $1
          default:
            return c
        }
      }
      if (Object.prototype.toString.call(a) === '[object Function]') {
        a = a($1)
      }
      return urlencode ? encodeURIComponent(a) : a
    })
  }
  var topWin = $topWindow()
  var topDoc = topWin.document

  z.isVisible = function (elem) {
    elem = z.getDom(elem)
    if (
      !elem.parentNode ||
      (elem.tagName !== 'BODY' &&
        elem.parentNode.tagName !== 'BODY' &&
        !elem.offsetParent)
    ) {
      return false // 不在节点内，或为隐藏元素
    }
    var curStyle = elem.currentStyle
    if (!curStyle && !z.isIE) {
      curStyle = topWin.getComputedStyle(elem, null)
      if (!curStyle) {
        return false
      }
    }
    if (curStyle.display === 'none') {
      return false
    } else if (
      elem.offsetWidth === 0 && elem.offsetHeight === 0 && elem.tagName !== 'TR'
    ) {
      return false
    }
    return true
  }
  /** ***********************弹出框类实现****************************/

  var UICompBase = {
    outerElAttrs: {
      tag: 'div'
    },
    init: function (config) {
      z.mix(this, config)
      this.getId()
      if (this.autoShow) { // 如果存在自动显示配置项，则自动显示
        this.show()
      }
    },
    on: function () {
      var args = Array.prototype.slice.call(arguments)
      args[0] = args[0].toLowerCase() + '.' + this.id
      $window.on.apply($window, args)
    },
    fireEvent: function () {
      var args = Array.prototype.slice.call(arguments)
      args[0] = args[0].toLowerCase() + '.' + this.id
      $window.trigger.apply($window, args)
    },
    off: function () {
      var args = Array.prototype.slice.call(arguments)
      args[0] = args[0].toLowerCase() + '.' + this.id
      $window.off.apply($window, args)
    },
    getId: function () {
      if (!this.id) {
        var ctype = this.ctype.toLocaleLowerCase().replace(/\./g, '_')
        var idSeed = topWin.Dialog.idSeed
        if (idSeed[ctype] === undefined) {
          idSeed[ctype] = 0
        }
        this.id = 'z-' + ctype + '-' + (++idSeed[ctype])
      }
      return this.id
    },
    beforerender: function () { },
    render: function (container, position) {
      if (container) {
        container = z.getDom(container)
      }
      // this.constructor.superclass.render.call(this, container, position);
      this.beforerender()
      if (this.rendered || this.fireEvent('beforerender', this) === false) {
        return this
      }
      if (!container) {
        if (this.el) {
          container = (this.outerEl || this.el).parentNode
          // this.allowDomMove = false;
        } else {
          container = this.container || this.parentEl || document.body
        }
      }
      this.ownerDocument = container.ownerDocument
      this.ownerWindow = container.ownerDocument.parentWindow || container.ownerDocument.defaultView
      // console.log(container)
      this.container = this.ownerWindow.getDom(container)
      if (this.ctCls) {
        $(this.container).addClass(this.ctCls)
        delete this.ctCls
      }
      this.onRender(this.container, position)

      this.rendered = true
      if (this.autoShow) {
        $(this.outerEl).removeClass(this.hiddenClass)
      }
      if (this.cls) {
        $(this.outerEl).addClass(this.cls)
        delete this.cls
      }

      this.fireEvent('render', this)

      this.initContent()

      this.afterRender(this.container)

      this.fireEvent('afterrender', this)

      if (this.hidden) {
        $(this.outerEl).addClass(this.hiddenClass)
      }
      if (this.disabled) {
        this.disable(true)
      }

      return this
    },
    // default function is not really useful
    _onRender: function (ct, position) {
      // this.constructor.superclass.onRender.call(this, ct, position);
      // 要特别注意这儿container元素和position元素，以及要添加的el元素的ownerDocument是否相同
      // console.log(ct.ownerDocument.parentWindow==this.el.ownerDocument.parentWindow);
      var div, renderData
      if (!ct) {
        ct = this.container || document.body
      } else {
        this.ownerDocument = ct.ownerDocument
        this.ownerWindow = ct.ownerDocument.parentWindow || ct.ownerDocument.defaultView
      }
      var doc = this.ownerDocument
      if (position !== undefined && position !== null) {
        if (z.isNumber(position)) {
          position = ct.children[position]
        } else {
          position = this.ownerWindow.getDom(position)
        }
      }
      if (!this.el && this.outerElAttrs) {
        if (this.outerElAttrs) {
          if (typeof this.outerElAttrs === 'string' && !/<|&#?\w+;/.test(this.outerElAttrs)) {
            this.outerEl = doc.createElement(this.outerElAttrs)
          } else {
            div = doc.createElement('div') // 注意this.el可能不在当前窗口，如dialog就是生成在顶层窗口的
            renderData = this.initRenderData()
            var html = typeof this.outerElAttrs === 'string' ? this.outerElAttrs : z.createHtml(this.outerElAttrs)
            div.innerHTML = z.tmpl(html, renderData)
            this.outerEl = div.firstChild
          }
        }
      }
      if (this.outerEl) {
        // if (this.allowDomMove !== false) {
        if (position) {
          ct.insertBefore(this.outerEl, position)
        } else {
          ct.appendChild(this.outerEl)
        }
        if (div) {
          if (div.parentNode) {
            div.parentNode.removeChild(div)
          }
          div = null
        }
        // }
      }
      if (this.renderTpl) {
        renderData = this.initRenderData()
        // console.log('renderData',renderData);
        this.outerEl.innerHTML = z.tmpl(this.renderTpl, renderData)
      }
      this.el = this.ownerWindow.getDom(this.getId())
      if (this.el && !this.outerEl) {
        this.outerEl = this.el
      } else if (!this.el && this.outerEl) {
        this.el = this.outerEl
      }
      if (!this.el.id) {
        this.el.id = this.getId()
        this.el._components = this.el._components || {}
        this.el._components[this.ctype] = this.id
      }
      if (this.el !== this.outerEl) {
        if (this.outerElIdPostfix) {
          this.outerEl.id = this.el.id + this.outerElIdPostfix
        }
        this.$outerEl = this.ownerWindow.$(this.outerEl)
        this.$el = this.ownerWindow.$(this.el) // 注意this.el可能不在当前窗口，如dialog就是生成在顶层窗口的
      } else {
        this.$outerEl = this.$el = this.ownerWindow.$(this.el)
      } /* 附加样式 */
      if (this.baseCls) {
        $(this.outerEl).addClass(this.baseCls)
      }
      if (this.cmpCls) {
        $(this.outerEl).addClass(this.cmpCls)
        delete this.cmpCls
      }

      if (this.style) {
        if (typeof this.style === 'string') {
          this.outerEl.style.cssText = this.style
        } else {
          z.mix(this.outerEl.style, this.style)
        }
        delete this.style
      } /**/
    },

    initRenderData: function () {
      this.renderData = this.renderData || {}
      return z.mixIf(this.renderData, {
        id: this.id,
        baseCls: this.baseCls,
        cmpCls: this.cmpCls,
        cls: this.cls
      })
    },
    /* 销毁侦听此组件的事件，删除dom元素，并从ComponentManager中注销 */
    destroy: function (destroyDom) {
      // this.constructor.superclass.destroy.call(this);
      if (this.isDestroyed === true) {
        return
      }

      if (this.fireEvent('beforedestroy', this) === false) {
        return
      }
      this.destroying = true
      if (this.beforeDestroy) {
        this.beforeDestroy()
      }
      if (this.ownerCt && this.ownerCt.remove) {
        this.ownerCt.remove(this, false)
        delete this.ownerCt
      }

      if (this.onDestroy) {
        this.onDestroy()
      }
      this.fireEvent('destroy', this)

      if (this.$el) {
        this.ownerWindow.$.cleanData(this.$el)
      }
      if (this.el && (this.el.onclick || this.el.ondblclick)) {
        this.el.onclick = this.el.ondblclick = null
      }

      if (this.$outerEl) {
        this.ownerWindow.$.cleanData(this.$outerEl)
      }
      if (this.outerEl && (this.outerEl.onclick || this.outerEl.ondblclick)) {
        this.outerEl.onclick = this.outerEl.ondblclick = null
      }
      var el
      for (var e in this.dom) {
        el = this.dom[e]
        if (el && (el.nodeName || el.length)) {
          (z.getDom(el).ownerDocument.parentWindow || z.getDom(el).ownerDocument.defaultView).$.cleanData(typeof el.length === 'number' ? el : [el])
        }
      }
      el = null
      if (this.rendered && this.el && this.el.ownerDocument) {
        var Dialog = (this.el.ownerDocument.parentWindow || this.el.ownerDocument.defaultView).Dialog
        if (Dialog && (destroyDom || this.removeDomOnDestroy)) { // 如果没有传入destroyDom或不存在donotDestroyDom属性则删除dom
          (this.el.ownerDocument.parentWindow || this.el.ownerDocument.defaultView).$(this.outerEl).remove()
        }
      }

      if (this.deleteMembers) {
        this.deleteMembers('parentEl', 'container', 'autoRender', 'defaultConfig', 'dom', 'el', '$el', 'outerEl', '$outerEl', 'targetEl', 'events', 'initialConfig', 'ownerDocument', 'ownerWindow', '_parent')
      }
      this.destroying = false
      this.isDestroyed = true
    },

    deleteMembers: function () {
      var args = arguments
      for (var i = 0, len = args.length; i < len; ++i) {
        delete this[args[i]]
      }
    }
  }

  var Dialog = function (config) {
    this.defaultConfig = { /* 在ie下并不能保证语言包js文件在本组件js载入之前载入，所以要在创建实例时获取 */
      okText: '确定',
      // {String} 确定按钮上的文字;
      cancelText: '取消',
      // {String} 取消按钮上的文字;
      buttons: [],
      // 自定义按钮
      autoRender: topDoc.body
    }
    if (!(this instanceof Dialog) && Dialog.list[config]) {
      return Dialog.list(config)
    }
    if (config && config.id && Dialog.list[config.id]) {
      window.console && console.warn('id为 ' + config.id + ' 的dialog已存在。')
      return Dialog.list[config.id]
    }
    if (typeof config === 'string') {
      if (arguments.length === 4) { // 兼容四参数写法
        config = {
          title: arguments[0],
          url: arguments[1],
          width: arguments[2],
          height: arguments[3]
        }
      } else if (/^https?:\/\/|^[a-z]+:|\w+\.\w+((\?[\w=&+]*)*(#[\w=&+]*)*)$/.test(config)) {
        config = {
          url: config
        }
      } else if (/^\w+\d*$/.test(config)) {
        config = {
          id: config
        }
      } else {
        config = {
          html: config
        }
      }
    }

    z.mix(this, this.defaultConfig)
    this.init(config)
  }
  window.Dialog = Dialog
  Dialog.idSeed = {}
  Dialog.disableTimeout = 2000
  Dialog.isHideScrollbar = false // 弹出Dialog时是否隐藏滚动条
  Dialog.isPreventScroll = true
  var clsPrefix = 'modal'
  Dialog.htmlTemplate = '<div class="{clsPrefix}-content">' + '<div class="{clsPrefix}-fang"><span class="fang fangbg">◆</span><span class="fang fangfg">◆</span></div>' + '<table class="{clsPrefix}-border">' + '<tbody>' + '<tr>' + '<td class="{clsPrefix}-nw"></td>' + '<td class="{clsPrefix}-n"></td>' + '<td class="{clsPrefix}-ne"></td>' + '</tr>' + '<tr>' + '<td class="{clsPrefix}-w"></td>' + '<td class="{clsPrefix}-c">' + '<div class="{clsPrefix}-inner">' + '<table class="{clsPrefix}-dialog">' + '<tbody>' + '<tr>' + '<td class="{clsPrefix}-headerCt">' + '<div class="{clsPrefix}-header">' + '<a class="{clsPrefix}-close close" href="javascript:/*close*/;">' + '\xd7' + '</a>' + '<h4 class="{clsPrefix}-title"></h4>' + '</div>' + '</td>' + '</tr>' + '<tr>' + '<td class="{clsPrefix}-bodyWrap">' + '<div class="{clsPrefix}-iconCt"><div class="{clsPrefix}-icon"></div></div>' + '<div class="{clsPrefix}-main"><div class="{clsPrefix}-body"></div></div>' + '</td>' + '</tr>' + '<tr>' + '<td class="{clsPrefix}-footerCt">' + '<div class="{clsPrefix}-footer"></div>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</div>' + '</td>' + '<td class="{clsPrefix}-e"></td>' + '</tr>' + '<tr>' + '<td class="{clsPrefix}-sw"></td>' + '<td class="{clsPrefix}-s"></td>' + '<td class="{clsPrefix}-se"></td>' + '</tr>' + '</tbody>' + '</table>' + '</div>'
  Dialog.htmlTemplate = Dialog.htmlTemplate.replace(/\{clsPrefix\}/g, clsPrefix)
  Dialog.buttonTemplate = '<button class="btn {cls}" id="{id}" onclick="{fn}">{text}</button>'

  // 通过window宽取一个Dialog的合适最大宽，在320下Dialog宽 97% 即 300，在1920下 Dialog宽40%，即768。
  var getResponseWidth = function (vw) {
    return Math.round(vw - vw * (0.6 * vw - 0.6 * 320 + 0.03 * 1920 - 0.03 * vw) / (1920 - 320))
  }

  z.mix(Dialog.prototype, {
    id: null,
    ctype: 'Dialog',
    baseCls: 'z-dialog',
    /* 可配置项 */
    url: '',
    // {String} url 要显示的url; 必填项
    title: '',
    // title 显示在标题栏的文字，默认取iframe中的页面的title
    width: null,
    // 弹出框宽度，以内容宽度为准，而不是外框宽度
    height: null,
    // 弹出框高度，以内容高度为准，而不是外框高度
    minWidth: 200,
    minHeight: 60,
    top: '50%',
    // {Number|String} 数字或百分比(字符串) 默认为居中对齐;
    left: '50%',
    // {Number|String} 数字或百分比(字符串) 默认为居中对齐;
    onOk: null,
    // 点击确定地要执行的方法
    onCancel: null,
    // 点击取消时要执行的方法
    okText: '确定',
    // {String} 确定按钮上的文字;
    cancelText: '取消',
    // {String} 取消按钮上的文字;
    OKClass: 'z-dialog-okbutton',
    // {String} 确定按钮的样式;
    cancelClass: 'z-dialog-cancelbutton',
    // {String} 取消按钮上的样式;
    onInit: null,
    // 对话框初始化后执行的函数
    onReady: null,
    // iframe DOM树准备好时执行
    onLoad: null,
    // iframe载入后执行的函数，第一个参数传入iframe内部window对象
    onClose: null,
    iconDataURL: null,
    // 消息图标的DataURL
    message: '',
    // 信息栏内容;
    showButtonRow: true,
    // 是否显示按钮栏
    animator: true,
    // 是否动画显示弹出框
    resizable: false,
    // 是否可以调整大小
    modal: true,
    // 是否为模态窗口，即是否使用遮挡层挡住dialog后面的元素
    follow: null,
    followEl: null,
    // {String/HTMLElement} 让对话框依附在指定元素附近
    closable: true,
    // 是否显示关闭按钮
    draggable: false,
    esc: true,
    // 是否支持按esc键关闭
    autoClose: null,
    // {Number}多少秒后自动关闭
    closeTip: '? 秒后自动关闭',
    padding: '20px 25px',
    // 内容与边界的填充距离
    html: '<div class="' + clsPrefix + '-loading"><span>loading..</span></div>',
    // 默认插入到页面顶层
    zIndex: 10100,
    fixed: !z.isPhone && !z.isIE6,
    renderTpl: Dialog.htmlTemplate,
    bottonTpl: Dialog.buttonTemplate,
    highlightButtonCls: 'active',
    hidden: true,
    // 是否在隐藏状态完成render过程
    removeDomOnDestroy: true,
    // 在执行destroy方法时删除相关的dom元素
    autoShow: false,
    // dialog创建后，默认为隐藏，需要调用show()方法显示出来
    contentElClass: clsPrefix + '-body',
    // 内容区样式名
    initComponent: function () {
      this.buttons = this.buttons || []
      if (this.hidden === false) {
        this.hidden = true
        this.show()
      }
      this.opener = window // 记录自己弹出的窗口
      if (this.url) {
        window.$D = this
      }
    },
    onRender: function (ct, position) {
      this.beforeRender()
      this.dom = this.dom || {}
      this._onRender(ct, position)
      this.$el.css('position', this.fixed ? 'fixed' : 'absolute')

      var theProxy = this.ownerWindow.getDom('z-dialog-proxy')
      if (!theProxy) {
        theProxy = this.ownerWindow.$('<div id="z-dialog-proxy" class="z-dlg-proxy"></div>', this.ownerDocument).get(0)
        this.ownerDocument.body.appendChild(theProxy)
      }
      this.proxy = this.ownerWindow.getDom(theProxy)
      this.$proxy = this.ownerWindow.$(theProxy)
      if (this.modal) {
        var dialogShim = this.ownerWindow.getDom('_DialogShim')
        if (!dialogShim) {
          dialogShim = this.ownerWindow.$('<div id="_DialogShim" class="z-dlg-shim ' + clsPrefix + '-state-lock"></div>', this.ownerDocument).get(0)
          this.ownerDocument.body.appendChild(dialogShim)

          if (z.isIE6) {
            var sLeft = 'Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)'
            var sTop = 'Math.max(document.documentElement.scrollTop, document.body.scrollTop)'

            dialogShim.style.position = 'absolute'
            dialogShim.style.setExpression('left', 'eval(' + sLeft + ') + "px"')
            dialogShim.style.setExpression('top', 'eval(' + sTop + ') + "px"')
          } else {
            dialogShim.style.position = 'fixed'
          }
          dialogShim.style.position = this.fixed ? 'fixed' : 'absolute'
        }
        this.shim = this.ownerWindow.getDom(dialogShim)
        this.$shim = this.ownerWindow.$(dialogShim)
        this.$shim.on('click', function (evt) {
          if (evt.stopPropagation) {
            evt.stopPropagation()
          } else {
            evt.cancelBubble = true
          }
        })
      }
    },
    beforeRender: function () { },
    initContent: function () {
      // 用html填充组件内容
      var contentTarget = this.getContentEl()
      if (this.html) {
        contentTarget.innerHTML = this.html
        // 如果要this.html里有script，需要特别处理，请重写initContent方法
        delete this.html
      }
      if (this.contentEl) { // 从页面中已有元素作为组件内容区内容
        this.updateContent(this.contentEl)
      }
      if (this.tpl) {
        contentTarget.innerHTML = z.tmpl(this.tpl, this.data || {})
        delete this.data
      }
    },

    /* 更新组件内容区域
    参数，html或data
    如果组件有配置html模板，将使用数据直译模板
    如果组件没有配置模板，将更新已存在的页面元素
    */
    updateContent: function (htmlOrData, loadScripts, cb) {
      var contentTarget = this.getContentEl()
      if (htmlOrData && htmlOrData.nodeType === 1) {
        this.contentEl = htmlOrData
        var ce = this.ownerWindow.getDom(this.contentEl)
        // 让传入的元素在对话框关闭后可以返回到原来的地方
        var display = ce.style.display
        var prev = ce.previousSibling
        var next = ce.nextSibling
        var parent = ce.parentNode
        var me = this
        this._elemBack = function () {
          if (prev && prev.parentNode) {
            prev.parentNode.insertBefore(ce, prev.nextSibling)
          } else if (next && next.parentNode) {
            next.parentNode.insertBefore(ce, next)
          } else if (parent) {
            parent.appendChild(ce)
          }
          ce.style.display = display
          me._elemBack = null
        }

        $(ce).removeClass(this.hiddenClass)
        // 从jQuery缓存中移除后代节点，用于防止内存泄漏
        this.ownerWindow.$.cleanData(contentTarget.getElementsByTagName('*'))
        contentTarget.innerHTML = ''
        contentTarget.appendChild(ce)
      } else if (this.tpl && typeof htmlOrData !== 'string') {
        // 从jQuery缓存中移除后代节点，用于防止内存泄漏
        this.ownerWindow.$.cleanData(contentTarget.getElementsByTagName('*'))
        contentTarget.innerHTML = z.tmpl(this.tpl, htmlOrData || {})
      } else {
        var html = z.isObject(htmlOrData) ? z.createHtml(htmlOrData) : htmlOrData
        Node.update(contentTarget, html, loadScripts, cb) // update方法见Node.update
      }
    },
    afterRender: function () {
      this.dom = {
        wrap: this.el,
        content: true,
        header: true,
        title: true,
        main: true,
        iconCt: true,
        icon: true,
        body: true,
        footerCt: true,
        footer: true,
        close: true
      }
      var els = this.el.getElementsByTagName('*'),
        elsLen = els.length

      for (var i = 0; i < elsLen; i++) {
        var compName = els[i].className.split(clsPrefix + '-')[1]
        if (compName) {
          compName = compName.split(' ')[0]
          if (compName && this.dom[compName]) {
            this.dom[compName] = this.ownerWindow.getDom(els[i])
            this.dom['$' + compName] = this.ownerWindow.$(els[i])
          }
        }
      }
      if (this.closable === false) {
        this.dom.$close.hide()
      }
      if (this.iconDataURL) {
        if (z.isIE && z.ieVersion < 8 && this.iconStandin) {
          this.dom.icon.innerHTML = this.iconStandin
        } else {
          this.dom.icon.style.backgroundImage = 'url(' + this.iconDataURL + ')'
        }
      } else {
        this.dom.$iconCt.hide()
      }
      this.dom.$title.css('cursor', this.draggable ? 'move' : 'auto')
      this.dom.$body.css('padding', this.padding)

      this.setTitle(this.title)
      this.initIframe()
      this.initButtons()
      if (!this.width) {
        this.width = getResponseWidth($window.width())
      }
      this.setSize(this.width, this.height)
      if (this.autoClose) {
        this.time(this.autoClose)
      }
      if (this.followEl) {
        this.followTo(this.followEl)
      } else {
        this.setPosition(this.left, this.top)
      }

      this.initEvents()
      this.initResizable()
      this.initDraggable()
      if (this.onInit) {
        this.onInit(window)
      }
    },

    // px与%单位转换成数值 (百分比单位按照最大值换算)
    // 其他的单位返回原值
    _toNumber: function (thisValue, maxValue) {
      if ((!thisValue && thisValue !== 0) || typeof thisValue === 'number') {
        return Math.min(thisValue, maxValue)
      }

      var last = thisValue.length - 1
      if (thisValue.lastIndexOf('px') === last) {
        thisValue = parseInt(thisValue, 10)
      } else if (thisValue.lastIndexOf('%') === last) {
        thisValue = parseInt(maxValue * thisValue.split('%')[0] / 100, 10)
      }

      return thisValue
    },
    followTo: function (followEl) {
      this.fixed = false
      var pst = Dom.computePositionEx(followEl, this.el)
      switch (pst.clock) {
        case 11:
        case 12:
        case 1:
          pst.y += 4
          break
        case 2:
        case 3:
        case 4:
          pst.x -= 4
          break
        case 5:
        case 6:
        case 7:
          pst.y -= 4
          break
        case 8:
        case 9:
        case 10:
          pst.x += 4
          break
      }
      $(this.el).css({
        position: 'absolute',
        left: pst.x,
        top: pst.y
      }).addClass('z-dialog-callout z-callout' + pst.clock)
    },
    reposition: function () {
      this.setPosition('50%', '50%')
    },
    setPosition: function (x, y) {
      if (!this.rendered) {
        this.x = (x !== undefined) ? x : this.x
        this.y = (y !== undefined) ? y : this.y
        return this
      }
      var isFixed = z.isIE6 ? false : this.fixed
      var ie6Fixed = z.isIE6 && this.fixed
      var doc = topWin.document
      var vpw = topWin.$(topWin).width()
      var vph = topWin.$(topWin).height()
      var sl = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft)
      var st = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
      var dl = isFixed ? 0 : sl
      var dt = isFixed ? 0 : st
      // var sw = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth),
      // sh = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
      if (x || x === 0) {
        this._x = x.toString().indexOf('%') !== -1 ? x : null
        x = this._toNumber(x, vpw - this.el.offsetWidth)
        if (typeof x === 'number') {
          x = ie6Fixed ? (x += sl) : x + dl
          this.$el.css('left', Math.max(x, dl) + 'px')
        } else if (typeof x === 'string') {
          this.$el.css('left', x)
        }
      }
      if (y || y === 0) {
        this._y = y.toString().indexOf('%') !== -1 ? y : null
        y = this._toNumber(y, vph - this.el.offsetHeight)
        if (typeof y === 'number') {
          y = ie6Fixed ? (y += st) : y + dt
          this.$el.css('top', Math.max(y, dt) + 'px')
        } else if (typeof y === 'string') {
          this.$el.css('top', y)
        }
      }
      this.onPosition(x, y)
      this.x = x
      this.y = y
      this.fireEvent('move', this, x, y)
      return this
    },
    onPosition: function (x, y) {
      if (x !== undefined && y !== undefined) {
        this._autoPositionType()
      }
    },
    _autoPositionType: function () {
      this[this.fixed ? '_setFixed' : '_setAbsolute']()
    },
    _setFixed: function () {
      if (z.isIE6) {
        // var doc = topDoc;
        var left = parseInt(this.$el.css('left'), 10) || 0
        var top = parseInt(this.$el.css('top'), 10) || 0
        // var sLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
        // sTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        var ssLeft = 'Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)'
        var ssTop = 'Math.max(document.documentElement.scrollTop, document.body.scrollTop)'

        this._setAbsolute()
        this.el.style.setExpression('left', 'eval(' + (left + ssLeft) + ') + "px"')
        this.el.style.setExpression('top', 'eval(' + (top + ssTop) + ') + "px"')
      } else {
        this.el.style.position = 'fixed'
      }
    },
    _setAbsolute: function () {
      if (z.isIE6) {
        this.el.style.removeExpression('left')
        this.el.style.removeExpression('top')
      }
      this.el.style.position = 'absolute'
    },
    _clickCancel: function () {
      if (this.onCancel) {
        if (this.onCancel(window) !== false) {
          this.close()
        }
      } else {
        this.close()
      }
    },
    _clickClose: function () {
      if (this.onBeforeClose) {
        if (this.onBeforeClose(window) !== false) {
          this.close()
        }
      } else {
        this.close()
      }
    },
    getTitle: function () {
      return this.dom.title.innerHTML
    },
    setTitle: function (txt) {
      if (txt === undefined) {
        txt = this.title
      } else {
        this.title = txt
      }
      if (this.title === false) {
        this.dom.title.innerHTML = ''
        this.dom.$title.hide()
        this.$el.addClass(clsPrefix + '-state-noTitle')
      } else {
        this.dom.title.innerHTML = txt
        this.dom.$title.show()
        this.$el.removeClass(clsPrefix + '-state-noTitle')
      }
      return this
    },
    initIframe: function () {
      if (!this.url) {
        return
      }
      var me = this
      var iframe = me.ownerDocument.createElement('iframe')
      iframe.src = me.url

      iframe.id = iframe.name = me.id + '_dialog_frame'
      iframe.style.cssText = 'border:none 0;border-width: 0;width:100%;height:100%;'
      iframe.setAttribute('frameborder', '0', 0) // 0：覆盖任何同名属性（忽略大小写）1：默认，覆盖已经被设定的属性值
      // iframe.setAttribute('allowTransparency', true);
      iframe.setAttribute('ownerdialogid', me.id)
      me.dom.iframe = me.ownerWindow.getDom(iframe)
      me.dom.$body.addClass(clsPrefix + '-state-full')
      me.dom.body.appendChild(iframe)
      me.innerFrame = iframe
      me.innerWin = iframe.contentWindow
      window.$D = me
      window.$DW = iframe.contentWindow
      iframe = null
      me.onOk = me.onOk || me.onOK
      if (typeof me.onOk === 'function') {
        me._OKFn = me.onOk
        me.onOk = function (evt) {
          if (me.okButton && (!me.okButton.disabled)) {
            me.okButton.disabled = true
            me.okButton.autoDisabled = true
          }
          me.enableOkButtonTimer = setTimeout(function () {
            if (me.okButton && me.okButton.autoDisabled) {
              me.okButton.disabled = false
            }
          }, Dialog.disableTimeout)
          return me._OKFn(evt || window.event, me.innerWin)
        }
      }
      if (typeof me.onCancel === 'function') {
        me._CancelFn = me.onCancel
        me.onCancel = function (evt) {
          return me._CancelFn(evt || window.event, me.innerWin)
        }
      }
      if (!z.isGecko) {
        me.$innerFrame = me.ownerWindow.$(me.innerFrame)
        me.$innerFrame.on('load.dialog', function () {
          me.onIframeLoad()
        })
      } else {
        me.innerFrame.onload = function () {
          me.onIframeLoad()
        }
      }
      me.content = null
      me.$content = null
    },
    onIframeReady: function () {
      this.dom.$loadingEl = this.dom.$content.find('.' + clsPrefix + '-loading')
      this.dom.$loadingEl.hide()
      if (this.onReady) {
        this.onReady(this.innerWin)
        this.onReady = null
      }
    },
    onIframeLoad: function () {
      this.dom.$loadingEl = this.dom.$body.find('.' + clsPrefix + '-loading')
      this.dom.$loadingEl.hide()
      if (this.onLoad) {
        this.onLoad(this.innerWin)
        this.onLoad = null
      }
    },
    getContentEl: function () {
      return this.dom.body || (this.dom.body = this.$el.find('.' + this.contentElClass)[0])
    },
    initButtons: function () {
      if (this.onOK && !this.onOk) {
        this.onOk = this.onOK
      }
      if (this.onOk) {
        this.buttons.push({
          text: this.okText,
          fn: this.onOk,
          id: this.id + '-OKButton',
          cls: this.OKClass,
          focus: true
        })
      }
      if (this.onCancel) {
        this.buttons.push({
          text: this.cancelText,
          fn: this._clickCancel,
          id: this.id + '-cancelButton',
          cls: this.cancelClass,
          focus: (!this.onOk)
        })
      }
      if (this.buttons.length < 1) {
        this.dom.$footer.hide()
      } else {
        for (var i = 0; i < this.buttons.length; i++) {
          this.addButton(this.buttons[i])
        }
      }
    },
    disableButton: function (id) {
      this.ownerWindow.$('#' + id).disable()
    },
    enableButton: function (id) {
      this.ownerWindow.$('#' + id).enable()
    },
    addButton: function (id, text, fn, after, focus, cls) {
      var me = this
      var btnConf
      if (typeof id !== 'object') {
        btnConf = {
          text: text,
          fn: fn,
          id: (id || this.id + '-button' + this.buttons.length),
          cls: cls || '',
          focus: !!focus
        }
      } else {
        btnConf = id
      }
      if (this.dom && this.dom.footer) {
        var button = me.ownerDocument.createElement('button')
        if (btnConf.text) {
          button.value = btnConf.text
          button.innerText = btnConf.text
        }
        if (btnConf.id) {
          button.id = btnConf.id
          if (button.id === me.id + '-OKButton') {
            me.okButton = button
          } else if (button.id === me.id + '-cancelButton') {
            me.cancelButton = button
          }
        }
        if (btnConf.cls) {
          button.className = 'z-dlg-button ' + btnConf.cls
        }
        me.dom.footer.appendChild(button)
        var $button = me.ownerWindow.$(button)
        if (btnConf.fn) {
          $button.on('click', $.proxy(btnConf.fn, me))
        }
        if (btnConf.focus) {
          $button.addClass(me.highlightButtonCls)
          setTimeout(function () {
            try {
              button.focus()
            } catch (e) { }
          }, 1) // 如果在还没有定位前就设置focus在chrome下会使页面滚到最底下
        }
        return this.dom.footer[after ? 'lastChild' : 'firstChild']
      } else {
        this.buttons[after ? 'push' : 'unshift'](btnConf)
      }
    },
    initEvents: function () {
      var me = this
      // me.el.on('mousedown', me.toFront, me);
      me.manager = me.manager || Dialog.Manager
      me.manager.register(me) // 将dialog实例加入统一管理Manager
      me.dom.$close.on('mousedown', function (evt) {
        if (evt.which <= 1) {
          me._clickClose(evt)
        }
      })
    },
    /* 定时关闭 */
    time: function (second) {
      var me = this
      if (this.closed) {
        clearTimeout(this._timer)
        return
      }
      if (second) {
        this.autoClose = second
        this._timer = setTimeout(function () {
          me.time()
        }, 1000)
        return
      }
      this.autoClose--
      if (this.title !== false) {
        this.setTitle(this.closeTip.format(this.autoClose))
      }
      if (this.autoClose <= 0) {
        this._clickClose()
      } else {
        this._timer = setTimeout(function () {
          me.time()
        }, 1000)
      }
    },
    initResizable: function () {

    },
    initDraggable: function () {

    },

    content: function (html) { // 设置内容
      if (html === undefined) {
        return this.dom.body
      }
      if (typeof html === 'string') {
        this.updateContent(html)
        return
      }
      if (html.nodeType && html.nodeName) { // 如果传入的参数的一个HTMLElement
        var display = html.style.display
        var prev = html.previousSibling
        var next = html.nextSibling
        var parent = html.parentNode
        this._elemBack = function () { // 用于在dialog关闭后恢复这个HTMLElement的位置，可以下次再引入回来
          if (prev && prev.parentNode) {
            prev.parentNode.insertBefore(html, prev.nextSibling)
          } else if (next && prev.parentNode) {
            next.parentNode.insertBefore(html, next)
          } else if (parent) {
            parent.appendChild(html)
          }
          html.style.display = display
        }
        if (this.dom.body.innerHTML) {
          // 从jQuery缓存中移除后代节点，用于防止内存泄漏
          this.ownerWindow.$.cleanData(this.dom.body.getElementsByTagName('*'))
          this.dom.body.innerHTML = ''
        }
        this.dom.body.appendChild(html)
        $(html).show()
      }
    },

    onEsc: function (e) { // 按esc键关闭
      z.stopEvent(e)
      if (!this.closable || !this.esc) {
        return
      }
      this._clickCancel()
    },
    setShimSize: function () {
      if (this.modal) {
        var maskhide = false
        if (!z.isVisible(this.shim)) {
          maskhide = true
        }
        if (maskhide) {
          this.$shim.css('visibility', 'hidden')
          this.$shim.show()
        }
        $(this.shim).width('100%')
        $(this.shim).height('100%')
        var force = this.shim.offsetHeight
        var viewportHeight = this.ownerWindow.$(this.ownerWindow).height()
        if (viewportHeight > force) {
          $(this.shim).height(viewportHeight)
        }
        if (maskhide) {
          $(this.shim).hide()
          this.$shim.css('visibility', 'visible')
        }
      }
    },
    onWindowResize: function () { // 调整窗口大小时，修改遮挡层尺寸，并约束dialog的位置
      this.setShimSize()
      this.doConstrain()
    },

    beforeShow: function () {
    },

    show: function (anchor) {
      this.followEl = anchor ? z.getDom(anchor) : this.followEl
      if (!this.rendered) {
        this.render(this.autoRender)
      }
      if (this.hidden === false) {
        this.toFront()
        return this
      }

      if (this.fireEvent('beforeshow', this) === false) {
        return this
      }

      this.hidden = false

      this.beforeShow()

      this.afterShow()

      if (this.modal) {
        if (!z.isVisible(this.shim)) {
          this.setShimSize()
          if (this.animator) {
            topWin.$(this.shim).css('opacity', 0.03)
            this.$shim.show()
            this.$shim.fadeIn()
          } else {
            this.$shim.show()
          }
        }
      }
      return this
    },

    afterShow: function (isAnim) {
      this.$proxy.hide()
      this.$el.show()
      if (this.monitorResize || this.modal || this.constrain) { // 如果监视尺寸调整或限定显示范围
        $window.on('resize.dialog', this.onWindowResize.bind(this))
      }
      this.doConstrain() // 限定位置
      this.doLayout()
      this.toFront()
      this.onShow()
      this.fireEvent('show', this)
    },

    onShow: function () { },
    // 预留接口
    toFront: function (e) {
      if (this.manager.bringToFront(this)) {
        if (!e || !e.getTarget().focus) {
          try {
            this.el.focus()
          } catch (e) {
          }
        }
      }
      return this
    },
    toBack: function () {
      this.manager.sendToBack(this)
      return this
    },
    setActive: function (isActive) {
      if (isActive) {
        var topZIndex = topWin.Dialog.front.lastZIndex
        this.setZIndex(topZIndex)
        if (this.modal && this.shim) {
          this.$shim.show()
        }
        this.$el.addClass(clsPrefix + '-state-focus')
        this.fireEvent('activate', this)
      } else {
        this.$el && this.$el.removeClass(clsPrefix + '-state-focus')
        this.fireEvent('deactivate', this)
      }
    },
    hide: function (cb, scope) {
      if (this.hidden || this.fireEvent('beforehide', this) === false) {
        return this
      }
      if (cb) {
        this.on('hide', cb, scope /*, {single:true} */)
      }
      this.hidden = true
      if (this.modal) {
        // this.shim.hide();//隐藏shim
      }

      this.$el.hide()
      this.afterHide()

      return this
    },
    afterHide: function () {
      this.$proxy.hide()
      if (this.monitorResize || this.modal || this.constrain) {
        $window.off('resize.dialog')
      }
      this.onHide()
      this.fireEvent('hide', this)
    },

    onHide: function () { },
    // 预留接口

    doConstrain: function () { // 约束在可见范围，及可拖拽范围内
      if (this.container.nodeName === 'BODY') {
        return
      }
      var offsets
      if (this.constrain) {
        var s = this.getSize()
        offsets = {
          right: -(s.width - 50),
          bottom: -(s.height - 25)
        }
      }
      var xy = Node.getConstrainToXY(this.el, this.container, true, offsets)
      if (xy) {
        var isFixed = z.isIE6 ? false : this.fixed
        if (isFixed) {
          var doc = topWin.document
          var sl = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft)
          var st = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
          xy[0] = xy[0] - sl
          xy[1] = xy[1] - st
        }
        this.setPosition(xy[0], xy[1])
      }
    },
    doLayout: function () { },
    close: function () {
      if (this.isDestroyed === true) {
        return
      }
      if (this.fireEvent('beforeclose', this) !== false) {
        this.doClose()
      }
    },
    doClose: function () {
      if (this.onClose) {
        this.onClose(this.innerWin)
        this.onClose = null
      }
      this.fireEvent('close', this)
      this.destroy()
    },
    beforeDestroy: function () {
      // window.$D=null;$D可能已指向其他Dialog
      if (this.enableOkButtonTimer) {
        clearTimeout(this.enableOkButtonTimer)
      }
      if (this.rendered && this.dom) {
        this.destroyIframe()
        if (this.dom.$loadingEl) {
          this.ownerWindow.$.cleanData(this.dom.$loadingEl)
        }
        if (this.dom.$close) {
          this.dom.$close.off()
        }
        this.okButton = this.cancelButton = null
        this.ownerWindow.$.cleanData(this.dom.footer.getElementsByTagName('BUTTON'))
        this.buttons.length = 0
        if (this.proxy) {
          this.$proxy = this.proxy = null
        }
        if (this.shim) {
          this.$shim = this.shim = null
        }
        if (this.contentEl) {
          delete this.contentEl
        }
        if (this.dd && this.dd.proxyEl) {
          topWin.$(this.dd.proxyEl).remove()
        }
        if (this._elemBack) {
          this._elemBack()
          this._elemBack = null
        }
      }
    },
    destroyIframe: function () {
      var me = this
      if (!me.dom || !me.dom.iframe) {
        return
      }
      window.$DW = null
      me.innerWin = me.innerDoc = null
      if (!z.isGecko) {
        me.$innerFrame.off('load.dialog')
      } else {
        me.innerFrame.onload = null
      }
      me.innerFrame.src = 'about:blank'

      me.ownerWindow.$(me.dom.iframe).remove()
      me.$innerFrame = me.innerFrame = null
    },
    onDestroy: function () {
      if (this.dd) {
        this.dd.destroy()
        delete this.dd
      }
      if (this.manager) {
        this.manager.unregister(this)
      }
      this._CancelFn = this._OKFn = this.onOk = this.onOK = this.onCancel = this.onLoad = this.onReady = this.onClose = null
      // Dialog.superclass.onDestroy.call(this)
    },

    setZIndex: function (index) {
      if (index === undefined) {
        index = this.zIndex
      }
      if (this.modal) {
        this.$shim.css('z-index', index)
      }
      this.el.style.zIndex = (++index)
      this.zIndex = index
      index += 5

      this.lastZIndex = index
      return this
    },
    setSize: function (w, h) {
      // 设置内容器的宽高，外容器的宽高需要换算一下。
      this.onSetSize(w, h)
    },

    onSetSize: function (w, h) {
      if (this.url) {
        w = w || getResponseWidth($window.width())
        h = h || Math.max(Math.round(w / 2), getResponseWidth($window.height()))
      }
      this.dom.$main.css('min-width', this.minWidth + 'px')
      if (z.isIE6 || z.isIE7 || (document.documentMode && document.documentMode < 8)) {
        this.dom.$main.css('width', this.minWidth + 'px')
      }
      if (w) {
        this._width = w.toString().indexOf('%') !== -1 ? w : null
        var maxWidth = topWin.$(topWin).width() - this.el.offsetWidth + this.dom.content.offsetWidth - 10
        w = this._toNumber(w, maxWidth)
        if (typeof w === 'number') {
          this.$el.css('width', 'auto')
          this.dom.$main.css('width', Math.max(this.minWidth, w) + 'px')
          this.$el.css('width', this.el.offsetWidth + 'px') // 防止未定义宽度的表格遇到浏览器右边边界伸缩
        } else if (typeof w === 'string') {
          this.dom.main.style.width = w
          if (w === 'auto') {
            this.$el.css('width', 'auto')
          }
        }
      }
      if (h) {
        this._height = h.toString().indexOf('%') !== -1 ? h : null
        var maxHeight = topWin.$(topWin).height() - this.el.offsetHeight + this.dom.content.offsetHeight - 20
        h = this._toNumber(h, maxHeight)
        if (typeof h === 'number') {
          this.dom.$main.css('height', Math.max(this.minHeight, h) + 'px')
        } else if (typeof h === 'string') {
          this.dom.$main.css('height', h)
        }
      }

      this.fireEvent('resize', this)
      return this
    },
    dragstart: function (dragObject) {
      dragObject.proxy = this.proxy
    }

  }, UICompBase) /* 几个比较独立的扩展 */
  z.mix(Dialog.prototype, {
    shake: function () { // 抖动，用于表单验证失败时
      var style = this.el.style
      var p = [4, 8, 4, 0, -4, -8, -4, 0]
      var fx = function () {
        style.marginLeft = p.shift() + 'px'
        if (p.length <= 0) {
          style.marginLeft = 0
          clearInterval(Dialog.timerId)
        }
      }
      p = p.concat(p.concat(p))
      Dialog.timerId = setInterval(fx, 13)
      return this
    }
  })

  /* Dialog下的静态方法 */

  z.mix(Dialog, {
    alert: function (content, func, alertFlag) {
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      if (alertFlag === false) {
        return Dialog.warn(content, func)
      }
      return new Dialog({
        width: w,
        autoShow: true,
        iconDataURL: 'data:image/gif;base64,R0lGODlhIgAiANUAAAAAAP///+X4jO36r/H7w6C8FqK+GKTAGqXBG6bCHKfDHajEHqvHIa3JI7DMJrPPKbbSLLjULrvXMb3ZM7/bNcHdN8PfOcfjPczoQs3pQ8/rRdLuSNPvSdXxS9j0TtfzTdn1T9z2V932Xt32ZOD2cuT4eeX4huv6oe/6tf+nEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACkALAAAAAAiACIAAAb/wJRwSBwSBgQU6kgoOp9Fwmn0CVmvn9GpCe0STJ+sVTQaiazUj4nbJaLCpNDI89FgMJqPZxQihVFtQyYgHiEiHRUOBwiMCAcOFR1nHiAmgSUfJCMcEguNBgcHBo0LEhwjfiVdJWgZDY0IBhAbGxCjjQ0ZfCGqTgIgmhcKsAkQRBAJsAoXqCACUXojGcOwBx1EHYvKunRsKWAhHAywjNbY2rAMHCFqRpkiFOSMBcZDEAXyCBQiflwnVh2oyTMQoUOHCLfkKehg5YSQMiMq5PtkoOJERhUgpiBQxYODi6BCibrooNCHI1Y+oCOXwIJBgxaS5TtQJQQSQxou0iSi8qKGxTNJ5GDQeW1ItosY+CgRSvQcUqUEcDY1upLczxAo2VVtZI7qRJpWkHT8OLOokKP5SrJrAlFiWaf5MpYR8i9EwLdeFTIM4XDju3jyup7dqo/fSUFVxAU2mwJtunXt3O2ZRk5w46oKuB0m8iuYQEcfeK5c1uyZE1ZyXHF9MKH1hAfocu3q9QSTJk6eYlXczajUqVSBBhU6lGjlo0iTKgUS8iaTHDp28ETr82e5ETBiDJU5IyfMGutRptS8wk6LN/BRkChhYj0IADs=',
        iconStandin: 'i',
        html: '' + content,
        cancelText: '确定',
        onCancel: function () {
          if (func) {
            func()
          }
          // this.close();//重复调用了！
        }
      })
    },
    warn: function (content, func) {
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      return new Dialog({
        width: w,
        autoShow: true,
        iconDataURL: 'data:image/gif;base64,R0lGODlhIgAiAOYAAAAAAP/////58v/Ysv/ZtP/atv/cuf/dvP/hw//mzf/p0//t2//v3//x4//z5//06f/37//48f/Sqf/Sqv/Vrv/Wr//WsP/Ztf/ev//fwP/gwv/hxP/q1v/r2P/w4v/y5v/17P/27v/Kn//LoP/Ppf/38P+/kP/FmP/Gmf+5iP+8jP+iaf+qc/+uef+xfv98NP+DP/+LSf+TVP+UVv+aXv9VAP9XAv9YBP9bCP9eDf9jE/9kFv9mF/9nGf9oHf9uIv90Kv9zLf93Lv94NP+KUP+MU/+SW/+mef+sg/+0jv+1kP/CpP/Msv/Pt//dzP/u5f/z7f/ezv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFIALAAAAAAiACIAAAf/gFKCg4SFhoeIiYQRCAMIEYqRhwsDlY6SmIIQlhaVD5mSGpUnIpUYoIoOlRQ9OSSVDaiIB5U0NTUxlQWyhgyVIji3NiaVHbyDApYwt7dClhDHUgqVKczMLpUaxyCWP0RRglFEPRSVDrwZlSw1SoRKNTSVB7IflRM6NUyETDU4pQOxQBmoJOOWvkH8cOkCRWkAihu3khBKIozYAA6YNlV6wQwJISTMgFgKIanRABfWihAqYo1FtkgPKlnoYW3IE0FPhljjUW7AuUQYKq2wVsMHOClRfBCNN2AeogaVSOQgumOJoCU7iPqrxABRgUoxiN46AgXKEbE1YFQicIhDJRM2gtDKtaaiEkZC3CoBmcu3hshKIAilG7AObRAngpoEketyQIZBqgbck2uEkBG5OiaYE0RrgC3KlufOkCfF1wBgcw8LcrJY7tYBDBJUatG3NrMWlRKYrlRhhO/fwIML/y2Bq5TBlpIrX87c0oVBDDY0n079godDJbJr3869+/Zo4MMjCgQAOw==',
        iconStandin: '!',
        html: '' + content,
        cancelText: '确定',
        onCancel: function () {
          if (func) {
            func()
          }
          // this.close();//重复调用了！
        }
      })
    },
    confirm: function (content, okFn, noFn) {
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      return new Dialog({
        width: w,
        autoShow: true,
        iconDataURL: 'data:image/gif;base64,R0lGODlhIgAiANUAAAAAAP/////Wff/Wfv/Zhv/aiv/cjv/vzf/x0/2oBP6pBf+qBv+qB/+rCv+tD/+uEf+vFv+yGv+yHv+1JP+2J/+2Kf+3Kv+6Nv+/RP/CSv/FVf/HWv/IXf/Obf/Sev/SfP/Tff/Vfv/Yhv/Xh//Zjf/bk//cl//dmv/enf/foP/go//hp//jrP/krf/ms//ouv/qwP/sxv/sx//z2v/LaP/alP/14////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADcALAAAAAAiACIAAAb/wJtwSBweYDMEYgY7FJ/Q4kG2Mq2uWKvMGe0eXiZTS5VSXcmqVvjF7RIRYVdqdUKNPJ4R6rRKucIIbkMvKidlJRwWCguMCwoWHCVkJyovgn8uKyQZD40JjJ+MDxkkK5hdmWYgE40LDhiwGBcOjRMgK2YuUC4qmR2djA0lUDUMoh2mvVImfCDACwwxXSzGCw+3JyZtN2ApJBGtNIIajREkKSaWQgcmvButCzZENRg1RCytG73aQlQpJc8WQCBig5EEgq0elJgjQ8iKFis4wGMAAdYHDNBYEKEBj8PDFTfYFaIAryQDjUQkwKNASRuMPigWlWx0sghHeApQzEGCa8TMzFb2iFT4OcJMkisefjJyUGToTw9XlCBVuiAEEQNUoa5Y0pPqACICqBZdwQSmzJkiiIhQmnOnyBMkf5ogYkIpSxX8PkqkypeRR4j9+gDsS1Uhw3XtVLybSYAIgZ/6/rTp9o2x45nm0KlD3Cwgo8ZDHsO7RocfEV6+PBcgUmA0MtS7cK1Y1ehs7Vq3cqFqp4lTYVKm2gkiZEgFIkWtHkWaVEmQEDjt5tS5k2dPnz8mAjlfB0YMmjNl1KTbtj0kFStYrmghX57IkSRLmmwPAgA7',
        iconStandin: '?',
        html: content,
        onOk: function () {
          if (!okFn) {
            return this.close()
          }
          if (okFn.call(this, window) !== false) {
            this.close()
          }
        },
        onCancel: noFn || function () { }
      })
    },
    prompt: function (content, okFn, defaultValue) {
      defaultValue = defaultValue || ''
      var input
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      return new Dialog({
        width: w,
        autoShow: true,
        html: ['<div style="margin-bottom:5px;font-size:12px">', content, '</div>', '<div>', '<input type="text" value="', defaultValue || '', '" style="width:18em;padding:3px 2px" />', '</div>'].join(''),
        onShow: function () {
          input = this.dom.$body.find('input')[0]
          input.select()
          input.focus()
        },
        onOk: function (e) {
          return okFn && okFn.call(this, input.value, e)
        }
      })
    },

    tips: function (content, autoClose) {
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      return new Dialog({
        width: w,
        autoShow: true,
        title: false,
        modal: false,
        html: '<div style="padding: 0 1em;">' + content + '</div>',
        autoClose: autoClose || 2
      })
    },
    WaitID: null,
    wait: function (content) {
      var w = Math.max(Math.min(String(content).replace(/<[^>]+>/g, '').length * 12 + 100, getResponseWidth($window.width())), 300)
      var _waitSecondCount = 0
      var _timerId
      var dlg = new Dialog({
        width: w,
        autoShow: true,
        html: content,
        // title:false,
        // closable:false,
        onCancel: function () {
          return false
        }
      })
      var waitAction = function () {
        if (!dlg || dlg.destroying === true) {
          if (_timerId) {
            clearTimeout(_timerId)
          }
          return
        }
        _waitSecondCount++
        dlg.cancelButton.innerText = '请等待' + '(' + _waitSecondCount + ')...'
        dlg.waitTimer = _timerId = setTimeout(waitAction, 1000)
      }
      dlg.waitTimer = _timerId = setTimeout(waitAction, 1000)
      dlg.on('beforeclose', function () {
        clearTimeout(_timerId)
      })
      return dlg
    },
    getInstance: function (id) {
      return Dialog.Manager.get(id)
    }
  })

  Dialog.list = {}
  Dialog.accessList = []
  Dialog.front = null // 最前面的dialog实例

  if (window !== topWin) {
    Dialog.list = topWin.Dialog.list
    Dialog.accessList = topWin.Dialog.accessList
    Dialog.front = topWin.Dialog.front
  }

  Dialog.Manager = (function () {
    var onFront = function (dlg) {
      if (Dialog.accessList.length === 1) {
        Dialog.front = topWin.Dialog.front = dlg
      }
    }
    var onShow = function (dlg) {
      if (Dialog.isHideScrollbar) {
        var topBody = topDoc.getElementsByTagName(topDoc.compatMode === 'BackCompat' ? 'BODY' : 'HTML')[0]
        topBody._styleOverflow = topBody.style.overflow
        if (!z.isIE) { // 在firefox下改变overflow属性会导致scrollTop=0
          var topWinBodyScrollTop = topBody.scrollTop
          topBody.style.overflow = 'hidden'
          topBody.scrollTop = topWinBodyScrollTop
        } else {
          topBody.style.overflow = 'hidden'
        }
      }
      if (Dialog.isPreventScroll) {
        // Event.lockScroll();
      }
    }
    var onClose = function (dlg) {
      if (Dialog.accessList.length < 2) { // 只剩下了正在关闭的这个Dialog，则隐藏遮罩
        if (topWin.getDom('_DialogShim')) {
          topWin.$('#_DialogShim').hide()
        }
        if (Dialog.isHideScrollbar) {
          var topBody = topDoc.getElementsByTagName(topDoc.compatMode === 'BackCompat' ? 'BODY' : 'HTML')[0]
          if (topBody._styleOverflow !== undefined) {
            if (!z.isIE) { // 在firefox下改变overflow属性会导致scrollTop=0
              var topWinBodyScrollTop = topBody.scrollTop
              topBody.style.overflow = topBody._styleOverflow
              topBody.scrollTop = topWinBodyScrollTop
            } else {
              topBody.style.overflow = topBody._styleOverflow
            }
          }
        }
        // Event.unlockScroll();
      }
      // Event.unlockScroll();
    }
    var sortDialogs = function (d1, d2) {
      return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1
    }
    var orderDialogs = function () {
      var a = Dialog.accessList
      var len = a.length
      if (len > 0) {
        a.sort(sortDialogs) // 对窗口层叠排序
        var seed = a[0].manager.zseed
        for (var i = 0; i < len; i++) {
          var dlg = a[i]
          if (dlg && !dlg.hidden) {
            dlg.setZIndex(seed + (i * 10))
          }
        }
      }
      activateLast()
    }

    var setActiveDlg = function (dlg) {
      if (dlg !== topWin.Dialog.front) {
        if (topWin.Dialog.front) {
          topWin.Dialog.front.setActive(false)
        }
        Dialog.front = topWin.Dialog.front = dlg
        if (dlg) {
          dlg.setActive(true)
        }
      }
    }
    var activateLast = function () {
      for (var i = Dialog.accessList.length - 1; i >= 0; --i) {
        if (!Dialog.accessList[i].hidden) {
          setActiveDlg(Dialog.accessList[i])
          return
        }
      }
      // none to activate
      setActiveDlg(null)
    }

    return {
      zseed: 10100,
      listenKeydown: function (evt, dlg) {
        evt = z.getEvent(evt)
        var target = evt.target
        if (evt.keyCode === 27) { // 按下esc健
          if (dlg && dlg.ctype === 'dialog') {
            if (target.nodeName && /^textarea$/i.test(target.nodeName) && target.defaultValue !== target.value && target.value.length > 2 && !window.confirm('侦测文本框中的内容已经被修改，你确定要放弃修改吗？')) {
              return
            }
            dlg.onEsc(evt)
          } else if (topWin.Dialog.front && topWin.Dialog.front.esc) {
            topWin.Dialog.front.onEsc(evt)
          }
        }
      },
      closeAll: function (beSelf) {
        if (Dialog.accessList.length > 0) {
          Dialog.accessList.forEach(function (d) {
            if (beSelf) {
              if (d.opener === window) {
                d.close()
              }
            } else {
              d.close()
            }
          })
          return true
        }
        return false
      },
      register: function (dlg) {
        Dialog.list[dlg.id] = dlg
        Dialog.accessList.push(dlg)
        dlg.on('hide', activateLast)
        dlg.on('show', onShow)
        dlg.on('beforeclose', onClose)
      },
      unregister: function (dlg) {
        delete Dialog.list[dlg.id]
        dlg.off('hide', activateLast)
        dlg.off('show', onShow)
        dlg.off('beforeclose', onClose)
        Dialog.accessList.remove(dlg)
      },
      get: function (id) {
        return typeof id === 'object' ? id : Dialog.list[id]
      },
      bringToFront: function (dlg) {
        dlg = this.get(dlg)
        if (dlg !== topWin.Dialog.front) {
          dlg._lastAccess = new Date().getTime()
          orderDialogs()
          onFront(dlg)
          return true
        }
        return false
      },

      sendToBack: function (dlg) {
        dlg = this.get(dlg)
        dlg._lastAccess = -(new Date().getTime())
        orderDialogs()
        return dlg
      },
      getActive: function () {
        return topWin.Dialog.front
      }

    }
  }())

  var $document = $(document)
  var $window = $(window)
  $(function () {
    if (z.restricted || !window.frameElement) {
      return
    }
    var ownerdialogid
    try {
      ownerdialogid = window.frameElement.getAttribute('ownerdialogid')
    } catch (ex) {
      window.console && console.error('没有权限：可能因为跨域，对话框不能与父窗口交互。')
    }
    if (!ownerdialogid) {
      return
    }

    var ownerDlg
    ownerDlg = topWin.Dialog.list[ownerdialogid]
    if (!ownerDlg) {
      return
    }
    window.ownerDialog = ownerDlg // 当前页面所在的dialog
    window.dialogOpener = ownerDlg.opener
    if (ownerDlg.getTitle() === '' && document.title) {
      if (ownerDlg.title !== false) {
        ownerDlg.setTitle(document.title)
      }
    }
    if (ownerDlg.onIframeReady) {
      ownerDlg.onIframeReady(window) // 隐藏load框
      ownerDlg.onIframeReady = null
    }
  })

  $document.on('keydown', Dialog.Manager.listenKeydown)

  $window.on('unload', function () {
    // console.log('dialog.js#1344 window unload'+(+new Date()));
    $document.off('keydown', Dialog.Manager.listenKeydown)
    Dialog.Manager.closeAll(true)
    window.ownerDialog = window.dialogOpener = null
    if (window === topWin) {
      $('#_DialogShim').off()
    }
  }) // 页面卸载前关闭所有从当前window打开的对话框

  var importCSS = function (url) {
    if (!document.body || document.readyState === 'loading') {
      document.write('<link rel="stylesheet" type="text/css" href="' + url + '" />')
    } else {
      var head = document.getElementsByTagName('head')[0] || document.documentElement
      var e = document.createElement('link')
      e.rel = 'stylesheet'
      e.type = 'text/css'
      e.href = url
      var scripts = head.getElementsByTagName('script')
      var script = scripts[scripts.length - 1]
      head.insertBefore(e, script)
    }
  }
  importCSS(jsPath + 'Dialog.css')

  if (!topWin.Dialog) {
    window.alert('在iframe内使用zDialog时，请确保顶层窗口也有引用zDialog.js')
  }
})()
