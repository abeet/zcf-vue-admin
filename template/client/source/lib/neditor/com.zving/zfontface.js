
(function () {
  // 编辑区内容的font-family属性控制（这个属性决定输入的字体字符是否可见。例如，如果选择蒙文，则可接受蒙文输入但不会接受藏文输入）
  UE.plugins['zbodyfontfamily'] = function () {
    var me = this

    var fontsUrl = window.UEDITOR_CONFIG.UEDITOR_HOME_URL + 'fonts/'
    // @font-face {font-family: mnglwhite;font-style:  normal;font-weight: normal;

    var currentBodyFontFamily = defaultFontFamily = me.options.bodyFontFamily || window.UEDITOR_CONFIG.bodyFontFamily || 'default'
    var elRelated = null
    var clsPrefix = 'body-font-family-'

    var bodyFontFamilys = {// 字体名和用于加载字体需要的css样式字符串构成的名值对
      'inherit': {},
      'mnglwhite': {
        // className=clsPrefix + ${name};类样式形式：.${className}{font-family:${name};}
        // 选定某个font-family后，先加载字体，然后把对应的class赋予关联元素（一共两个关联元素；一个是编辑区对应的body元素，另一个是编辑所在页面的body元素）
        // 加载字体使用的样式；（字体文件放在fontsUrl目录下）
        'fontFace': '@font-face {font-family: mnglwhite;src:url("' + fontsUrl + 'mnglwhite.ttf");src: url("' + fontsUrl + 'mnglwhite.eot")\\9;}'
      }
    }
    var fontFaceLoaded = {}// 记录已加载的字体，避免重复加载
    me.setOpt('zbodyfontfamily', [
      { name: 'inherit', val: 'inherit' },
      { name: 'mnglwhite', val: 'mnglwhite' }
    ]
    )
    // 把样式添加到页面
    var cssText = ''
    for (var p in bodyFontFamilys) {
      cssText += '.' + clsPrefix + p + '{font-family:' + p + ';}'
      cssText += 'div.' + clsPrefix + p + ' pre{font-family:' + p + ';}'
      cssText += 'div.' + clsPrefix + p + ' textarea{font-family:' + p + ';}'// IE中使用的textarea
    }
    addStyle(cssText)
    me.ready(function () {
      addStyle(null, cssText, me.window)
      elRelated = me.container
      me.execCommand('zbodyfontfamily', defaultFontFamily)
    })

    me.commands['zbodyfontfamily'] = {
      execCommand: function (cmdName, fontFamily) {
        if (!bodyFontFamilys[fontFamily || '']) { return }

        var domUtils = UE.dom.domUtils

        // 如果需要自定义字体且没字体还没被加载，则加载字体
        if (bodyFontFamilys[fontFamily]['fontFace'] && !fontFaceLoaded['fontFace']) {
          addStyle(bodyFontFamilys[fontFamily]['fontFace'])
          addStyle(bodyFontFamilys[fontFamily]['fontFace'], me.window)
          fontFaceLoaded[fontFamily] = true
        }

        // 重新挂载样式类
        $(elRelated).removeClass(clsPrefix + currentBodyFontFamily)
        domUtils.removeClasses(me.body, clsPrefix + currentBodyFontFamily)

        currentBodyFontFamily = fontFamily

        $(elRelated).addClass(clsPrefix + currentBodyFontFamily)
        domUtils.addClass(me.body, clsPrefix + currentBodyFontFamily)
      }
    }
  }
}())
