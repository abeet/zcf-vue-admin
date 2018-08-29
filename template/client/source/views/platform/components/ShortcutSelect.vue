<template>
  <div class="layout-no-cols">
    <el-row :gutter="20">
      <el-col :span="8"><span>快捷链接选择：</span></el-col>
      <el-col :span="16">
        <shortcut :menu-ids="preferences.shortcut" :layout-col="6" :hide-btn="hideBtn"></shortcut>
        <div class="m-t">
          <el-button @click="showMenuListDialog"><i class="el-icon-plus"></i>添加新的快捷功能</el-button>
          <span>最多可以选择8个快捷链接</span>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="菜单列表" :visible.sync="showMenuList" append-to-body width="70%">
      <div class="menu-list" v-loading="dataLoading">
        <tree-grid ref="menuList" :columns="columns" :tree-structure="true" :strict="true" :data-source="menus" @selection-change="onSelectionChange">
        </tree-grid>
      </div>
      <div slot="footer">
        <el-button @click="showMenuList = false">取 消</el-button>
        <el-button type="primary" @click="selectMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Shortcut from './Shortcut.vue'
import TreeGrid from '../../../components/TreeGrid.vue'
import translate from '../../../common/dataTranslate.js'
import util from '../../../common/util.js'
export default {
  data () {
    return {
      hideBtn: true,
      shortcuts: [],
      showMenuList: false,
      dataLoading: false,
      columns: [
        {
          text: '菜单名称',
          // dataIndex: 'name',
          render: function (row) {
            return '<i class="' + row.icon + '">&nbsp;' + row.name + '</i>'
          }
        },
        {
          text: '是否启用',
          render: function (row) {
            if (row.status === 'Y') {
              return '<i class="fa fa-check icon-success"></i>'
            } else {
              return '<i class="fa fa-times icon-danger"></i>'
            }
          }
        },
        {
          text: 'ID',
          dataIndex: 'ID'
        },
        {
          text: 'URL',
          dataIndex: 'URL'
        },
        {
          text: '来源插件',
          dataIndex: 'pluginName'
        }
      ],
      menus: [],
      selectedRows: []
    }
  },
  watch: {
    shortcuts: function () {
      let arr = []
      this.shortcuts.forEach(val => {
        if (val.URL) {
          arr.push(val.ID)
        }
      })
      this.preferences.shortcut = arr.length ? arr.join(',') : ''
    }
  },
  methods: {
    selectMenu () {
      if (this.selectedRows.length > 8) {
        util.showErrorMessageBox('最多选择8个快捷链接！')
        return
      }
      this.shortcuts = this.selectedRows
      this.showMenuList = false
    },
    onSelectionChange (selection) {
      this.selectedRows = selection
    },
    async showMenuListDialog () {
      this.showMenuList = true
      this.dataLoading = true
      let menuRes = await axios
        .get('/api/menus/enabledmenulist', {
          params: { selectedMenuIDs: this.preferences.shortcut }
        })
      this.menus = menuRes.data.data
      this.dataLoading = false
    }
  },
  components: {
    'tree-grid': TreeGrid,
    'shortcut': Shortcut
  },
  props: ['preferences']
}
</script>

<style scoped>
.m-t {
  margin-top: 20px;
}
.menu-list {
  padding: 10px;
}
.layout-no-cols {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
