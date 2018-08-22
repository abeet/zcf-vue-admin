<template>
  <div class="right-list-toolbar right-list-panel-card">
    <el-toolbar>
      <el-button :loading="saveLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="saveClickHandler"><i class="fa fa-floppy-o"></i>保存</el-button>
      <el-button @click="selectedAllHandler"><i class="fa fa-check-square"></i>全选</el-button>
      <el-col :span="8" class="search-box-r tool-search-box-r">
        <el-input v-model="search" placeholder="请输入站点名" class="search-bar-algin-toolbar" @keyup.enter.native="searchHandler"></el-input>
        <span class="search-icon"><i class="fa fa-search" @click="searchHandler" title="查询"></i></span>
      </el-col>
    </el-toolbar>
    <div>
      <div class="padding-top-bottom-intab scroll">
        <div v-loading="dataLoading">
          <tree-grid-permission ref="treegrid" v-model="permissions" :columns="columns" ></tree-grid-permission >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../../common/util'
  import translate from '../../../common/dataTranslate.js'
  import TreeGridPermission from './TreeGridPermission.vue'

  export default {
    data() {
      return {
        permissions: [],
        permissionsBak: [],
        columns: [
          {
            text: '站点名称',
            dataIndex: 'com.zving.cms.Site.',
            width: '',
            key: 'com.zving.cms.Site'
          }
        ],
        search: '',
        dataLoading: true,
        saveLoading: false,
        isAllChecked: false,
        tableHeight: 0
      }
    },
    computed: {},
    methods: {
      searchHandler() {
        this.getData()
      },
      selectedAllHandler() {
        this.$refs.treegrid.selectedAllHandler()
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
          let res = await axios.put(`/sitepriv/id/${this.id}/type/${this.type}/privs`, { data: updatedPermissions })
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
          this.dataLoading = true
          try{
            let datas=await Promise.all([
              axios.get(`/sitepriv/id/all/type/${this.type}/columns`),
              axios.get(`/sitepriv/id/${this.id}/type/${this.type}/privs`, { params: { name: encodeURIComponent(encodeURIComponent(this.search)) } })
            ])
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
            this.columns = [...this.columns.slice(0, 1), ...datas[0].data.data]
            //定义各列的宽度，使得文字显示比较完整
            let columnsWidth = [250, 70, 100, 100, 70, 70, 120, 70, 100, 120,150];
            columnsWidth.forEach((val, index) => {
              this.columns[index].width = val;
            })
          }catch(e){
            console.error(e.toString())
          }
          this.dataLoading = false
        }
      }
    },
    watch: {
      id: function (value) {
        if (value) {
          this.updatedPermissions = {}
          this.getData()
        } else {
          this.permissions = []
        }
      }
    },
    created() {
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
       'tree-grid-permission': TreeGridPermission
    },
    mounted () {
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.tableHeight = windowHeight * 0.7 - 180
    }
  }
</script>

<style scoped>
  .search-wrap {
    padding: 10px 0;
    text-align: right;
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
