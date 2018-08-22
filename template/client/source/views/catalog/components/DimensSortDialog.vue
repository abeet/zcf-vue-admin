<template>
  <el-dialog title="分类排序" @open="dialogOpen" :visible.sync="isShow" class="sort-dimens-dlg">
    <div class="sort-order-input">移动<el-input-number v-model="sortNumber"></el-input-number>位</div>
      <div class="sort-input-hint">填正数表示向<span>上</span>移动，负数表示向<span>下</span>移动</div>
    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" v-loading="submitLoading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import util from '../../../common/util.js'
export default {
  props:{
    dimensionId:{
      type:Number,
      default:0,
      required:true,
    },
    show:{
      type:Boolean,
      default:false,
      required:false
    },
  },
  data() {
    return {
      sortNumber: 1 /**移动位数 */,
      submitLoading:false,
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
    dialogOpen(){
      this.sortNumber = 1
      this.submitLoading = false
    },
    /**提交排序 */
    async confirm() {
      if (!this.sortNumber) {
        util.showResponseMessage({message:'分类未移动顺序'})
        return
      }
      this.submitLoading = true
      let params = { dimensionID: this.dimensionId, move: this.sortNumber }
      try {
        let res = await axios.put('/api/dimens/sort', params)
        this.submitLoading = false
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.isShow = false
          this.$emit('callback')
        }
      } catch (e) {
        this.submitLoading = false
        return
      }
    }
  }
}
</script>
<style scope>
.sort-dimens-dlg .sort-order-input {
  margin-left: 65px;
}
.sort-dimens-dlg .sort-order-input .el-input-number {
  margin: 0px 2px 0px 2px!important;
}
.sort-dimens-dlg .sort-input-hint{
  margin-top: 2px;
  margin-left: 53px;
}
.sort-dimens-dlg .sort-input-hint span{
  color: #FF6600;
}
</style>
<style>
.sort-dimens-dlg .el-dialog{
  width:400px;
}
@media (max-width:1266px){
  .sort-dimens-dlg .el-dialog{
    width:35%;
  }
}
</style>
