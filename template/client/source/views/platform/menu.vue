<template>
  <div class="layout-no-cols">
        <el-toolbar>
      <el-button icon="plus" :disabled="selectedRows.length !== 1" @click="sortClickHandler" priv="Platform.Menu.Sort">排序</el-button>&nbsp;
      <el-button icon="edit" :disabled="selectedRows.length === 0" @click="disableOrEnableClickHandler('true')" priv="Platform.Menu.Start">启用</el-button>&nbsp;
      <el-button icon="delete" :disabled="selectedRows.length === 0" @click="disableOrEnableClickHandler('false')" priv="Platform.Menu.Stop">禁用</el-button>&nbsp;
      <el-button icon="information" @click="resetClickHandler" priv="Platform.Menu.Reset">重置</el-button>&nbsp;
        </el-toolbar>
      <div class="layout-content-padding scroll">
        <div class="search-bar">
            查看指定插件下的菜单：<el-select v-model="searchPlugins.pluginID" filterable clearable @change="searchPluginsChange">
              <el-option
                v-for="plugin in plugins"
                :key="plugin.ID"
                :label="plugin.name"
                :value="plugin.ID">
              </el-option>
            </el-select>
        </div>
        <div v-loading="dataLoading">
            <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" @selection-change="onSelectionChange">
            </tree-grid>
        </div>
        </div>
        <el-dialog title="排序设置" :visible.sync="sortModal" size="tiny">
            <el-form label-width="100px">
              <b style="color:#F00;padding-left: 45px;">\{{name}}</b>移动位数：
              <el-input-number v-model="sortOffset"></el-input-number>
        <p class="hint">填
          <b>正数</b>表示向
          <b style="color:#FF6600;">上</b>移动，
          <b>负数</b>表示向
          <b style="color:#FF6600;">下</b>移动</p>
            </el-form>
            <div slot="footer">
                <el-button @click="sortModal = false">取 消</el-button>
                <el-button type="primary" :loading="confirmLoading" @click="confirmSortClickHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import TreeGrid from '../../components/TreeGrid.vue'
import util from '../../common/util.js'

export default {
  data () {
    return {
      name: '',
      searchPlugins: {
        pluginID: ''
      },
      plugins: [],
      columns: [
        {
          text: '菜单名称',
          render: function (row) {
            return '<i class="' + row.icon + '">&nbsp;' + row.name + '</i>'
          }
        },
        {
          text: '是否启用',
          render: function (row) {
            if (row.isEnable) {
              return '<i class="fa fa-check icon-success"></i>'
            } else {
              return '<i class="fa fa-times icon-danger"></i>'
            }
          }
        },
        {
          text: 'ID',
          dataIndex: 'id'
        },
        {
          text: 'URL',
          dataIndex: 'URL'
        },
        {
          text: '来源插件',
          dataIndex: 'source'
        }
      ],
      dataSource: [],
      selectedRows: [],
      dataLoading: false,
      sortModal: false,
      confirmLoading: false,
      sortOffset: 1
    }
  },
  methods: {
    onSelectionChange (selection) {
      this.selectedRows = selection
      if (this.selectedRows.length === 1) {
        this.name = this.selectedRows[0].name
      }
    },
    // 排序
    sortClickHandler () {
      this.sortOffset = 1
      this.sortModal = true
    },
    // 排序确定
    async confirmSortClickHandler () {
      if (this.sortOffset === 0) {
        this.$confirm('菜单未移动顺序', '系统提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }
      this.confirmLoading = true
      try {
        let opts = {
          id: this.selectedRows[0].id,
          offset: this.sortOffset
        }
        let res = await axios.put('/api/menus/sortmenu', opts)
        this.confirmLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          this.sortModal = false
          this.menuList()
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    // 启用/禁用
    async disableOrEnableClickHandler (status) {
      let ids = []
      this.selectedRows.forEach(function (row) {
        ids.push(row.id)
      })
      if (ids.join().indexOf('Platform.Menu') != -1) {
        this.$confirm('菜单管理不可禁用！', '系统提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }
      try {
        await this.$confirm(`确定${status === 'true' ? '启用' : '禁用'}吗？`, `确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await axios.put('/api/menus/status', {ids: ids.join(), status})
        util.showMessage(res)
        if (res.data.status === 1) {
          this.menuList()
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    // 重置
    async resetClickHandler () {
      try {
        await this.$confirm('确定重置吗，重置后失去所有自定义设置？', '重置确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      try {
        let res = await axios.put('/api/menus/reset', {params: {reset: true}})
        util.showMessage(res)
        if (res.data.status === 1) {
          this.menuList()
        }
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    // 菜单列表数据加载
    async menuList () {
      this.dataLoading = true
      let res = await axios.get('/api/menus', { params: { pluginID: this.searchPlugins.pluginID} })
      this.dataSource = res.data.data
      this.dataLoading = false
    },
    // 查看指定插件下的菜单
    searchPluginsChange () {
      this.menuList()
    }
  },
  components: {
    TreeGrid
  },
  async created () {
    this.menuList()
    // 查看指定插件下的菜单数据加载
    let res = await axios.get('/api/menus/getpluginlist')
    this.plugins = res.data.data
  }
}
</script>

<style scoped>
.hint {
  text-indent: 45px;
  padding-top: 25px;
}
.hint span {
  color: red;
}
.search-bar {
  text-align: right;
  padding: 5px;
}
</style>
