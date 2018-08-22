<template>
  <div>
    <el-dialog title="短消息列表" :visible.sync="messageDialog" @open="dialogOpen" class="short-message-dialog">
      <el-toolbar>
        <el-button @click="addMessageClick"><i class="fa fa-plus"></i>新建</el-button>
        <el-button :disabled="selectedRows.length ===0 || selectedRows[0].fromUser === 'SYSTEM'" @click="replyMessageClick"><i class="fa fa-edit"></i>回复</el-button>
        <el-button :disabled="selectedRows.length === 0" @click="deleteMessageClick"><i class="fa fa-remove"></i>删除</el-button>
        <el-button :disabled="selectedRows.length === 0" @click="markReadClick"><i class="fa fa-bookmark"></i>标记为已读</el-button>
        <el-button @click="sendMessageClick"><i class="fa fa-send" aria-hidden="true"></i>已发消息</el-button>
      </el-toolbar>
        <el-table :data="messageTable" ref="messageTable" :data-read-url="getData" :page-size="10" tooltip-effect="dark" style="font-size:12px;" highlight-current-row @selection-change="messageSelectionChange" @row-dblclick="lookMessageDbClick">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="5%">
            <template slot-scope="scope">
              <i :class="scope.row.readFlag ? 'fa fa-envelope-open-o' : 'fa fa-envelope'"></i>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="47%" label="标题">
            <template slot-scope="scope">
              <div v-html="scope.row.subject" class="subject-div"></div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="8%" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text">
                <i class="fa fa-pencil"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="fromUser" show-overflow-tooltip min-width="15%" label="发送人"></el-table-column>
          <el-table-column prop="addTime" show-overflow-tooltip min-width="20%" label="发送时间"></el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageDialog = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 新建消息dialog -->
    <msgadd-dialog :messageAddShow.sync="messageAddShow" @callback="getMessageData"></msgadd-dialog>
    <!-- 回复 -->
    <msgreply-dialog :messageReplyShow.sync="messageReplyShow" :tmpMessage="tmpMessageReply"></msgreply-dialog>
    <!-- 已发消息 -->
    <msghistory-dialog :msgHistoryShow.sync="msgHistoryShow"></msghistory-dialog>
    <!-- 双击查看消息详情 -->
    <msgdetail-dialog :showLookMessageShow.sync="showLookMessageShow" :tmpMessageDetail="tmpMessageDetail" :userType="userType"></msgdetail-dialog>
  </div>
</template>

<script>
import util from '../../../common/util.js'
import message from './messageDialog.vue'
import messageReply from './messageReplyDialog.vue'
import messageHistory from './messageHistory.vue'
import messageDetail from './messageDetailDialog.vue'
export default {
  data() {
    return {
      sortField: 'addTime',
      messageTable: [], //消息列表数据
      selectedRows: [], //消息列表当前行
      messageAddShow: false, //新建消息dialog显示状态
      messageReplyShow: false, //回复dialog显示状态
      msgHistoryShow: false, //已发消息dialog显示状态
      showLookMessageShow: false,
      tmpMessageDetail: {
        toUser: '',
        fromUser: '',
        addTime: '',
        subject: '',
        content: ''
      },
      userType: 'FromUser',
      tmpMessageReply: {
        toUser: '',
        subject: '',
        content: ''
      },
      openTimes:0,
    }
  },
  computed: {
    messageDialog: {
      get() {
        return this.messageShow
      },
      set(val) {
        this.$emit('update:messageShow', val)
      }
    }
  },
  components: {
    'msgadd-dialog': message,
    'msgreply-dialog': messageReply,
    'msghistory-dialog': messageHistory,
    'msgdetail-dialog': messageDetail
  },
  methods: {
    dialogOpen() {
      if(this.openTimes > 0){
        this.getMessageData()
      }
      this.openTimes += 1
    },
    edit(row) {
      console.log(row)
    },
    //新建
    addMessageClick() {
      this.messageAddShow = true
    },
    //回复点击
    replyMessageClick() {
      this.messageReplyShow = true
      this.tmpMessageReply = Object.assign({}, this.selectedRows[0])
    },
    //已发消息
    sendMessageClick() {
      this.msgHistoryShow = true
    },
    getData() {
      return [
        '/api/message',
        {
          params: {
            sortField: this.sortField
          }
        }
      ]
    },
    //短消息列表数据
    getMessageData() {
      this.$refs.messageTable.getData()
    },
    //选中行
    messageSelectionChange(selection) {
      this.selectedRows = selection
    },
    //标记为已读
    markReadClick() {
      let rowIds = []
      this.selectedRows.forEach(function(row) {
        rowIds.push(row.ID)
      })

      this.$confirm('确认所选的消息标记为已读?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await axios.put(`/api/message/${rowIds}/setreadflag`)
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.getMessageData()
        }
      })
    },

    //删除消息
    deleteMessageClick() {
      let rowIds = []
      this.selectedRows.forEach(function(row) {
        rowIds.push(row.ID)
      })
      this.$confirm('确认删除所选的消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await axios.delete(`/api/message/${rowIds}?userType=` + this.userType)
        util.showResponseMessage(res.data)
        if (res.data.status === 1) {
          this.getMessageData()
        }
      })
    },
    //双击查看消息
    lookMessageDbClick(row) {
      this.tmpMessageDetail = Object.assign({}, row)
      this.showLookMessageShow = true
    }
  },
  props: ['messageShow']
}
</script>
<style>
/* 在一般情况下dialog宽为900像素，在逻辑分辨率480像素以下dialog宽为96% */
.short-message-dialog .el-dialog {
  width: 900px;
}
@media (max-width: 480px) {
  .short-message-dialog .el-dialog {
    width: 96%;
  }
}
font.lightred {
  color: #fd545a;
}
font.deepred {
  color: #a80005;
}
</style>

<style scoped>

</style>
