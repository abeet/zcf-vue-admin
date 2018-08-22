<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="addClick" priv="Platform.Branch.Add" theme="flat">添加</el-button>
      <el-button icon="edit" :disabled="selectedRows.length !== 1" @click="editClick" priv="Platform.Branch.Edit">编辑</el-button>
      <el-button icon="delete" :disabled="selectedRows.length === 0" @click="deleteClick" priv="Platform.Branch.Delete">删除</el-button>
      <el-button icon="document" :disabled="selectedRows.length !== 1" @click="setPermissionsClick" priv="Platform.Branch.SetPrivRange">设置权限范围</el-button>
    </el-toolbar>

    <div class="layout-content-padding" v-loading="dataLoading">
      <tree-grid :columns="columns" :tree-structure="true" :data-source="branch" @selection-change="onSelectionChange" @row-dblclick="editClick">
      </tree-grid>
    </div>

    <!--添加编辑框-->
    <el-dialog :title="editMode === 1 ? '添加新机构' : '编辑机构'" :visible.sync="branchModal">
      <el-form :model="tmpBranch" :rules="branchRules" ref="branchForm" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="tmpBranch.name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="branchCode">
          <el-input v-model="tmpBranch.branchCode"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentInnerCode">
          <tree-select :value.sync="tmpBranch.parentInnerCode" :clearable="true" :items="branch" :itemsOptions="treeItemsOptions" :disabled="editMode === 2" placeholder="请选择">
          </tree-select>
        </el-form-item>
        <el-form-item label="机构主管">
          <el-select v-model="tmpBranch.managerselected" :multiple="true" placeholder="请机构主管" class="manager-select">
            <el-option v-for="item in users" :key="item.userName" :label="item.realName" :value="item.userName">
              <span class="manager-select-item-left">\{{ item.userName }}</span>
              <span class="manager-select-item-right">\{{ item.realName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="tmpBranch.phone"></el-input>
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="tmpBranch.fax"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="branchModal = false">取 消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="okHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!--设置权限范围框-->
    <el-dialog title="设置权限范围" :visible.sync="permissionModal">
      <el-tabs v-model="currentTab" class="tabs-wrap" value="menuPermission">
        <el-tab-pane :label="type.name" :name="type.code" v-for="(type,index) in branchPermissionTypes" :key="type.code">
          <div class="pane-wrap">
            <component  v-if="index==0||currentTab==type.code" :is="type.code" :refresh="editBranchModal" :id="tmpBranch.branchInnerCode" :type="privType"></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import TreeGrid from '../../components/TreeGrid.vue'
import TreeSelect from '../../components/TreeSelect.vue'
import MenuPermission from './components/MenuPermission.vue'
import SitePermission from './components/SitePermission.vue'
import APIPermission from './components/APIPermission.vue'
import CatalogPermission from './components/CatalogPermission.vue'
import DocPermission from './components/DocPermission.vue'
import ModulesPermission from './components/ModulesPermission.vue'
import BlockPermission from './components/BlockPermission.vue'
import util from '../../common/util.js'

const columns = [
  {
    text: '名称',
    dataIndex: 'name'
  },
  {
    text: '编号',
    dataIndex: 'branchCode'
  },
  {
    text: '机构主管',
    render(row) {
      let names = []

      row.managers.forEach(val => {
        names.push(val.realName)
      })

      return names.join('，')
    }
  },
  {
    text: '电话',
    dataIndex: 'phone'
  },
  {
    text: '传真',
    dataIndex: 'fax'
  }
]

export default {
  data() {
    return {
      branchPermissionTypes: [],
      privType: 'B',
      columns,
      branch: [],
      currentTab:'menuPermission',
      dataLoading: true,
      selectedRows: [],
      deleteLoading: false,
      editBranchModal: false,
      tmpBranch: {
        name: '',
        branchCode: '',
        managers: [],
        phone: '',
        fax: '',
        parentInnerCode: '',
        managerselected: []
      },
      branchRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        branchCode: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        parentInnerCode: [
          {
            required: true,
            message: '请选择上级机构',
            trigger: 'blur'
          }
        ]
      },
      branchModal: false,
      confirmLoading: false,
      editMode: 1, // 1： 添加， 2：编辑
      treeItemsOptions: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode'
      },
      users: [],
      permissionModal: false,
      permissionLoading: false,
      permissionSaveLoading: false
    }
  },
  methods: {
    onSelectionChange(selection) {
      this.selectedRows = selection
    },
    async fetchUsers() {
      if (!this.users || !this.users.length) {
        let data = await axios.get(`/api/users`).then(res => res.data)
        this.users = data.data
        this.branchModal = true
      } else {
        this.branchModal = true
      }
    },
    addClick() {
      this.editMode = 1

      this.tmpBranch = {
        name: '',
        branchCode: '',
        managers: [],
        managerselected: [],
        phone: '',
        fax: '',
        parentInnerCode: ''
      }

      this.fetchUsers()
    },
    editClick(row) {
      this.editMode = 2
      this.tmpBranch = Object.assign({}, row.branchCode ? row : this.selectedRows[0], {
        managerselected: []
      })
      this.tmpBranch.managers.forEach(val => {
        this.tmpBranch.managerselected.push(val.userName)
      })
      this.fetchUsers()
    },
    async okHandler() {
      let addForm = async () => {
        this.tmpBranch.manager = this.tmpBranch.managerselected.join(',')
        let data = await axios.post('/api/branches', this.tmpBranch).then(res => res.data)
        if (data.status !== 1) {
          return data
        }

        let branchInnerCode = data.branchInnerCode
        let parent = util.findTreeNode(
          this.branch,
          'branchInnerCode',
          this.tmpBranch.parentInnerCode,
          'children'
        )

        if (!parent.children) {
          parent.children = []
        }

        let managers = this.users.filter(val =>
          this.tmpBranch.managerselected.includes(val.userName)
        )
        this.tmpBranch.managers = Object.assign([], managers)

        parent.children.push({
          branchInnerCode: branchInnerCode,
          name: this.tmpBranch.name,
          branchCode: this.tmpBranch.branchCode,
          managers: this.tmpBranch.managers,
          phone: this.tmpBranch.phone,
          fax: this.tmpBranch.fax,
          parentInnerCode: this.tmpBranch.parentInnerCode
        })
        this.branch = Object.assign([], this.branch)
        return data
      }

      let editForm = async () => {
        let res = await axios.put(`/api/branches/${this.tmpBranch.branchInnerCode}`, {
          name: this.tmpBranch.name,
          branchCode: this.tmpBranch.branchCode,
          manager: this.tmpBranch.managerselected.join(','),
          phone: this.tmpBranch.phone,
          fax: this.tmpBranch.fax,
          branchInnerCode: this.tmpBranch.branchInnerCode,
          parentInnerCode: this.tmpBranch.parentInnerCode
        }).then(res => res.data)
        if (res.status !== 1) {
          return res
        }

        let managers = this.users.filter(val =>
          this.tmpBranch.managerselected.includes(val.userName)
        )
        this.tmpBranch.managers = Object.assign([], managers)

        let node = util.findTreeNode(
          this.branch,
          'branchInnerCode',
          this.tmpBranch.branchInnerCode,
          'children'
        )

        Object.assign(node, {
          name: this.tmpBranch.name,
          branchCode: this.tmpBranch.branchCode,
          managers: this.tmpBranch.managers,
          phone: this.tmpBranch.phone,
          fax: this.tmpBranch.fax
        })

        this.branch = Object.assign([], this.branch)
        return res
      }

      try {
        await util.validateForm(this.$refs['branchForm'])
      } catch (e) {
        util.showErrorNotification(e)
        this.confirmLoading = false
        return
      }
      this.confirmLoading = true
      if (this.editMode === 1) {
        var res = await addForm()
      }
      if (this.editMode === 2) {
        var res = await editForm()
      }

      this.confirmLoading = false
      if (res.status === 1) {
        this.branchModal = false
      }
      util.showNotification(res)
    },
    async deleteClick() {
      let isHasAdmin = this.selectedRows.find(val => val.treeLevel === 1)

      if (isHasAdmin) {
        this.$notify({
          title: '不能删除',
          message: '不能删除，根机构!',
          type: 'warning',
          duration: 2000
        })
        return
      }
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
      let rowIds = []
      this.selectedRows.forEach(function(row) {
        rowIds.push(row.branchInnerCode)
      })
      if (!rowIds.length) {
        return
      }
      let data = await axios.delete('/api/branches/'+ rowIds.join(',')).then(res => res.data)
      this.selectedRows = []
      util.showNotification(data)
      if (data.status === 1) {
        let data = await axios.get('/api/branches').then(res => res.data)
        this.dataLoading = false
        this.branch = data.data
      }
    },
    async setPermissionsClick() {
      this.tmpBranch = Object.assign({}, this.selectedRows[0], {
        managerselected: []
      })
      this.permissionLoading = true
      this.permissionModal = true
      this.editBranchModal = true

    }
  },
  async created() {
    try {
      let datas = await Promise.all([
        axios.get('/api/branches').then(res => res.data),
        axios.get(`/api/permissions/id/none/type/none/types`).then(res => res.data)
      ]);

      this.branch = datas[0].data
      console.log(this.branch)
      this.branchPermissionTypes = datas[1].data
      this.dataLoading = false
    }catch (e) {

    }

  },
  components: {
    'tree-select': TreeSelect,
    'tree-grid': TreeGrid,
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
.pane-wrap {
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
}
.manager-select {
  width: 100%;
}
.manager-select-item-left {
  float: left;
}
.manager-select-item-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
  margin-right: 32px;
}
</style>
