<template>
  <div>
    <el-dialog title="新建消息" :visible.sync="messageAddDialog" @open="dialogOpen" class="message-add-dialog">
      <el-form :model="tmpMessageAdd" :rules="messageAddRules" ref="messageAddForm" label-width="100px">
        <el-form-item prop="toUser" label="接收人：">
          <el-input type="text" v-model="tmpMessageAdd.toUser">
            <el-button @click="userSelectClick" slot="append">选择..</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="toRole" label="接收角色：">
          <el-input type="text" v-model="tmpMessageAdd.toRole">
            <el-button @click="roleSelectClick" slot="append">选择..</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="subject" label="标题：">
          <el-input type="text" v-model="tmpMessageAdd.subject"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容：">
          <el-input type="textarea" v-model="tmpMessageAdd.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmMessageAddClick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择用户 -->
    <user-dialog :userSelectShow.sync="userSelectShow" :toUsers="tmpMessageAdd.toUser" @callback="userSelectCallback"></user-dialog>
    <!-- 选择角色 -->
    <role-dialog :roleSelectShow.sync="roleSelectShow" :roleCodes="tmpMessageAdd.toRole" @callback="roleSelectCallback"></role-dialog>
  </div>
</template>

<script>
import userSelect from '../userSelectDialog.vue'
import roleSelect from '../roleSelectDialog.vue'
import util from '../../../common/util.js'

export default {
  data() {
    return {
      tmpMessageAdd: {
        toUser: '',
        toRole: '',
        subject: '',
        content: '',
      }, //新建消息对象
      userSelectShow: false, //选择用户dialog显示状态
      roleSelectShow: false, //选择角色dialog显示状态
      messageAddRules: {
        toUser: [{ required: true, message: '接收人不能为空', trigger: 'blur' }],
        toRole: [{ required: true, message: '接收角色不能为空', trigger: 'blur' }],
        subject: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 1, max: 2000, message: '长度在 1 到 2000 个字符', trigger: 'blur' },
        ],
      }, //新建消息规则
    }
  },
  computed: {
    messageAddDialog: {
      get() {
        return this.messageAddShow
      },
      set(val) {
        this.$emit('update:messageAddShow', val)
      },
    },
  },
  components: {
    'user-dialog': userSelect,
    'role-dialog': roleSelect,
  },
  methods: {
    dialogOpen(){
      this.tmpMessageAdd={
        toUser: '',
        toRole: '',
        subject: '',
        content: '',
      }
    },
    //选择用户点击
    async userSelectClick() {
      this.userSelectShow = true
    },
    //选择角色点击
    async roleSelectClick() {
      this.roleSelectShow = true
    },
    roleSelectCallback(roles){
      this.tmpMessageAdd.toRole = roles
    },
    //接收人
    userSelectCallback(users) {
      this.tmpMessageAdd.toUser = users
    },
    async confirmMessageAddClick() {
      try {
        await util.validateForm(this.$refs['messageAddForm'])
      } catch (e) {
        util.showErrorMessageBox(e)
        return
      }
      let res = await axios.post('/api/message',this.tmpMessageAdd)
      util.showResponseMessage(res.data)
      if(res.data.status === 1){
        this.messageAddDialog = false
        this.$emit('callback')
      }
    },
  },
  props: ['messageAddShow'],
}
</script>

<style scoped>
.page {
  float: right;
}
</style>
<style>
.content .el-textarea__inner {
  height: 108px;
}
/* 在一般情况下dialog宽为450像素，在逻辑分辨率480像素以下dialog宽为96% */
.message-add-dialog .el-dialog {
  width: 450px;
}
@media (max-width: 480px) {
  .message-add-dialog .el-dialog {
    width: 96%;
  }
}
</style>
