<template>
  <div class="right-list-toolbar right-list-panel-card">
    <el-toolbar>
      <el-button :loading="handlerLoading" @click="saveClickHandler" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"><i class="fa fa-floppy-o"></i>保存</el-button>
      <el-button @click="selectAllClickHandler" :loading="selectAllLoading"><i class="fa fa-check-square" ></i>全选</el-button>
    </el-toolbar>
    <div v-loading="dataLoading" class="padding-top-bottom-intab scroll panel-card margin0">
      <tree-permission v-model="permission" :permissions="permissionTree" :props="defaultProps"></tree-permission>
    </div>
  </div>
</template>

<script>
import TreePermission from './TreePermission.vue'
import util from '../../../common/util.js'
export default {
  data () {
    return {
      selectAllLoading: false,
      permission: [],
      permissionBak: [],
      permissionTree: [],
      dataLoading: true,
      defaultProps: {
        children: 'children',
        label: 'name',
        permission: 'items'
      },
      handlerLoading: false
    }
  },
  methods: {
    async getData () {
      if (this.id) {
        this.dataLoading = true
        let res = await axios.get(`/api/permissions/id/${this.id}/type/${this.type}/menus`)
        this.permissionBak = Object.assign([], res.data.data.value)
        this.permission = res.data.data.value
        this.permissionTree = res.data.data.tree
        this.dataLoading = false
      }
    },
    selectAllClickHandler () {
      this.selectAllLoading = true
      let handle = (tree, flag) => {
        let result = []
        let disabledResult = []
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].code) {
            result.push(tree[i].code)
            if (tree[i].disabled && !flag) {
              this.permissionBak.forEach(val => {
                if (val == tree[i].code) {
                  disabledResult.push(tree[i].code)
                }
              })
            }
          }
          if (tree[i].items && tree[i].items.length > 0) {
            tree[i].items.forEach(val => {
              result.push(val.code)
              if (val.disabled && !flag) {
                this.permissionBak.forEach(code => {
                  if (code == val.code) {
                    disabledResult.push(val.code)
                  }
                })
              }
            })
          }
          if (tree[i].children && tree[i].children.length > 0) {
            if (flag) {
              let tmp = handle(tree[i].children, true)
              result = result.concat(tmp)
            } else {
              let tmp = handle(tree[i].children, false)
              disabledResult = disabledResult.concat(tmp)
            }
          }
        }
        if (flag) {
          return result
        } else {
          return disabledResult
        }
      }
      let allPermissions = handle(this.permissionTree, true)
      if (!!this.permission && !!this.permission.length && this.permission.length == allPermissions.length) {
        allPermissions = []
      }
      allPermissions = allPermissions.concat(handle(this.permissionTree, false))
      this.permission = _.uniq(allPermissions)
      setTimeout(() => { this.selectAllLoading = false }, 1000)
    },
    async saveClickHandler () {
      this.handlerLoading = true
      try {
        let priv = {}
        this.permissionBak.filter(p => this.permission.indexOf(p) == -1).forEach(p => (priv[p] = 0))
        this.permission.filter(p => this.permissionBak.indexOf(p) == -1).forEach(p => (priv[p] = 1))
        let res = await axios.put(`/api/permissions/id/${this.id}/type/${this.type}/menus`, { data: priv })
        res.data && util.showResponseMessage(res.data)
        this.handlerLoading = false
      } catch (e) {
        util.showErrorNotification(e)
        this.handlerLoading = false
      }
    }
  },
  watch: {
    id: function (value, oldValue) {
      if (value) {
        this.getData()
      } else {
        this.permission = []
        this.permissionTree = []
      }
    }
  },
  created () {
    this.getData()
  },
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      required: true
    }
  },
  components: {
    'tree-permission': TreePermission
  }
}
</script>
