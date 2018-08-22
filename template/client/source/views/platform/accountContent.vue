<template>
  <div>
    <el-toolbar>
      <el-button icon="circle-check" @click="saveClickHandler" priv="Platform.AccountSecurity.Save">保存</el-button>
    </el-toolbar>

    <div class="layout-content-padding">
      <el-row>
        <el-col :span="16">
          <el-form :model="security" :rules="ruleValidate" ref="formValidate" label-width="320px">
            <el-form-item label="是否启用账户安全配置" prop="IsOpenThreeSecurity">
              <el-switch v-model="security.IsOpenThreeSecurity" on-text="" off-text=""></el-switch>
            </el-form-item>

            <div v-show="security.IsOpenThreeSecurity">
              <h3 class="header-title">密码规则配置</h3>
              <el-form-item label="密码最小长度" prop="PasswordMinLength">
                <el-input-number v-model="security.PasswordMinLength" placeholder="密码最小长度"></el-input-number>
              </el-form-item>
              <el-form-item label="密码最大长度" prop="PasswordMaxLength">
                <el-input-number v-model="security.PasswordMaxLength" placeholder="密码最小长度"></el-input-number>
              </el-form-item>
              <el-form-item label="密码字符要求" prop="PasswordCharacterSpecification">
                <el-select v-model="security.PasswordCharacterSpecification" placeholder="请选择密码字符要求">
                  <el-option value="无要求" label="无要求"></el-option>
                  <el-option value="必须同时包含字母和数字" label="必须同时包含字母和数字"></el-option>
                  <el-option value="必须同时包含大写字母、小写字母、数字" label="必须同时包含大写字母、小写字母、数字"></el-option>
                  <el-option value="必须同时包含大、小写字母、特殊字符、数字" label="必须同时包含大、小写字母、特殊字符、数字"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="密码中不能包含的用户信息" prop="NotIncludeUserInfo">
                <el-checkbox-group v-model="security.NotIncludeUserInfo">
                  <el-checkbox label="用户名"></el-checkbox>
                  <el-checkbox label="用户真实姓名"></el-checkbox>
                  <el-checkbox label="电子邮箱"></el-checkbox>
                  <el-checkbox label="手机"></el-checkbox>
                  <el-checkbox label="联系电话"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="是否开启密码重复性检查" prop="IsOpenRecentlyCheck">
                <el-switch v-model="security.IsOpenRecentlyCheck"></el-switch>
              </el-form-item>
              <el-form-item label="重复性检查记录数" prop="RepeatCount">
                <el-input-number v-model="security.RepeatCount" :disabled="!security.IsOpenRecentlyCheck" placeholder="密码最小长度"></el-input-number>
              </el-form-item>

              <h3 class="header-title">密码校检配置</h3>
              <el-form-item label="一天内密码错误次数超过最大重试次数锁定账号" prop="SpecifyOverTimeLock">
                <el-switch v-model="security.SpecifyOverTimeLock"></el-switch>
              </el-form-item>
              <el-form-item label="密码错误最大重试次数" prop="MaxLoginCount">
                <el-input-number v-model="security.MaxLoginCount" :disabled="!security.SpecifyOverTimeLock" placeholder="密码错误最大重试次数"></el-input-number>
              </el-form-item>
              <el-form-item label="超过密码错误最大重试次数处理方式" prop="OverLoginCountType">
                <el-select v-model="security.OverLoginCountType" placeholder="超过密码错误最大重试次数处理方式">
                  <el-option value="不处理">不处理</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="禁止登录时长" prop="LockTime">
                <el-input-number v-model="security.LockTime" :disabled="!security.SpecifyOverTimeLock" placeholder="禁止登录时长"></el-input-number>
              </el-form-item>

              <h3 class="header-title">密码变更通知</h3>
              <el-form-item label="指定密码过期时间" prop="Expiration">
                <el-input-number v-model="security.Expiration" :disabled="!security.SpecifyOverTimeLock" placeholder="指定密码过期时间"></el-input-number>
              </el-form-item>
              <el-form-item label="后台重置密码后下次登录是否强制修改密码" prop="NextLoginUpdatePwd">
                <el-switch v-model="security.NextLoginUpdatePwd"></el-switch>
              </el-form-item>
            </div>

          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        security: {
          IsOpenThreeSecurity: false,
          PasswordMinLength: 6,
          PasswordMaxLength: 30,
          PasswordCharacterSpecification: 1,
          NotIncludeUserInfo: [],
          IsOpenRecentlyCheck: false,
          RepeatCount: 0,
          SpecifyOverTimeLock: false,
          MaxLoginCount: 0,
          OverLoginCountType: '',
          LockTime: 0,
          Expiration: 0,
          NextLoginUpdatePwd: false
        },
        ruleValidate: {

        }
      }
    },
    methods: {
    async saveClickHandler() {
      const data = await axios.put('/api/securitys/all', { data:this.security })
        this.$notify({
          title: '成功',
          message: '操作成功！',
          type: 'success',
          duration: 2000
        });
    }
  },
  async created() {
    let data = await axios.get('/api/securitys')
    data = data.data
      if (data.IsOpenThreeSecurity) {
        this.security = data;
      }

  }
}
</script>

<style scoped>
  .header-title{
    text-indent: 30px;
    margin-bottom: 20px;
  }
</style>
