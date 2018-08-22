<style>
.meta-clounm-options-dlg .el-dialog{
  width:530px;
}
.meta-clounm-options-dlg .el-form-item .el-input {
  width: 300px;
  margin-right: 5px;
}
.meta-clounm-options-dlg .el-form-item .el-textarea {
  width: 300px;
  margin-right: 5px;
}
.meta-clounm-options-dlg .form-item-center .el-form-item__content {
  margin: 0 auto!important;
  width: 300px;
}
@media (max-width:480px){
  .meta-clounm-options-dlg .el-dialog{
    width:96%;
  }
}
</style>
<template>
  <el-dialog title="字段选项列表" :visible.sync="isShow" @open="beforeDialogOpen" class="meta-clounm-options-dlg">
    <el-form :model="fieldOptions" :rules="fieldOptionsRules" ref="fieldOptionsForm" label-width="128px">
      <el-form-item label="选项数据来源：">
        <el-radio-group v-model="fieldOptions.source" @change="fieldOptionsChangeHandler" size="mini">
          <el-radio-button label="Code">从系统代码表中选择</el-radio-button>
          <el-radio-button label="Input">手工输入</el-radio-button>
          <el-radio-button label="Method">从后台方法</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-item-center" v-show="fieldOptions.source === 'Code'" prop="value">
        <el-select v-model="fieldOptions.value" placeholder="请选择" clearable>
          <el-option v-for="item in codeTypes" :key="item.codeType" :label="item.codeName" :value="item.codeType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-center" v-show="fieldOptions.source === 'Input'" prop="value">
        <el-input type="textarea" :rows="4" placeholder="请输入，每行文本表示一个选项" v-model="fieldOptions.value">
        </el-input>
      </el-form-item>
      <el-form-item class="form-item-center" v-show="fieldOptions.source === 'Method'" prop="value">
        <el-input placeholder="请输入，方法返回类型必须是Mapx" v-model="fieldOptions.value">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmClickHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import util from '../../common/util.js';
export default {
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      },
    },
  },
  props: {datas:String,show:Boolean},
  data() {
    return {
      fieldOptions:{source:'',value:''},/**具体选项列表对象 */
      codeTypes:[],/**系统代码数据 */
      fieldOptionsRules:{/**form校验规则 */
        value: [{required: true, message: '必填', trigger: 'blur change'}]
      }
    }
  },
  methods: {
    beforeDialogOpen(){
      if (!this.datas) {
        this.fieldOptions.source = 'Code'
        this.fieldOptions.value = ''
      } else {
        let items = this.datas.split(':')
        this.fieldOptions.source = items[0]
        this.fieldOptions.value = items[1]
        if (this.fieldOptions.source === 'Input') {
          this.fieldOptions.value = this.fieldOptions.value.replace(/<br>/g, '\n')
        }
      }
      this.loadCodeTypes()
    },
    fieldOptionsChangeHandler() {
      this.fieldOptions.value = ''
    },
    /**选项列表提交事件 */
    async confirmClickHandler() {
      try {
        await util.validateForm(this.$refs['fieldOptionsForm'])
      } catch (e) {
        util.showErrorNotification(e);
        return
      }
      if (this.fieldOptions.source === 'Input') {
        this.fieldOptions.value = this.fieldOptions.value.replace(/\n/g, '<br>')
      }
      this.$emit('callback',`${this.fieldOptions.source}:${this.fieldOptions.value}`)
      this.$emit('update:show',false);
    },
    async loadCodeTypes(){
      let res = await axios.get('/metamodels/0/columns/codeTypes')
      this.codeTypes = (res.data.data&&res.data.data.length)?res.data.data:[{codeType:'',codeName:''}]
    }
  }
};
</script>


