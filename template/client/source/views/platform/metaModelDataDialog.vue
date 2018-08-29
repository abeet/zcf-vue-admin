<style>
.metadata-data-dialog .el-dialog{
  width:450px;
}
@media (max-width: 480px) {
  .metadata-data-dialog .el-dialog{
    width:96%;
  }
}
.metadata-data-dialog .el-form-item .el-input {
  width: 200px;
  margin-right: 5px;
}
.metadata-data-dialog .el-form-item .el-textarea {
  width: 200px;
  margin-right: 5px;
}
.metadata-data-dialog .filed-group .group-name{
  padding: 10px 0;
  font-size: 16px;
  font-weight: 700;
  color:#8391A5;
}
</style>
<template>
  <div>
    <el-dialog :title="title" :visible.sync="isShow" @open="beforeDialogOpen" class="metadata-data-dialog">
      <el-form :model="tmpPkData" ref="pkDataForm" label-width="100px">
        <el-form-item label="PK值" prop="PKValue" :verify="['NotNull']">
          <el-input v-model="tmpPkData.PKValue"></el-input>
        </el-form-item>
        <div class="filed-group" v-for="(group, index) in fieldGroup" :key="group.ID">
          <h4 class="group-name">\{{group.name}}</h4>
          <z-from-item v-for="(field, index) in getGroupFields(group.ID)" :key="field.ID" :field="field">
            <component :is="getControlType(field)" v-model="tmpPkData['metavalue_'+field.code]"
              :config="getControlConfig(field)"></component>
          </z-from-item>
        </div>
        <h3></h3>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmPkDataClickHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import ControlPassword from './components/control/ControlPassword.vue'
import ControlRadio from './components/control/ControlRadio.vue'
import ControlCheckbox from './components/control/ControlCheckbox.vue'
import ControlSelect from './components/control/ControlSelect.vue'
import ControlText from './components/control/ControlText.vue'
import ControlTextArea from './components/control/ControlTextArea.vue'
import ControlNumber from './components/control/ControlNumber.vue'
import ControlDatePicker from './components/control/ControlDatePicker.vue'
import ControlUpload from './components/control/ControlUpload.vue'
import FromItem from './components/control/FormItem.vue'
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
  props: {title: String, show: Boolean, datas: Object, modelId: [Number, String]},
  data () {
    return {
      tmpPkData: {}, /** form表单数据 */
      oldPKValue: 0, /** 编辑时的PKValue */
      fieldGroup: [], /** 分组数据 */
      fields: [], /** 字段数据 */
      confirmLoading: false
    }
  },
  methods: {
    /** 提交添加或编辑事件 */
    async confirmPkDataClickHandler () {
      this.confirmLoading = true
      try {
        await util.validateForm(this.$refs['pkDataForm'])
        let res = ''
        if (this.oldPKValue) {
          res = await axios.put(`/metamodels/${this.modelId}/datas/${this.oldPKValue}`, this.tmpPkData)
        } else {
          res = await axios.post(`/metamodels/${this.modelId}/datas`, this.tmpPkData)
        }
        this.confirmLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          // let pkData = {}
          // for (let k in this.tmpPkData) {
          //   if (k.startsWith('metavalue_')) {
          //     pkData[k.substr(10)] = this.tmpPkData[k]
          //   } else {
          //     pkData[k] = this.tmpPkData[k]
          //   }
          // }
          this.$emit('callback')
          this.$emit('update:show', false)
        }
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
      }
    },
    beforeDialogOpen () {
      this.tmpPkData = this.datas
      this.oldPKValue = !this.datas.PKValue ? 0 : this.datas.PKValue
      this.loadColumnGroup()
      this.loadFields()
    },
    /** 加载元数据字段分组 */
    async loadColumnGroup () {
      let res = await axios.get(`/metamodels/${this.modelId}/groups`)
      this.fieldGroup = (res.data.data && res.data.data.length) ? res.data.data : []
    },
    async loadFields () {
      let res = await axios.get(`/metamodels/${this.modelId}/columns`)
      this.fields = (res.data.data && res.data.data.length) ? res.data.data : []
    },
    /** 获取某个分组字段 */
    getGroupFields (groupID) {
      let tmpFields = this.fields.concat()
      return tmpFields.filter(val => val.groupID === groupID)
    },
    /** 获取控件类型 */
    getControlType (field) {
      if (field.controlType === 'Text' && (field.dataType === 'Long' || field.dataType === 'Double')) {
        return 'control-number'
      }
      switch (field.controlType) {
        // case 'Password':
        //   return 'control-password'
        case 'Radio':
          return 'control-radio'
        case 'Select':
          return 'control-select'
        case 'Text':
          return 'control-text'
        case 'TextArea':
          return 'control-text-area'
        case 'Checkbox':
          return 'control-checkbox'
        case 'Date':
          return 'control-date-picker'
        case 'DateTime':
          return 'control-date-picker'
        // case 'RichText':
        //   break;
        case 'ImageUpload':
        case 'FileUpload':
        case 'AudioUpload':
        case 'VideoUpload':
          return 'control-date-upload'
        default:
          return ''
      }
    },
    /** 获取控件配置 */
    getControlConfig (field) {
      let config = {
        dataType: field.dataType
      }

      if (field.listOptions) {
        config.listOptions = field.listOptions
      }

      if (field.controlType === 'DateTime') {
        config.dataType = 'DateTime'
      }
      if (['ImageUpload', 'FileUpload', 'AudioUpload', 'VideoUpload'].includes(field.controlType)) {
        config.resourceType = field.controlType.substring(0, field.controlType.length - 6)
      }
      return config
    }
  },
  components: {
    'control-password': ControlPassword,
    'control-radio': ControlRadio,
    'control-select': ControlSelect,
    'control-text': ControlText,
    'control-text-area': ControlTextArea,
    'control-number': ControlNumber,
    'control-checkbox': ControlCheckbox,
    'control-date-picker': ControlDatePicker,
    'control-date-upload': ControlUpload,
    'z-from-item': FromItem
  }
}
</script>
<style scoped>

</style>
