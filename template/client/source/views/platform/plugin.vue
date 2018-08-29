<template>
  <div class="layout-row-inpage">
      <div :span="6" class="layout-col-tree" style="flex-basis: 240px;" v-loading="dataLoading">
        <el-toolbar>
          <el-switch v-model="info.status" active-text="启用" inactive-text="停用" :disabled="!info.ID"  @change="pluginStatusChange"></el-switch>
        </el-toolbar>
        <div class="layout-content-padding mini scroll">
        <el-tree :data="pluginTree" :props="defaultProps" :render-content="renderContent" node-key="ID" :default-expand-all="true"
                 :highlight-current="true" @node-click="handleNodeClick">
        </el-tree>
        </div>
      </div>
      <div :span="18" class="layout-col-detail">
        <el-tabs class="tabs-wrap" value="info">
          <el-tab-pane name="info">
          <span slot="label">
            <i class="el-icon-information"></i>基本信息</span>
            <div class="layout-content-padding scroll">
              <h3 class="title">基本信息</h3>
              <p class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">\{{info.ID}}</span>
              </p>
              <p class="info-item">
                <span class="info-label">名称:</span>
                <span class="info-value">\{{info.name}}</span>
              </p>
              <p class="info-item">
                <span class="info-label">状态:</span>
                <span class="info-value">
                <i class="fa fa-check icon-success" v-if="info.status"></i>
                <i class="fa fa-times icon-danger" v-else></i>
              </span>
              </p>
              <p class="info-item">
                <span class="info-label">版本:</span>
                <span class="info-value">\{{info.version}}</span>
              </p>
              <p class="info-item">
                <span class="info-label">供应商:</span>
                <span class="info-value">\{{info.provider}}</span>
              </p>
              <p class="info-item">
                <span class="info-label">作者:</span>
                <span class="info-value">\{{info.author}}</span>
              </p>
              <p class="info-item">
                <span class="info-label">备注:</span>
                <span class="info-value">\{{info.description}}</span>
              </p>

              <h3 class="title">依赖的插件</h3>
              <el-table :data="dependPlugin" stripe tooltip-effect="dark" style="width: 100%">
                <el-table-column width="68" align="center" label="序列">
                  <template slot-scope="scope">
                    \{{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column prop="ID" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="version" label="版本"></el-table-column>
              </el-table>

              <h3 class="title">直接或间接依赖于本插件的插件</h3>
              <el-table :data="beDependPlugin" stripe tooltip-effect="dark" style="width: 100%">
                <el-table-column width="68" align="center" label="序列">
                  <template slot-scope="scope">
                    \{{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column prop="ID" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="version" label="版本"></el-table-column>
              </el-table>

            </div>
          </el-tab-pane>
          <el-tab-pane name="extend">
          <span slot="label">
            <i class="el-icon-time"></i>扩展</span>
            <div class="layout-content-padding scroll">
              <el-collapse :value="['1','2','3','4']">
                <el-collapse-item title="扩展服务列表" name="1">

                  <el-table :data="extendData.extendServices" stripe tooltip-effect="dark" style="width: 100%">
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="ID" label="ID"></el-table-column>
                    <el-table-column prop="description" label="Description"></el-table-column>
                  </el-table>

                </el-collapse-item>
                <el-collapse-item title=" 扩展项列表" name="2">
                  <el-table :data="extendData.extenditems" stripe tooltip-effect="dark" style="width: 100%">
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="ID" label="ID"></el-table-column>
                    <el-table-column prop="description" label="Description"></el-table-column>
                  </el-table>
                </el-collapse-item>
                <el-collapse-item title=" 扩展点列表" name="3">
                  <el-table :data="extendData.extendpoints" stripe tooltip-effect="dark" style="width: 100%">
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="ID" label="ID"></el-table-column>
                    <el-table-column prop="uiflag" label="UIFlag"></el-table-column>
                    <el-table-column prop="description" label="Description"></el-table-column>
                  </el-table>
                </el-collapse-item>
                <el-collapse-item title="扩展行为列表" name="4">
                  <el-table :data="extendData.extendactions" stripe tooltip-effect="dark" style="width: 100%">
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="ID" label="ID"></el-table-column>
                    <el-table-column prop="description" label="Description"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
          <el-tab-pane name="menu">
          <span slot="label">
            <i class="el-icon-menu"></i>菜单</span>
            <div class="layout-content-padding scroll">
              <tree-grid :columns="menuColumns" :tree-structure="true" :data-source="extendMenus">
              </tree-grid>
            </div>
          </el-tab-pane>
          <el-tab-pane name="files">
          <span slot="label">
            <i class="el-icon-share"></i>文件列表</span>
            <div class="layout-content-padding scroll">
              <el-tree :data="pluginFiles" :props="{children: 'children', label: 'name'}"
                       :render-content="renderTreeContent" :default-expand-all="true"></el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import TreeGrid from '../../components/TreeGrid.vue'
import util from '../../common/util.js'

export default {
  data () {
    return {
      pluginTree: [
        {
          ID: 0,
          name: '插件列表',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dependPlugin: [],
      beDependPlugin: [],
      info: {},
      extendData: {},
      extendMenus: [],
      menuColumns: [
        {
          text: '菜单名称',
          dataIndex: 'name'
        },
        {
          text: 'ID',
          dataIndex: 'ID'
        },
        {
          text: 'URL',
          dataIndex: 'URL'
        }
      ],
      pluginFiles: [],
      dataLoading: true
    }
  },
  methods: {
    async pluginStatusChange (status) {
      let params = {
        ID: this.info.ID,
        status: status
      }
      let res = await axios.put('/api/plugins/status', params).catch(e => console.log(e))
      let data = res.data
      if (data.status == 0) {
        this.info['status'] == status && Object.assign(this.info, { status: !status})
      }
      util.showResponseMessage(res.data)
    },
    renderContent (createElement, { node, data, store }) {
      let className = !data.ID ? 'fa fa-television' : 'fa fa-puzzle-piece'
      let icon = createElement('i', { attrs: { class: className } })
      let label = createElement('span', ' ' + node.label)
      return createElement('span', [icon, label])
    },

    handleNodeClick (item) {
      if (item.ID === 0) {
        this.info = {}
        this.dependPlugin = []
        this.beDependPlugin = []
        this.extendData = {}
        this.extendMenus = []
        this.pluginFiles = []
        return
      }

      this.info = item || {}
      this.dependPlugin = item.requiredPlugins || []
      this.beDependPlugin = item.deRequiredPlugins || []
      this.extendData = item.extends || {}
      this.extendMenus = item.menus || []
      this.pluginFiles = item.pluginFiles || []
    },
    renderTreeContent (h, { node }) {
      if (node.data.type === 'directory') {
        return h('span', { class: ['folder-node'], style: { verticalAlign: 'sub' } }, [
          h(
            'i',
            {
              class: {
                fa: true,
                'fa-folder': !node.expanded,
                'fa-folder-open': node.expanded
              }
            },
            ''
          ),
          h('span', {}, node.data.name)
        ])
      }

      return h(
        'span',
        {
          class: ['file-node'],
          style: {
            verticalAlign: 'sub'
          }
        },
        [
          h(
            'i',
            {
              class: ['fa', 'fa-file']
            },
            ''
          ),
          h('span', {}, node.data.name)
        ]
      )
    }
  },

  async created () {
    let data = await axios.get('/api/plugins')
    data = data.data
    this.pluginTree[0].children = data.data
    this.dataLoading = false
  },
  components: {
    'tree-grid': TreeGrid
  }
}
</script>

<style scoped>
.info-item,
.title {
  line-height: 1.5;
  margin-bottom: 0.5em;
  font-size: 13px;
}

.info-item .info-label {
  display: inline-block;
  text-align: right;
  width: 100px;
}

.title {
  margin-top: 1em;
}

.folder-node i {
  color: #2d8cf0;
  font-size: 14px;
}

.folder-node span {
  font-size: 14px;
}

.menu-wrap {
  overflow: auto;
}
.el-collapse-item {
  margin-bottom: 15px;
}
</style>
