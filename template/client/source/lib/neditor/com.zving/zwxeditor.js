/* pluginName：微信正文内容编辑器
 * codeDate：2018年7月2日
 * author：zhuzl@zving.com
*/

UE.plugins['zwxeditor'] = function () {
  var me = this
  var wxeditor = {
    activeSnippetInEditor: null,
    ueditorIframeInitWidth: me.options.frameBodyWidth,
    expanded: false,
    // editor: me,
    $toggleEl:null,
    $editorPanel: null,
    wxPanelWidth : 430, // 微信编辑器面板显示宽度
    editorWidth : 400, // 全屏模式下编辑器显示宽度
    // 初始化，显示位置控制，事件监听（全屏、查看源码、图片获得焦点等）
    init(){
      this.$toggleEl = $('.wxeditor-toggle-arrow')
      this.$editorPanel = $(".wxeditor-toggle-content")
      this.ueditorIframeInitWidth = parseInt($(me.iframe.parentNode).width(), 10) || me.options.frameBodyWidth
      me.addListener('click', wxeditor.clickOnEditor)
      // 源码切换
      this.sourceModeChangeHandler()
      // 监听切换全屏状态
      this.fullscreenChangeHandler()
      // 添加ueditor命令:wxeditorexpand/wxeditorcollapse
      this.addUEditorCommands()
    },
    // 正文内容单击
    clickOnEditor(t, evt) {
      evt = evt || window.event;
      var el = evt.target || evt.srcElement;
      var $el;
      if (($el=$(el).closest('.pEditor')).size() > 0) {
        el = $el.get(0);
        if (wxeditor.activeSnippetInEditor) {
          wxeditor.activeSnippetInEditor.removeAttr('style');
        }

        wxeditor.activeSnippetInEditor = $el;
        wxeditor.activeSnippetInEditor.css({
          'outline' : '1px dotted #0faeff'
        });
        wxeditor.clickPop.render();
        var html = wxeditor.clickPop
          .formatHtml('<nobr class="otf-poptools">'
             + '<span onclick="$$._remove()" stateful>'
             + '删除模板</span>　'
             + '<span onclick="$$._preblank()" stateful>'
             + '前面插入空行</span>　<span onclick="$$._blank()" stateful>'
             + '后面插入空行</span>' + '</nobr>');
        var content = wxeditor.clickPop.getDom('content');
        content.innerHTML = html;
        // $(el).find('.select').tooltip({
        // 	'title' : '选中后，可以秒刷更换为别的样式'
        // });
        if ($(el).find('.pBg').size()) {
          $(content).find('.pBg').removeClass(
            'hidden');
        }
        if ($(el).find('.video_iframe').size()) {
          $(content).find('._P_video').removeClass(
            'hidden');
        }
        var bdbg_flag = false;
        $(el).find('*').each(function () {
          if (this.style.background
             || this.style.border
             || this.style.borderBottom
             || this.style.borderTop
             || this.style.borderLeft
             || this.style.borderRight) {
            bdbg_flag = true;
          }
        });
        if (bdbg_flag && navigator.userAgent.match(/WebKit/)) {
          $(content).find('._P_bdbg').removeClass('hidden');
        }
        wxeditor.clickPop.anchorEl = el;
        wxeditor.clickPop.showAnchor(wxeditor.clickPop.anchorEl);
      } else {
        if (wxeditor.activeSnippetInEditor) {
          wxeditor.activeSnippetInEditor.removeAttr('style');
          wxeditor.activeSnippetInEditor = null;
        }
      }
    },
    clickPop : new baidu.editor.ui.Popup({
      content : "",
      editor : me,
      _remove : function() {
        $(wxeditor.clickPop.anchorEl).remove();
        wxeditor.clickPop.hide();
      },
      _blank : function() {
        $('<p><br/></p>').insertAfter(wxeditor.clickPop.anchorEl);
        wxeditor.activeSnippetInEditor.removeAttr("style");
        wxeditor.clickPop.hide();
      },
      _preblank : function() {
        $('<p><br/></p>').insertBefore(wxeditor.clickPop.anchorEl);
        wxeditor.activeSnippetInEditor.removeAttr("style");
        wxeditor.clickPop.hide();
      },
      pBg : function() {
        // console.log("pbg");
        // pBgDialog.render();
        // pBgDialog.open();
        // pBgDialog.anchorEl = wxeditor.clickPop.anchorEl;
      },
      _P_clearStyle : function() {
        wxeditor.activeSnippetInEditor.html(wxeditor.activeSnippetInEditor.find('.pBrush')
            .get(0).innerText);
      },
      _pItem : null,
      className : 'edui-bubble'
    }),
    addUEditorCommands() {
      // 展开编辑器
      me.commands['wxeditorexpand'] = {
        execCommand: function() {
          var isFullScreen = me.ui.isFullScreen()
          wxeditor.fixedPanelPosition()
          if(isFullScreen) {
            var leftValue = ($(window).width() - wxeditor.editorWidth) / 2
            me.iframe.parentNode.style.marginLeft = leftValue + 'px'
            me.iframe.parentNode.style.width = wxeditor.editorWidth + 'px'
            me.iframe.contentDocument.body.style.width = '95%'
          } else {
            me.iframe.parentNode.style.marginLeft = wxeditor.wxPanelWidth + 'px'
            me.iframe.parentNode.style.width = wxeditor.ueditorIframeInitWidth - wxeditor.wxPanelWidth + 'px'
            me.iframe.contentDocument.body.style.width = '95%'
          }
          wxeditor.expanded = true
        }
      }
      me.commands['wxeditorcollapse'] = {
        execCommand: function() {
          var isFullScreen = me.ui.isFullScreen()
          if(isFullScreen) {
            me.iframe.parentNode.style.marginLeft = 0
            me.iframe.parentNode.style.width = "100%"
            me.iframe.contentDocument.body.style.width = me.options.frameBodyWidth + 'px'
          } else {
            me.iframe.parentNode.style.marginLeft = 0
            me.iframe.parentNode.style.width = wxeditor.ueditorIframeInitWidth + 'px'
            me.iframe.contentDocument.body.style.width = me.options.frameBodyWidth + 'px'
          }
          wxeditor.expanded = false
        },
        queryCommandState: function() {
          return 1
        },
        notNeedUndo: 1
      }
    },
    // 切换源码模式
    sourceModeChangeHandler(){
      // 为便于跟vue代码整合，相关代码逻辑见articleEditor.js中的sourceModeChangeHandler
    },
    fixedPanelPosition(){
      var $panel = wxeditor.$editorPanel
      var $toolbar = $('.edui-toolbar')
      var toolbarHeight = $toolbar.height()
      var isFullScreen = me.ui.isFullScreen()
      if(isFullScreen) {
        var left = ($(window).width() - wxeditor.wxPanelWidth) / 2 - wxeditor.wxPanelWidth
        $panel.css({
          position: 'fixed',
          top: (toolbarHeight + 10) + 'px',
          left: left + 'px'
        })
      } else {
        $panel.css({
          position: 'absolute',
          top: (toolbarHeight + 10) + 'px',
          left: 0
        })
      }
    },
    fullscreenChangeHandler(){
      me.on('fullscreenchanged', (e, enabled) => {
        wxeditor.fixedPanelPosition()
        if (enabled) {
          if (wxeditor.expanded) {
            var leftValue = ($(window).width() - wxeditor.editorWidth) / 2
            me.iframe.parentNode.style.marginLeft = leftValue + 'px'
            me.iframe.parentNode.style.width = wxeditor.editorWidth + 'px'
            me.iframe.contentDocument.body.style.width = '95%'
          }
        } else {
          if (wxeditor.expanded) {
            me.iframe.parentNode.style.marginLeft = wxeditor.wxPanelWidth + 'px'
            me.iframe.parentNode.style.width = wxeditor.ueditorIframeInitWidth - wxeditor.wxPanelWidth + 'px'
            me.iframe.contentDocument.body.style.width = '95%'
          }
        }
      })
    }
  }
  me.ready(function(){
    wxeditor.init()
  })


}
