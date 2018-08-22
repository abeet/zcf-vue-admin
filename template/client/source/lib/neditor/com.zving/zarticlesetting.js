/**
 * 设置选中文字的文章标题
 * @author fmy@zving.com
 */
UE.plugins['zarticlesetting'] = function () {
  var editor = this
  UE.commands['settitle'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.title=title
      editor.fireEvent("changeOptions");
      // document.getElementById('Title').value = title // 标题
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setshorttitle'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.shortTitle=title
      editor.fireEvent("changeOptions");
      // document.getElementById('ShortTitle').value = title // 短标题
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setsubtitle'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.subTitle=title
      editor.fireEvent("changeOptions");
      // document.getElementById('SubTitle').value = title // 副标题
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setkeyword'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.keyword=title
      editor.fireEvent("changeOptions");
      // document.getElementById('Keyword').value = title // 关键词
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setauthor'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.author=title
      editor.fireEvent("changeOptions");
      // document.getElementById('Author').value = title // 作者
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setsource'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.source=title
      editor.fireEvent("changeOptions");
      // document.getElementById('Source').value = title // 来源
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
  UE.commands['setsummary'] = {
    execCommand: function () {
      var node = editor.selection.getStart()
      var title = editor.selection.getText()
      if (!title) {
        return
      }
      editor.options.summary=title
      editor.fireEvent("changeOptions");
      // document.getElementById('Summary').value = title // 摘要
    },
    queryCommandState: function () {
      var node = editor.selection.getStart()
      return !this.highlight && node ? 0 : -1
    }
  }
}
addStyle('.edui-default  div.edui-for-setTextTo .edui-icon{background:url("' + UEditorPath + 'icon_setting.png") center no-repeat;}')
