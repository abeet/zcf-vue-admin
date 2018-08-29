<template>
  <el-dialog title="批量导入栏目" @open="dialogOpen" :visible.sync="isShow" class="catalog-import-dialog">
      <div v-if="step===1">
        <h5>请按如下要求输入栏目名称： </h5>
        <p >1.每行请填写一个栏目；</p>
        <p>2.子栏目相对父栏目使用两个空格缩进。</p>
        <p>3.内容类型：
          <el-select clearable v-model="batchImportContentType" placeholder="请选择" style="width:160px;">
            <el-option
              v-for="item in contentTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <el-input type="textarea" v-model="catalogStructureInput"></el-input>
      </div>
      <div v-else>
        <h5>栏目预览</h5>
        <el-tree
          :data="previewCatalogTree"
          :render-content="renderContent"
          :props="defaultProps"
          style="height: calc(55vh); overflow: auto; margin: 5px 0 0 5px;"
          node-key="ID"
          :default-expand-all="true"
          :highlight-current="true"
          v-loading="previewTreeLoading">
        </el-tree>
      </div>
      <div class="step-btn">
        <el-button v-if="step===1" type="primary" @click="nextClickHandler" v-loading="submitLoading">下一步</el-button>
        <el-button v-if="step===2" type="primary" @click="prevClickHandler">上一步</el-button>
        <el-button v-if="step===2" type="primary" v-loading="submitLoading" @click="confirm">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script>
import util from '../../../common/util.js'
export default {
  props: {
    catalogId: {
      type: [Number, String],
      default: 0
    },
    contentType: {
      type: String,
      default: '',
      required: false
    },
    dimensionId: {
      type: [Number, String],
      default: 0,
      required: true
    },
    contentTypes: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      catalogStructure: '' /** 栏目结构 */,
      catalogStructureInput: '' /** 用户输入的栏目结构 */,
      submitLoading: false,
      previewCatalogTree: [] /** 栏目预览树 */,
      previewTreeLoading: false,
      step: 1 /** 上一步下一步 */,
      batchImportContentType: '' /** 导入栏目类型 */,
      defaultProps: {
        /** 树节点默认配置 */
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    dialogOpen () {
      this.submitLoading = false
      this.catalogStructureInput = ''
      this.batchImportContentType = this.contentType
      this.previewCatalogTree = []
      this.step = 1
    },
    /** 树节点渲染 */
    renderContent: function (createElement, { node, data, store }) {
      let params = {
        h: createElement,
        treeObj: { node, data, store }
      }
      return util.renderTreeContent(params)
    },
    /** 检查填写的字符串格式是否正确,替换掉特殊字符,保留中文 */
    checkFormat () {
      let str = this.catalogStructureInput
      str = str.replace('\t', '  ')
      str = str.replace(/\r\b\f/g, '')
      str = str.replace(/[^a-zA-Z0-9_.-/\s\n\u4e00-\u9fa5]/g, '')
      if (!str) {
        this.$emit('dialog', '请输入正确字符')
        return false
      }
      this.catalogStructureInput = str
      return true
    },
    /** 批量导入栏目上一步 */
    prevClickHandler () {
      this.step = 1
      this.previewCatalogTree = []
    },
    /** 批量导入栏目下一步 */
    async nextClickHandler () {
      if (!this.catalogStructureInput) {
        this.$emit('dialog', '导入栏目不能为空')
        return
      }
      if (!this.checkFormat()) {
        return
      }
      let cNames = this.catalogStructureInput.split('\n')
      for (let j = 0; j < cNames.length; j++) {
        if (cNames[j].trim().length > 100) {
          this.$emit('dialog', '导入栏目超过最大长度限制:<br>' + cNames[j])
          return
        }
      }
      this.submitLoading = true
      try {
        let res = await axios.put('/api/catalogs/checkimportcatalog', {
          batchColumn: this.catalogStructureInput
        })
        this.submitLoading = false
        if (res.data.status === 1) {
          this.previewTreeLoading = true
          let resp = await axios.get('/api/catalogs/importtreedatabind', {
            params: {
              parentID: this.catalogId,
              batchColumn: encodeURIComponent(this.catalogStructureInput)
            }
          })
          this.previewTreeLoading = false
          if (resp.data.status === 1) {
            this.previewCatalogTree = resp.data.data
            this.step = 2
          } else {
            util.showMessage(res)
          }
        } else {
          util.showMessage(res)
        }
      } catch (e) {
        this.submitLoading = false
      }
    },
    /** 提交批量添加栏目 */
    async confirm () {
      let params = {
        parentID: this.catalogId,
        contentType: this.batchImportContentType,
        batchColumn: this.catalogStructureInput,
        dimensionID: this.dimensionId
      }
      this.submitLoading = true
      try {
        let res = await axios.post('/api/catalogs/branchimportcatalog', params)
        this.submitLoading = false
        if (res.data.status === 1) {
          this.isShow = false
          await util.showProgress(res.data.taskID, `正在导入栏目`)
          this.$emit('callback')
        } else {
          util.showResponseMessage(res.data)
        }
      } catch (e) {
        this.submitLoading = false
      }
    }
  }
}
</script>
<style scope>
.catalog-import-dialog .el-dialog p{
  padding: 5px 0px 5px 0px;
  margin-bottom: 2px;
  display: block;
  margin-top: -10px;
}
.catalog-import-dialog .el-dialog .step-btn{
  margin: 0 auto;
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
.catalog-import-dialog .el-dialog h5{
  color: #445566;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
<style>
.catalog-import-dialog .el-dialog{
  width: 450px;
}
@media (max-width:480px){
  .catalog-import-dialog .el-dialog{
    width: 96%;
  }
}
.catalog-import-dialog .el-dialog .el-textarea__inner{
  vertical-align: top;
  color: #336699;
  border: 1px solid #667788;
  border-color: #9ab #cde #cde #bcd;
  line-height: 19px;
  padding: 1px 1px 1px 4px;
  background: #F7FAFC url(/assets/images/textarea_bg.gif);
  height: 280px;
  margin: 0;
  box-shadow: 1px 0px 8px 0px rgba(0, 0, 50, 0.1) inset;
  overflow: auto;
}
</style>
