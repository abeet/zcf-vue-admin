<style scoped>
  .template-input,
  .template-btns {
    padding: 10px 10px 5px;
  }
</style>
<template>
  <div class="pane-wrap">
    <el-toolbar>
      <el-button :disabled="!modelId" @click="saveTemplateClickHandler">
        <i class="fa fa-floppy-o"></i>保存</el-button>
    </el-toolbar>
    <div class="layout-content-padding scroll" v-loading="dataLoading">
      <div class="template-btns">
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('model:fieldgroup')">字段组标签</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('model:field')">字段标签</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('fieldgroup.name')">字段组名称</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('fieldgroup.code')">字段组Code</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('field.name')">字段名称</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('field.code')">字段Code</el-button>
        <el-button :disabled="!modelId" @click="addTemplateClickHandler('field.htmlcontrol')">字段控件</el-button>
      </div>
      <div class="template-input" v-for="(item, index) in metadataTemplate" :key="index">
        <h4>\{{item.name}}</h4>
        <el-input type="textarea" :rows="10"
          :id="'tpl_text_' + item.MMTemplateTypeID"
          @focus="textareaFocusHandler(item.MMTemplateTypeID)"
          :disabled="!modelId" v-model="item.template">
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
  import util from '../../common/util.js'
  // let currentTemplateEditor = null//模板编辑变量
  // const cursorPosition = {
  //   get: function (textarea) {
  //     var rangeData = {text: '', start: 0, end: 0}
  //     if (textarea.setSelectionRange) { // W3C
  //       textarea.focus()
  //       rangeData.start = textarea.selectionStart
  //       rangeData.end = textarea.selectionEnd
  //       rangeData.text = (rangeData.start != rangeData.end)
  //         ? textarea.value.substring(rangeData.start, rangeData.end)
  //         : ''
  //     } else if (document.selection) { // IE
  //       textarea.focus()
  //       var i,
  //         oS = document.selection.createRange(),
  //         // Don't: oR = textarea.createTextRange()
  //         oR = document.body.createTextRange()
  //       oR.moveToElementText(textarea)
  //       rangeData.text = oS.text
  //       rangeData.bookmark = oS.getBookmark()
  //       // object.moveStart(sUnit [, iCount])
  //       // Return Value: Integer that returns the number of units moved.
  //       for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
  //         // Why? You can alert(textarea.value.length)
  //         if (textarea.value.charAt(i) == '\r') {
  //           i++
  //         }
  //       }
  //       rangeData.start = i
  //       rangeData.end = rangeData.text.length + rangeData.start
  //     }
  //     return rangeData
  //   },

  //   set: function (textarea, rangeData) {
  //     var oR, start, end
  //     if (!rangeData) {
  //       alert('You must get cursor position first.')
  //     }
  //     textarea.focus()
  //     if (textarea.setSelectionRange) { // W3C
  //       textarea.setSelectionRange(rangeData.start, rangeData.end)
  //     } else if (textarea.createTextRange) { // IE
  //       oR = textarea.createTextRange()
  //       // Fixbug : ues moveToBookmark()
  //       // In IE, if cursor position at the end of textarea, the set function don't work
  //       if (textarea.value.length === rangeData.start) {
  //         //alert('hello')
  //         oR.collapse(false)
  //         oR.select()
  //       } else {
  //         oR.moveToBookmark(rangeData.bookmark)
  //         oR.select()
  //       }
  //     }
  //   },
  //   add: function (textarea, rangeData, text) {
  //     var oValue, nValue, oR, sR, nStart, nEnd, st
  //     this.set(textarea, rangeData)
  //     if (textarea.setSelectionRange) { // W3C
  //       oValue = textarea.value
  //       nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end)
  //       nStart = nEnd = rangeData.start + text.length
  //       st = textarea.scrollTop
  //       textarea.value = nValue
  //       // Fixbug:
  //       // After textarea.values = nValue, scrollTop value to 0
  //       if (textarea.scrollTop != st) {
  //         textarea.scrollTop = st
  //       }
  //       textarea.setSelectionRange(nStart, nEnd)
  //     } else if (textarea.createTextRange) { // IE
  //       sR = document.selection.createRange()
  //       sR.text = text
  //       sR.setEndPoint('StartToEnd', sR)
  //       sR.select()
  //     }
  //   },
  // }
  export default {
    props: { modelId: [String, Number], tabName: String },
    data() {
      return {
        metadataTemplate: [],/**模板数据 */
        dataLoading: false,
        currentTemplateID: ''
      }
    },
    methods: {
      /**模板输入框获取焦点事件 */
      textareaFocusHandler(val) {
        this.currentTemplateID = val
        // currentTemplateEditor = event.target
        // let mMTemplateTypeID = event.target.id.replace('tpl_text_','')
        // let index = this.metadataTemplate.findIndex(val => val.MMTemplateTypeID == mMTemplateTypeID)
        // if(index!==-1){
        //   this.metadataTemplate[index].template = event.target.value
        // }
      },
      /**添加模板 */
      addTemplateClickHandler(key) {
        if (!this.currentTemplateID) {
          return
        }
        let tpl = ''
        switch (key) {
          case 'model:fieldgroup':
            tpl = '<model:fieldgroup code="字段分组Code"></model:fieldgroup>'
            break
          case 'model:field':
            tpl = '<model:field code="字段Code"></model:field>'
            break
          case 'fieldgroup.name':
            tpl = '@{FieldGroup.Name}'
            break
          case 'fieldgroup.code':
            tpl = '@{FieldGroup.Code}'
            break
          case 'field.name':
            tpl = '@{Field.Name}'
            break
          case 'field.code':
            tpl = '@{Field.Code}'
            break
          case 'field.htmlcontrol':
            tpl = '@{Field.ControlHtml}'
            break
        }
        let index = this.metadataTemplate.findIndex(val => val.MMTemplateTypeID == this.currentTemplateID)
        this.metadataTemplate[index].template == null ? this.metadataTemplate[index].template = tpl :
        this.metadataTemplate[index].template += tpl
      },
      /**保存模板 */
      async saveTemplateClickHandler() {
        try {
          let res = await axios.put(`/metamodels/${this.modelId}/templates/updated`, {
            templateContent: this.metadataTemplate
          })
          util.showMessage(res)
        } catch (e) {
          util.showErrorNotification(e)
          return
        }
      },
      async loadMetadataTemplate() {
        let res = await axios.get(`/metamodels/${this.modelId}/templates`)
        this.metadataTemplate = (res.data.data && res.data.data.length) ? res.data.data : []
      }
    },
    components: {
    },
    watch: {
      tabName(val) {
        if (val === 'template' && this.modelId) {
          this.loadMetadataTemplate()
        } else {
          this.metadataTemplate = []
        }
      },
      modelId(val) {
        if (this.tabName === 'template' && val) {
          this.loadMetadataTemplate()
        } else {
          this.metadataTemplate = []
        }
      }
    }
  }
</script>
