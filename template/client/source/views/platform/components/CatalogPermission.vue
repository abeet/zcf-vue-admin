<template>
  <div class="right-list-toolbar right-list-panel-card">
    <el-toolbar>
      <tree-select class="prv-site-selector" width="215" site top :value.sync="currentSiteID" :items="siteListTreeData"></tree-select>
      &nbsp;&nbsp;&nbsp;&nbsp;维度：<el-select placeholder="维度视图" style="width:155px;padding-right: 20px;" v-model="dimensionID" @change="changeClickHandler">
        <el-option v-for="dimension in dimensions" :key="dimension.ID" :label="dimension.name" :value="dimension.ID">
        </el-option>
      </el-select>
      <el-button :loading="saveLoading" @click="saveClickHandler" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"><i class="fa fa-save"></i>保存</el-button>
      <el-button @click="selectedAllHandler" :loading="selectAllLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"><i class="fa fa-check-square"></i>全选</el-button>
      <el-button icon="plus" :loading="applyLoading" @click="applyToChildCatalog"
        priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange">应用到子栏目</el-button>
      <el-button icon="refresh" @click="refreshCatalogs">刷新栏目列表</el-button>
      <el-button icon="back" v-show="showBack" @click="backLevel">返回</el-button>
    </el-toolbar>
    <div v-loading="dataLoading" class="padding-top-bottom-intab scroll">
      <tree-grid-permission ref="treegrid" v-on:load-children="loadChildren" v-model="permissions" :columns="columns" ></tree-grid-permission >
    </div>
  </div>
</template>

<style scoped>
  .catalog-link {
    color: #08d
  }

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: '';
  }
</style>

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
        search: '',
        dataLoading: true,
        saveLoading: false,
        applyLoading: false,
        currentCatalogID: 0,
        currentParentCatalogID: 0,
        showBack: false,
        currentSiteID: this.$root.siteID,
        siteListTreeData: [], //站点列表树数据
        isAllChecked: false,
        tableHeight: 0,
        dimensionID: 1,
        dimensions: [{ID:1,code:'default',name:'默认分类'}]
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
        setTimeout(()=>{           this.selectAllLoading = false         },1000)
      },
      changeClickHandler(value) {
        this.dimensionID = value
        this.getData()
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
          let res = await axios.put(`/catalogpriv/id/${this.id}/type/${this.type}/catalogprivs`, { data: updatedPermissions })
          util.showMessage(res)
          this.saveLoading = false
        } catch (e) {
          util.showErrorNotification(e)
          this.saveLoading = false
          return
        }

      },
      async applyToChildCatalog() {
        this.applyLoading = true
        let parentPrivMap = {}
        let updatedPermissions={}
        this.permissions.forEach((val,permissionIndex) => {
          let permissionBak=this.permissionsBak[permissionIndex]
          this.columns.forEach((col, index) => {
            if (!val[col.dataIndex].disabled) {
              if (index == 0) {
                parentPrivMap[col.dataIndex + val.ID] = val[col.dataIndex].value ? 1 : 0
              } else {
                parentPrivMap[col.dataIndex + '.' + val.ID] = val[col.dataIndex].value ? 1 : 0
              }
            }
            if(permissionBak[col.dataIndex].value!=val[col.dataIndex].value&&!permissionBak[col.dataIndex].disabled){
              if(index==0){
                 updatedPermissions[col.dataIndex  + val.ID] = val[col.dataIndex].value ? 1 : 0
              }else{
                 updatedPermissions[col.dataIndex + '.' + val.ID] = val[col.dataIndex].value ? 1 : 0
              }
            }
          })
        })
        let privPrefix = this.columns[0].dataIndex
        try {
          let res = await axios.put(`/catalogpriv/id/${this.id}/type/${this.type}/applytochild`, { data: { 'parentPrivMap': parentPrivMap, 'privPrefix': privPrefix, 'privMap': updatedPermissions } })
          util.showMessage(res)
          this.applyLoading = false
        } catch (e) {
          util.showErrorNotification(e)
          this.applyLoading = false
          return
        }
      },
      async getData() {
        if (this.id) {
          this.dataLoading = true
          if(this.currentSiteID&&this.siteListTreeData&&this.siteListTreeData.length>0){
            let datas=await Promise.all([
              axios.get(`/catalogpriv/id/all/type/${this.type}/catalogcolumns`),
              axios.get(`/catalogpriv/id/${this.id}/type/${this.type}/catalogprivs`, { params: { 'siteID': this.currentSiteID, 'catalogID': this.currentCatalogID,dimensionID:this.dimensionID } })
            ])
            let res = datas[1]
            if (res.data.data.length > 0) {
              this.permissions = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
              this.permissions.forEach((val, index) => {
                val.children=[]
                if (this.currentCatalogID != 0 && val.ID == this.currentCatalogID) {
                  this.currentParentCatalogID = val.parentID
                }
              })
              this.permissionsBak = JSON.parse(JSON.stringify(this.permissions))
            }else{
              this.permissions = []
              this.permissionsBak = []
            }
            let resp = datas[0]
            this.columns = [...this.columns.slice(0, 1), ...resp.data.data]
            //定义各列的宽度，使得文字显示比较完整
            let columnsWidth = [180, 70, 70, 70, 70, 70, 120, 100, 70, 100, 100, 100, 120];
            columnsWidth.forEach((val, index) => {
              this.columns[index]['width'] = val;
            })
          }
          this.dataLoading = false
        }
      },
      loadChildren(row) {
        this.currentCatalogID = row.ID
        this.currentParentCatalogID = row.parentID
        this.showBack = true
        this.getData()
      },
      refreshCatalogs() {
        this.currentCatalogID = 0
        this.currentParentCatalogID = 0
        this.updatedPermissions = {};
        this.getData()
      },
      backLevel() {
        this.currentCatalogID = this.currentParentCatalogID
        if (this.currentCatalogID == 0) {
          this.showBack = false
          this.refreshCatalogs();
        } else {
          this.getData()
        }
      },
      async getDimensions(){
        let res = await axios.get('/api/dimensions',{params:{siteID:this.currentSiteID}})
        this.dimensions = res.data.data
        this.dimensionID = res.data.data[0].ID || 1
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
        await this.getDimensions()
        await this.getData()
      }
    },
    async created() {
      let siteRes = await axios.get(`/sitepriv/id/${this.id}/type/${this.type}`)
      this.siteListTreeData = siteRes.data.data
      await this.getDimensions()
      await this.getData()
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
