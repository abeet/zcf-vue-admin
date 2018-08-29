<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="addOrEdit('add')" priv="Platform.Schedule.Add">添加</el-button>&nbsp;
      <el-button icon="edit" :disabled="selectedRows.length !== 1" @click="addOrEdit('edit')" priv="Platform.Schedule.Edit">编辑</el-button>&nbsp;
      <el-button icon="delete" :disabled="selectedRows.length !== 1" @click="deleteClickHandler" priv="Platform.Schedule.Delete">删除</el-button>&nbsp;
      <el-button icon="information" :disabled="selectedRows.length !== 1" @click="executionClickHandler" priv="Platform.Schedule.ManualExecute">手动执行</el-button>&nbsp;
    </el-toolbar>

    <div class="layout-content-padding scroll" v-loading="dataLoading">
      <el-table :data="schedules" stripe tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="typeCodeName" label="类型" width="100"></el-table-column>
          <el-table-column prop="sourceIDName" label="名称" width="250"></el-table-column>
          <el-table-column label="是否启用" width="100" align="center">
            <template slot-scope="scope">
              <i class="fa fa-check icon-success" v-if="scope.row.isUsing==='Y'"></i>
              <i class="fa fa-times icon-danger" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="nextRunTime" label="下次执行时间" width="200"></el-table-column>
          <el-table-column prop="description" label="任务描述"></el-table-column>
      </el-table>
    </div>

    <!--添加，编辑框-->
    <schedule-add-dialog ref="scheduleDialog" @success="afterSuccess"></schedule-add-dialog>

  </div>
</template>

<style scoped>

</style>

<script>
import util from '../../common/util.js'
import ScheduleAddDialog from './components/ScheduleAddDialog.vue'

export default {
  data () {
    return {
      selectedRows: [],
      schedules: [],
      dataLoading: false
    }
  },
  methods: {
    afterSuccess (data) {
      if (data.type == 'add') {
        this.schedules = [...this.schedules, data.data]
      } else if (data.type == 'edit') {
        let id = data.id
        let index = this.schedules.findIndex(val => val.ID === id)
        this.schedules = [...this.schedules.slice(0, index), Object.assign({}, data.data), ...this.schedules.slice(index + 1)]
      }
    },

    onSelectionChange (selection) {
      this.selectedRows = selection
    },

    addOrEdit (type) {
      let params = {
        addOrEdit: type,
        data: this.selectedRows.length > 0 ? this.selectedRows[0] : {}
      }
      this.$refs.scheduleDialog.initDialog(params)
    },

    async deleteClickHandler () {
      try {
        await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }

      let res = await axios.delete(`/api/schedules/deleted`, this.selectedRows[0]).catch(e => console.log(e))
      let data = res.data
      if (data.status !== 1) {
        return data
      }
      let index = this.schedules.findIndex(val => val.id === this.selectedRows[0].id)

      this.schedules = [...this.schedules.slice(0, index), ...this.schedules.slice(index + 1)]

      util.showNotification(data)
    },

    async executionClickHandler () {
      try {
        let res = await axios.post('/api/schedules/executed', this.selectedRows[0])
        util.showResponseMessage(res.data)
      } catch (e) {
        util.showErrorNotification(e)
      }
    },

    async loadSchedulesData () {
      this.dataLoading = true
      let res = await axios.get('/api/schedules').catch(e => console.log(e))
      let data = res.data
      this.schedules = data.status == 1 ? data.data : this.schedules
      this.dataLoading = false
    }
  },
  created () {
    this.loadSchedulesData()
  },
  components: {
    'schedule-add-dialog': ScheduleAddDialog
  }
}
</script>
