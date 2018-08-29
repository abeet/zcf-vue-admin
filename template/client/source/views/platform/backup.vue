<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="backupClickHandler" priv="Platform.Backup.Backup">备份数据</el-button>&nbsp;
      <el-button icon="document" :disabled="selectedRows.length !== 1" @click="recoveryClickHandler" priv="Platform.Backup.Restore">恢复数据</el-button>&nbsp;
      <el-button icon="delete" :disabled="selectedRows.length === 0" @click="deleteClickHandler" priv="Platform.Backup.Delete">删除文件</el-button>&nbsp;
      <el-button icon="view" :disabled="selectedRows.length !== 1" @click="seeClickHandler">查看文件</el-button>&nbsp;
    </el-toolbar>

    <div class="layout-content-padding" v-loading="dataLoading">
      <el-table :data="backupFiles" stripe tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column prop="file" label="文件名" min-width="40%"></el-table-column>
        <el-table-column prop="size" label="大小" min-width="25%"></el-table-column>
        <el-table-column prop="lastChangeDate" label="最后修改时间" min-width="25%"></el-table-column>
        <el-table-column label="下载" min-width="10%">
          <template slot-scope="scope">
            <el-button v-show="scope.row.hasFileDownloadPriv" type="primary" size="mini" @click="downloadClickHandler(scope.row)">点击下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--查看文件框-->
    <el-dialog :title="tmpBackupFile.info.file" :visible.sync="tmpBackupFile.isShowModal">
      <el-tabs v-model="tmpBackupFile.activeName" @tab-click="tabClickHandler">
        <el-tab-pane label="Info" name="info">
          <el-form label-width="100px">
            <el-form-item label="File name：">
              <span>\{{tmpBackupFile.info.file}}</span>
            </el-form-item>
            <el-form-item label="Data size：">
              <span>\{{tmpBackupFile.info.size}}</span>
            </el-form-item>
            <el-form-item label="Total records：">
              <span>\{{tmpBackupFile.info.total}}</span>
            </el-form-item>
            <el-form-item label="Start time：">
              <span>\{{tmpBackupFile.info.startTime}}</span>
            </el-form-item>
            <el-form-item label="End time：">
              <span>\{{tmpBackupFile.info.endTime}}</span>
            </el-form-item>
            <el-form-item label="Task log：">
              <el-input type="textarea" :rows="10" placeholder="task log" v-model="tmpBackupFile.info.tasklog"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Tables" name="tables">
          <div class="pane-wrap" v-loading="tableDataLoading">
            <el-table :data="tmpBackupFile.table" stripe height="512" tooltip-effect="dark" style="width: 100%">
              <el-table-column type="index" width="60" align="center"></el-table-column>
              <el-table-column prop="name" label="Table name"></el-table-column>
              <el-table-column prop="size" label="Data size"></el-table-column>
              <el-table-column prop="total" label="Total records"></el-table-column>
              <el-table-column prop="batchcount" label="Batch count"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>
import util from '../../common/util.js'
export default {
  data () {
    return {
      backupFiles: [],
      selectedRows: [],
      dataLoading: true,
      tmpBackupFile: {
        isShowModal: false,
        activeName: 'info',
        info: {},
        table: []
      },
      tableDataLoading: false
    }
  },
  methods: {
    onSelectionChange (selection) {
      this.selectedRows = selection
    },
    async backupClickHandler () {
      try {
        await this.$confirm('确认备份数据库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      let res = await axios.post('/api/backups')
      if (res.data.status == 1) {
        let resp = await axios.get(`/api/framework/longtimetasks/${res.data.taskID}`)
        try {
          await util.showProgress(res.data.taskID, resp.data.data.currentInfo)
          this.initBackups()
        } catch (e) {
          util.showErrorNotification(e)
        }
      }
    },
    async recoveryClickHandler () {
      try {
        await this.$confirm('确认恢复数据库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
        return
      }
      let res = await axios.put('/api/backups/restored', { file: this.selectedRows[0].file })
      if (res.data.status == 1) {
        let resp = await axios.get(`/api/framework/longtimetasks/${res.data.taskID}`)
        try {
          await util.showProgress(res.data.taskID, resp.data.data.currentInfo)
          this.initBackups()
        } catch (e) {
          util.showErrorNotification(e)
        }
      }
    },
    async deleteClickHandler () {
      await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let ids = []
      this.selectedRows.forEach(function (obj) {
        ids.push(obj.file)
      })
      try {
        /* 经过测试发现RESTful风格的接口不支持ids中带英文点（.），比如：/api/backups/full_20180112173004.zbf，这中间有个英文点，
          导致接口无法找到（404错误）。故设置参数位为空，使用params传递ids */
        let res = await axios.delete(`/api/backups/`, { params: { ids: ids.join() } })
        util.showMessage(res)
        if (res.data.status === 1) {
          this.backupFiles = this.backupFiles.filter(val => !ids.includes(val.file))
          this.selectedRows = []
        }
      } catch (e) {
        util.showNotification(e)
      }
    },
    async seeClickHandler () {
      try {
        let res = await axios.get('/api/backups/infos', { params: { file: this.selectedRows[0].file } })
        this.tmpBackupFile.info = res.data
        this.tmpBackupFile.activeName = 'info'
        this.tmpBackupFile.table = []
        this.tmpBackupFile.isShowModal = true
      } catch (e) {
        util.showNotification(e)
      }
    },
    async tabClickHandler (tab) {
      if (this.tmpBackupFile.activeName === 'tables' && !this.tmpBackupFile.table.length) {
        this.tableDataLoading = true
        try {
          let res = await axios.get('/api/backups/tables', { params: { file: this.tmpBackupFile.info.file } })
          this.tmpBackupFile.table = res.data.data
          this.tableDataLoading = false
        } catch (e) {
          util.showNotification(e)
        }
      }
    },
    downloadClickHandler (row) {
      if (!row.hasFileDownloadPriv) {
        this.$alert('没有下载权限！')
        return
      }
      window.location.href = `${axios.defaults.baseURL}/api/backups/download/file?fileName=${row.file}`
    },
    async initBackups () {
      let res = await axios.get('/api/backups')
      this.backupFiles = res.data.data
    }
  },
  created () {
    this.initBackups()
    this.dataLoading = false
  }
}
</script>
