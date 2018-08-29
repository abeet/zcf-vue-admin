<style>
.metadata-column-dialog .el-dialog {
  width: 850px;
}
@media (max-width: 480px) {
  .metadata-column-dialog .el-dialog {
    width: 96%;
  }
}
.metadata-column-dialog .el-form-item .el-input {
  width: 200px;
  margin-right: 5px;
}
.metadata-column-dialog .el-form-item .el-textarea {
  width: 200px;
  margin-right: 5px;
}
.metadata-column-dialog .el-form-item .el-checkbox__label {
  font-size: 12px;
}
.metadata-column-dialog .el-form-item .el-checkbox + .el-checkbox {
  margin-left: 10px;
}
</style>
<template>
  <div>
    <el-dialog :title="title" :visible.sync="isShow" @open="beforeDialogOpen" class="metadata-column-dialog">
      <el-form :model="tmpField" :rules="fieldRules" ref="fieldForm" label-width="150px">
        <el-row :gutter="36">
          <el-col :span="11">
            <h4 class="title">基本信息</h4>
            <el-form-item label="名称：" prop="name" :verify="['NotNull']">
              <el-input v-model="tmpField.name"></el-input>
            </el-form-item>
            <el-form-item label="代码：" prop="code" :verify="['NotNull']">
              <el-input v-model="tmpField.code"></el-input>
            </el-form-item>
            <el-form-item label="字段分组：" clearable prop="groupID">
              <el-select v-model="tmpField.groupID" placeholder="请选择">
                <el-option v-for="item in fieldGroup" :key="item.ID" :label="item.name" :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="控件类型：" prop="controlType">
              <el-select v-model="tmpField.controlType" clearable placeholder="请选择" @change="dataTypeChangeHandler">
                <el-option v-for="item in controlTypes" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据类型：" clearable prop="dataType">
              <el-select v-model="tmpField.dataType" placeholder="请选择" :disabled="dataTypeDisabled">
                <el-option v-for="item in dataTypes" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否必填：">
              <el-switch v-model="tmpField.mandatoryFlag"  active-value="Y" inactive-value="N" @change="mandatoryChangeHandler"></el-switch>
            </el-form-item>
            <el-form-item label="默认值：">
              <el-date-picker value-format="yyyy-MM-dd" v-if="tmpField.controlType==='Date'" id="data-default-value" v-model="tmpField.defaultValue" type="date" placeholder="选择日期"></el-date-picker>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-else-if="tmpField.controlType==='DateTime'" id="datatime-default-value" v-model="tmpField.defaultValue" type="datetime" placeholder="选择日期时间"></el-date-picker>
              <el-input v-else v-model="tmpField.defaultValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <h4 class="title">界面属性</h4>
            <el-form-item label="选项列表：">
              <el-input v-model="tmpField.listOptions" :disabled="true">
                <el-button slot="append" @click="openFieldOptionsClickHandler">设置</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="校验规则：">
              <el-input v-model="tmpField.verifyRule">
                <el-button slot="append" @click="openFieldValidateRulesClickHandler">设置</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="校验条件：">
              <el-input v-model="tmpField.verifyCondition"></el-input>
            </el-form-item>
            <el-form-item label="CSS样式类：">
              <el-input v-model="tmpField.styleClass"></el-input>
            </el-form-item>
            <el-form-item label="CSS样式文本：">
              <el-input v-model="tmpField.styleText"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="tmpField.FVisible">前台列表页面显示</el-checkbox>
              <el-checkbox v-model="tmpField.BVisible">后台列表页面显示</el-checkbox>
            </el-form-item>
            <el-form-item label="说明文本：">
              <el-input v-model="tmpField.memo" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmClickHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!--  选项列表弹框 -->
    <meta-column-options-dialog
      :show.sync="fieldOptionsDlg.isShowModal"
      :datas="fieldOptionsDlg.listOptions"
      @callback="getFieldOptions">
    </meta-column-options-dialog>
    <!-- 校验规则弹框 -->
    <meta-column-verify-dialog
      :show.sync="fieldValidateRulesDlg.isShowModal"
      :datas="fieldValidateRulesDlg.verifyRule"
      @callback="getFieldValidateRules">
    </meta-column-verify-dialog>
  </div>
</template>
<script>
import util from '../../common/util.js'
import metaColumnOptionsDialog from './metaColumnOptionsDialog.vue'
import metaColumnVerifyDialog from './metaColumnVerifyDialog.vue'
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
  props: { title: String, modelId: [Number, String], datas: Object, show: Boolean },
  data () {
    return {
      confirmLoading: false,
      tmpField: {} /** form表单临时对象 */,
      fieldGroup: [] /** 分组数据 */,
      controlTypes: [] /** 控件类型数据 */,
      dataTypes: [] /** 数据类型数据 */,
      fieldRules: {
        /** 表单校验规则 */
        groupID: [
          {
            trigger: 'change',
            required: true,
            validator: (rule, value, callback) => {
              let group = this.fieldGroup.find(val => val.ID === value)
              if (group) {
                callback()
              } else {
                callback(new Error('请选择分组'))
              }
            }
          }
        ],
        controlType: [
          {
            trigger: 'change',
            required: true,
            validator: (rule, value, callback) => {
              let type = this.controlTypes.find(val => val.key === value)
              if (type) {
                callback()
              } else {
                callback(new Error('请选择控件类型'))
              }
            }
          }
        ],
        dataType: [
          {
            trigger: 'change',
            required: true,
            validator: (rule, value, callback) => {
              let type = this.dataTypes.find(val => val.key === value)
              if (type) {
                callback()
              } else {
                callback(new Error('请选择数据类型'))
              }
            }
          }
        ]
      },
      sdt: {} /** 特色控件类型和数据类型键值对 */,
      dataTypeDisabled: false /** 数据类型是否不可编辑 */,
      fieldOptionsDlg: {
        /** 选项列表弹框属性 */
        isShowModal: false,
        listOptions: ''
      },
      fieldValidateRulesDlg: {
        /** 校验规则弹框属性 */
        isShowModal: false,
        verifyRule: ''
      }
    }
  },
  methods: {
    beforeDialogOpen () {
      if (this.datas.ID) {
        this.tmpField = Object.assign({}, this.datas)
        !!this.tmpField.addTime && Object.assign(this.tmpField, { addTime: util.formatDate(this.tmpField.addTime, 'yyyy-MM-dd hh:mm:ss') })
        !!this.tmpField.modifyTime &&
          Object.assign(this.tmpField, { modifyTime: util.formatDate(this.tmpField.modifyTime, 'yyyy-MM-dd hh:mm:ss') })
      } else {
        this.tmpField = {
          name: '',
          code: '',
          groupID: '',
          controlType: 'Text',
          dataType: 'ShortText',
          mandatoryFlag: 'N',
          defaultValue: '',
          listOptions: '',
          verifyRule: '',
          verifyCondition: '',
          styleClass: '',
          styleText: '',
          isForegroundDisplay: '',
          isBackstageDisplay: '',
          FVisible: '',
          BVisible: '',
          memo: ''
        }
      }
      this.loadSDT()
      this.loadFieldGroup()
      this.loadControlTypes()
      this.loadDataTypes()
      this.dataTypeChangeHandler(this.tmpField.controlType)
    },
    /** 是否必填开关改变事件 */
    mandatoryChangeHandler (val) {
      if (val === 'Y') {
        if (this.tmpField.verifyRule.includes('NotNull')) {
          return
        }
        this.tmpField.verifyRule = this.tmpField.verifyRule.length > 0 ? this.tmpField.verifyRule + '&&NotNull' : 'NotNull'
      } else {
        this.tmpField.verifyRule = this.tmpField.verifyRule.replace('NotNull', '')
        this.tmpField.verifyRule = this.tmpField.verifyRule.replace('&&&&', '&&')
        if (this.tmpField.verifyRule.endsWith('&&')) {
          this.tmpField.verifyRule = this.tmpField.verifyRule.substring(0, this.tmpField.verifyRule.length - 2)
        }
        if (this.tmpField.verifyRule.startsWith('&&')) {
          this.tmpField.verifyRule = this.tmpField.verifyRule.substring(2)
        }
      }
    },
    /** 控件类型改变事件 */
    dataTypeChangeHandler (val) {
      if (this.sdt[val]) {
        this.tmpField.dataType = this.sdt[val]
        this.dataTypeDisabled = true
      } else {
        this.dataTypeDisabled = false
        this.tmpField.dataType = 'ShortText'
      }
    },
    async loadSDT () {
      let res = await axios.get('/metamodels/0/columns/sdt')
      this.sdt = res.data.data
    },
    /** 加载分组数据 */
    async loadFieldGroup () {
      let res = await axios.get(`/metamodels/${this.modelId}/groups`)
      this.fieldGroup = res.data.data && res.data.data.length ? res.data.data : [{ ID: '', name: '' }]
    },
    /** 加载控件类型数据 */
    async loadControlTypes () {
      let res = await axios.get(`/metamodels/0/columns/controlTypes`)
      this.controlTypes = res.data.data && res.data.data.length ? res.data.data : [{ value: '', key: '' }]
    },
    /** 加载数据类型数据 */
    async loadDataTypes () {
      let res = await axios.get('/metamodels/0/columns/dataTypes')
      this.dataTypes = res.data.data && res.data.data.length ? res.data.data : [{ value: '', key: '' }]
    },
    /** 选项列表弹框回调 */
    getFieldOptions (data) {
      this.tmpField.listOptions = data
    },
    /** 选项列表弹框打开事件 */
    openFieldOptionsClickHandler () {
      this.fieldOptionsDlg.isShowModal = true
      this.fieldOptionsDlg.listOptions = this.tmpField.listOptions
    },
    /** 校验规则弹框回调 */
    getFieldValidateRules (data) {
      if (this.tmpField.mandatoryFlag === 'Y') {
        if (!data.includes('NotNull')) {
          data = data.length > 0 ? `NotNull&&${data}` : 'NotNull'
        }
      }
      this.tmpField.verifyRule = data
    },
    /** 校验规则弹框打开事件 */
    openFieldValidateRulesClickHandler () {
      this.fieldValidateRulesDlg.isShowModal = true
      this.fieldValidateRulesDlg.verifyRule = this.tmpField.verifyRule
    },
    /** 添加字段或修改字段保存事件 */
    async confirmClickHandler () {
      this.confirmLoading = true
      try {
        await util.validateForm(this.$refs['fieldForm'])
        let res = ''
        if (this.tmpField.ID) {
          res = await axios.put(`/metamodels/${this.modelId}/columns/${this.tmpField.ID}`, this.tmpField)
        } else {
          res = await axios.post(`/metamodels/${this.modelId}/columns`, this.tmpField)
        }
        this.confirmLoading = false
        util.showMessage(res)
        if (res.data.status === 1) {
          this.$emit('callback', res.data.data)
          this.$emit('update:show', false)
        }
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
      }
    }
  },
  components: {
    'meta-column-options-dialog': metaColumnOptionsDialog,
    'meta-column-verify-dialog': metaColumnVerifyDialog
  }
}
</script>
