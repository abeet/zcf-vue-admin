<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="addClick" priv="Platform.User.Add">添加</el-button>
      <el-button icon="edit" :disabled="selectedRows.length !== 1" @click="editClick" priv="Platform.User.Edit">编辑</el-button>
      <el-button icon="circle-close" :disabled="!(selectedRows.length === 1 && selectedRows[0].status)" @click="disableOrEnableClickHandler" priv="Platform.User.Disable">停用</el-button>
      <el-button icon="circle-check" :disabled="!(selectedRows.length === 1 && !selectedRows[0].status)" @click="disableOrEnableClickHandler" priv="Platform.User.Enable">启用</el-button>
      <el-button icon="delete" :disabled="selectedRows.length === 0" @click="deleteClickHandler" priv="Platform.User.Delete">删除</el-button>
      <el-button icon="setting" :disabled="selectedRows.length !== 1" @click="modifyPasswordClick" priv="Platform.User.ChangePassword">修改密码</el-button>
      <el-button icon="message" :disabled="selectedRows.length === 0" @click="noticeClickHandler" priv="Platform.User.LastLoginUpdatePwd">通知修改密码</el-button>
    </el-toolbar>

    <div class="layout-content-padding">
       <div class="tar">
         <div class="layout-data-search layout-data-search-6 layout-data-search-con">
            <el-input v-model="userNameSearch" placeholder="请输入用户名"></el-input>
            <el-input v-model="realNameSearch" placeholder="请输入真实姓名"></el-input>
            <tree-select class="layout-select" clearable :value.sync="branchValue" :items="branches" :itemsOptions="treeItemsOptions"  placeholder="请选择所属机构">
            </tree-select>
            <el-select class="layout-select" v-model="userStatus" placeholder="请选择用户状态" clearable>
              <el-option v-for="item in optionsStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
             <el-select class="layout-select" v-model="changePasswordType" placeholder="请选择密码变更时间"  clearable>
              <el-option v-for="item in optionsPasswordType" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-button type="primary" @click="searchClickHandlder">搜索</el-button>
          </div>
        </div>
      <el-table :data="users"  ref="userDataTable" stripe tooltip-effect="dark" style="width: 100%" @selection-change="onSelectionChange" :data-read-url="getUsersURL" :page-size="15">
        <el-table-column type="selection" width="30" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" min-width="15%"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="15%"></el-table-column>
        <el-table-column label="用户状态" min-width="10%">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.status"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" min-width="15%">
          <template slot-scope="scope">
            <span>\{{scope.row.branch.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属角色" min-width="50%">
          <template slot-scope="scope">
            <span v-for="role in scope.row.roles" :key="role.roleCode">\{{role.name}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifyPassTime" label="最后修改密码时间" min-width="20%"></el-table-column>
      </el-table>

    </div>

    <!--修改密码框-->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordModal" width="30%">
      <el-form :model="tmpUser" :rules="userRules" ref="modifyPasswordForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input type="text" v-model="tmpUser.userName" :readonly="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="tmpUser.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPassword">
          <el-input type="password" v-model="tmpUser.repeatPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="modifyPasswordModal = false">取 消</el-button>
        <el-button type="primary" @click="modifyPasswordHandler" :loading="handlerLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加框-->
    <el-dialog title="添加用户" :visible.sync="addUserModal">
      <el-form :model="tmpUser" :rules="userRules" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input type="text" v-model="tmpUser.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input type="text" v-model="tmpUser.realName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="tmpUser.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPassword">
          <el-input type="password" v-model="tmpUser.repeatPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="branchInnerCode">
          <tree-select :value.sync="tmpUser.branchInnerCode" :items="branches" :itemsOptions="treeItemsOptions" placeholder="请选择所属机构">
          </tree-select>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="tmpUser.email"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="tmpUser.tel" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="tmpUser.mobile" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleIds">
          <el-select v-model="tmpUser.roleIds" multiple collapse-tags placeholder="请选择所属角色" style="width:auto">
            <el-option v-for="role in roles" :key="role.roleCode" :label="role.name" :value="role.roleCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addUserModal = false">取 消</el-button>
        <el-button type="primary" @click="addUserHandler" :loading="handlerLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑框-->
    <el-dialog title="编辑用户" :visible.sync="editUserModal">
      <el-tabs class="tabs-wrap" v-model="currentTab">
        <el-tab-pane label="基本信息" name="base" key="base">
          <div class="modal-wrap" v-loading="modalLoading">
            <el-form :model="tmpUser" :rules="userRules" ref="editUserForm" style="margin-top: 20px;" label-width="100px">
              <el-form-item label="用户名" prop="userName">
                <el-input type="text" v-model="tmpUser.userName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="realName">
                <el-input type="text" v-model="tmpUser.realName"></el-input>
              </el-form-item>
              <el-form-item label="所属机构" prop="branchInnerCode">
                <tree-select :value.sync="tmpUser.branchInnerCode" :items="branches" :itemsOptions="treeItemsOptions" :disabled="true" placeholder="请选择所属机构">
                </tree-select>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="tmpUser.email"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="tmpUser.tel" placeholder="联系电话"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="tmpUser.mobile" placeholder="手机号码"></el-input>
              </el-form-item>
              <el-form-item label="所属角色" prop="roleIds">
                <el-select v-model="tmpUser.roleIds" multiple collapse-tags placeholder="请选择所属角色" style="width:auto">
                  <el-option v-for="(role, index) in roles" :key="index" :label="role.name" :value="role.roleCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="pane-btns">
                <el-button @click="editUserModal = false">取 消</el-button>
                <el-button type="primary" @click="editUserHandler()" :loading="handlerLoading">保存基本信息</el-button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="type.name" :name="type.code"  v-for="type in userPermissionTypes" :key="type.code">
          <div>
            <component v-if="currentTab==type.code" :is="type.code"  :id="tmpUser.userName" :type="privType"></component>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '../../components/TreeSelect.vue'
import MenuPermission from './components/MenuPermission.vue'
import SitePermission from './components/SitePermission.vue'
import APIPermission from './components/APIPermission.vue'
import CatalogPermission from './components/CatalogPermission.vue'
import DocPermission from './components/DocPermission.vue'
import ModulesPermission from './components/ModulesPermission.vue'
import BlockPermission from './components/BlockPermission.vue'
import util from '../../common/util.js'

export default {
  data () {
    return {
      users: [],
      privType: 'U',
      selectedRows: [],
      handlerLoading: false,
      modifyPasswordModal: false,
      addUserModal: false,
      editUserModal: false,
      currentTab: 'base',
      tmpUser: {
        userName: '',
        realName: '',
        password: '',
        repeatPassword: '',
        status: 'Y',
        branchInnerCode: '',
        roles: [],
        roleIds: [],
        lastModifyPassTime: '',
        email: '',
        tel: '',
        mobile: '',
        remark: ''
      },
      branches: [],
      roles: [],
      userPermissionTypes: [],
      UserPermissions: [],
      modalLoading: false,
      userStatus: '', // 用户状态
      changePasswordType: '', // 用户更改密码时间类型
      optionsPasswordType: [],
      userNameSearch: '',
      realNameSearch: '',
      branchValue: '',
      optionsBranches: [],
      optionsStatus: [
        {
          value: 'Y',
          label: '启用'
        },
        {
          value: 'N',
          label: '停用'
        }
      ], // 查询会员状态
      userRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 32, message: '密码最少6位，最多32位', trigger: 'blur' }],
        repeatPassword: [
          { required: true, message: '请重复输入一次密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.tmpUser.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        branchInnerCode: [
          {
            required: true,
            message: '请选择所属机构',
            trigger: 'blur, change'
          }
        ],
        roleIds: [
          {
            type: 'array',
            required: true,
            message: '请选择所属角色',
            trigger: 'blur, change'
          }
        ]
      },
      treeItemsOptions: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode'
      }
    }
  },
  computed: {
    disableOrEnable: function () {
      if (this.selectedRows.length !== 1) {
        return ''
      }

      return this.selectedRows[0].status ? '停用' : '启用'
    }
  },
  methods: {
    onSelectionChange (selection) {
      this.selectedRows = selection
    },
    async changePasswordMethod () {
      let data = await axios.get('/api/users/changepasswordtype')
      this.optionsPasswordType = data.data.data
    },
    searchClickHandlder () {
      this.$refs.userDataTable.getData()
    },
    getUsersURL () {
      return [
        '/api/users',
        {
          params: {
            userName: this.userNameSearch,
            realName: this.realNameSearch,
            branchInnerCode: this.branchValue,
            status: this.userStatus,
            changePasswordType: this.changePasswordType
          }
        }
      ]
    },
    async addClick () {
      this.tmpUser = {
        userName: '',
        realName: '',
        password: '',
        repeatPassword: '',
        status: 'Y',
        branchInnerCode: '',
        roles: [],
        roleIds: [],
        lastModifyPassTime: '',
        email: '',
        tel: '',
        mobile: '',
        remark: ''
      }
      if (!this.branches.length || !this.roles.length) {
        await Promise.all([axios.get('/api/branches').then(res => res.data), axios.get('/api/roles').then(res => res.data)]).then(datas => {
          this.branches = datas[0].data
          this.roles = datas[1].data
        })
      }

      this.addUserModal = true
    },

    async getBranches () {
      let data = await axios.get('/api/branches')
      this.branches = data.data.data
    },
    async addUserHandler () {
      try {
        await util.validateForm(this.$refs['addUserForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.handlerLoading = false
        return
      }
      this.handlerLoading = true
      this.tmpUser.roles = this.roles.filter(val => {
        return this.tmpUser.roleIds.includes(val.roleCode)
      })

      // this.tmpUser.branchInnerCode = this.tmpUser.branch.branchInnerCode
      this.tmpUser.roleCode = this.tmpUser.roles.map(val => val.roleCode).join(',')
      let data = await axios.post('/api/users', this.tmpUser).then(res => res.data)
      if (data.status !== 1) {
        return data
      }
      this.$refs.userDataTable.getData()
      this.addUserModal = false
      this.handlerLoading = false
      util.showNotification(data)
    },
    editClick () {
      this.tmpUser = Object.assign({ roleIds: [] }, this.tmpUser, this.selectedRows[0])
      this.tmpUser.roleIds = this.tmpUser.roles.map(val => {
        return val.roleCode
      })
      this.currentTab = 'base'
      this.modalLoading = true
      this.editUserModal = true

      Promise.all([
        axios.get('/api/branches').then(res => res.data),
        axios.get('/api/roles').then(res => res.data),
        axios.get(`/api/permissions/id/none/type/none/types`).then(res => res.data)
      ]).then(datas => {
        this.branches = datas[0].data
        this.roles = datas[1].data
        this.userPermissionTypes = datas[2].data
        this.modalLoading = false
      })
    },
    async editUserHandler () {
      try {
        await util.validateForm(this.$refs['editUserForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.handlerLoading = false
        return
      }
      this.handlerLoading = true
      this.tmpUser.roleCode = this.tmpUser.roleIds.join(',')
      let res = await axios.put(`/api/users/${this.tmpUser.userName}`, this.tmpUser).then(res => res.data)
      if (res.status !== 1) {
        this.handlerLoading = false
        return res
      }
      let index = this.users.findIndex(val => val.userName === this.tmpUser.userName)
      this.tmpUser.roles = this.roles.filter(val => {
        return this.tmpUser.roleIds.includes(val.roleCode)
      })

      // this.users = [
      //   ...this.users.slice(0, index),
      //   this.tmpUser,
      //   ...this.users.slice(index + 1)
      // ];
      this.users.splice(index, 1, this.tmpUser)
      this.handlerLoading = false
      util.showNotification(res)
      this.editUserModal = false
    },
    async deleteClickHandler () {
      let rowIds = []

      this.selectedRows.forEach(function (row) {
        rowIds.push(row.userName)
      })

      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            if (action !== 'confirm') {
              done()
              return
            }
            instance.confirmButtonLoading = true

            try {
              var data = await axios.delete('/api/users/' + rowIds.join(',')).then(res => res.data)
            } catch (e) {
              util.showErrorNotification(e)
              instance.confirmButtonLoading = false
              done()
              return
            }
            instance.confirmButtonLoading = false
            if (data.status !== 1) {
              return data
            }

            this.users = this.users.filter(val => !rowIds.includes(val.userName))

            util.showNotification(data)
            done()
          }
        })
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    async noticeClickHandler () {
      let rowIds = [],
        rowUsers = []

      this.selectedRows.forEach(function (row) {
        rowIds.push(row.userName)
        rowUsers.push(row.userName)
      })

      try {
        await this.$confirm('这些用户：' + rowUsers.join('、') + '，下次登录时修改密码吗?', '确认通知', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            if (action !== 'confirm') {
              done()
              return
            }
            instance.confirmButtonLoading = true
            let ids = rowIds.join(',')
            try {
              var data = await axios
                .post('/api/message', {
                  toUser: `${ids}`,
                  subject: '密码长时间未修改通知',
                  content: '您的密码由于长时间未修改，请您及时修改密码！'
                })
                .then(res => res.data)
            } catch (e) {
              util.showErrorNotification(e)
              instance.confirmButtonLoading = false
              done()
              return
            }
            instance.confirmButtonLoading = false
            util.showNotification(data)
            done()
          }
        })
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    async disableOrEnableClickHandler () {
      let userName = this.selectedRows[0].userName

      this.$confirm('确定' + this.disableOrEnable + '这个用户吗？', '确认' + this.disableOrEnable, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action !== 'confirm') {
            done()
            return
          }
          instance.confirmButtonLoading = true
          let handle
          if (this.selectedRows[0].status) {
            handle = async () => {
              return await axios.put('/api/users/disable/' + userName).then(res => res.data)
            }
          } else {
            handle = async () => {
              return await axios.put('/api/users/enable/' + userName).then(res => res.data)
            }
          }

          try {
            var data = await handle(userName)
          } catch (e) {
            util.showErrorNotification(e)
            instance.confirmButtonLoading = false
            done()
            return
          }
          instance.confirmButtonLoading = false
          if (data.status !== 1) {
            return data
          }
          let index = this.users.findIndex(val => {
            return val.userName === userName
          })
          this.users[index].status = !this.users[index].status

          util.showNotification(data)
          done()
        }
      }).catch(e => {
        util.showErrorNotification(e)
      })
    },
    modifyPasswordClick () {
      this.tmpUser.userName = this.selectedRows[0].userName
      this.tmpUser.password = ''
      this.tmpUser.repeatPassword = ''

      this.modifyPasswordModal = true
    },
    async modifyPasswordHandler () {
      try {
        await util.validateForm(this.$refs['modifyPasswordForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.handlerLoading = false
        return
      }
      this.handlerLoading = true
      let data = await axios
        .put('/api/users/password', {
          userName: this.tmpUser.userName,
          password: this.tmpUser.password
        })
        .then(res => res.data)
      this.modifyPasswordModal = false
      this.handlerLoading = false
      util.showNotification(data)
    }
  },
  created () {
    this.changePasswordMethod() // 获取密码变更时间类型数据
    this.getBranches() // 机构数据
  },
  components: {
    'tree-select': TreeSelect,
    menuPermission: MenuPermission,
    sitePermission: SitePermission,
    apiPermission: APIPermission,
    catalogPermission: CatalogPermission,
    modulesPermission: ModulesPermission,
    docPermission: DocPermission,
    blockPermission: BlockPermission
  }
}
</script>

<style scoped>
.pane-btns {
  text-align: right;
}
.tree-class {
  width: 180px;
}
</style>
