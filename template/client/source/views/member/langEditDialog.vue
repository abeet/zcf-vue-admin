<template>
  <div>
    <el-dialog class="lang-edit-dialog" title="多语言字段编辑器" @open="beforeDialogOpen" :visible.sync="isShow">
      <el-form :model="tmpRoleLang" label-width="20%">
          <el-form-item v-for="(o, index) in langList" :key="o.name" :label="o.name+'：'">
            <el-input v-model="tmpRoleLang[ID+'_'+o.key]" type="textarea" :rows="2"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import util from '../../common/util.js'
export default {
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  props: { ID: String, languages: String, show: Boolean, targetValue: String },
  data () {
    return {
      tmpRoleLang: {} /** 角色多种语言临时存储变量 */,
      langList: [] /** 支持语言列表 */,
      lang: ''
    }
  },
  methods: {
    beforeDialogOpen () {
      this.tmpRoleLang = {}
      this.initLanguages()
    },
    async initLanguages () {
      let res = await axios.get('/api/role/initlanguage')
      this.langList = res.data.data.data
      this.lang = res.data.data.lang
      this.setValues()
    },
    confirm () {
      let r = ['@Lang']
      let index = 0
      for (let key in this.tmpRoleLang) {
        if (key.length <= this.ID.length) {
          continue
        }
        let k = key.substring(this.ID.length + 1)
        r.push(k + '=' + this.tmpRoleLang[key])
      }
      this.$emit('callback', { data: escape(r.join('\n')), ID: this.ID })
      this.$emit('update:show', false)
    },
    setValues () {
      let temLanguages = unescape(this.languages)
      if (temLanguages.startsWith('@Lang\n')) {
        var arr = temLanguages.substring(6).split(/\n/)
        for (var i = 0; i < arr.length; i++) {
          var k = arr[i]
          if (k.indexOf('=') < 1) {
            continue
          }
          var v = k.substring(k.indexOf('=') + 1)
          k = k.substring(0, k.indexOf('='))
          if (k == this.lang) {
            v = this.targetValue // 反映最新的修改情况
          }
          this.tmpRoleLang[this.ID + '_' + k] = v
        }
      } else {
        this.tmpRoleLang[this.ID + '_' + this.lang] = this.targetValue
      }
    }
  }
}
</script>
<style>
.lang-edit-dialog .el-dialog {
  width: 500px;
}
/* 在一般情况下dialog宽为600像素，在逻辑分辨率480像素以下dialog宽为96% */
@media (max-width: 480px) {
  .lang-edit-dialog .el-dialog {
    width: 96%;
  }
}
</style>
