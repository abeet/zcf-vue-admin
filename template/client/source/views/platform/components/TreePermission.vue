<template>
  <div class="tree-wrap">
    <el-checkbox-group :value="value">
      <el-tree class="permission-tree-wrap" :data="permissions" :props="props" :expand-on-click-node="false" :default-expand-all="expand" :render-content="renderContent">
      </el-tree>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
  .tree-wrap{
  }
</style>

<script>
import util from '../../../common/util.js'

export default {
  data () {
    return {}
  },
  props: {
    'value': {
      type: Array,
      required: true
    },
    'permissions': {
      type: Array,
      required: true
    },
    'props': {
      type: Object,
      default: function () {
        return {
          children: 'children',
          label: 'name',
          permission: 'permissions'
        }
      }
    },
    'expand': {
      type: Boolean,
      default: true
    }
  },
  computed: {
  },
  methods: {
    checkBoxChangeHandler (code, parentCode) {
      return (value) => {
        let val = Object.assign([], this.value)
        if (value) {
          val.push(code)
          if (parentCode) {
            val = this.checkParentNode(parentCode, val)
          }
        } else {
          let index = val.findIndex(val => val === code)
          val.splice(index, 1)
        }
        val = _.uniq(val)
        return this.$emit('input', val)
      }
    },
    checkParentNode (code, val) {
      while (code) {
        val = val.concat(code)
        let parentNode = util.findTreeParentNode(this.permissions, 'code', code, this.props.children)
        if (parentNode.code && code != parentNode.code) {
          code = parentNode.code
        } else {
          break
        }
      }
      return val
    },
    nodeCheckBoxChangeHandler (code) {
      return (targetValue) => {
        let val = Object.assign([], this.value)
        let node = util.findTreeNode(this.permissions, 'code', code, this.props.children)
        if (node.parentCode) {
          val = this.checkParentNode(node.parentCode, val)
        }
        let nodeValues = this.treeNodeAllPermissionItems([node])
        if (targetValue) { // 全选子节点
          val = val.concat(nodeValues)
        } else { // 取消选择子节点
          val = val.filter(val => !nodeValues.includes(val))
        }
        val = _.uniq(val)
        return this.$emit('input', val)
      }
    },
    renderContent (h, {node, data, store }) {
      // console.log(data)
      let nodeContent = []
      nodeContent.push(h(
        'div', {
          'class': ['node-name'],
          'style': {
            'display': 'inline-block',
            'fontWeight': '600'
          }
        }, [

          h('el-checkbox', {
            props: {
              'label': data ? data['code'] : '',
              'disabled': data ? data['disabled'] : ''
            },
            on: {
              'change': this.nodeCheckBoxChangeHandler(data ? data['code'] : '')
            }
          }, ''),
          h('span',
            {
              style: {
                'display': 'inline-block',
                'marginRight': '20px',
                'lineHeight': '32px',
                'fontSize': '18px'
              }
            },
            [
              h(
                'i', {
                  'class': data && data['icon'] ? data['icon'] : 'fa fa-folder',
                  'style': {
                    'marginLeft': '2px'
                  }
                }
              ),
              h(
                'span', data ? data.name : ''
              )
            ]
          )
        ]
      ))

      if (data && data[this.props.permission] && data[this.props.permission].length) {
        let permissionCheckBoxs = data[this.props.permission].map((val) => {
          return h('el-checkbox', {
            style: {
              'marginLeft': '18px'
            },
            props: {
              'label': val.code,
              'disabled': val.disabled
            },
            on: {
              'change': this.checkBoxChangeHandler(val.code, val.parentCode)
            }
          }, val.name)
        }, this)

        nodeContent.push(h(
          'div', {
            style: {
              'marginTop': '10px',
              'whiteSpace': 'normal'
            },
            'class': 'node-content'
          }, permissionCheckBoxs
        ))
      }
      return h('div', {
        style: {
          display: 'inline-block',
          marginBottom: '10px'
        }
      }, nodeContent)
    },
    treeNodeAllPermissionItems (tree) {
      let result = []
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].code) {
          result.push(tree[i].code)
        }
        if (tree[i][this.props.permission] && tree[i][this.props.permission].length) {
          let tmpItems = tree[i][this.props.permission].map(val => val.code)
          result = result.concat(tmpItems)
        }
        if (tree[i][this.props.children] && tree[i][this.props.children].length) {
          let tmp = this.treeNodeAllPermissionItems(tree[i][this.props.children])
          result = result.concat(tmp)
        }
      }
      return result
    }
  }
}
</script>
<style>
.node-content .el-checkbox:first-child{
 margin-left: 23px!important;
}
.node-content .el-checkbox__input.is-checked + .el-checkbox__label {
  color: gray;
}
.tree-wrap .permission-tree-wrap .el-tree-node{
  border-bottom: 1px solid #e5e5e5;
}
.tree-wrap .permission-tree-wrap .el-tree-node:last-child{
  border-bottom: none;
}
.tree-wrap .permission-tree-wrap .el-tree-node__children .el-tree-node {
  border-bottom: 0px;
  margin-bottom:0px;
}
</style>
