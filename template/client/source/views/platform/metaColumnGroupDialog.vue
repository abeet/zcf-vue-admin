<template>
  <div>
    <el-dialog :title="title" :visible.sync="isShow" @open="beforeDialogOpen" class="metadata-column-group-add-dialog">
      <el-form :model="tmpColumnGroup" ref="form" label-width="25%">
        <el-form-item label="名称：" prop="name" :verify="['NotNull']">
          <el-input v-model="tmpColumnGroup.name"></el-input>
        </el-form-item>
        <el-form-item label="代码：" prop="code" :verify="['NotNull']">
          <el-input v-model="tmpColumnGroup.code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmClickHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
export default {
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
  props: {
    data: Object,
    show: Boolean,
    title: String,
    modelId: [String, Number]
  },
  data () {
    return {
      confirmLoading: false,
      tmpColumnGroup: {} /** form临时数据存储 */
    }
  },
  methods: {
    async confirmClickHandler () {
      this.confirmLoading = true
      try {
        await util.validateForm(this.$refs['form'])
        let res = ''
        if (this.tmpColumnGroup.ID) {
          res = await axios.put(`/metamodels/${this.modelId}/groups/${this.tmpColumnGroup.ID}`, this.tmpColumnGroup)
        } else {
          res = await axios.post(`/metamodels/${this.modelId}/groups`, this.tmpColumnGroup)
        }
        this.confirmLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          this.$emit('callback', res.data.data)
          this.$emit('update:show', false)
        }
      } catch (e) {
        this.confirmLoading = false
        util.showErrorNotification(e)
      }
    },
    beforeDialogOpen () {
      if (this.data.ID) {
        // 编辑
        this.tmpColumnGroup = Object.assign({}, this.data)
        !!this.tmpColumnGroup.addTime &&
          Object.assign(this.tmpColumnGroup, { addTime: util.formatDate(this.tmpColumnGroup.addTime, 'yyyy-MM-dd hh:mm:ss') })
        !!this.tmpColumnGroup.modifyTime &&
          Object.assign(this.tmpColumnGroup, { modifyTime: util.formatDate(this.tmpColumnGroup.modifyTime, 'yyyy-MM-dd hh:mm:ss') })
      } else {
        // 添加
        this.tmpColumnGroup = { name: '', code: '' }
      }
    }
  }
}
</script>
<style>
.metadata-column-group-add-dialog .el-dialog {
  width: 400px;
}
@media (max-width: 480px) {
  .metadata-column-group-add-dialog .el-dialog {
    width: 96%;
  }
}
.metadata-column-group-add-dialog .el-form-item .el-input {
  width: 70%;
  margin-right: 5px;
}
</style>
