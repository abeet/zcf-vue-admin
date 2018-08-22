<template>
  <div>
    <el-dialog title="已发消息" :visible.sync="msgHistoryDialog" @open="dialogOpen" class="message-history-dialog">
      <el-toolbar>
        <el-button :disabled="msgHistorySelectedRows.length === 0" @click="deleteClick"><i class="fa fa-remove"></i>删除</el-button>
      </el-toolbar>
      <el-table :data="msgHistoryTable" ref="datatable" :data-read-url="getData" :page-size="10" tooltip-effect="dark" highlight-current-row @selection-change="msgHistorySelectionChange"  @row-dblclick="lookMsgHistoryDbClick">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <i class="fa fa-envelope-o" aria-hidden="true"></i>
          </template>
        </el-table-column>
        <el-table-column prop="subject" show-overflow-tooltip min-width="60%" label="标题"></el-table-column>
        <el-table-column prop="toUser" show-overflow-tooltip min-width="20%" label="接收人"></el-table-column>
        <el-table-column prop="addTime" show-overflow-tooltip min-width="20%" label="发送时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgHistoryDialog = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 双击查看消息详情 -->
    <msgdetail-dialog :showLookMessageShow.sync="showLookMessageShow" :tmpMessageDetail="tmpMessageDetail" :userType="userType"></msgdetail-dialog>
  </div>
</template>

<script>
import util from '../../../common/util.js'
import messageDetail from './messageDetailDialog.vue'
export default {
  data() {
    return {
      sortField:'addTime',
      msgHistorySelectedRows: [],
      msgHistoryTable: [],
      showLookMessageShow: false,
      tmpMessageDetail: {
        toUser: '',
        fromUser: '',
        addTime: '',
        subject: '',
        content: ''
      },
      userType: 'FromUser',
      openTimes:0,
    }
  },
  computed: {
    msgHistoryDialog: {
      get() {
        return this.msgHistoryShow
      },
      set(val) {
        this.$emit('update:msgHistoryShow', val)
      },
    },
  },
  components: {
    'msgdetail-dialog': messageDetail
  },
  methods: {
    dialogOpen(){
      if(this.openTimes > 0){
        this.getMsgHistoryData()
      }
      this.openTimes += 1
    },
    //当前行
    msgHistorySelectionChange(selection) {
      this.msgHistorySelectedRows = selection
    },
    getData(){
      return [
        '/api/message/historydatabind',{
        params:{
          sortField:this.sortField,
        }
      }]
    },
    //已发消息列表数据
    getMsgHistoryData() {
      this.$refs.datatable.getData()
    },
    //双击查看已发消息
    lookMsgHistoryDbClick(row) {
      this.showLookMessageShow = true
      this.tmpMessageDetail = Object.assign({}, row)
    },
    //已发消息删除事件
    async deleteClick() {
      try{
        await this.$confirm('确认删除所选的消息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        let rowIds = []
        this.msgHistorySelectedRows.forEach(function(row) {
          rowIds.push(row.ID)
        })
        let res = await axios.delete(`/api/message/${rowIds}?userType=`+this.userType)
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.getMsgHistoryData()
        }
      }catch(e){
        return
      }
    },
  },
  props: ['msgHistoryShow']
}
</script>
<style>
/* 在一般情况下dialog宽为800像素，在逻辑分辨率480像素以下dialog宽为96% */
.message-history-dialog .el-dialog {
  width: 800px;
}
@media (max-width: 480px) {
  .message-history-dialog .el-dialog {
    width: 96%;
  }
}
</style>
