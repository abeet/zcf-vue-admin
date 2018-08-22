<template>
  <div>
    <el-dialog class="catalog-add-dlg" title="新建栏目" :visible.sync="isShow" @open="dialogOpen">
      <el-form :model="tmpCatalog" status-icon ref="form" label-width="150px" label-suffix="：">
          <el-form-item label="上级栏目">
            <el-input v-model="tmpCatalog.parent.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="继承上级栏目权限" v-if="tmpCatalog.parent.ID">
            <el-switch v-model="tmpCatalog.isExtendParentPriv" active-value="Y" inactive-value="N"></el-switch>
          </el-form-item>
          <el-form-item label="栏目名称" prop="name" :verify="['NotNull','Length<30']">
            <el-input v-model="tmpCatalog.name" @change="setAlias()" ></el-input>
          </el-form-item>
          <el-form-item label="栏目别名" prop="alias" :verify="['NotNull','Regex=^[a-zA-Z0-9_\.\-\/]+$','Length<100']">
            <el-input v-model="tmpCatalog.alias" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="栏目类型">
            <el-select v-model="tmpCatalog.type" clearable placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="内容类型">
            <el-select v-model="tmpCatalog.contentType" clearable placeholder="请选择">
              <el-option
                v-for="item in contentTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" v-loading="submitLoading" @click="confirmClickHandler">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import util from '../../../common/util.js'
export default {
  props:{
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    dimensionId: {
      type: [Number,String],
      default: 0
    },
    parent: {
      type: Object
    },
    types:{
      type: Array,
      required:true
    },
    contentTypes:{
      type: Array,
      required:true
    },
  },
  data() {
    return {
      submitLoading: false,
      tmpCatalog: {name:'',alias:'',parent:{ID:0,name:'',alias:'',contentType:'',type:''}},
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    //别名设置：取名称首字母
    setAlias() {
      if(this.tmpCatalog.alias.trim()){
        return
      }
      this.tmpCatalog.alias = util.getSpell(
        this.tmpCatalog.name,
        true
      )
      if(this.parent.alias){
        this.tmpCatalog.alias = this.parent.alias + '_' + this.tmpCatalog.alias
      }
    },
    dialogOpen(){
      this.tmpCatalog = {
        parent:{ID:this.parent.ID,name:this.parent.name},
        name:'',
        isExtendParentPriv:'N',
        alias:'',
        type:this.parent.type,
        contentType:this.parent.contentType
      },
      this.submitLoading = false
    },
    /**检查填写的字符串格式是否正确,替换掉特殊字符,保留中文*/
    checkFormat() {
      let str = this.tmpCatalog.name
      if(!str){
        return false;
      }
      str = str.replace('\t', '  ')
      str = str.replace(/\r\b\f/g, '')
      // str = str.replace(/[^a-zA-Z0-9_.-/\s\n\u4e00-\u9fa5]/g, '')
      if (!str) {
        this.dialog('请输入正确字符')
        return false
      }
      this.tmpCatalog.name = str
      return true
    },
    async confirmClickHandler() {
      this.tmpCatalog.dimensionID = this.dimensionId
      this.tmpCatalog.parentID = this.parent.ID
      let flag = await this.checkFormat()
      if (!flag) {
        util.showResponseMessage({message:'请输入正确的栏目名称'})
        return
      }
      this.submitLoading = true
      try {
        await util.validateForm(this.$refs['form'])
        let res = await axios.post('/api/catalogs', this.tmpCatalog)
        this.submitLoading = false
        util.showResponseMessage(res.data)
        if(res.data.status===1){
          this.isShow = false
          await this.$nextTick()
          await util.updatePriv()
          this.$refs.form.resetFields()
          this.$emit('callback',res.data.catalog)
        }
      } catch (e) {
        this.submitLoading = false
        return
      }
    },
  }
}
</script>
<style>
.catalog-add-dlg .el-dialog{
  width:600px;
}
@media (max-width:480px){
  .catalog-add-dlg .el-dialog{
    width:96%;
  }
}
.catalog-add-dlg .el-dialog .el-form {
  margin-top: 20px;
}
.catalog-add-dlg .el-dialog .el-form .el-input {
  width: 330px;
  margin-right: 5px;
}
</style>
