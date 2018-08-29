<template>
  <div>
    <el-dialog title="个人设置" :visible.sync="show" v-if="show" class="user-setting-dialog">
      <el-tabs v-model="activeName" @tab-click="handleClick" class='tabs-wrap'>
        <!-- 偏好设置 -->
        <el-tab-pane label="偏好设置" name="UserPreferences">
          <user-preferences ref="UserPreferences" @close-dialog="show=false;"></user-preferences>
        </el-tab-pane>
        <!-- 委托管理 -->
        <el-tab-pane label="委托管理" name="EntrustManage" v-if="isBanner">
          <user-entrust-manage ref="EntrustManage"></user-entrust-manage>
        </el-tab-pane>
        <!-- 修改密码 -->
        <el-tab-pane label="修改密码" name="ChangePassword" v-if="isBanner">
          <user-change-password ref="ChangePassword" @close-dialog="show=false;"></user-change-password>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="show = false" v-if="activeName === 'UserPreferences' || activeName === 'ChangePassword'">取 消</el-button>
        <el-button type="primary" @click="confirm" v-if="activeName === 'UserPreferences'">确 定</el-button>
        <el-button type="primary" @click="confirmChangePassword" v-else-if="activeName === 'ChangePassword'">确 定</el-button>
        <el-button type="primary" @click="show = false" v-else>关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userPreferences from './components/UserPreferences.vue'
import entrustManageDialog from './components/EntrustManageDialog.vue'
import changePasswordDialog from './components/ChangePasswordDialog.vue'

export default {
  data () {
    return {
      activeName: 'UserPreferences'
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'UserPreferences') {
        return
      }
      if (tab.name === 'EntrustManage') {
        this.$refs.EntrustManage.loadEntrustListData()
        return
      }
      if (tab.name === 'ChangePassword') {

      }
    },
    confirm () {
      this.$refs.UserPreferences.savePreferences()
    },
    confirmChangePassword () {
      this.$refs.ChangePassword.changePassword()
    }
  },
  computed: {
    show: {
      get () {
        return this.showDialog
      },
      set (val) {
        this.$emit('update:showDialog', val)
      }
    }
  },
  components: {
    'user-preferences': userPreferences,
    'user-entrust-manage': entrustManageDialog,
    'user-change-password': changePasswordDialog
  },
  props: ['showDialog', 'isBanner']
}
</script>
