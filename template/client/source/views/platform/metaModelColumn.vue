<style scoped>

</style>
<template>
  <div class="pane-wrap">
    <el-toolbar>
      <el-button :disabled="!modelId" @click="addColumnClickHandler">
        <i class="fa fa-plus"></i>添加字段</el-button>
      <el-button :disabled="selectedRows.length !== 1" @click="editColumnClickHandler">
        <i class="fa fa-edit"></i>修改字段</el-button>
      <el-button :disabled="selectedRows.length === 0" @click="deleteColumnClickHandler">
        <i class="fa fa-remove"></i>删除字段</el-button>
    </el-toolbar>
    <div class="layout-content-padding scroll">
      <el-table
        :data="columns"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="dataLoading"
        @selection-change="onSelectionChange">
        <el-table-column type="selection" width="48" align="center"></el-table-column>
        <el-table-column prop="code" label="代码"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="dataType" label="数据类型"></el-table-column>
        <el-table-column prop="controlType" label="控件类型"></el-table-column>
        <el-table-column label="必填" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.mandatoryFlag === 'Y'"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加字段或编辑字段弹框 -->
    <meta-column-dialog
      :show.sync="addOrEdit.isShowModal"
      :title="addOrEdit.title"
      :datas="addOrEdit.tmpColumn"
      :model-id="modelId"
      @callback="afterAddOrEdit">
    </meta-column-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import metaColumnDialog from './metaColumnDialog.vue'
export default {
  props:{modelId:[String,Number],tabName:String},
  data() {
    return {
      dataLoading : false,
      selectedRows:[],/**分组选中行 */
      currentColumn:{},/**当前选中首行字段 */
      columns:[],/**表格填充数据 */
      addOrEdit:{/** 添加或修改弹框 */
        tmpColumn:{},
        isShowModal:false,
        title:''
      }
    }
  },
  methods:{
    /**添加或编辑回调 */
    afterAddOrEdit(data){
      let index = this.columns.findIndex(val => val.ID == data.ID)
      index != -1 ? this.columns.splice(index, 1, data) : this.columns.splice(0, 0, data)
    },
    /**添加字段 */
    addColumnClickHandler(){
      this.addOrEdit.title = '添加字段'
      this.addOrEdit.tmpColumn = {}
      this.addOrEdit.isShowModal = true
    },
    /**修改字段 */
    editColumnClickHandler(){
      this.addOrEdit.title = '修改字段'
      this.addOrEdit.tmpColumn = Object.assign({},this.currentColumn)
      this.addOrEdit.isShowModal = true
    },
    /**删除字段 */
    async deleteColumnClickHandler(){
      let ids = util.getSelectedIDs(this.selectedRows)
      try {
        await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await axios.delete(`/metamodels/${this.modelId}/columns/${ids.join()}`)
        util.showMessage(res)
        if(res.data.status === 1) {
          this.columns = this.columns.filter(val => !ids.includes(val.ID))
          this.selectedRows = []
        }
      } catch(e) {
        util.showErrorNotification(e)
        return
      }
    },
    onSelectionChange(selection){
      this.selectedRows = selection
      this.currentColumn = this.selectedRows.length ? Object.assign({}, this.selectedRows[0]) : {}
    },
    async loadColumnList(){
      this.dataLoading = true
      let res = await axios.get(`/metamodels/${this.modelId}/columns`)
      this.dataLoading = false
      this.columns = (res.data.data&&res.data.data.length)?res.data.data:[]
    }
  },
  components:{
    'meta-column-dialog' : metaColumnDialog,
  },
  watch:{
    modelId(val){
      if(this.tabName === 'field'){
        this.loadColumnList()
      }
    },
    tabName(val){
      if(val === 'field'){
        this.loadColumnList()
      }
    }
  }
}
</script>
