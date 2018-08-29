<template>
  <div>
     <!--添加，编辑框-->
    <el-dialog :title="inputParams.addOrEdit === 'add' ? '添加任务' : '修改任务'" :visible.sync="dialogVisible">
      <el-form :model="tmpSchedule" :rules="scheduleRules" ref="scheduleForm" label-width="100px">
        <el-form-item label="任务类别" prop="typeCode" :verify="['NotNull']">
          <el-select v-model="tmpSchedule.typeCode" placeholder="请选择" @change="typeChangeHandler" :disabled="inputParams.addOrEdit === 'edit'" style="width:auto">
            <el-option v-for="item in scheduleTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择任务" prop="sourceCode" :verify="['NotNull']">
          <el-select v-model="tmpSchedule.sourceCode" placeholder="请选择" :disabled="inputParams.addOrEdit === 'edit'" style="width:auto">
            <el-option v-for="item in OptionalSchedule" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="startTime" :disabled="inputParams.addOrEdit === 'edit'">
          <el-date-picker v-model="tmpSchedule.startTime" type="datetime" placeholder="选择起始时间" :disabled="inputParams.addOrEdit === 'edit'"></el-date-picker>
        </el-form-item>
        <el-form-item label="执行周期">
          <el-radio class="radio" v-model="tmpSchedule.cycle" label="1" :disabled="inputParams.addOrEdit === 'edit'">定时</el-radio>
          <el-radio class="radio" v-model="tmpSchedule.cycle" label="2" :disabled="inputParams.addOrEdit === 'edit'">使用Cron表达式</el-radio>
        </el-form-item>
        <el-form-item v-show="tmpSchedule.cycle === '1'">
          <span>每隔</span>
          <el-input-number v-model="tmpSchedule.cyclenumber" :min="1"></el-input-number>
          <el-select v-model="tmpSchedule.cycleunit" placeholder="请选择">
            <el-option label="分钟" value="Minute"></el-option>
            <el-option label="小时" value="Hour"></el-option>
            <el-option label="日" value="Day"></el-option>
            <el-option label="月" value="Month"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="tmpSchedule.cycle === '2'" prop="cyclecron">
          <el-input v-model="tmpSchedule.cyclecron" placeholder="请输入Cron表达式"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio class="radio" v-model="tmpSchedule.isUsing" label="Y">启用</el-radio>
          <el-radio class="radio" v-model="tmpSchedule.isUsing" label="N">禁用</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tmpSchedule.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirmScheduleClickHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import util from '../../../common/util.js'

export default {
  data () {
    return {
      tmpSchedule: {
        typeCode: '',
        typeCodeName: '',
        sourceCode: '',
        sourceIDName: '',
        startTime: '',
        nextruntime: '',
        cycle: '1',
        cyclenumber: 1,
        cycleunit: 'Minute',
        cyclecron: '',
        isUsing: 'Y',
        description: ''
      },
      tmpScheduleBak: {},
      scheduleRules: {
        startTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.inputParams.addOrEdit === 'add' && !(value instanceof Date)) {
                callback(new Error('请选择起始时间!'))
              } else {
                callback()
              }
            }
          }
        ],
        cyclecron: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.tmpSchedule.cycle === '2' && value === '') {
                callback(new Error('请输入Cron表达式!'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      dialogVisible: false,
      confirmLoading: false,
      scheduleTypes: [],
      OptionalSchedule: [],
      inputParams: {}
    }
  },
  methods: {
    initDialog (params) {
      this.dialogVisible = true
      this.$refs.scheduleForm && this.$refs.scheduleForm.clearValidate()
      !util.isEmptyObject(params) && Object.assign(this.inputParams, params)
      this.loadScheduleTypes(params.addOrEdit == 'add')

      if (params.addOrEdit == 'add') {
        Object.assign(this.tmpSchedule, this.tmpScheduleBak)
      } else if (params.addOrEdit == 'edit') {
        !util.isEmptyObject(params.data) && Object.assign(this.tmpSchedule, params.data)
        this.tmpSchedule.sourceCode = this.tmpSchedule.sourceIDName
      }
    },

    async loadScheduleTypes (isUsable) {
      let res = null
      if (isUsable) {
        res = await axios.get('/api/schedules/types', { params: { usable: 'Y' } }).catch(e => console.log(e))
      } else {
        res = await axios.get('/api/schedules/types').catch(e => console.log(e))
      }
      let data = res.data
      this.scheduleTypes = data.status == 1 ? data.data : this.scheduleTypes
    },

    async typeChangeHandler (typeID) {
      let res = await axios.get('/api/schedules', { params: { optional: 'Y', typeID: typeID } }).catch(e => console.log(e))
      let data = res.data
      this.OptionalSchedule = data.data
    },

    async confirmScheduleClickHandler () {
      let addForm = async () => {
        let type = this.scheduleTypes.find(val => val.code === this.tmpSchedule.typeCode)
        this.tmpSchedule.typeCodeName = type.name

        let source = this.OptionalSchedule.find(val => val.code === this.tmpSchedule.sourceCode)
        this.tmpSchedule.sourceIDName = source.name

        let res = await axios.post('/api/schedules', this.tmpSchedule).catch(e => console.log(e))
        let data = res.data
        if (data.status !== 1) {
          return data
        }
        // this.schedules = [...this.schedules, Object.assign({}, this.tmpSchedule, { ID: data.data.ID })]

        let emitDatas = {
          type: 'add',
          data: Object.assign({}, this.tmpSchedule, { ID: data.data.ID })
        }
        this.$emit('success', emitDatas)
        return data
      }

      let editForm = async () => {
        let res = await axios.put('/api/schedules/updated', this.tmpSchedule).catch(e => console.log(e))
        let data = res.data
        if (data.status !== 1) {
          return data
        }
        // let index = this.schedules.findIndex(val => val.ID === this.tmpSchedule.ID)
        // this.schedules = [...this.schedules.slice(0, index), Object.assign({}, this.tmpSchedule), ...this.schedules.slice(index + 1)]
        let emitDatas = {
          type: 'edit',
          id: this.tmpSchedule.ID,
          data: this.tmpSchedule
        }
        this.$emit('success', emitDatas)
        return data
      }

      try {
        await util.validateForm(this.$refs['scheduleForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
        return
      }
      this.confirmLoading = true
      let res = null
      if (this.inputParams.addOrEdit === 'add') {
        res = await addForm()
      }

      if (this.inputParams.addOrEdit === 'edit') {
        res = await editForm()
      }
      this.confirmLoading = false
      this.dialogVisible = false
      util.showNotification(res)
    }
  },
  created () {
    Object.assign(this.tmpScheduleBak, this.tmpSchedule)
  }
}
</script>
