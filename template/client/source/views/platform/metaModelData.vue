<style scoped>

</style>
<template>
  <div class="pane-wrap">
    <el-toolbar>
      <el-button :disabled="!modelId" @click="addPkDataClickHandler">
        <i class="fa fa-plus"></i>添加</el-button>
      <el-button :disabled="selectedRows.length !== 1" @click="editPkDataClickHandler">
        <i class="fa fa-edit"></i>修改</el-button>
      <el-button :disabled="selectedRows.length === 0"@click="deletePkDataClickHandler">
        <i class="fa fa-remove"></i>删除</el-button>
    </el-toolbar>
    <div class="layout-content-padding scroll">
      <el-table
        v-loading="dataLoading"
        :data="pkData"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="onSelectionChange"
        @row-dblclick="editPkDataClickHandler">
        <el-table-column type="selection" width="48" align="center"></el-table-column>
        <el-table-column prop="PKValue" label="PK值"></el-table-column>
        <el-table-column
          v-for="(field, index) in fields"
          :key="field.code"
          :prop="field.code"
          :label="field.name">
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination class="page" background @current-change="currentChangeHandler" @size-change="chooseSizeChangeHandler" :page-sizes="[5,10, 15, 20, 30, 50]" :current-page.sync="currentPage" :page-size="pageSize" layout="total, sizes, ->, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <meta-data-dialog
      :title="addOrEdit.title"
      :show.sync="addOrEdit.isShowModal"
      :datas="addOrEdit.tmpPkData"
      :model-id="modelId"
      @callback="afterAddOrEdit">
    </meta-data-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import metaModelDataDialog from './metaModelDataDialog.vue'
export default {
  props: {modelId: [String, Number], tabName: String},
  data () {
    return {
      dataLoading: false,
      pageSize: 15,
      currentPage: 1,
      total: 0,
      fields: [], /** 字段数据 */
      pkData: [], /** 表格数据 */
      selectedRows: [], /** 选中行数据 */
      currentPKData: {}, /** 当前选中首行数据 */
      addOrEdit: {
        isShowModal: false,
        title: '',
        tmpPkData: {}
      }
    }
  },
  methods: {
    /** 添加或编辑弹框回调 */
    afterAddOrEdit () {
      this.loadPKData()
    },
    currentChangeHandler (val) {
      this.currentPage = val || this.currentPage
      this.loadPKData()
    },
    chooseSizeChangeHandler (val) {
      this.pageSize = val || this.pageSize
      this.loadPKData()
    },

    /** 添加PKData */
    addPkDataClickHandler () {
      this.addOrEdit.title = '添加记录'
      let pk = {
        PKValue: ''
      }
      this.fields.forEach(val => {
        switch (val.dataType) {
          case 'Long':
            pk['metavalue_' + val.code] = 0
            break
          case 'Double':
            pk['metavalue_' + val.code] = 0.0
            break
          case 'Datetime':
            pk['metavalue_' + val.code] = new Date()
            break
          default:
            pk['metavalue_' + val.code] = val.defaultValue || ''
            break
        }
        if (val.controlType === 'Checkbox') {
          pk['metavalue_' + val.code] = []
        }
      }, this)
      this.addOrEdit.tmpPkData = pk
      this.addOrEdit.isShowModal = true
    },
    /** 编辑PKData */
    editPkDataClickHandler (row) {
      this.addOrEdit.title = '修改记录'
      let currentData = row.modelID ? row : this.currentPKData
      let data = {}
      for (let k in currentData) {
        if (k != 'PKValue') {
          if (k.endsWith('_en')) {
            data['metavalue_' + k.substring(0, k.length - 3)] = currentData[k]
          } else {
            data['metavalue_' + k] = currentData[k]
          }
        } else {
          data[k] = currentData[k]
        }
      }
      this.addOrEdit.tmpPkData = Object.assign({}, data)
      this.addOrEdit.isShowModal = true
    },
    /** 删除PKData */
    async deletePkDataClickHandler () {
      let PKValues = util.getSelectedIDs(this.selectedRows, 'PKValue')
      try {
        await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await axios.delete(`/metamodels/${this.modelId}/datas/${PKValues.join()}`)
        util.showMessage(res)
        if (res.data.status === 1) {
          this.pkData = this.pkData.filter(val => !PKValues.includes(val.PKValue))
          this.selectedRows = []
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    onSelectionChange (selection) {
      this.selectedRows = selection
      this.currentPKData = this.selectedRows.length ? Object.assign({}, this.selectedRows[0]) : {}
    },
    /** 加载PKData */
    async loadPKData () {
      this.dataLoading = true
      let res = await axios.get(`/metamodels/${this.modelId}/datas`)
      this.dataLoading = false
      this.fields = (res.data.columnData && res.data.columnData.length) ? res.data.columnData : []
      if (res.data.data && res.data.data.length) {
        this.pkData = res.data.data
        this.total = res.data.total
      } else {
        this.pkData = []
        this.total = 0
        this.currentPage = 1
        this.pageSize = 15
      }
    }
  },
  components: {
    'meta-data-dialog': metaModelDataDialog
  },
  watch: {
    tabName (val) {
      if (val === 'data') {
        this.loadPKData()
      }
    },
    modelId (val) {
      if (this.tabName === 'data') {
        this.loadPKData()
      }
    }
  }
}
</script>
<style scoped>
.el-pagination__rightwrapper {
    float: right;
}
</style>
