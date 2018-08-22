<template>
  <div class="layout-no-cols">
    <div class="layout-content-padding scroll">
      <el-form v-if="!isAgent && !isEntrust" label-width="80px">
        <el-form-item label="所属机构" prop="branchInnerCode">
          <el-row :gutter="20">
          <el-col :span="8">
            <tree-select :value.sync="branchInnerCode" :items="branches" :itemsOptions="treeItemsOptions" :clearable="true" placeholder="请选择所属机构">
            </tree-select>
          </el-col>
          <el-col :span="8">
            <el-input type="text" v-model="userName" auto-complete="off" placeholder="用户名"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="commitSearch">搜索</el-button>
          </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" ref="userTable" :data="users" stripe tooltip-effect="dark" style="width: 100%" :data-read-url="getUsersURL" :page-size="10" :auto-get-data="false">
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column label="所属机构">
          <template slot-scope="scope">
            <span v-if="isAgent || isEntrust">\{{scope.row.branchName}}</span>
            <span v-else>\{{scope.row.branch && scope.row.branch.name ? scope.row.branch.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAgent" @click="changeLoginUserHandler(scope.row.userName)" type="text" size="small" class="entrust-text">切换用户</el-button>
            <el-button v-else-if="isEntrust" @click="cancelEntrustUser(scope.row.userName)" type="text" size="small" class="entrust-text">取消委托</el-button>
            <el-button v-else @click="addEntrustUser(scope.row.userName)" type="text" size="small" class="entrust-text">委托</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import TreeSelect from '../../../components/TreeSelect.vue';
import util from '../../../common/util.js';
export default {
  data() {
    return {
      branchInnerCode: '',
      userName: '',
      branches: [],
      treeItemsOptions: {
        children: 'children',
        label: 'name',
        key: 'branchInnerCode',
      },
      users: [],
      isAgent: false,
      isEntrust: false,
      loading: true
    };
  },
  components: {
    'tree-select': TreeSelect,
  },
  methods: {
    commitSearch() {
      this.$refs.userTable.getData();
    },
    getUsersURL() {
      if (this.isAgent) {
        return ['/api/application/entrustusers', {}];
      } else {
        if (this.isEntrust) {
          return ['/api/application/agentusers', {}];
        } else {
          return [
            '/api/users',
            {
              params: {
                pageSize: 10,
                userName: this.userName,
                branchInnerCode: this.branchInnerCode,
              },
            },
          ];
        }
      }
    },
    async initEntrust() {
      let data = await axios.get('/api/application/entrustinit').then(res => res.data);
      this.isAgent = data.agent ? data.agent : false;
      this.isEntrust = data.entrust ? data.entrust : false;
    },
    async addEntrustUser(userName) {
      let data = await axios.put('/api/application/addentrust', { userName: userName }).then(res => res.data)
      if (data.status === 1) {
        util.showSuccess(data.message);
        this.loadEntrustListData();
      } else {
        util.showErrorMessageBox(data.message);
      }
    },
    async cancelEntrustUser() {
      let data = await axios.put('/api/application/cancelentrust').then(res => res.data);
      if (data.status === 1) {
        util.showSuccess(data.message);
        this.loadEntrustListData();
      } else {
        util.showErrorMessageBox(data.message);
      }
    },
    async changeLoginUserHandler(userName) {
      let data = await axios.get(`/api/changeaccount?userName=${userName}`).then(res => res.data)
      if (data.status === 1) {
        window.location = 'index.html';
      } else {
        util.showErrorMessageBox(data.message);
      }
    },
    async loadEntrustListData() {
      let branchData = await axios.get('/api/branches').then(res => res.data);
      this.branches = branchData.data;
      await this.initEntrust();
      await this.$refs.userTable.getData();
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.el-tab-pane .layout-content-padding.scroll,
.layout-content-padding-intab.scroll {
  height: 100%;
}
.entrust-text {
  padding-left: 0px;
}
</style>
