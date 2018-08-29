<style>
.meta-column-verify-dlg .el-dialog {
  width: 600px;
}
@media (max-width: 480px) {
  .meta-column-verify-dlg .el-dialog {
    width: 96%;
  }
}
.meta-column-verify-dlg .el-dialog .el-dialog__body {
  background: rgb(249, 249, 249);
}
.meta-column-verify-dlg .el-dialog .title {
  color: #8391a5;
  font-weight: 600;
  margin: 5px 0;
}
</style>
<template>
  <el-dialog title="选择校验规则" :visible.sync="isShow" @open="beforeDialogOpen" class="meta-column-verify-dlg">
    <el-checkbox-group v-model="validateRule.items">
      <div class="panel-card">
        <h4 class="panel-legend">一般校验规则</h4>
        <el-row>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="NotNull">不能为空</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="Number">数字（整数或小数）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="Int">整数</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="Time">时间（HH-mm-ss）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="Date">日期（yyyy-MM-dd）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="DateTime">日期时间（yyyy-MM-dd HH:mm:ss）</el-checkbox>
          </el-col>
        </el-row>
      </div>

      <div class="panel-card">
        <h4 class="panel-legend">业务校验规则</h4>
        <el-row>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="Email">Email</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="ZipCode">邮政编码（中国）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="CnTel">固定电话号码（中国）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="CnMobile">移动电话号码（中国）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="CnPhone">固定或移动电话（中国）</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox class="rule-checkbox" label="IDCardNo">身份证号码（中国）</el-checkbox>
          </el-col>
        </el-row>
      </div>

      <div class="panel-card">
        <h4 class="panel-legend">高级校验规则</h4>
        <el-row>
          <el-col :span="6">
            <el-checkbox class="rule-checkbox" label="Script" @change="scriptChangeHandler">JavaScript脚本</el-checkbox>
          </el-col>
          <el-col :span="18">
            <el-input v-model="validateRule.script" class="rule-input" :disabled="!validateRule.items.includes('Script')"></el-input>
          </el-col>
          <el-col :span="6">
            <el-checkbox class="rule-checkbox" label="Regex" @change="regexChangeHandler">正则表达式</el-checkbox>
          </el-col>
          <el-col :span="18">
            <el-input v-model="validateRule.regex" class="rule-input" :disabled="!validateRule.items.includes('Regex')"></el-input>
          </el-col>
          <el-col :span="6">
            <el-checkbox class="rule-checkbox" label="Length" @change="lengthChangeHandler">长度</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-select v-model="validateRule.lengthSymbol"  clearable :disabled="!validateRule.items.includes('Length')" placeholder="请选择" class="rule-input" style="width: 100%;">
              <el-option label="等于" value="="></el-option>
              <el-option label="大于" value=">"></el-option>
              <el-option label="小于" value="<"></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input-number v-model="validateRule.lengthValue" :disabled="!validateRule.items.includes('Length')" :min="0" class="rule-input" style="width: 100%"></el-input-number>
          </el-col>
        </el-row>
      </div>
    </el-checkbox-group>
    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmClickHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
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
  props: { datas: String, show: Boolean },
  data () {
    return {
      validateRule: { items: [], lengthSymbol: '', lengthValue: 0, regex: '', script: '' } /** 校验规则表单数据 */
    }
  },
  methods: {
    beforeDialogOpen () {
      if (!this.datas) {
        this.validateRule.items = []
        this.validateRule.script = ''
        this.validateRule.regex = ''
        this.validateRule.lengthSymbol = ''
        this.validateRule.lengthValue = 0
      } else {
        this.validateRule.items = this.datas.split('&&')
        let scriptIndex = this.validateRule.items.findIndex(val => val.startsWith('Script'))
        if (scriptIndex !== -1) {
          this.validateRule.script = this.validateRule.items[scriptIndex].slice(7)
          this.validateRule.items[scriptIndex] = 'Script'
        }
        let regexIndex = this.validateRule.items.findIndex(val => val.startsWith('Regex'))
        if (regexIndex !== -1) {
          this.validateRule.regex = this.validateRule.items[regexIndex].slice(6)
          this.validateRule.items[regexIndex] = 'Regex'
        }
        let lengthIndex = this.validateRule.items.findIndex(val => val.startsWith('Length'))
        if (lengthIndex !== -1) {
          this.validateRule.lengthSymbol = this.validateRule.items[lengthIndex].slice(6, 7)
          this.validateRule.lengthValue = this.validateRule.items[lengthIndex].slice(7)
          this.validateRule.items[lengthIndex] = 'Length'
        }
      }
    },
    lengthChangeHandler (val) {
      if (!val) {
        this.validateRule.lengthSymbol = ''
        this.validateRule.lengthValue = 0
      }
    },
    regexChangeHandler (val) {
      if (!val) {
        this.validateRule.regex = ''
      }
    },
    scriptChangeHandler (val) {
      if (!val) {
        this.validateRule.script = ''
      }
    },
    confirmClickHandler () {
      let scriptIndex = this.validateRule.items.findIndex(val => val.startsWith('Script'))
      if (scriptIndex !== -1) {
        this.validateRule.items[scriptIndex] = `Script=${this.validateRule.script}`
      }
      let regexIndex = this.validateRule.items.findIndex(val => val.startsWith('Regex'))
      if (regexIndex !== -1) {
        this.validateRule.items[regexIndex] = `Regex=${this.validateRule.regex}`
      }
      let lengthIndex = this.validateRule.items.findIndex(val => val.startsWith('Length'))
      if (lengthIndex !== -1) {
        this.validateRule.items[lengthIndex] = `Length${this.validateRule.lengthSymbol}${this.validateRule.lengthValue}`
      }
      this.$emit('callback', this.validateRule.items.join('&&'))
      this.$emit('update:show', false)
    }
  }
}
</script>
