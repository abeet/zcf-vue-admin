<template>
  <el-dialog :title="title" :visible.sync="isShow" @open="beforeDialogOpen" class="metadata-add-dialog">
    <el-form :model="tmpMetadata" :rules="metadataRules" ref="form" label-width="25%">
      <el-form-item label="元数据模型名称：" prop="name" :verify="['NotNull']">
        <el-input v-model="tmpMetadata.name"></el-input>
        <span class="text-hint">富有意义的可读的名称</span>
      </el-form-item>
      <el-form-item label="代码：" prop="code" :verify="['NotNull']">
        <el-input v-model="tmpMetadata.code"></el-input>
        <span class="text-hint">程序逻辑中将使用此代码存取元数据</span>
      </el-form-item>
      <el-form-item label="类型：" prop="ownerType">
        <el-select v-model="tmpMetadata.ownerType" placeholder="请选择类型" style="width:auto">
          <el-option v-for="metadataType in types" :key="metadataType.ID" :label="metadataType.name" :value="metadataType.ID">
          </el-option>
        </el-select>
        <span class="text-hint">系统元数据只支持机构(代码=branch)和用户(代码=user)</span>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="tmpMetadata.memo" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
        <span class="text-hint">关于此模型的其他说明信息</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" :loading="confirmLoading" @click="confirmClickHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style>
.metadata-add-dialog .el-dialog {
  width: 700px;
}
@media (max-width: 480px) {
  .metadata-add-dialog .el-dialog {
    width: 96%;
  }
}
.metadata-add-dialog .el-form-item .el-input {
  width: 50%;
  margin-right: 5px;
}
.metadata-add-dialog .el-form-item .el-textarea {
  width: 50%;
  margin-right: 5px;
}
.metadata-add-dialog .el-form-item .el-select .el-input__inner {
  width: 220%;
  margin-right: 5px;
}
.metadata-add-dialog .el-form-item .el-select .el-input__suffix {
  left: 195%;
}
.metadata-add-dialog .el-form-item .text-hint {
  color: gray;
  font-size: 12px;
  float: right;
  text-align: center;
  font-style: italic;
  width: 40%;
}
</style>

<script>
import util from '../../common/util.js'
export default {
  props: { data: Object, show: Boolean, types: Array, title: String },
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
  data() {
    return {
      confirmLoading: false,
      tmpMetadata: {} /**form表单数据 */,
      metadataRules: {
        /**表单验证规则 */
        ownerType: [
          {
            trigger: 'change',
            required: true,
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请选择类型'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    /**弹框打开前回调 */
    beforeDialogOpen() {
      if (this.data.ID) {
        /**类似创建 */
        this.tmpMetadata = this.data
      } else {
        this.tmpMetadata = { name: '', code: '', ownerType: '', memo: '' }
      }
    },
    async confirmClickHandler() {
      this.confirmLoading = true
      try {
        await util.validateForm(this.$refs['form'])
        let res = await axios.post('/metamodels', this.tmpMetadata)
        this.confirmLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          this.$emit('callback', res.data.data)
          this.$emit('update:show', false)
        }
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
        return
      }
    }
  }
}
</script>


