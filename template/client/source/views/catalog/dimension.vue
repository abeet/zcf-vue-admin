<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button @click="addClick" priv="DimensionManage.Add"><i class="fa fa-plus"></i>添加</el-button>
      <el-button :disabled="selectedRows.length !== 1" @click="editClickHandler"
        priv="DimensionManage.Edit"><i class="fa fa-floppy-o"></i>编辑</el-button>
      <el-button :disabled="selectedRows.length === 0" @click="deleteClickHandler"
        priv="DimensionManage.Delete"><i class="fa fa-times"></i>删除</el-button>
        <el-button :disabled="selectedRows.length !== 1" @click.stop="sortClickHandler"
        priv="DimensionManage.Sort"><i class="fa fa-refresh f16"></i>排序</el-button>
    </el-toolbar>
    <div class="layout-content-padding">
      <div class="tar">
        <div class="layout-data-search layout-data-search-6 layout-data-search-con">
          <el-input v-model="searchName" placeholder="请输入分类名称" @keyup.enter.native="searchClickHandlder"></el-input>
          <el-button type="primary" @click="searchClickHandlder">搜索</el-button>
        </div>
      </div>
      <el-table  ref="table" stripe tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange" :data-read-url="getDimensionURL" :page-size="10">
        <el-table-column type="selection" width="30" align="center"></el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="15%"></el-table-column>
        <el-table-column prop="code" label="代码" min-width="15%"></el-table-column>
        <el-table-column label="状态" min-width="10%" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.isOpen=='Y'"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="addUser" label="添加人" min-width="15%"></el-table-column>
        <el-table-column prop="addTime" label="添加时间" min-width="20%"></el-table-column>
      </el-table>
    </div>
    <dimens-dialog
      :show.sync="isShowModal"
      :datas="currentDimension"
      @callback="searchClickHandlder"
    ></dimens-dialog>
    <dimens-sort-dialog
      :show.sync="sortShowModal"
      :dimension-id="currentDimension.ID"
      @callback="searchClickHandlder"
    ></dimens-sort-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import DimensAddDialog from './components/DimensAddDialog.vue'
import DimensSortDialog from './components/DimensSortDialog.vue'
export default {
  components: {
    'dimens-dialog': DimensAddDialog,
    'dimens-sort-dialog': DimensSortDialog
  },
  data () {
    return {
      searchName: '' /** 查询名称 */,
      selectedRows: [] /** 选中行 */,
      currentDimension: {},
      isShowModal: false,
      sortShowModal: false/** 排序弹框状态 */
    }
  },
  methods: {
    getDimensionURL () {
      return ['/api/dimens', { params: { name: encodeURI(this.searchName) } }]
    },
    addClick () {
      this.isShowModal = true
      this.currentDimension = {
        ID: '',
        name: '',
        code: '',
        isOpen: 'Y',
        memo: ''
      }
    },
    editClickHandler () {
      this.isShowModal = true
    },
    sortClickHandler () {
      this.sortShowModal = true
    },
    async deleteClickHandler () {
      let ids = util.getSelectedIDs(this.selectedRows)
      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        let res = await axios.delete(`/api/dimens/${ids.join()}`)
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.$refs.table.getData()
        }
      } catch (e) {

      }
    },
    searchClickHandlder () {
      this.$refs.table.getData()
    },
    onSelectionChange (selection) {
      this.selectedRows = selection
      this.currentDimension = this.selectedRows[0] ? Object.assign({}, this.selectedRows[0]) : {}
    }
  }
}
</script>
