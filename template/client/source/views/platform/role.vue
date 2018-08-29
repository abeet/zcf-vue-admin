<template>
  <div class="layout-row-inpage">
    <div class="layout-col-tree">
      <el-toolbar>
        <el-button @click="goBranchHandler">
          <i class="fa fa-pencil"></i>修改组织机构</el-button>
      </el-toolbar>
      <div style="overflow: auto;height: calc(50vh - 100px);" v-loading="branchLoading">
        <el-tree :props="branchProps" :data="roleBranchTree" node-key="branchInnerCode" :default-expand-all="true" :expand-on-click-node="false" :highlight-current="true" @current-change="onRoleBranchTreeCheckChange">
        </el-tree>
      </div>
      <el-toolbar>
        <el-button @click="addRoleClickHandler" :disabled="!currentBranch" priv="Platform.Role.Add">
          <i class="fa fa-plus"></i>新建
        </el-button>
        <el-button @click="editRoleClickHandler" :disabled="!currentRole" priv="Platform.Role.Edit">
          <i class="fa fa-pencil"></i>编辑
        </el-button>
        <el-button @click="deleteRoleClickHandler" :disabled="!currentRole" priv="Platform.Role.Delete">
          <i class="fa fa-close"></i>删除
        </el-button>
      </el-toolbar>
      <div v-loading="roleLoading">
        <el-tree :highlight-current="true" :props="roleProps" :data="roleTree" @current-change="onRoleTreeCheckChange">
        </el-tree>
      </div>
    </div>
    <div class="layout-col-detail">
      <div>
        <el-tabs class="tabs-wrap" v-model="activeName" @tab-click="onRoleTabsClick">
          <el-tab-pane label='基本信息' name='roleInfo'>
            <div v-loading="roleInfoLoading">
              <div style="padding: 15px;">
                <table width="100%" cellpadding="4" cellspacing="0" class="z-datagrid">
                  <thead>
                    <tr class="dataTableHead" style="height: 24px; line-height: 24px;">
                      <td width="2%">&nbsp;</td>
                      <td width="14%">名称</td>
                      <td width="35%">值</td>
                      <td width="14%">名称</td>
                      <td width="35%">值</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="height: 24px; line-height: 24px;">
                      <td class="noellipsis">&nbsp;</td>
                      <td>角色名：</td>
                      <td>\{{currentRole && currentRole.name}}</td>
                      <td>所属机构：</td>
                      <td>\{{currentRole && currentBranch && currentBranch.name}}</td>
                    </tr>
                    <tr style="height: 24px; line-height: 24px;">
                      <td class="noellipsis">&nbsp;</td>
                      <td>备注：</td>
                      <td>\{{currentRole && currentRole.memo}}</td>
                      <td></td>
                      <td>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <el-toolbar>
                <el-button icon="plus" @click="addUsersToRoleClickHandler" :disabled="!currentBranch || !currentRole">添加用户到角色</el-button>
                <el-button icon="delete" @click="deleteUsersToRoleClickHandler" :disabled="!currentBranch || !currentRole">从角色中删除用户
                </el-button>
              </el-toolbar>
              <div class="layout-content-padding">
                <el-table class="role-intab" style="width: 100%" :data="userDataTableValues">
                  <el-table-column prop="userName" label="用户名" min-width="150"></el-table-column>
                  <el-table-column prop="realName" label="真实姓名" min-width="150"></el-table-column>
                  <el-table-column label="所属角色" min-width="150">
                    <template slot-scope="scope">
                      <span v-for="role in scope.row.roles" :key="role.roleCode">
                        \{{role.name}}，
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="type.name" :name="type.code" v-for="type in rolePermissionTypes" :key="type.code">
              <component v-if="activeName===type.code" :is="type.code" :id="currentRole.roleCode" :type="privType"></component>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--添加编辑框-->
    <el-dialog :title="editRoleMode === 1 ? '添加新角色' : '编辑角色'" :visible.sync="roleDialog">
      <el-form :model="tmpRole" :rules="roleRules" ref="roleForm" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="tmpRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="tmpRole.roleCode" :disabled="editRoleMode === 2"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="branchInnerCode">
          <tree-select :value.sync="tmpRole.branchInnerCode" :items="roleBranchTree" :itemsOptions="treeItemsOptions" :disabled="editRoleMode === 2" placeholder="请选择">
          </tree-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tmpRole.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="okHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!--用户选择框-->
    <el-dialog :title="selectMode === 1 ? '添加用户到角色' : '从角色中删除用户'" :visible.sync="selectDialog">
      <div class="select-user-wrap" v-loading="selectLoading">
        <el-table style="width: 100%" :data="selectUsers" @selection-change="usersSelectionChangeHandler">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="userName" label="用户名" min-width="150"></el-table-column>
          <el-table-column prop="realName" label="真实姓名" min-width="150"></el-table-column>
          <el-table-column label="所属角色" min-width="150">
            <template slot-scope="scope">
              <span v-for="role in scope.row.roles" :key="role.roleCode">
                \{{role.name}}，
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="selectDialog = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" :disabled="!selectedUsers.length" @click="selectConfirmClickHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import util from '../../common/util.js'
import TreeSelect from '../../components/TreeSelect.vue'
import MenuPermission from './components/MenuPermission.vue'
import SitePermission from './components/SitePermission.vue'
import APIPermission from './components/APIPermission.vue'
import CatalogPermission from './components/CatalogPermission.vue'
import DocPermission from './components/DocPermission.vue'
import ModulesPermission from './components/ModulesPermission.vue'
import BlockPermission from './components/BlockPermission.vue'

export default {
  data () {
    return {
      rolePermissionTypes: [],
      branchLoading: true,
      roleLoading: false,
      roleBranchTree: [],
      currentBranch: null,
      roleTree: [],
      currentRole: { roleCode: '' },
      activeName: 'roleInfo',
      roleInfoLoading: false,
      userDataTableValues: [],
      menuPrivLoading: false,
      privType: 'R',
      branchProps: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode'
      },
      roleProps: {
        children: 'children',
        label: 'name',
        key: 'roleCode'
      },

      roleDialog: false,
      editRoleMode: 1, // 1： 添加， 2：编辑
      tmpRole: {},
      roleRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
        branchInnerCode: [
          {
            required: true,
            message: '请选择所属机构',
            trigger: 'blur'
          }
        ]
      },
      treeItemsOptions: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode'
      },
      confirmLoading: false,
      selectUsers: [],
      selectMode: 1, // 1: 添加用户到角色，2: 从角色中删除用户
      selectDialog: false,
      selectLoading: false,
      selectedUsers: []
    }
  },
  created () {
    Promise.all([
      axios.get('/api/branches').then(res => res.data),
      axios.get(`/api/permissions/id/none/type/none/types`).then(res => res.data)
    ]).then(datas => {
      this.roleBranchTree = datas[0].data
      this.rolePermissionTypes = datas[1].data
      this.branchLoading = false
    })
  },
  methods: {
    goBranchHandler () {
      this.$router.push({
        path: '/platform/branch'
      })
    },
    // 当在左上机构树上点击
    async onRoleBranchTreeCheckChange (branch) {
      this.currentBranch = branch
      this.currentRole = {}
      this.userDataTableValues = []
      this.roleLoading = true

      let data = await axios.get('/api/roles?branchInnercode=' + branch.branchInnerCode)
      this.roleTree = data.data.data
      this.roleLoading = false
    },
    // 当在左下机构树上点击
    onRoleTreeCheckChange (role) {
      this.currentRole = role
      this.userDataTableValues = []
      this.onRoleTabsClick()
    },
    // 当在右上页签上点击
    async onRoleTabsClick () {
      if (!this.currentBranch || !this.currentBranch.branchInnerCode || !this.currentRole || !this.currentRole.roleCode) {
        return
      }
      if (this.activeName === 'roleInfo' && !this.userDataTableValues.length) {
        this.roleInfoLoading = true
        let res = await axios.get(`/api/roles/${this.currentRole.roleCode}/users`).catch(e => console.log(e))
        let data = res.data
        this.userDataTableValues = data.data
        this.roleInfoLoading = false
      }
    },
    addRoleClickHandler () {
      this.editRoleMode = 1
      // console.info(this.currentBranch.branchInnerCode)
      this.tmpRole = {
        roleName: '',
        roleCode: '',
        branchInnerCode: this.currentBranch.branchInnerCode,
        memo: ''
      }
      this.roleDialog = true
    },
    editRoleClickHandler () {
      this.editRoleMode = 2
      // console.info(this.currentRole)
      this.tmpRole = {
        roleCode: this.currentRole.roleCode,
        branchInnerCode: this.currentBranch.branchInnerCode,
        memo: this.currentRole.memo,
        roleName: this.currentRole.name
      }

      this.roleDialog = true
    },
    async deleteRoleClickHandler () {
      try {
        await this.$confirm('确定删除吗，删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      let res = await axios.delete(`/api/roles/${this.currentRole.roleCode}`).catch(e => console.log(e))
      let data = res.data
      if (data.status !== 1) {
        return data
      }

      let index = this.roleTree.findIndex(val => val.roleCode === this.currentRole.roleCode)

      this.roleTree = [...this.roleTree.slice(0, index), ...this.roleTree.slice(index + 1)]

      this.currentRole = { roleCode: '' }
      this.userDataTableValues = []

      util.showNotification(data)
    },
    async okHandler () {
      let addForm = async () => {
        let data = await axios.post('/api/roles', this.tmpRole).then(res => res.data)
        if (data.status !== 1) {
          return data
        }
        if (this.currentBranch.branchInnerCode === this.tmpRole.branchInnerCode) {
          this.roleTree.push({
            name: this.tmpRole.roleName,
            roleCode: this.tmpRole.roleCode,
            memo: this.tmpRole.memo
          })
        }
        return data
      }

      let editForm = async () => {
        let res = await axios.put(`/api/roles/${this.tmpRole.roleCode}`, this.tmpRole).catch(e => console.log(e))
        let data = res.data
        if (data.status !== 1) {
          return data
        }

        let index = this.roleTree.findIndex(val => val.roleCode === this.tmpRole.roleCode)
        this.tmpRole.name = this.tmpRole.roleName
        this.roleTree = [...this.roleTree.slice(0, index), this.tmpRole, ...this.roleTree.slice(index + 1)]

        return data
      }

      try {
        await util.validateForm(this.$refs['roleForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
        return
      }
      this.confirmLoading = true
      if (this.editRoleMode === 1) {
        var res = await addForm()
      }

      if (this.editRoleMode === 2) {
        var res = await editForm()
      }
      this.confirmLoading = false
      this.roleDialog = false

      util.showNotification(res)
    },
    async addUsersToRoleClickHandler () {
      this.selectUsers = []
      this.selectedUsers = []
      this.selectMode = 1
      this.selectLoading = true
      this.selectDialog = true

      let res = await axios.get(`/api/roles/${this.currentRole.roleCode}/users`, { params: { optional: true } }).catch(e => console.log(e))
      let data = res.data
      this.selectUsers = data.data
      this.selectLoading = false
    },
    deleteUsersToRoleClickHandler () {
      this.selectUsers = Object.assign([], this.userDataTableValues)
      this.selectedUsers = []
      this.selectMode = 2
      this.selectLoading = false
      this.selectDialog = true
    },
    usersSelectionChangeHandler (selection) {
      this.selectedUsers = selection
    },
    async selectConfirmClickHandler () {
      this.confirmLoading = true

      let deleteUsers = async () => {
        let ids = this.selectedUsers.map(val => val.userName)

        let usernames = ids.join(',')
        let res = await axios
          .delete(`/api/roles/${this.currentRole.roleCode}/users`, { params: { usernames: usernames } })
          .catch(e => console.log(e))
        res = res.data
        if (res.status !== 1) {
          return res
        }
        this.userDataTableValues = this.userDataTableValues.filter(val => {
          return !ids.includes(val.userName)
        })
        return res
      }

      let addUsers = async () => {
        let ids = this.selectedUsers.map(val => val.userName)

        let usernames = ids.join(',')
        let res = await axios.put(`/api/roles/${this.currentRole.roleCode}/users`, { usernames }).catch(e => console.log(e))
        res = res.data
        if (res.status !== 1) {
          return res
        }

        this.userDataTableValues = [...this.userDataTableValues, ...this.selectedUsers]

        return res
      }

      let handler = this.selectMode === 1 ? addUsers : deleteUsers

      try {
        var res = await handler()
      } catch (e) {
        this.confirmLoading = false
        util.showErrorNotification(e)
        return
      }
      this.confirmLoading = false
      this.selectDialog = false

      util.showNotification(res)
    }
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
