<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="circle-check" @click="saveClickHandler">保存</el-button>
    </el-toolbar>

    <div class="layout-content-padding scroll" v-loading="dataLoading">
      <el-row>
        <el-col :span="20">
          <el-form :model="security" :rules="ruleValidate" ref="formValidate" label-position="left" label-width="380px" class="platform-security-form">
            <h3 class="header-title">账户安全配置</h3>
            <el-form-item label="是否启用账户安全配置：" prop="isOpenThreeSecurity">
              <el-switch v-model="security.isOpenThreeSecurity" on-text="" off-text=""></el-switch>
            </el-form-item>

            <div v-show="security.isOpenThreeSecurity">
              <h3 class="header-title">密码规则配置</h3>
              <el-form-item label="密码最小长度：" prop="passwordMinLength">
                <el-input-number v-model="security.passwordMinLength" placeholder="密码最小长度"></el-input-number>
              </el-form-item>
              <el-form-item label="密码最大长度：" prop="passwordMaxLength">
                <el-input-number v-model="security.passwordMaxLength" placeholder="密码最小长度"></el-input-number>
              </el-form-item>
              <el-form-item label="密码字符要求：" prop="passwordCharacterSpecification">
                <el-select v-model="security.passwordCharacterSpecification" placeholder="请选择密码字符要求" style="width:310px">
                  <el-option value="A" label="无要求"></el-option>
                  <el-option value="B" label="必须同时包含字母和数字"></el-option>
                  <el-option value="C" label="必须同时包含大写字母、小写字母、数字"></el-option>
                  <el-option value="D" label="必须同时包含大、小写字母、特殊字符、数字"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="密码中不能包含的用户信息：" prop="notIncludeUserInfo">
                <el-checkbox-group v-model="security.notIncludeUserInfo">
                  <el-checkbox  label="UserName">用户名</el-checkbox>
                  <el-checkbox label="RealName">用户真实姓名</el-checkbox>
                  <el-checkbox label="Email">电子邮箱</el-checkbox>
                  <el-checkbox label="Mobile">手机</el-checkbox>
                  <el-checkbox label="Tel">联系电话</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="是否开启密码重复性检查：" prop="isOpenRecentlyCheck">
                <el-switch v-model="security.isOpenRecentlyCheck"></el-switch>
              </el-form-item>
              <el-form-item label="重复性检查记录数：" prop="repeatCount">
                <el-input-number v-model="security.repeatCount" :disabled="!security.isOpenRecentlyCheck" placeholder="密码最小长度"></el-input-number>
              </el-form-item>
              <el-form-item>
                <font color="#BBBBBB">注：重复性检查记录数设置为空或0时则不检查</font>
              </el-form-item>

              <h3 class="header-title">密码校检配置</h3>
              <el-form-item label="一天内密码错误次数超过最大重试次数锁定账号：" prop="specifyOverTimeLock">
                <el-switch v-model="security.specifyOverTimeLock"></el-switch>
              </el-form-item>
              <el-form-item label="密码错误最大重试次数：" prop="maxLoginCount">
                <el-input-number v-model="security.maxLoginCount" :disabled="!security.specifyOverTimeLock" placeholder="密码错误最大重试次数"></el-input-number>
              </el-form-item>
              <el-form-item>
                <font color="#BBBBBB">注：登录密码最大校检次数不设置或设置为0则不进行校验</font>
              </el-form-item>
              <el-form-item label="超过密码错误最大重试次数处理方式：" prop="overLoginCountType">
                <el-select v-model="security.overLoginCountType" placeholder="超过密码错误最大重试次数处理方式" style="width:160px">
                    <el-option value="" label="不处理"></el-option>
                    <el-option value="A" label="锁定账号"></el-option>
                    <el-option value="B" label="指定时间内禁止登录"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="禁止登录时长：" prop="lockTime">
                <el-input-number v-model="security.lockTime" :disabled="security.overLoginCountType!='B'" placeholder="注：账户锁定时间设置为0或为空时则不锁定，最长锁定时间为100天"></el-input-number>
              </el-form-item>
              <el-form-item>
                <font color="#BBBBBB">注：账户锁定时间设置为0或为空时则不锁定，最长锁定时间为100天</font>
              </el-form-item>

              <h3 class="header-title">密码变更通知</h3>
              <el-form-item label="指定密码过期时间：" prop="expiration">
                <el-input-number v-model="security.expiration" :disabled="!security.specifyOverTimeLock" placeholder="指定密码过期时间"></el-input-number>
              </el-form-item>
              <el-form-item>
                <font color="#BBBBBB">注：指定密码时间设置为0或空时将不过期</font>
              </el-form-item>
              <el-form-item label="后台重置密码后下次登录是否强制修改密码：" prop="nextLoginUpdatePwd">
                <el-switch v-model="security.nextLoginUpdatePwd"></el-switch>
              </el-form-item>
            </div>

          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import util from '../../common/util.js'

export default {
  data() {
    return {
      dataLoading: true,
      security: {
        isOpenThreeSecurity: false,
        passwordMinLength: 6,
        passwordMaxLength: 30,
        passwordCharacterSpecification: 1,
        notIncludeUserInfo: [],
        isOpenRecentlyCheck: false,
        repeatCount: 0,
        specifyOverTimeLock: false,
        maxLoginCount: 0,
        overLoginCountType: '',
        lockTime: 0,
        expiration: 0,
        nextLoginUpdatePwd: false
      },
      ruleValidate: {}
    }
  },
  methods: {
    async saveClickHandler() {
      try {
        var res = await axios.put('/api/securitys/all', { data: this.security })
        console.log(res)
        util.showResponseMessage(res.data)
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
    }
  },
  async created() {
    let data = await axios.get('/api/securitys')
    data = data.data
    if (typeof data == 'string') {
      this.security = JSON.parse(data)
    } else {
      for (let key in this.security) {
        if (!data.hasOwnProperty(key)) {
          data[key] = this.security[key]
        }
      }
      this.security = data
    }
    this.dataLoading = false
  }
}
</script>

<style scoped>
.header-title {
  text-indent: 30px;
  margin-bottom: 20px;
}
</style>
<style>
.platform-security-form .el-form-item__label {
  text-indent: 60px !important;
}
</style>
