<template>
  <div>
    <h3>Vue封装的UEditor使用示例</h3>
    <ueditor ref="ueditor" :content.sync="editorContent" :config="editorConfig" @ready="ready" @reset="reset" @focus="focus" @destroy="destroy" @contentChange="contentChange">
    </ueditor>
    <button @click="setCont">重新设置编辑器中的内容</button>
  </div>
</template>

<script>
import ueditor from '../../components/ueditor.vue'

export default {
  data() {
    return {
      editorContent: '<p>hello ueditor~~</p>',
      editorConfig: {
        initialFrameHeight: 300,
      }
    }
  },
  components: {
    'ueditor': ueditor
  },
  methods: {
    ready(editor) {
      console.log('ready')
    },
    reset(editor) {
      console.log('reset')
    },
    focus() {
      console.log('focus')
    },
    destroy() {
      console.log('destroy')
    },
    contentChange(val) {
      console.log('编辑器内容有修改',val)
      this.$nextTick(_=>{
        console.log('editorContent.sync自动同步父子组件状态',this.editorContent)
      })
    },
    setCont () {
      this.editorContent = '<b>这是重新设置的内容</b>'
    },
    setContByUEditorInstance () {
      this.$refs.ueditor.instance.setContent('<b>这是重新设置的内容</b>')
    }
  }
}
</script>
