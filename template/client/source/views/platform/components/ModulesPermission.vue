<template>
  <div>
    <el-toolbar>
      <tree-select width="215" site top :value.sync="currentSiteID" :items="siteListTreeData"></tree-select>
      <el-select style="width:20%;padding-right: 20px;padding-left: 20px;" :value.sync="mType" v-model="mType" placeholder="请选择功能组件">
        <el-option v-for="(value,key) in moduleTypes" :key="key" :label="value" :value="key">
        </el-option>
      </el-select>
      <el-button :loading="saveLoading" @click="saveClickHandler" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"><i class="fa fa-save"></i>保存</el-button>
      <el-button @click="selectedAllHandler" :loading="selectAllLoading"><i class="fa fa-check-square"></i>全选</el-button>
      <el-col :span="6" class="search-box-r tool-search-box-r">
        <el-input v-model="keyword" @change="searchHandler" placeholder="请输入关键字" class="search-bar-algin-toolbar"></el-input>
        <span class="search-icon"><i class="fa fa-search" @click="searchHandler" title="查询"></i></span>
      </el-col>
    </el-toolbar>
    <div v-loading="dataLoading">
      <tree-grid-permission ref="treegrid" v-model="permissions" :columns="columns" ></tree-grid-permission >
    </div>
  </div>
</template>
<script>
  import util from '../../../common/util'
  import translate from '../../../common/dataTranslate.js'
  import TreeSelect from '../../../components/TreeSelect.vue'
  import TreeGridPermission from './TreeGridPermission.vue'
  export default {
    data() {
      return {
        selectAllLoading:false,
        permissions: [],
        permissionsBak: [],
        columns: [],
        keyword: '',
        mType: '',
        moduleTypes: {},
        dataLoading: true,
        saveLoading: false,
        currentSiteID: this.$root.siteID,
        siteListTreeData: [], //站点列表树数据
        isAllChecked: false,
      }
    },
    computed: {},
    methods: {
      searchHandler() {
        this.getData()
      },
      selectedAllHandler() {
        this.selectAllLoading = true
        this.$refs.treegrid.selectedAllHandler()
        setTimeout(()=>{
          this.selectAllLoading = false
        },1000)
      },
      async saveClickHandler() {
        this.saveLoading = true
        let updatedPermissions={}
        this.permissionsBak.forEach((permissionBak,index)=>{
          let permission=this.permissions[index]
          this.columns.forEach((column,colIndex)=>{
            if(permissionBak[column.dataIndex].value!=permission[column.dataIndex].value&&!permissionBak[column.dataIndex].disabled){
              if(colIndex==0){
                 updatedPermissions[column.dataIndex  + permission.ID] = permission[column.dataIndex].value ? 1 : 0
              }else{
                 updatedPermissions[column.dataIndex + '.' + permission.ID] = permission[column.dataIndex].value ? 1 : 0
              }
            }
          })
        })
        try {
          let res = await axios.put(`/modulespriv/id/${this.id}/type/${this.type}/modulespriv`, { data: updatedPermissions })
          util.showMessage(res)
          this.permissionsBak=JSON.parse(JSON.stringify(this.permissions))
          this.saveLoading = false
        } catch (e) {
          util.showErrorNotification(e)
          this.saveLoading = false
          return
        }

      },
      async getData() {
        if (this.id) {
          this.dataLoading = true
          if(this.currentSiteID&&this.siteListTreeData&&this.siteListTreeData.length>0){
            this.columns=[]
            let resModelTypes = await axios.get(`/modulespriv/id/${this.id}/type/${this.type}/privtype`);
            this.moduleTypes = resModelTypes.data.data
            if (!this.mType) {
              for (let moduleType in this.moduleTypes) {
                this.mType = moduleType
                break
              }
            }
            let datas = await Promise.all([
              axios.get(`/modulespriv/id/all/type/${this.type}/modulesprivcolumns`, { params: { 'mType': this.mType } }),
              axios.get(`/modulespriv/id/${this.id}/type/${this.type}/modulesprivs`, { params: { 'siteID': this.currentSiteID, 'mType': this.mType, 'keyword': encodeURIComponent(encodeURIComponent(this.keyword)) } })
            ])
            let resp = datas[0]
            this.columns = resp.data.data
            this.columns[0].width = 250;
            if(this.mType === 'MessageBoard'){
              this.columns[5].width = 130
            }
            let res = datas[1]
            if (res.data.data.length > 0) {
              this.permissions = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
              this.permissions.forEach(val=>{
                  val.children=[]
              })
              this.permissionsBak = JSON.parse(JSON.stringify(this.permissions))
            } else {
              this.permissions = []
              this.permissionsBak = []
            }
          }
          this.dataLoading = false
        }
      }
    },
    watch: {
      id: function (value) {
        if (value) {
          this.currentSiteID = this.$root.siteID
          this.moduleTypes = {}
          this.mType = ''
          this.updatedPermissions = {}
          this.getData()
        } else {
          this.permissions = []
        }
      },
      async currentSiteID(val, oldVal) {
        this.currentSiteID = val
        this.moduleTypes = {}
        this.mType = ''
        this.updatedPermissions = {}
        this.getData()
      },
      async mType(val, oldVal) {
        this.mType = val
        this.updatedPermissions = {}
        this.getData()
      }
    },
    async created() {
      let siteRes = await axios.get(`/sitepriv/id/${this.id}/type/${this.type}`)
      this.siteListTreeData = siteRes.data.data
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
      'tree-select': TreeSelect,
      'tree-grid-permission': TreeGridPermission
    }
  }
</script>
