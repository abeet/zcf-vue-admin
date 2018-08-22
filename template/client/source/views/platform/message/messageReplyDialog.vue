<template>
  <div>
    <el-dialog title="回复" :visible.sync="messageReplyDialog" @open="dialogOpen" class="message-reply-dialog">
      <el-form :model="tmpMessageReply" :rules="messageReplyRules" ref="messageReplyForm" label-width="100px">
        <el-form-item prop="toUser" label="接收人：">
          <el-input type="text" v-model="tmpMessageReply.toUser" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="subject" label="标题：" >
          <el-input type="text" v-model="tmpMessageReply.subject" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容：">
          <el-input type="textarea" v-model="tmpMessageReply.content" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageReplyDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmMessageReplyClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../common/util.js'
export default {
  data() {
    return {
      confirmLoading: false,
      tmpMessageReply:{},
      messageReplyRules: {
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度在 1 到 2000 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    messageReplyDialog: {
      get() {
        return this.messageReplyShow
      },
      set(val) {
        this.$emit('update:messageReplyShow', val)
      }
    }
  },
  methods: {
    dialogOpen(){
      this.tmpMessageReply = {
        toUser:this.tmpMessage.toUser,
        subject:'回复：'+this.tmpMessage.subject,
        content:''
      }
    },
    async confirmMessageReplyClick() {
      try {
        await util.validateForm(this.$refs['messageReplyForm'])
      } catch (e) {
        util.showErrorMessageBox(e)
        return
      }
      let res = await axios.post('/api/message/reply',this.tmpMessageReply)
      util.showResponseMessage(res.data)
      if(res.data.status === 1){
        this.messageReplyDialog = false
      }
    },
  },
  props: ['messageReplyShow','tmpMessage'],
}
</script>
<style>
/* 在一般情况下dialog宽为450像素，在逻辑分辨率480像素以下dialog宽为96% */
.message-reply-dialog .el-dialog {
  width: 450px;
}
@media (max-width: 480px) {
  .message-reply-dialog .el-dialog {
    width: 96%;
  }
}
</style>

<style scoped>
.page {
  float: right;
}
</style>
