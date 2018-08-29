<style scoped>
  .layout-row-intab{
    flex-direction: column;
  }
  .pane-up-wrap .info-form-wrap {
    padding: 15px;
  }
</style>
<style>
.metadata-info-form .el-form-item .el-input {
  width: 50%;
  margin-right: 5px;
}
.metadata-info-form .el-form-item .el-textarea {
  width: 50%;
  margin-right: 5px;
}
.metadata-info-form .el-form-item .el-select {
  width: 75%;
  margin-right: 5px;
}
</style>
<template>
  <div class="layout-row-intab">
    <div class="pane-up-wrap">
      <el-toolbar>
        <el-button v-loading="saveSubmitLoading":disabled="!currentMetadata.ID"
          @click="saveMetadataClickHandler"><i class="fa fa-floppy-o"></i>保存
        </el-button>
      </el-toolbar>
      <div class="info-form-wrap metadata-info-form">
        <el-form :model="currentMetadata" ref="form" label-width="20%">
          <el-form-item label="元数据模型名称：" prop="name" :verify="['NotNull']">
            <el-input v-model="currentMetadata.name" :disabled="!currentMetadata.ID"></el-input>
          </el-form-item>
          <el-form-item label="代码：" prop="code" :verify="['NotNull']">
            <el-input v-model="currentMetadata.code" :disabled="!currentMetadata.ID"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="currentMetadata.memo" type="textarea" :disabled="!currentMetadata.ID"
              :rows="2" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="currentMetadata.ownerType" placeholder="请选择类型" :disabled="true">
              <el-option v-for="type in types" :key="type.ID" :label="type.name" :value="type.ID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属ID：">
            <el-input v-model="currentMetadata.ownerID" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="物理表名：">
            <el-input v-model="currentMetadata.targetTable" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="pane-down-wrap">
      <el-toolbar>
        <el-button :disabled="!currentMetadata.ID" @click="addGroupClickHandler">
          <i class="fa fa-plus"></i>添加字段分组</el-button>
        <el-button :disabled="selectedRows.length !== 1" @click="editGroupClickHandler">
          <i class="fa fa-edit"></i>修改字段分组</el-button>
        <el-button :disabled="selectedRows.length === 0" @click="deleteGroupClickHandler">
          <i class="fa fa-remove"></i>删除字段分组</el-button>
      </el-toolbar>
      <div class="layout-content-padding">
        <el-table
          :data="columnGroup"
          stripe
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="dataLoading"
          @selection-change="onGroupSelectionChange">
          <el-table-column type="selection" width="48" align="center"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="代码"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加分组或修改分组弹框 -->
    <column-group-dialog
      :show.sync="addOrEdit.isShowModal"
      :data="addOrEdit.tmpColumnGroup"
      :model-id="this.currentMetadata.ID"
      :title="addOrEdit.title"
      @callback="addOrEditGroupBack">
    </column-group-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import metaColumnGroupDialog from './metaColumnGroupDialog.vue'
export default {
  props: ['data', 'tabName', 'types'],
  data () {
    return {
      saveSubmitLoading: false,
      dataLoading: false,
      currentMetadata: {}, /** 当前元数据变量 */
      selectedRows: [], /** 分组选中行 */
      columnGroup: [], /** 分组数据 */
      currentColumnGroup: {}, /** 当前分组数据 */
      addOrEdit: {/** 添加或修改弹框 */
        tmpColumnGroup: {},
        isShowModal: false,
        title: ''
      }
    }
  },
  methods: {
    /** 添加或编辑字段分组弹框回调 */
    addOrEditGroupBack (data) {
      let index = this.columnGroup.findIndex(val => val.ID == data.ID)
      index != -1 ? this.columnGroup.splice(index, 1, data) : this.columnGroup.splice(0, 0, data)
    },
    /** 保存元数据信息 */
    async saveMetadataClickHandler () {
      this.saveSubmitLoading = true
      try {
        await util.validateForm(this.$refs['form'])
        let res = await axios.put(`/metamodels/${this.currentMetadata.ID}`, this.currentMetadata)
        this.saveSubmitLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          this.$emit('callback', this.currentMetadata)
        }
      } catch (e) {
        this.saveSubmitLoading = false
        util.showErrorNotification(e)
      }
    },
    /** 添加元数据字段分组 */
    addGroupClickHandler () {
      this.addOrEdit.tmpColumnGroup = {}
      this.addOrEdit.isShowModal = true
      this.addOrEdit.title = '添加字段分组'
    },
    /** 编辑元数据字段分组 */
    editGroupClickHandler () {
      this.addOrEdit.tmpColumnGroup = Object.assign({}, this.currentColumnGroup)
      this.addOrEdit.isShowModal = true
      this.addOrEdit.title = '修改字段分组'
    },
    /** 删除元数据字段分组 */
    async deleteGroupClickHandler () {
      let ids = util.getSelectedIDs(this.selectedRows)
      try {
        await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await axios.delete(`/metamodels/${this.currentMetadata.ID}/groups/${ids.join()}`)
        util.showMessage(res)
        if (res.data.status === 1) {
          this.columnGroup = this.columnGroup.filter(val => !ids.includes(val.ID))
          this.selectedRows = []
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    /** 加载元数据字段分组 */
    async loadColumnGroup () {
      this.dataLoading = true
      let res = await axios.get(`/metamodels/${this.currentMetadata.ID}/groups`)
      this.dataLoading = false
      this.columnGroup = (res.data.data && res.data.data.length) ? res.data.data : []
    },
    onGroupSelectionChange (selection) {
      this.selectedRows = selection
      this.currentColumnGroup = this.selectedRows.length ? Object.assign({}, this.selectedRows[0]) : {}
    }
  },
  watch: {
    tabName (val) {
      if (val === 'info') {
        this.$refs['form'].resetFields()
        this.currentMetadata = Object.assign({}, this.data)
        this.loadColumnGroup()
      }
    },
    data (val) {
      if (this.tabName === 'info') {
        this.$refs['form'].resetFields()
        this.currentMetadata = Object.assign({}, val)
        this.loadColumnGroup()
      }
    }
  },
  components: {
    'column-group-dialog': metaColumnGroupDialog
  }
}
</script>
