<template>
  <el-dialog title="导出栏目结构" @open="dialogOpen"  :visible.sync="isShow"  class="export-structure-dlg">
      <div v-loading="dataLoading">
        <span class="hint">导出的文本经复制后使用批量导入栏目功能可以导入到其它站点或栏目下</span>
        <el-input type="textarea" readonly :rows="15" v-model="catalogStructure"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="isShow = false">关 闭</el-button>
      </div>
    </el-dialog>
</template>
<script>
import util from '../../../common/util.js'
export default {
  props: {
    catalogId: {
      type: [Number,String],
      default: 0,
      required: true
    },
    dimensionId: {
      type: [Number,String],
      default: 0,
      required: true
    },
    show: {
      type: Boolean,
      default: false,
      required: true
    },
  },
  data() {
    return {
      dataLoading: false,
      catalogStructure: '' /**栏目结构 */
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    dialogOpen() {
      this.getExportStructure()
    },
    /**导出栏目结构 */
    async getExportStructure() {
      this.dataLoading = true
      try {
        let res = await axios.get(`/api/catalogs/${this.catalogId}/exportstructure`, {
          params: {
            siteID: this.siteId,
            dimensionID: this.dimensionId
          }
        })
        this.dataLoading = false
        if (res.data.status === 1) {
          this.catalogStructure = res.data.data.data
        } else {
          util.showResponseMessage(res.data)
        }
      } catch (e) {
        this.dataLoading = false
        return
      }
    },
  }
}
</script>
<style scope>
.export-structure-dlg .el-dialog .hint {
  padding: 5px 0px 5px 0px;
  margin-bottom: 5px;
  font-size: 12px;
  display: block;
  margin-top: -10px;
}
.export-structure-dlg .el-dialog h5 {
  color: #445566;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
<style>
.export-structure-dlg .el-dialog {
  width: 450px;
}
.export-structure-dlg .el-dialog .el-textarea__inner {
  vertical-align: top;
  color: #336699;
  border: 1px solid #667788;
  border-color: #9ab #cde #cde #bcd;
  line-height: 19px;
  padding: 1px 1px 1px 4px;
  background: #f7fafc url(/assets/images/textarea_bg.gif);
  height: 280px;
  margin: 0;
  box-shadow: 1px 0px 8px 0px rgba(0, 0, 50, 0.1) inset;
  overflow: auto;
}
</style>
