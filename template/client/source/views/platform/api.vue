<template>
  <div class="layout-row-inpage">
      <div :span="6" class="layout-col-tree">
        <el-toolbar>
         <el-input class="search-input" placeholder="输入接口名称查找" v-model="filterText" icon="search">
           <el-button slot="append" @click="apiTreeFilter">搜索</el-button>
         </el-input>
        </el-toolbar>
        <div class="layout-content-padding mini scroll">
          <el-tree :data="apiTree" :props="defaultProps" node-key="ID" :render-content="renderContent" :default-expand-all="true" :highlight-current="true" :filter-node-method="filterNode" @node-click="handleNodeClick" ref="apiTree">
          </el-tree>
        </div>
      </div>
      <div :span="18" class="layout-col-detail">
        <el-tabs :data="info" value="info" class="tabs-wrap">
          <el-tab-pane name="info">
            <span slot="label">
              <i class="el-icon-information"></i>接口信息</span>
            <div class="pane-wrap">
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
                <span class="info-label">来源插件:</span>
                <span class="info-value">\{{info.plugin}}</span>
              </p>

              <h3 class="title">输入参数</h3>
              <tree-grid :columns="parameterscolumns" :tree-structure="true" :data-source="inputparameters" :needCheckbox="false" serialNumberName="序号">
              </tree-grid>

              <h3 class="title">输出参数</h3>
              <tree-grid :columns="parameterscolumns" :tree-structure="true" :data-source="outputparameters" :needCheckbox="false" serialNumberName="序号">
              </tree-grid>

            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import TreeGrid from '../../components/TreeGrid.vue'
export default {
  data () {
    return {
      filterText: '',
      apiTree: [
        {
          ID: '-1',
          name: '接口列表',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      info: {},
      inputparameters: [],
      parameterscolumns: [
        {
          text: '名称',
          dataIndex: 'name'
        },
        {
          text: '数据类型',
          dataIndex: 'dataType'
        },
        {
          text: '是否为数组',
          dataIndex: 'arrayFlag'
        },
        {
          text: '允许空值',
          dataIndex: 'allowNull'
        },
        {
          text: '备注',
          dataIndex: 'memo'
        }
      ],
      outputparameters: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.apiTree.filter(val)
    }
  },
  methods: {
    apiTreeFilter () {
      this.$refs.apiTree.filter(this.filterText)
    },
    renderContent (createElement, { node, data, store }) {
      let className = data.ID < 0 ? 'fa fa-tv' : 'fa fa-plug'
      let icon = createElement('i', { attrs: { class: className } })
      let label = createElement('span', ' ' + node.label)
      return createElement('span', [icon, label])
    },
    handleNodeClick (data) {
      if (data.ID == -1 || data.ID == this.info.ID) {
        return
      }
      this.info = data
      this.inputparameters = data.inputs
      this.outputparameters = data.outputs
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  },
  components: {
    TreeGrid
  },
  async created () {
    const res = await axios.get('/api/apis')
    this.apiTree[0].children = res.data.data
  }
}
</script>

<style scoped>
.pane-wrap {
  padding: 0 15px 15px;
}

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
</style>
