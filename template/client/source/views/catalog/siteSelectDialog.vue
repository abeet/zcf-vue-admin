<template>
  <div class="select-wrap" @click.stop="wrapClickHandler">
    <el-input :value="inputValue" :readonly="true" :disabled="disabled" :icon="isOpenTree ? 'caret-top' : 'caret-bottom'" @click.stop="inputClickHandler">
    </el-input>
    <div class="tree-wrap" v-show="isOpenTree">
      <el-toolbar>
        站点：
        <el-input v-model="filterText" style="width:120px"></el-input>
      </el-toolbar>
      <el-tree :filter-node-method="filterNode" ref="siteTree" :data="siteTreeData" :node-key="treeOptions.key" :current-node-key="currentNodeKey" :props="treeOptions" :default-expand-all="true" :expand-on-click-node="false" :highlight-current="true" @node-click="treeNodeClickHandler" :render-content="renderContent">
      </el-tree>
    </div>
  </div>
</template>

<script>
;

export default {
  data () {
    return {
      inputValue: '',
      treeOptions: { key: 'ID', label: 'name', children: 'children' },
      siteTreeData: [],
      isOpenTree: false,
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.siteTree.filter(val)
    }
  },
  methods: {
    inputClickHandler () {
      if (this.disabled) {
        return
      }
      this.isOpenTree = !this.isOpenTree
    },
    async wrapClickHandler () {
      if (this.disabled) {
        return
      }
      if (!this.isOpenTree) {
        this.isOpenTree = true
      }
      if (this.isOpenTree) {
        let obj = {
          name: this.name,
          path: this.path
        }
        let getSiteListTreeData = await axios.get('/api/sites', obj)
        this.siteTreeData = getSiteListTreeData.data.data
      }
    },
    treeNodeClickHandler (data) {
      let val = {}
      if (data[this.treeOptions.key] > 0) {
        val[this.treeOptions.label] = data[this.treeOptions.label]
        val[this.treeOptions.key] = data[this.treeOptions.key]
        this.$emit('callback', data[this.treeOptions.key])
        this.inputValue = data[this.treeOptions.label]
        this.isOpenTree = false
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    renderContent: function (createElement, { node, data, store }) {
      let icon = 'fa fa-home'
      if (node.data.ID === 0) {
        icon = 'fa fa-desktop'
      }
      let params = {
        h: createElement,
        treeObj: { node, data, store },
        icon: icon
      }
      return util.renderTreeContent(params)
    }
  },
  computed: {
    inputValue () {
      if (!this.value || !this.treeOptions || !this.treeOptions.label) {
        return ''
      }

      return this.value[this.treeOptions.label] || ''
    },
    currentNodeKey () {
      if (!this.value || !this.treeOptions || !this.treeOptions.key) {
        return ''
      }

      return this.value[this.treeOptions.key] || ''
    }
  },
  props: ['value', 'disabled', 'name', 'path'],
  mounted () {
    let that = this
    document.addEventListener(
      'click',
      () => {
        that.isOpenTree = false
      },
      false
    )
  }
}
</script>

<style scoped>
.select-wrap {
  max-width: 203px;
  position: relative;
  cursor: pointer;
}

.select-wrap input[type='text'] {
}

.select-wrap .tree-wrap {
  overflow: auto;
  position: absolute;
  z-index: 10000;
  top: 42px;
  left: 1px;
  right: 1px;
  width: 270px;
  height: 250px;
  background-color: #fff;
  border: 1px solid #d1dbe5;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
