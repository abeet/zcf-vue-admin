
/* pluginName：自定义插件：'插入栏目资源路径'
 * codeDate：2015.5.1
 * author：wangzhaohui
*/
UE.plugins['zresourceurl'] = function () {
  var me = this, editor = this
  var _cursorPosition
  // console.log(UEditorPath,'xxxx')
  editor.addListener('selectionchange', function () {
    baidu.editor.ui.buttons.zresourceurl && baidu.editor.ui.buttons.zresourceurl.setChecked(false)
  })
  editor.commands['zresourceurl'] = {
    execCommand: function () {
      if (editor.options.sourceEditor == 'textarea') {
        var textarea = editor.sourceEditor.textarea
        _cursorPosition = cursorPosition.get(textarea)
      }
      var url = Zving.CONTEXTPATH + 'contentcore/resourceselector/fileResources.zhtml?InputType=radio&DataType=' + me.options.dataType + '&DataID=' + me.options.dataID + '&CatalogID=' + me.options.catalogID + '&ResourceType=file'
      var Dialog = baidu.editor.ui.Dialog
      var dialog = new Dialog({
          editor: editor,
        iframeUrl: url,
         width: 800,
         height: 450,
         title: '插入栏目资源路径',
        buttons: [
          {
            className: 'edui-cancelbutton',
            label: editor.getLang('cancel'),
            editor: editor,
            onclick: function () {
              dialog.close(false)
            }
          },
          {
            className: 'edui-okbutton',
            label: editor.getLang('ok'),
            editor: editor,
            onclick: dlgOnOk
          },
        ]
      })

      var dlgOnOk = function () {
        var arr = $DW.$N('SelectedID'),
          id, url, fileName = ''
        for (var i = 0; arr && i < arr.length; i++) {
          if (arr[i].checked) {
            id = arr[i].value
            url = $DW.$V('Prefix_' + id) + $DW.$V('URL_' + id)
            fileName: $DW.$V('Name_' + id)
          }
        }
        if (editor.options.sourceEditor == 'codemirror') {
          var cm = editor.sourceEditor.getCodeMirror()
          cm.replaceSelection(url)
        } else if (editor.options.sourceEditor == 'textarea') {
          textarea = editor.sourceEditor.textarea
          cursorPosition.add(textarea, _cursorPosition, url)
        }

        // editor.execCommand("insertHTML",html);
        dialog.close()
      }
      dialog.open()
    },
    queryCommandState: function () {
      return editor.queryCommandState('source') ? 0 : -1
    }
  }

	/**
	* cursorPosition Object
	*/
  var cursorPosition = {
    get: function (textarea) {
      var rangeData = {
        text: '',
        start: 0,
        end: 0
      }

      if (textarea.setSelectionRange) { // W3C
        textarea.focus()
        rangeData.start = textarea.selectionStart
        rangeData.end = textarea.selectionEnd
        rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : ''
      } else if (document.selection) { // IE
        textarea.focus()
        var i,
          oS = document.selection.createRange(),
          // Don't: oR = textarea.createTextRange()
          oR = document.body.createTextRange()
        oR.moveToElementText(textarea)

        rangeData.text = oS.text
        rangeData.bookmark = oS.getBookmark()

        // object.moveStart(sUnit [, iCount])
        // Return Value: Integer that returns the number of units moved.
        for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart('character', -1) !== 0; i++) {
          // Why? You can alert(textarea.value.length)
          if (textarea.value.charAt(i) == '\r') {
            i++
          }
        }
        rangeData.start = i
        rangeData.end = rangeData.text.length + rangeData.start
      }

      return rangeData
    },

    set: function (textarea, rangeData) {
      var oR,
        start,
        end
      if (!rangeData) {
        alert('You must get cursor position first.')
      }
      textarea.focus()
      if (textarea.setSelectionRange) { // W3C
        textarea.setSelectionRange(rangeData.start, rangeData.end)
      } else if (textarea.createTextRange) { // IE
        oR = textarea.createTextRange()

        // Fixbug : ues moveToBookmark()
        // In IE, if cursor position at the end of textarea, the set function don't work
        if (textarea.value.length === rangeData.start) {
          // alert('hello')
          oR.collapse(false)
          oR.select()
        } else {
          oR.moveToBookmark(rangeData.bookmark)
          oR.select()
        }
      }
    },

    add: function (textarea, rangeData, text) {
      var oValue,
        nValue,
        oR,
        sR,
        nStart,
        nEnd,
        st
      this.set(textarea, rangeData)

      if (textarea.setSelectionRange) { // W3C
        oValue = textarea.value
        nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end)
        nStart = nEnd = rangeData.start + text.length
        st = textarea.scrollTop
        textarea.value = nValue
        // Fixbug:
        // After textarea.values = nValue, scrollTop value to 0
        if (textarea.scrollTop != st) {
          textarea.scrollTop = st
        }
        textarea.setSelectionRange(nStart, nEnd)
      } else if (textarea.createTextRange) { // IE
        sR = document.selection.createRange()
        sR.text = text
        sR.setEndPoint('StartToEnd', sR)
        sR.select()
      }
    }
  }
}
addStyle('.edui-toolbar div.edui-for-zresourceurl .edui-icon{background:url("' + UEditorPath + 'icon_resourceurl.gif") center no-repeat;}')
