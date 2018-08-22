<template>
  <div>
    <el-dialog title="选择角色" :visible.sync="roleSelectDialog" @open="dialogOpen" class="role-select-dialog">
      <el-table :data="roleSelectTable" ref="datatable" data-read-url="/api/roles/roledatabind" tooltip-effect="dark" @selection-change="onRoleSelectSelectionChange">
        <el-table-column width="55" align="center" type="index"></el-table-column>
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="roleName" show-overflow-tooltip min-width="50%" label="名称"></el-table-column>
        <el-table-column prop="roleCode" show-overflow-tooltip min-width="50%" label="代码"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRoleSelectClick" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleSelectTable: [],
      selectedRows: [],
      openTimes:0,
    }
  },
  computed: {
    roleSelectDialog: {
      get() {
        return this.roleSelectShow
      },
      set(val) {
        this.$emit('update:roleSelectShow', val)
      },
    },
  },
  watch:{
    roleSelectTable(){
      if (this.roleSelectShow) {
        let list = this.roleCodes.split(',')
        for (let i = 0; i < list.length; i++) {
          this.roleSelectTable.forEach(row => {
            if (row.roleCode === list[i]) {
              this.$refs.datatable.toggleRowSelection(row)
            }
          })
        }
      }
    }
  },
  methods: {
    //选择角色列表数据
    async dialogOpen() {
      if(this.openTimes > 0){
        this.$refs.datatable.getData()
      }
      this.openTimes += 1
    },
    //当前行
    onRoleSelectSelectionChange(selection) {
      this.selectedRows = selection
    },
    //确定点击
    confirmRoleSelectClick() {
      let roleCodes = []
      this.selectedRows.forEach(row => {
        roleCodes.push(row.roleCode)
      })
      this.$emit('callback', roleCodes.join(','))
      this.roleSelectDialog = false
    },
  },
  props: ['roleSelectShow', 'roleCodes'],
}
</script>
<style>
/* 在一般情况下dialog宽为450像素，在逻辑分辨率480像素以下dialog宽为96% */
.role-select-dialog .el-dialog {
  width: 500px;
}
@media (max-width: 480px) {
  .role-select-dialog .el-dialog {
    width: 96%;
  }
}
</style>

<style scoped>
.page {
  float: right;
}
</style>
