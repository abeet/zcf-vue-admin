<template>
   <div class="layout-row-inpage">
      <div :span="6" class="layout-col-tree">
        <el-toolbar>
          <div :span="8" style="text-align:center;">分类：</div>
          <div :span="16">
            <el-select placeholder="分类" style="width:100%;" v-model="dimensionID" @change="changeDimensionHandler">
              <el-option v-for="dimension in dimensions" :key="dimension.ID" :label="dimension.name" :value="dimension.ID">
              </el-option>
            </el-select>
          </div>
        </el-toolbar>
        <div class="layout-content-padding mini scroll" v-loading="treeDataLoading">
          <el-tree
            :props="defaultProps"
            node-key="ID"
            :render-content="renderContent"
            lazy
            :load="loadTreeNodeData"
            :default-expanded-keys="[0]"
            :highlight-current="true"
            :expand-on-click-node="false"
            ref="catalogTree"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </div>
      </div>
      <div :span="18" class="layout-col-detail">
        <el-toolbar>
          <el-button :loading="submitLoading" @click.stop="saveClickHandler" :disabled="!catalogInfo.ID"
            :priv="'com.zving.cms.Catalog.Edit.'+catalogInfo.ID">
            <i class="fa fa-floppy-o"></i>保存
          </el-button>
          <el-button @click.stop="addClickHandler"
            :priv="!catalogInfo.ID ? `ContentCore.Catalog.AddTopLevelCatalog`:`com.zving.cms.Catalog.Add.${catalogInfo.ID}`">
            <i class="fa fa-plus"></i>添加\{{catalogInfo.ID?"":"顶级"}}栏目</el-button>
          <el-button @click.stop="deleteClickHandler" :disabled="!catalogInfo.ID"
            :priv="'com.zving.cms.Catalog.Delete.'+catalogInfo.ID"><i class="fa fa-times"></i>删除</el-button>
          <el-button @click.stop="importClickHandler"
            :priv="!catalogInfo.ID ? `ContentCore.Catalog.AddTopLevelCatalog`:`com.zving.cms.Catalog.Add.${catalogInfo.ID}`">
            <i class="fa fa-file-archive-o"></i>批量导入栏目</el-button>
          <el-button @click.stop="exportClickHandler"
            :priv="!catalogInfo.ID ? `ContentCore.Catalog.AddTopLevelCatalog`:`com.zving.cms.Catalog.Edit.${catalogInfo.ID}`">
            <i class="fa fa-cloud-upload f16"></i>导出栏目结构</el-button>
        </el-toolbar>
        <el-form label-position="right" v-loading="dataLoading" ref="catalog-form" class="catalog-form" label-width="180px" :model="catalogInfo">
          <div class="panel-fieldset">
            <h4 class="panel-legend">基本属性</h4>
              <el-form-item label="栏目ID：">
                  \{{catalogInfo.ID}} (内部编码：\{{catalogInfo.innerCode}})
              </el-form-item>
              <el-form-item label="状态：">
                  <el-switch v-model="catalogInfo.isShow" :disabled="!catalogInfo.ID" inactive-text="禁用" active-text="启用"  active-value="0" inactive-value="1"></el-switch>
              </el-form-item>
              <el-form-item label="排序：">
                    <el-input v-model="catalogInfo.orderFlag" style="width: 240px;" :disabled="!catalogInfo.ID"></el-input>
              </el-form-item>
              <el-form-item label="栏目名称：" prop="name" :verify="['NotNull','Length<30']">
                  <el-input v-model="catalogInfo.name" style="width: 240px;" :disabled="!catalogInfo.ID"></el-input>
              </el-form-item>
              <el-form-item label="栏目别名：" prop="alias" :verify="['NotNull','Regex=^[a-zA-Z0-9_\.\-\/]+$','Length<100']">
                  <el-input v-model="catalogInfo.alias" style="width: 240px;" :disabled="!catalogInfo.ID"></el-input>
              </el-form-item>
              <!-- <el-form-item label="栏目类型：">
                  <el-select clearable v-model="catalogInfo.type" placeholder="请选择" style="width: 240px;" :disabled="!catalogInfo.ID">
                      <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item> -->
              <el-form-item label="内容类型：">
                  <el-select clearable v-model="catalogInfo.contentType" placeholder="请选择" style="width: 240px;" :disabled="!catalogInfo.ID">
                      <el-option v-for="item in contentTypes" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="栏目描述：">
                  <el-input type="textarea" :rows="2" v-model="catalogInfo.info" :style="{width:'280px'}" :disabled="!catalogInfo.ID"></el-input>
              </el-form-item>
              <el-form-item label="Logo图片：" :style="{'margin-top':'5px;'}">
                <div style="width:80px">
                  <logo-path
                    :path.sync="catalogInfo.logoFile"
                    :preview-path.sync="catalogInfo.logoSrc"
                    edit-position="right"
                    upload-title="上传栏目Logo图片"
                    :resource-dialog-props="resourceDialogProps"
                    :disabled="!catalogInfo.ID"
                  ></logo-path>
                </div>
              </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 栏目结构导出 -->
      <catalog-structure
        :catalog-id="catalogInfo.ID"
        :dimension-id="dimensionID"
        :show.sync="exportShowModal"
      ></catalog-structure>
      <!-- 栏目批量导入 -->
      <catalog-import
        :catalog-id="catalogInfo.ID"
        :dimension-id="dimensionID"
        :show.sync="importShowModal"
        :content-types="contentTypes"
        :content-type="catalogInfo.contentType"
        @callback="reloadTreeNodeData"
      ></catalog-import>
      <!-- 新建栏目 -->
      <catalog-add
        :dimension-id="dimensionID"
        :show.sync="addCatalogForm.isShowModal"
        :content-types="contentTypes"
        :types="types"
        :parent="addCatalogForm.parent"
        @callback="addCatalogCallback"
      ></catalog-add>
  </div>
</template>
<script>
import util from '../../common/util.js'
import CatalogExportStructure from './components/CatalogExportStructureDialog.vue'
import CatalogImport from './components/CatalogImportDialog.vue'
import CatalogAdd from './components/CatalogAddDialog.vue'
import LogoPath from './components/LogoPath.vue'
export default {
  components:{
    'catalog-structure': CatalogExportStructure,
    'catalog-import': CatalogImport,
    'catalog-add': CatalogAdd,
    'logo-path': LogoPath
  },
  data(){
    return {
      catalogTree:[],
      defaultProps: {
        label: 'name',
        'isLeaf': 'isLeaf'
      },
      currentTreeData: null,
      currentTreeNode: null,
      dimensionID: '',
      dimensions: [],
      treeDataLoading:false,
      catalogInfo:{},
      submitLoading:false,
      dataLoading:false,
      resourceDialogProps: {},
      contentTypes:[],
      types:[],
      exportShowModal: false,/**栏目导出弹框 */
      importShowModal: false,/**栏目导人弹框*/
      addCatalogForm:{},/**添加栏目弹框 */
    }
  },
  created() {
    this.getDimensions()
    this.loadContentType()
    // this.loadCatalogType()
  },
  methods:{

    async addCatalogCallback(res){
      res.isLeaf = true
      if(this.currentTreeNode === null) {
        this.currentTreeNode = this.$refs.catalogTree.root.childNodes[0]
      }
      this.currentTreeNode.doCreateChildren([res])
      if (this.currentTreeNode.isLeaf) {
        this.currentTreeNode.updateLeafState()
        this.currentTreeNode.isLeaf = false
      }
      this.currentTreeNode.expand()
      // this.catalogInfo = res
    },
    renderContent(createElement, { node, data, store }) {
      let className = data.ID <= 0 ? 'fa fa-desktop' : 'fa fa-folder'
      let icon = createElement('i', { attrs: { class: className } })
      let label = createElement('span', ' ' + node.label)
      return createElement('span', [icon, label])
    },
    async handleNodeClick(curData, e, curNode) {
      if (curData.ID == 0) {
        this.catalogInfo = {}
        this.$refs['catalog-form'].resetFields()
        return
      }
      this.currentTreeData = curData
      this.currentTreeNode = curNode.node
      this.dataLoading = true
      let res = await axios.get(`/api/catalogs/${curData.ID}`)
      this.dataLoading = false
      this.catalogInfo = res.data.data
      //logo对象
      this.resourceDialogProps = {
        dataType: 'CatalogLogo',
        dataID: this.catalogInfo.ID,
        resourceType: 'image',
        imageType: 'logo',
        catalogID: this.catalogInfo.ID,
        dimensionID: this.dimensionID,
        imageWidth: 120,
        imageHeight: 120,
        inputType: 'radio'
      }
    },
    reloadTreeNodeData(){
      if(this.currentTreeNode === null) {
        this.currentTreeNode = this.$refs.catalogTree.root.childNodes[0]
      }
      if(this.currentTreeData){
        this.currentTreeNode.loaded = false
        this.currentTreeNode.loadData()
      }
    },
    async loadTreeNodeData (node, resolve) {
      let params = { dimensionID: this.dimensionID }
      if ( node.data && (node.data.ID || node.data.ID === 0)) {
        params.parentID = node.data.ID
      } else {
        params.isRoot = 'Y'
      }
      let res = await axios.get('/api/catalog/admintree', { params })
      let catalogData = res.data.data
      resolve(catalogData)
      if ( node.data && node.data.ID === 0) {
        this.$nextTick(function () {
          let subNodes = this.$refs.catalogTree.root.childNodes[0].childNodes
          for(let i = 0; i< subNodes.length; i++) {
            let pNode = subNodes[i]
            if (pNode.data && pNode.data.children && pNode.data.children.length > 0) {
              pNode.doCreateChildren(pNode.data.children)
              pNode.loaded = true
              pNode.expand()
            }
          }
        })

      }
    },
    changeDimensionHandler(value) {
      this.dimensionID = value
      this.currentTreeNode = null
      this.reloadTreeNodeData()
    },
    async loadContentType() {
      let res = await axios.get('/contentcore/contenttypes')
      this.contentTypes = res.data.data
    },
    async getDimensions(){
      let res = await axios.get('/api/dimensions')
      this.dimensions = res.data.data
      this.dimensionID = this.dimensions[0].ID
      this.reloadTreeNodeData()
    },
    exportClickHandler(){
      this.exportShowModal = true
    },
    importClickHandler(){
      this.importShowModal = true
    },
    async deleteClickHandler (){
      if(!this.catalogInfo.ID) {
        return
      }
      try {
        await this.$confirm('警告：您确认要删除这个栏目吗？', '系统提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        let res = await axios.delete(`/api/catalogs/${this.catalogInfo.ID}`)
        if (res.data.status === 2) {
          await util.showProgress(res.data.taskID, `正在删除[`+this.catalogInfo.name+`]栏目`)
          this.catalogInfo = {}
          this.$refs['catalog-form'].resetFields()
          this.currentTreeNode.parent.removeChild(this.currentTreeNode)
        } else {
          util.showResponseMessage(res)
        }
      } catch (e) {
        return
      }
    },
    addClickHandler(){
      this.addCatalogForm = {
        isShowModal:true,
        parent:{
          ID: this.catalogInfo.ID||0,
          name: this.catalogInfo.name||'根栏目',
          alias: this.catalogInfo.alias||'',
          contentType: this.catalogInfo.contentType||'',
          type: this.catalogInfo.type||'Default'
        }
      }
    },
    async saveClickHandler(){
      this.submitLoading = true
      await util.validateForm(this.$refs['catalog-form'])
      let res = await axios.put(`/api/catalogs/${this.catalogInfo.ID}`, this.catalogInfo)
      this.submitLoading = false
      util.showResponseMessage(res.data)
      if(res.data.status === 1) {
        this.currentTreeData = Object.assign(this.currentTreeData, this.catalogInfo)
      }
    }
  }
}
</script>



