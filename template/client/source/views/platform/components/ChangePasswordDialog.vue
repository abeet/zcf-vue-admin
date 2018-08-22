<template>
  <div class="password-form">
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-form :model="passwordTemp" :rules="passwordRules" ref="changePasswordForm" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="passwordTemp.oldPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="passwordTemp.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="confirmPassword">
            <el-input type="password" v-model="passwordTemp.confirmPassword" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <div class="el-dialog__footer">
            <div class="save-btn">
              <button type="button" class="el-button el-button--primary" @click="changePassword"><span>确定</span></button>
            </div>
          </div> -->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from '../../../common/util.js';
export default {
  data() {
    return {
      passwordTemp: {
        oldPassword: '',
        password: '',
        confirmPassword: '',
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '密码最少6位，最多32位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '密码最少6位，最多32位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请重复输入一次密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordTemp.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async changePassword() {
      try {
        await util.validateForm(this.$refs['changePasswordForm']);
      } catch (e) {
        util.showErrorMessageBox(e);
        return;
      }
      let data = await axios
        .put('/api/application/changepassword', {
          oldPassword: this.passwordTemp.oldPassword,
          password: this.passwordTemp.password,
          confirmPassword: this.passwordTemp.confirmPassword,
        })
        .then(res => res.data);
      if (data.status === 1) {
        util.showSuccess(data.message);
        this.$refs['changePasswordForm'].resetFields();
        this.$emit('close-dialog');
      } else {
        util.showErrorMessageBox(data.message);
      }
    },
  },
};
</script>

<style scoped>
.password-form {
  margin-top: 50px;
  margin-bottom: 50px;
}
.el-dialog__footer{
  padding: 0;
}
</style>
