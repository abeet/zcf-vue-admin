<template>
  <div>
    <!-- 栏目选择框 -->
    <el-dialog :title="title" :visible.sync="isShow" @open="dialogOpen" append-to-body class="catalog-selector-dialog">
      <div class="dialog-body">
        <!-- 站点选择 -->
        <div v-if="this.site === 'Y'">
          <site-select @callback="siteSelectCallback"></site-select>
        </div>
        <!-- 单选按钮模式 -->
        <div v-if="inputType === 'radio'">
          <el-radio-group v-model="tmpNode.ID">
            <el-tree
              :render-content="renderContent"
              ref="tree"
              :data="copyContentTree"
              v-loading="catalogTreeLoading"
              :default-expand-all="true"
              :highlight-current="true"
              :node-key="treeOptions.key"
              :expand-on-click-node="false"
              :props="treeOptions"
              check-strictly
              @node-click="treeNodeClick"
              :show-checkbox="false"
              class="catalog-tree">
            </el-tree>
          </el-radio-group>
        </div>
        <!-- 复选框模式 -->
        <div v-else-if="inputType === 'checkbox'">
          <el-checkbox-group v-model="ids" @change="checkedChangHandler">
            <el-tree
              :render-content="renderContent"
              ref="tree"
              :data="copyContentTree"
              v-loading="catalogTreeLoading"
              :default-expand-all="true"
              :highlight-current="true"
              :node-key="treeOptions.key"
              :expand-on-click-node="false"
              :props="treeOptions"
              check-strictly
              @node-click="treeNodeClick"
              class="catalog-tree">
            </el-tree>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 底部确认按钮 -->
      <div slot="footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import siteSelectDialog from './../siteSelectDialog.vue'
  import util from '../../../common/util.js'

  export default {
    components: {
      'site-select': siteSelectDialog,
    },
    data() {
      return {
        siteID: null, //站点ID
        treeObject: {}, //树对象
        catalogTreeLoading: true, //树加载动画
        copyContentTree: [], //内容复制树的值
        treeOptions: { key: 'ID', label: 'name', children: 'children' }, //树属性选项
        tmpNode: {},
        ids:[],/**被选中的节点栏目ID */
        names:[],/**选中栏目名称 */
      }
    },
    computed: {
      isShow: {
        get() {
          return this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
    },
    props: {
      contentType: {
        default: ''
      },
      inputType: {
        default: 'radio'
      },
      checkedIds: {
        default: ()=> {
          return []
        }
      },
      catalogId: {
        default: ''
      }, site: {
        default: ''
      },
      title: {
        default: '栏目选择'
      },
      show: {
        default: false
      }
    },
    methods: {
      /**渲染树样式 */
      renderContent: function (createElement, { node, data, store }) {
        if(this.inputType === 'radio'){ // 单选按钮渲染
          if (node.level === 1) {
            return createElement('span', [
              createElement('i', { attrs: { class: 'fa fa-desktop' } }),
              createElement('span', node.label),
            ])
          } else {
            return createElement('span', [
              createElement('el-radio', {
                props: { label: data.ID },
              }, '.'
              ),
              createElement('i', { attrs: { class: 'fa fa-folder' } }),
              createElement('span', node.label)
            ])
          }
        }else if(this.inputType === 'checkbox'){ // 复选框渲染
          let color = ''
          if (node.data.disabled) {
            color = '#ACA899'
          }
          if (node.level === 1) {
            return createElement('span', [
              createElement('i', { attrs: { class: 'fa fa-desktop' } }),
              createElement('span', node.label),
            ])
          } else {
            return createElement('span', [
              createElement('el-checkbox',{ props: {label: data.ID,disabled: data.disabled,},},[
                  createElement('i', { attrs: { class: 'fa fa-folder' } }),
                  createElement('span', { style: { color: color } }, node.label),
                ],
              ),
            ])
          }
        } else {
          console.warn("未设置节点选择类型：(radio, checkbox)");
        }
      },
      /* 加载栏目数据 */
      async loadingCatalogTree() {
        let res = await axios.get('/api/catalog/bindcopycontenttree', {
          params: this.treeObject,
        })
        this.copyContentTree = res.data.data
        this.catalogTreeLoading = false
      },
      /**弹框打开回调 */
      async dialogOpen() {
        this.siteID = null
        this.treeObject = {}
        this.tmpNode = { ID: this.catalogId }
        this.catalogTreeLoading = true
        let res = await axios.get('/api/catalog/inittreelevel', {
          params: { checkedIDs: this.checkedIds.join() },
        })
        if (res.data.data != null) {
          Vue.set(this.treeObject, 'catalogtreelevel', res.data.data.catalogTreeLevel)
        } else {
          Vue.set(this.treeObject, 'catalogtreelevel', null)
        }
        Vue.set(this.treeObject, 'catalogID')
        Vue.set(this.treeObject, 'contentType', this.contentType)
        Vue.set(this.treeObject, 'checkedIDs', this.checkedIds.join())
        this.ids = this.checkedIds
        this.loadingCatalogTree()
      },
      /**站点选择回调 */
      siteSelectCallback(val) {
        this.siteID = val
      },
      /* 单选按钮点击时触发 */
      treeNodeClick(node) {
        if(this.inputType === 'radio'){
          this.tmpNode = node
        }else{

        }
      },
      /* 复选框点击时触发 */
      checkedChangHandler(val) {
        this.ids = val
      },
      /**确认按钮点击事件 */
      confirm() {
        if (this.inputType === 'radio') { // 单选按钮处理
          if (!this.tmpNode.ID || this.tmpNode.ID <= 0) {
            this.$alert('请先选择一条记录！', '提示')
            return
          }
          this.$emit('callback', this.tmpNode)
          this.isShow = false
          return
        } else if(this.inputType === 'checkbox'){ // 针对复选框操作
          if (this.ids.length === 0) {
            this.$alert('请选择栏目', '提示', {
              type: 'info',
              confirmButtonText: '确定',
            })
            return
          }
          // 清空数组
          this.names.splice(0, this.names.length)
          this.ids.forEach(el => {
            let node = util.findTreeNode(this.copyContentTree[0].children, 'ID', el, 'children')
            if (node) {
              this.names.push(node.name)
            }
          })
          this.$emit('callback', {
            ids: this.ids.join(),
            names: this.names.join(),
          })
          this.isShow = false
        }else{}
      },
    },
  }
</script>
<style>
  /* 在一般情况下dialog宽为400像素，在逻辑分辨率480像素以下dialog宽为96% */
  .catalog-selector-dialog .el-dialog {
    width: 450px;
  }
  @media (max-width: 480px) {
    .catalog-selector-dialog .el-dialog {
      width: 96%;
    }
  }
  .catalog-selector-dialog .el-radio__label {
    display: none;
  }
  .catalog-selector-dialog .el-radio__input {
    padding-right: 10px;
  }
</style>
<style scoped>
  .catalog-tree {
    height: 100%;
    width: 100%;
    overflow: auto;
    font-size: 12px;
  }
  .dialog-body {
    height: 400px;
    width: 100%;
    /* border: 1px solid #ddd; */
  }
</style>
