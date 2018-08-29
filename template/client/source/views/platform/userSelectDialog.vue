<template>
    <el-dialog title="选择用户" :visible.sync="userSelectDialog" @open="dialogOpen" class="user-select-dialog">
       <el-row>
          <el-col :span="11">
            <div class="selected-content">
              <div class="search-bar fr">
                <tree-select class="select-jg" :value.sync="branchInnerCode" clearable :items="roleBranchTree" :itemsOptions="treeItemsOptions" width="150" placeholder="所属机构">
                </tree-select>
                <el-input v-model="searchName" placeholder="请输入用户名或姓名" class="input-name">
                  <el-button  @click="searchAllUserSelectClick" slot="append">搜索</el-button>
                </el-input>
              </div>
              <el-table class="table-content" :data="allUserSelectTable" tooltip-effect="dark" :data-read-url="getAllUserURL" :page-size="10" ref="allUserTable" pagination-layout="total,sizes,->,prev,next" highlight-current-row @selection-change="allUserSelectChange" @row-dblclick="addUserClick">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="userName" show-overflow-tooltip min-width="20%" label="用户名"></el-table-column>
                <el-table-column prop="realName" show-overflow-tooltip min-width="25%" label="真实姓名"></el-table-column>
                <el-table-column prop="branchName" show-overflow-tooltip min-width="25%" label="所属机构"></el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="2">
            <div style="margin-top:190px; text-align:center;">
              <el-button @click="addUserClick(0)" :disabled="selectedAllUserRows.length === 0">&nbsp;<i class="fa fa-angle-double-right"></i></el-button><br/><br/>
              <el-button @click="removeUserClick(0)" :disabled="selectedUserRows.length === 0">&nbsp;<i class="fa fa-angle-double-left"></i></el-button>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="selected-content">
              <div class="search-bar">
                <span class="ft">已选中用户列表</span>
              </div>
              <el-table class="table-content" :data="userSelectTable" tooltip-effect="dark" :data-read-url="getSelectedUserURL" ref="selectedUserTable" highlight-current-row @selection-change="userSelectChange" @row-dblclick="removeUserClick">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="userName" show-overflow-tooltip min-width="20%" label="用户名"></el-table-column>
                <el-table-column prop="realName" show-overflow-tooltip min-width="25%" label="真实姓名"></el-table-column>
                <el-table-column prop="branchName" show-overflow-tooltip min-width="25%" label="所属机构"></el-table-column>
              </el-table>
            </div>
          </el-col>
       </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUserSelectClick">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import TreeSelect from '../../components/TreeSelect.vue'
export default {
  data () {
    return {
      branchInnerCode: 0,
      roleBranchTree: [],
      treeItemsOptions: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode'
      },
      searchName: '',
      allUserSelectTable: [],
      userSelectTable: [],
      selectedAllUserRows: [],
      users: [], // 短消息-新建-接收人-用户去重
      selectedUsers: [], // 短消息-新建-接收人-处理后的用户
      selectedUserRows: [],
      openTimes: 0
    }
  },
  computed: {
    userSelectDialog: {
      get () {
        return this.userSelectShow
      },
      set (val) {
        this.$emit('update:userSelectShow', val)
      }
    }
  },
  components: {
    'tree-select': TreeSelect
  },
  methods: {
    dialogOpen () {
      this.searchName = ''
      this.selectedUsers = this.toUsers.split(',')
      this.userSelectTable = []
      this.getBranchDatas()
      if (this.openTimes > 0) {
        this.getAllUserSelectDatas()
        this.getUserSelectDatas()
      }
      this.openTimes += 1
    },
    async getBranchDatas () {
      let res = await axios.get('/api/branches/branchtree')
      this.roleBranchTree = res.data.data
    },
    getAllUserURL () {
      return [
        '/api/userselector/alluserdatabind', {
          params: {
            selectedUsers: this.selectedUsers.join(','),
            searchContent: this.searchName,
            branchInnerCode: this.branchInnerCode
          }
        }]
    },
    // 所有用户数据
    getAllUserSelectDatas () {
      this.$refs.allUserTable.getData()
    },
    // 选中行
    allUserSelectChange (selection) {
      this.selectedAllUserRows = selection
    },
    // 已选用户列表选中行
    userSelectChange (selection) {
      this.selectedUserRows = selection
    },
    // 所有用户搜索
    searchAllUserSelectClick () {
      this.getAllUserSelectDatas()
    },
    // 添加到已选用户列表
    addUserClick (row) {
      if (row) {
        this.selectedUsers.push(row.userName)
      } else {
        this.selectedAllUserRows.forEach(o => {
          this.selectedUsers.push(o.userName)
        })
      }
      this.getAllUserSelectDatas()
      this.getUserSelectDatas()
    },
    removeUserClick (row) {
      if (row) {
        let index = this.selectedUsers.findIndex(val => val === row.userName)
        this.selectedUsers.splice(index, 1)
      } else {
        this.selectedUserRows.forEach(o => {
          let index = this.selectedUsers.findIndex(val => val === o.userName)
          this.selectedUsers.splice(index, 1)
        })
      }
      this.getAllUserSelectDatas()
      this.getUserSelectDatas()
    },
    getSelectedUserURL () {
      return [
        '/api/userselector/selecteduserdatabind', {
          params: {
            selectedUsers: this.selectedUsers.join(',')
          }
        }
      ]
    },
    // 已选用户列表数据
    getUserSelectDatas () {
      this.$refs.selectedUserTable.getData()
    },
    // 选择用户确定
    confirmUserSelectClick () {
      let users = []
      this.userSelectTable.forEach(row => {
        users.push(row.userName)
      })
      this.$emit('callback', users.join(','))
      this.userSelectDialog = false
    }
  },
  props: ['userSelectShow', 'toUsers']
}
</script>

<style scoped>
.search-bar {
  padding: 5px 1px;
}
.select-wrap {
  width: 118px;
  float: left;
}
.input-name {
  width: 200px;
  padding-left: 2px;
  padding-right: 2px;
}
.ft {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
  color: #1f2d3d;
}
.selected-content {
  padding: 4px;
}
.el-pagination {
  padding: 2px 0px;
}
.table-content{
  font-size:12px;
}
</style>
<style>
.table-content .cell,
.table-content th > div {
  padding-left: 16px;
  padding-right: 16px;
}
/* 在一般情况下dialog宽为450像素，在逻辑分辨率480像素以下dialog宽为96% */
.user-select-dialog .el-dialog {
  min-width: 850px;
}
@media (max-width: 480px) {
  .user-select-dialog .el-dialog {
    width: 96%;
  }
}
</style>
