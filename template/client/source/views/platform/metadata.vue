<template>
  <div class="layout-row-inpage">
    <div :span="6" class="layout-col-list">
      <el-toolbar>
        <el-button @click="addMetaClickHandler"
          priv="Platform.Metadata.Add"><i class="fa fa-plus"></i>创建</el-button>
        <el-button :disabled="selectedRows.length !== 1" @click="cloneMetaClickHandler"
          priv="Platform.Metadata.Add"><i class="fa fa-plus"></i>类似创建
        </el-button>
        <el-button :disabled="selectedRows.length === 0" @click="deleteMetaClickHandler"
          priv="Platform.Metadata.Delete"><i class="fa fa-remove"></i>删除
        </el-button>
      </el-toolbar>
      <div class="layout-content-padding scroll">
        <div class="search-bar">
          <el-input placeholder="请输入名称" v-model="search.key" class="metadata-search-input-with-select">
            <el-select v-model="search.typeId" clearable slot="prepend" placeholder="请选择类型">
              <el-option v-for="item in metadataTypes" :key="item.ID" :label="item.name" :value="item.ID">
              </el-option>
            </el-select>
            <el-button slot="append" @click="searchClickHandler">搜索</el-button>
          </el-input>
        </div>
        <el-table  v-loading="dataLoading" ref="table" :data="metadata" stripe tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange">
          <el-table-column type="selection" width="48" align="center"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="代码"></el-table-column>
        </el-table>
      </div>
    </div>
    <div :span="18" class="layout-col-detail">
      <el-tabs class="tabs-wrap" v-model="tabActiveName"  @tab-click="changeTabClickHandler">
        <el-tab-pane name="info">
          <span slot="label">
            <i class="el-icon-star-off"></i>基本信息
          </span>
          <!-- 元数据基本信息 -->
          <meta-model-info :data="currentMetadata" :tab-name="tabActiveName" :types="metadataTypes" @callback="metadataInfoChangedBack" ref="metaInfo"></meta-model-info>
        </el-tab-pane>
        <el-tab-pane name="field">
          <span slot="label">
            <i class="el-icon-share"></i>字段列表
          </span>
          <!-- 元数据字段 -->
          <meta-model-column :model-id="currentMetadata.ID" :tab-name="tabActiveName"></meta-model-column>
        </el-tab-pane>
        <el-tab-pane name="data">
          <span slot="label">
            <i class="el-icon-date"></i>数据管理</span>
          <meta-model-data :model-id="currentMetadata.ID" :tab-name="tabActiveName"></meta-model-data>
        </el-tab-pane>
        <el-tab-pane name="template">
          <span slot="label">
            <i class="el-icon-document"></i>模板设置</span>
          <meta-model-template :model-id="currentMetadata.ID" :tab-name="tabActiveName"></meta-model-template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新建或类似新建弹框 -->
    <meta-add-dialog
      :title="addMetadataDlg.title"
      :show.sync="addMetadataDlg.isShowModal"
      :types="metadataTypes"
      :data="addMetadataDlg.tmpMetadata"
      @callback="addBack">
    </meta-add-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import metaAddDialog from './metaAddDialog.vue'
import metaModelInfo from './metadataInfo.vue'
import metaModelColumn from './metaModelColumn.vue'
import metaModelData from './metaModelData.vue'
import metaModelTemplate from './metaModelTemplate.vue'
export default {
  data () {
    return {
      metadata: [], /** 元数据表格数据 */
      selectedRows: [], /** 选中的行 */
      currentMetadata: {}, /** 当前元数据 */
      metadataTypes: [], /** 元数据类型 */
      dataLoading: false,
      search: {/** 查询条件 */
        typeId: null,
        key: ''
      },
      addMetadataDlg: {/** 新建或类似新建弹框变量 */
        title: '',
        isShowModal: false,
        tmpMetadata: {}
      },
      tabActiveName: 'info'/** 当前分页条名称 */
    }
  },
  methods: {
    /** 基本信息组件回调 */
    metadataInfoChangedBack (data) {
      let index = this.metadata.findIndex(val => val.ID == data.ID)
      this.metadata.splice(index, 1, data)
      this.$refs.table.toggleRowSelection(data)
    },
    /** 分页条点击事件 */
    changeTabClickHandler (tab, event) {
      this.tabActiveName = tab.name
    },
    /** 添加元数据弹框回调 */
    addBack (data) {
      this.metadata.splice(0, 0, data)
    },
    /** 加载元数据类型 */
    async loadMetadataTypes () {
      let res = await axios.get('/metamodels/types')
      this.metadataTypes = res.data.data
    },
    /** 加载元数据表格 */
    async loadMetadata () {
      this.dataLoading = true
      let res = await axios.get('/metamodels', {params: {typeId: this.search.typeId, key: this.search.key}})
      this.dataLoading = false
      this.metadata = res.data.data
    },
    /** 查询点击事件 */
    searchClickHandler () {
      this.loadMetadata()
    },
    onSelectionChange (selection) {
      this.selectedRows = selection
      this.currentMetadata = this.selectedRows.length ? Object.assign({}, this.selectedRows[0]) : {}
      // this.changeTabClickHandler({ name: 'info' })
      if (selection.length === 0) {
        this.$refs.metaInfo.$refs.form.resetFields()
      }
    },
    /** 删除元数据 */
    async deleteMetaClickHandler () {
      let rowIds = []
      this.selectedRows.forEach(function (row) {
        rowIds.push(row.ID)
      })
      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await axios.delete(`/metamodels/${rowIds.join()}`)
        util.showMessage(res)
        if (res.data.status === 1) {
          this.metadata = this.metadata.filter(val => !rowIds.includes(val.ID))
          this.selectedRows = []
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    /** 类似创建元数据 */
    cloneMetaClickHandler () {
      this.addMetadataDlg.title = '类似创建元数据模型'
      this.addMetadataDlg.tmpMetadata = Object.assign({}, this.currentMetadata)
      this.addMetadataDlg.isShowModal = true
    },
    /** 新建元数据 */
    addMetaClickHandler () {
      this.addMetadataDlg.title = '新建元数据模型'
      this.addMetadataDlg.tmpMetadata = {}
      this.addMetadataDlg.isShowModal = true
    }
  },
  created () {
    this.loadMetadata()
    this.loadMetadataTypes()
  },
  components: {
    'meta-add-dialog': metaAddDialog,
    'meta-model-info': metaModelInfo,
    'meta-model-column': metaModelColumn,
    'meta-model-data': metaModelData,
    'meta-model-template': metaModelTemplate
  }
}
</script>
<style>
  .search-bar {
    padding: 5px 0;
  }
</style>
