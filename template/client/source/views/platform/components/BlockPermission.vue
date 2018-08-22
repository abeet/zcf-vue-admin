<template>
  <div>
    <el-toolbar>
      <tree-select class="prv-site-selector" width="215" site top :value.sync="currentSiteID" :items="siteListTreeData"></tree-select>
      <el-button style="padding-left: 20px;" :loading="saveLoading" @click="saveClickHandler" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"><i class="fa fa-floppy-o"></i>保存</el-button>
      <el-button @click="selectedAllHandler" :loading="selectAllLoading"><i class="fa fa-check-square"></i>全选</el-button>
    </el-toolbar>
    <div v-loading="dataLoading" class="padding-top-bottom-intab scroll">
          <tree-grid-permission ref="treegrid" v-model="permissions" :columns="columns" ></tree-grid-permission >
    </div>
  </div>
</template>

<script>
  import util from '../../../common/util.js'
  import TreeSelect from '../../../components/TreeSelect.vue'
  import TreeGridPermission from './TreeGridPermission.vue'
  import translate from '../../../common/dataTranslate.js'

  export default {
    data() {
      return {
        selectAllLoading:false,
        permissions: [],
        permissionsBak: [],
        oldColumns: [
          {
            text: '区块',
            dataIndex: 'com.zving.cms.Block.',
            width: 150,
            key: 'com.zving.cms.Block'
          },
          {
            text: '栏目',
            dataIndex: 'catalogName',
            width: 150,
            key: 'com.zving.cms.Catalog',
            noCheckBox: true
          }
        ],
        columns:[],
        dataLoading: true,
        saveLoading: false,
        currentSiteID: this.$root.siteID,
        siteListTreeData: [], //站点列表树数据
        isAllChecked: false,
        tableHeight: 0
      }
    },
    computed: {

    },
    methods: {
      async saveClickHandler() {
        this.saveLoading = true
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
          let res = await axios.put(`/blockpriv/id/${this.id}/type/${this.type}/privs`, { data: updatedPermissions })
          util.showMessage(res)
          this.saveLoading = false
        } catch (e) {
          util.showErrorNotification(e)
          this.saveLoading = false
          return
        }
      },
      async getData() {
        if (this.id) {
          this.dataLoading=true
          if(this.currentSiteID&&this.siteListTreeData&&this.siteListTreeData.length>0){
            let datas=await Promise.all([
              axios.get(`/blockpriv/id/all/type/${this.type}/columns`),
              axios.get(`/blockpriv/id/${this.id}/type/${this.type}/privs`, { params: { 'siteID': this.currentSiteID } })
            ])
            this.dataLoading = true
            let res = datas[1]
          if (res.data.data.length > 0) {
              this.permissions = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
              this.permissionsBak = JSON.parse(JSON.stringify(this.permissions))
            } else {
              this.permissions = []
              this.permissionsBak = []
            }
            let resp = datas[0]
            this.columns = [...this.oldColumns.slice(0, 2), ...resp.data.data]
          }
          this.dataLoading = false
        }
      },
      selectedAllHandler() {
        this.selectAllLoading = true
        this.$refs.treegrid.selectedAllHandler()
        setTimeout(()=>{           this.selectAllLoading = false         },1000)
      }
    },
    watch: {
      id: function (value) {
        if (value) {
          this.getData()
        } else {
          this.permissions = []
        }
      },
      async currentSiteID(val, oldVal) {
        this.currentSiteID = val
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
    },
    mounted () {
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.tableHeight = windowHeight * 0.7 - 160
    }
  }
</script>
