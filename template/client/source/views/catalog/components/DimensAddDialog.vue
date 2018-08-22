<template>
  <el-dialog class="dimens-add-dlg" :title="tmpDimens.ID ? '编辑分类' : '新建分类'" :visible.sync="isShow" @open="dialogOpen">
      <el-form :model="tmpDimens" :rules="dimensionRules" label-suffix="：" ref="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="tmpDimens.name" @change="setAlias()"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input type="text" v-model="tmpDimens.code"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isOpen">
          <el-switch v-model="tmpDimens.isOpen" active-value="Y" inactive-text="禁用" active-text="启用" inactive-value="N"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input type="text" v-model="tmpDimens.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmHandler" :loading="handlerLoading">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import util from '../../../common/util.js'
export default {
  props: {
    datas: {
      type: Object,
      default: {}
    },
    show: {
      type: Boolean,
      default: false,
      required: true
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
  data() {
    return {
      tmpDimens: {},
      dimensionRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            pattern: /^([\u4E00-\u9FA50-9a-zA-Z]*)$/,
            message: '只能输入汉字、字母或数字',
            trigger: 'blur,change'
          }
        ],
        code: [
          { required: true, message: '请输入别名', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9]+)$/,
            message: '只能是数字或字母组成',
            trigger: 'blur,change'
          }
        ]
      },
      handlerLoading: false
    }
  },
  methods: {
    //别名设置：取名称首字母
    setAlias() {
      if(this.tmpDimens.code.trim()){
        return
      }
      this.tmpDimens.code = util.getSpell(
        this.tmpDimens.name,
        true
      )
    },
    dialogOpen() {
      this.handlerLoading = false
      this.tmpDimens = Object.assign({}, this.datas)
    },
    async confirmHandler() {
      try {
        this.handlerLoading = true
        await util.validateForm(this.$refs['form'])
        let res = ''
        if (!!this.tmpDimens.ID) {
          res = await axios.put(`/api/dimens/${this.tmpDimens.ID}`, this.tmpDimens)
        } else {
          res = await axios.post('/api/dimens', this.tmpDimens)
        }
        this.handlerLoading = false
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.isShow = false
          this.$emit('callback')
        }
      } catch (e) {
        this.handlerLoading = false
        return
      }
    }
  }
}
</script>
<style>
.dimens-add-dlg .el-dialog{
  width:500px;
}
@media (max-width:480px){
  .dimens-add-dlg .el-dialog{
    width:96%;
  }
}
.dimens-add-dlg .el-dialog .el-form {
  margin-top: 20px;
}
.dimens-add-dlg .el-dialog .el-form .el-input {
  width: 330px;
  margin-right: 5px;
}
</style>
