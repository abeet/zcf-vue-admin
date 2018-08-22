/* pluginName：自定义插件：'分页'
 * codeDate：2013.11.15
 * author：zhangshaoliu
 */

UE.plugins['zpagebreak'] = function() {
  var me = this
  me.commands['zpagebreak'] = {
    execCommand: function(cmd, name) {

      var number = parseInt(Math.random() * 10000)
      var neweditor = ZPageBreak.addPageBlock(me, number)

      // 往编辑器选区插入 分页的标识
      var range = me.selection.getRange()
      var pageBreakMark = this.document.createElement('span')
      UE.dom.domUtils.setAttributes(pageBreakMark, {
        style: 'page-break-after: always;'
      })
      range.insertNode(pageBreakMark)

      var content = me.getContent()
      var pageBreakAfterAlways = /page-break-after:\s?always/i.exec(content)
      var breakAfterPage = false
      if (pageBreakAfterAlways == null) {
        breakAfterPage = /break-after:\s?page/i.exec(content)
      }
      var contentSplit = content.split(
        breakAfterPage ? /<span[^>]+break-after:\s?page[^>]+><\/span>/i : /<span[^>]+page-break-after:\s?always[^>]+><\/span>/i
      )
      var prevContent = contentSplit[0],
        nextContent = contentSplit[1] || '' // 当在空页中执行分页操作时，getContent返回''导致contentSplit.length=1
      me.setContent(prevContent)
      neweditor.addListener('ready', function(type, evt) {
        this.setContent(nextContent)
      })
    }
  }
}

var ZPageBreak = window.ZPageBreak = {}

// 添加分页区块
ZPageBreak.addPageBlock = function(me, pageIndex) {
  var opts = me.options

  $('.divPageTitle').show() // 显示分页标题
    // 在当前要分页的编辑器容器后添加  新的分页标题和编辑器容器
  // console.log(me)
  $(me.container).parents('.vue-ueditor').append(
    '<div class="divPageTitle" id="divPageTitle_' +
    pageIndex +
    '" style="margin: 5px 0">' +
    '<span class="el-form-item__label">分页标题：</span><div class="el-input" style="width:80%;"><input type="text" id="PageTitle_' +
    pageIndex +
    '" name="PageTitle" class="el-input__inner"/></div>' +
    '<button class="el-button el-button--default" onclick="ZPageBreak.mergePage(this)"><span>合并分页</span></button>' +
    '</div><div id="editor_' + pageIndex + '" style="min-height:400px;"></div>'
  )

  var options = {
    dataType: opts.dataType,
    ID: opts.ID || '',
    catalogID: opts.catalogID,
    siteID: opts.siteID,
    resourceProps: opts.resourceProps,
    logoFile: opts.logoFile,
    wordCount: false, // 关闭字数统计
    minFrameHeight: opts.minFrameHeight,
    initialFrameWidth: opts.initialFrameWidth,
    initialFrameHeight: opts.initialFrameHeight,
    // toolbars:[[]], // 去掉编辑工具栏
    toolbars: opts.toolbars,
    initialStyle: opts.initialStyle,
    elementPathEnabled: opts.elementPathEnabled, // 关闭elementPath
    autoFloatEnabled: opts.autoFloatEnabled, // 是否保持toolbar的位置不动,默认true
    dataID: opts.dataID,
    imageWidth: opts.imageWidth,
    imageHeight: opts.imageHeight,
    allowAudioType: opts.allowAudioType,
    selfCatalog: opts.selfCatalog,
    language: opts.language,
    contextPath: opts.contextPath,
    page: pageIndex
  }

  return UE.getEditor('editor_' + pageIndex, options)
}

// 分页合并
ZPageBreak.mergePage = function(me) {
  var currentPageTitle, prevEditor, currentEditor,

  currentPageTitle = $(me).parent()

  var currentID = currentPageTitle.nextAll('.edui-notadd')[0].id,
    prevID = currentPageTitle.prevAll('.edui-notadd')[0].id;

  prevEditor = UE.getEditor(prevID);
  currentEditor = UE.getEditor(currentID);

  var content = prevEditor.getContent() + currentEditor.getContent();

  prevEditor.setContent(content);

  currentEditor.destroy();

  // setTimeout(function() {
    // console.log(currentID, $("#"+ currentID));

    $("#" + currentID).remove()
  // }, 100);

  currentPageTitle.remove()

  if ($('.divPageTitle').length <= 1) {
    $('.divPageTitle').hide()
  }
}

// 编辑器工具栏切换【视觉效果：所有编辑器公用一个工具栏】
/* editor: 编辑器实例
 * content：编辑器内容数据
 */
ZPageBreak.boolbarSwitch = function(editor, content) {
  var me = editor,
    editor_toolbarbox = null
    // 设置编辑器内容
  me.setContent(content)
    // 将编辑工具条移到目标区域中
  editor_toolbarbox = me.ui.getDom('toolbarbox')
  $('#editorToolbarWrap').append(editor_toolbarbox)
  if (editor_toolbarbox) {
    $(editor_toolbarbox).hide() // 隐藏新创建的编辑器的工具栏
  }
  // 根据当前focus的编辑器来切换显示/隐藏工具栏
  UE.dom.domUtils.on(me.window, 'focus', function() {
    $('#editorToolbarWrap .edui-editor-toolbarbox').hide()
    $(me.ui.getDom('toolbarbox')).show()
  })
  UE.dom.domUtils.on(me.container, 'click', function() {
    // 根据当前focus的编辑器来切换显示/隐藏工具栏
    $('#editorToolbarWrap .edui-editor-toolbarbox').hide()
    $(me.ui.getDom('toolbarbox')).show()
  })
}


