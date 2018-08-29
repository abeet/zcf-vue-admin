<template>
  <div>
    <!-- 资源选择弹框 -->
    <el-dialog :title="title" :visible.sync="isShow" @open="beforeDialogOpen" class="resource-dialog" :append-to-body="true" @close="dialogClose">
      <el-tabs class="tabs-wrap" v-model="tabActiveName" @tab-click="onRoleTabsClick">
        <!-- 资源上传面板选择栏 -->
        <el-tab-pane name="uploader">
          <span slot="label">资源上传</span>
          <el-form label-position="right" label-width="200px" :model="tmpResourceProps">
            <div v-if="tmpResourceProps.supportNetSource != 'false'">
              <el-form-item label="来源：">
                <el-radio-group v-model="tmpResourceProps.sourceType">
                  <el-radio label="upload">本地上传</el-radio>
                  <el-radio label="internet">网络</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!-- 根据不同来源加载不同表单样式 -->
            <div v-if="tmpResourceProps.sourceType === 'upload'">
              <el-form-item label="文件：">
                <el-upload ref="upload" action="" :multiple="false" :file-list="tmpFileList" :auto-upload="false" class="upload-additional-dic" :on-change="selectFileChangeHandler" :on-remove="selectFileRemoveHandler" :accept="tmpResourceProps.allowType" style="width:330px;">
                  <el-row :gutter="3">
                    <el-col :span="18">
                      <el-input disabled v-model="tmpResourceProps.allowType"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-button type="primary">选择文件</el-button>
                    </el-col>
                  </el-row>
                  <div slot="tip" class="el-upload__tip">只能上传 \{{tmpResourceProps.allowType}} 文件</div>

                </el-upload>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="URL地址：" prop="URL">
                <el-input auto-complete="on" style="width:300px;" v-model="tmpResourceProps.URL" @input="autoFillOldName(`${tmpResourceProps.URL}`)"></el-input>
              </el-form-item>
              <el-form-item label="名称：" prop="oldName" :rules="[{required:true,message:'不能为空',trigger:'blur'}]">
                <el-input style="width:300px;" v-model="tmpResourceProps.oldName"></el-input>
              </el-form-item>
            </div>
            <div v-if="tmpResourceProps.resourceType === 'image' || tmpResourceProps.resourceType === 'video'">
              <el-form-item label="宽度：">
                <el-input-number v-model="tmpResourceProps.width" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="高度：">
                <el-input-number v-model="tmpResourceProps.height" :min="0"></el-input-number>
              </el-form-item>
            </div>
          </el-form>
          <el-form label-position="right" label-width="200px" :model="tmpParams">
            <div v-if="tmpResourceProps.resourceType === 'image'">
              <el-form-item label="添加水印：">
                <el-radio-group v-model="tmpParams.addWaterImage">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="logo图缩放模式：">
                <el-select v-model="tmpParams.logoThumbMode">
                  <el-option v-for="item in logoThumbModeOptions" :key="item.key" :value="item.key" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="裁剪保留区域：" v-if="tmpParams.logoThumbMode === 'fill'">
                <water-position-picker :position.sync="tmpParams.logoCutSavePart"></water-position-picker>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 资源库面板选择栏 -->
        <el-tab-pane name="selector">
          <span slot="label">资源库</span>
          <el-row id="resources-row">
            <el-col :span="7" id="resources-col">
              <el-tree :render-content="renderContent" :data="catalogTree" @node-click="catalogTreeNodeClick" default-expand-all highlight-current :node-key="treeOptions.key" :props="treeOptions" :expand-on-click-node="false" class="catalog-tree"></el-tree>
            </el-col>
            <el-col :span="17">
              <el-toolbar style="position:relative">
                <el-button @click="copy">
                  <i class="fa fa-copy"></i>复制</el-button>
                <span v-if="tmpResourceProps.selectorURL === 'imageResources'">
                  <el-button @click="cutImage">
                    <i class="fa fa-cut"></i>裁剪</el-button>
                </span>
              </el-toolbar>
              <div id="resources-search-div">
                <el-input v-model="keyword" style="width:270px">
                  <el-button slot="append" @click="loadingResourcesData">查询</el-button>
                </el-input>
              </div>
              <div v-if="tmpResourceProps.selectorURL === 'imageResources'">
                <el-row class="resource-icon">
                  <el-radio-group v-model="imgRadio" style="width: 100%;">
                    <el-col :span="6" v-for="item in resourcesData" v-bind:key="item.ID" :offset="1">
                      <el-card :body-style="{ padding: '0px' }">
                        <div>
                          <div class="image"><img @click="imgClick(item.logoFile,item.ID,item.logoFile)" :imageid="item.ID" :title="item.name" :src="tmpResourceProps.prefix+item.logoFile" @error="setErrorImg"/></div>
                          <div class="resource-title">
                            <el-radio :label="item.logoFile">\{{item.oldName}}</el-radio>
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-radio-group>
                </el-row>
              </div>
              <div v-if="tmpResourceProps.selectorURL === 'fileResources'">
                <el-table :data="resourcesData" height="320" class="resources-table" v-loading="resourcesDataLoading" highlight-current-row @row-click="selecteRow">
                  <el-table-column type="index" label=" " width="60" align="center"></el-table-column>
                  <el-table-column label="　　名称">
                    <template slot-scope="scope">
                      <el-radio v-model="imgRadio" :label="scope.row.path" class="table-radio">&nbsp;\{{scope.row.oldName}}
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column width="60" label="类型" align="center">
                    <template slot-scope="scope">
                      <img :src="'../../assets/images/framework/filetype/'+scope.row.icon">
                    </template>
                  </el-table-column>
                  <el-table-column prop="fileSize" width="100" label="大小" align="center"></el-table-column>
                </el-table>
              </div>
              <div v-if="tmpResourceProps.selectorURL === 'videoResources'">
                <el-table :data="resourcesData" height="320" class="resources-table" v-loading="resourcesDataLoading" highlight-current-row @row-click="selecteRow">
                  <el-table-column type="index" label=" " width="60" align="center"></el-table-column>
                  <el-table-column type="selection" width="40" align="center"></el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <div  class="floatPicCell">
                        \{{scope.row.oldName}}.\{{scope.row.suffix}}
                        <div class="floatPicWrap" v-show="!!scope.row.logFile">
                            <img :src="scope.row.logoFile" style="max-height:120px;max-width:120px" @error="setErrorImg" />
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="60" label="类型" align="center">
                    <template slot-scope="scope">
                      <img :src="'../../assets/images/framework/filetype/'+scope.row.icon">
                    </template>
                  </el-table-column>
                  <el-table-column prop="fileSize" width="100" label="大小" align="center"></el-table-column>
                </el-table>
              </div>
              <div v-if="tmpResourceProps.selectorURL === 'audioResources'">
                <el-table :data="resourcesData" height="320" class="resources-table" v-loading="resourcesDataLoading" highlight-current-row @row-click="selecteRow">
                  <el-table-column type="index" label=" " width="60" align="center"></el-table-column>
                  <el-table-column label="　　名称">
                    <template slot-scope="scope">
                      <el-radio v-model="imgRadio" :label="scope.row.path" class="table-radio">&nbsp;\{{scope.row.oldName}}.\{{scope.row.suffix}}
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column width="60" label="类型" align="center">
                    <template slot-scope="scope">
                      <img :src="'../../assets/images/framework/filetype/'+scope.row.icon">
                    </template>
                  </el-table-column>
                  <el-table-column prop="fileSize" width="100" label="大小" align="center"></el-table-column>
                  <el-table-column width="90" label=" ">
                    <template slot-scope="scope">
                      <audio :ref="'audioPlayer'+scope.row.ID" :id="'audioPlayer'+scope.row.ID" :src="tmpResourceProps.prefix + scope.row.path">您的浏览器不支持 audio 标签。</audio>
                      <span class="audio-player">
                        <i title="播放" @click="audioStart('audioPlayer'+scope.row.ID)" class="fa fa-play fa-fw"></i>
                        <i title="暂停" @click="audioPause('audioPlayer'+scope.row.ID)" class="fa fa-pause fa-fw"></i>
                        <i title="停止" @click="audioStop('audioPlayer'+scope.row.ID)" class="fa fa-stop fa-fw"></i>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!--分页-->
              <div class="resources-page-bar">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page.sync="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="total" layout="total, prev, pager, next, jumper">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <!-- 底部确认按钮 -->
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 栏目选择框 -->
    <catalog-selector inputType="checkbox" :show.sync="catalogSelectorModal" title="选择需要复制到的栏目" @callback="catalogSelectorCallback"></catalog-selector>
    <imagecutting-dialog :show.sync="imageCuttingModal" :imagePath="imgRadio" :siteID="resourceDialogProps.siteID" @callback="imageCuttingCallback"></imagecutting-dialog>
  </div>
</template>

<script>
import util from '../../common/util.js'
import catalogSelector from './components/catalogSelector.vue'
import commonImageCuttingDialog from './commonImageCuttingDialog.vue'
import WaterPositionPicker from './components/WaterPositionPicker.vue'
export default {
  data () {
    return {
      imageCuttingModal: false,
      tmpFile: null, // 要上传的文件
      tmpFileList: [], // 文件待上传列表
      resourcesIDs: '', // 资源id
      catalogSelectorModal: false, // 控制栏目选择框
      resourcesDataLoading: false, // 资源数据加载动画
      imgRadio: 0, // 绑定资源单选框
      resourcesData: [], // 资源数据
      pageSizes: [10, 20, 30, 50], // 分页大小控制
      pageSize: 30, // 分页当前页大小
      pageIndex: 1, // 分页当前页索引
      total: 0, // 分页中数据总量
      keyword: '', // 搜索关键词
      treeOptions: { key: 'ID', label: 'name', children: 'children' }, // 树属性选项
      catalogTree: [], // 栏目树数据
      tmpParams: {}, // 图片上传参数
      tabActiveName: 'uploader', // 面板选择控制
      logoThumbModeOptions: [{ key: 'fit', label: '原比例缩放' }, { key: 'fill', label: '裁剪缩放' }], // logo图缩放模式数据
      tmpResourceProps: {}
    }
  },
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    cutImage () {
      if (!this.imgRadio) {
        this.$alert('请先选择一条记录', '提示', {
          type: 'info'
        })
        return
      }
      this.imageCuttingModal = true
    },
    imageCuttingCallback (sPath, path) {
      this.imgRadio = path
    },
    audioStart (refName) {
      let audio = this.$refs[refName]
      audio.play()
    },
    audioPause (refName) {
      let audio = this.$refs[refName]
      audio.pause()
    },
    audioStop (refName) {
      let audio = this.$refs[refName]
      audio.currentTime = 0
      audio.pause()
    },
    dialogClose () {
      this.imgRadio = 0
      this.tmpFileList = []
      this.tmpFile = null
      this.resourceIDs = ''
      this.resourcesData = []
      this.tabActiveName = 'uploader'
      this.tmpResourceProps = {}
    },
    /** 设置错误图片 */
    setErrorImg (e) {
      e.target.src = '/assets/images/picture404.png'
    },
    /** 自动填写名称 */
    autoFillOldName (pathURL) {
      if (
        pathURL &&
        pathURL.lastIndexOf('/') > -1 &&
        pathURL.lastIndexOf('.') > -1 &&
        pathURL.lastIndexOf('.') > pathURL.lastIndexOf('/')
      ) {
        let name = pathURL.substring(pathURL.lastIndexOf('/') + 1, pathURL.lastIndexOf('.'))
        if (!this.tmpResourceProps.oldName) {
          this.tmpResourceProps.oldName = name
        }
      }
    },
    /** 面板选择 */
    onRoleTabsClick (val) {
      if (val.name === 'selector') {
        this.loadingCatalogTree()
      }
    },
    /** 获取栏目列表数据 */
    async loadingCatalogTree () {
      let obj = {
        siteID: this.tmpResourceProps.siteID
      }
      let res = await axios.get('/api/resourcesselector/bindtree', {
        params: obj
      })
      this.catalogTree = res.data.data
      this.loadingResourcesData()
    },
    /** 栏目树点击节点触发事件 */
    catalogTreeNodeClick (val) {
      this.tmpResourceProps.catalogID = val.ID
      this.loadingResourcesData()
    },
    /** 加载资源数据 */
    async loadingResourcesData () {
      let obj = {
        catalogID: this.tmpResourceProps.catalogID,
        siteID: this.tmpResourceProps.siteID,
        resourceType: this.tmpResourceProps.resourceType,
        keyword: this.keyword,
        suffix: this.tmpResourceProps.suffix,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      let res = await axios.get('/api/resourcesselector/resourcesdatagrid', {
        params: obj
      })
      this.resourcesData = res.data.data
      this.resourcesData.forEach(o => {
        if (o.icon && o.icon.length > 0) {
          o.icon = o.icon.substring(o.icon.lastIndexOf('/'))
        }
      })
      this.total = res.data.total
    },
    /** 资源库页面大小改变事件  */
    sizeChangeHandler (val) {
      this.pageSize = val
      this.loadingResourcesData()
    },
    /** 资源库页面索引改变事件 */
    currentChangeHandler (val) {
      this.pageIndex = val
      this.loadingResourcesData()
    },
    /** 资源复制 */
    copy () {
      if (this.imgRadio === 0) {
        this.$alert('请选择需要复制的资源文件', '提示', {
          confirmButtom: '确定',
          type: 'info'
        })
        return
      }
      this.catalogSelectorModal = true
    },
    /** 资源复制选中栏目后回调 */
    async catalogSelectorCallback (val) {
      if (val.ids.length === 0) {
        this.$alert('请选择需要复制到的栏目', '提示', {
          type: 'info'
        })
        return
      }
      let res = await axios.put(`/api/catalogresources/${this.resourcesIDs}/copy`, {
        catalogIDs: val.ids,
        siteID: this.siteID
      })
      util.showResponseMessage(res.data)
    },
    /** 资源库图片点击事件 */
    imgClick (val, imgID, path) {
      this.imgRadio = val
      this.resourcesIDs = imgID
    },
    /** 资源选择弹框打开回调 */
    async beforeDialogOpen () {
      this.tmpResourceProps = Object.assign({}, this.resourceDialogProps)
      let initResourceDialog = await axios.get('/api/catalogresources/initresourcedialog', {
        params: {
          resourceType: this.tmpResourceProps.resourceType,
          inputType: this.tmpResourceProps.inputType
        }
      })
      Vue.set(this.tmpResourceProps, 'selectorURL', initResourceDialog.data.data.selectorURL)
      let resourceUploadInit = await axios.get('/api/catalogresources/resourceuploadinit', {
        params: {
          manualAllowType: this.tmpResourceProps.manualAllowType,
          resourceType: this.tmpResourceProps.resourceType,
          siteID: this.tmpResourceProps.siteID,
          catalogID: this.tmpResourceProps.catalogID
        }
      })
      Vue.set(this.tmpResourceProps, 'sourceType', 'upload')
      Vue.set(this.tmpResourceProps, 'URL', '')
      Vue.set(this.tmpResourceProps, 'oldName', '')
      Vue.set(this.tmpResourceProps, 'width', this.tmpResourceProps.imageWidth)
      Vue.set(this.tmpResourceProps, 'height', this.tmpResourceProps.imageHeight)
      if (this.tmpResourceProps.resourceType === 'image') {
        Vue.set(this.tmpParams, 'addWaterImage', 'Y')
        Vue.set(this.tmpParams, 'logoThumbMode', 'fit')
        Vue.set(this.tmpParams, 'logoCutSavePart', 5)
      }
      Vue.set(this.tmpResourceProps, 'allowType', '.' + resourceUploadInit.data.data.allowType.replace(/,/g, ',.'))
      Vue.set(this.tmpResourceProps, 'prefix', resourceUploadInit.data.data.prefix)
    },
    /** 改变选中文件触发事件 */
    selectFileChangeHandler (file, files) {
      this.tmpFileList = [files[0]]
      this.tmpFile = files[0].raw
      if (files.length > 1) {
        this.$message.info('文件总数量限制为1')
      }
    },
    selectFileRemoveHandler (file, files) {
      this.tmpFile = null
    },
    /** 资源库表格行点击 */
    selecteRow (val) {
      this.imgRadio = val.path
    },
    /** 文件上传确定事件 */
    async uploadFile () {
      if (!this.tmpFile) {
        this.$alert('请选择要上传的文件', '提示', {
          type: 'warning'
        })
        return
      }
      const formData = new FormData()
      formData.append('file', this.tmpFile)
      for (let i in this.tmpResourceProps) {
        formData.append(i, this.tmpResourceProps[i])
      }
      for (let i in this.tmpParams) {
        formData.append(i, this.tmpParams[i])
      }
      let upload = await axios.post(`/api/catalogresources/${this.tmpResourceProps.catalogID}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      util.showResponseMessage(upload.data)
      if (upload.data.status === 1) {
        this.saveRela(this.resourceID, true)
        this.isShow = false
        this.$emit('callback', upload.data.previewPrefix + upload.data.path, upload.data.path, upload.data.resourceID)
      }
    },
    /** 确定资源选中事件,返回callback回调函数，附带文件预览路径、文件路径、资源id参数 */
    confirm () {
      if (this.tabActiveName === 'uploader') {
        if (this.tmpResourceProps.sourceType === 'upload') {
          this.uploadFile()
          return
        }
        if (this.tmpResourceProps.sourceType === 'internet') {
          this.isShow = false
          this.$emit('callback', this.tmpResourceProps.URL, this.tmpResourceProps.URL)
        }
      }
      if (this.tabActiveName === 'selector') {
        this.isShow = false
        this.$emit('callback', this.tmpResourceProps.prefix + this.imgRadio, this.imgRadio, this.resourcesIDs, true)
      }
    },
    /**
     * dataType和dataID不为空时记录资源引用关系
     * delFlag: 是否先删除原有引用记录
     */
    async saveRela (resourceID, delFlag) {
      let obj = {
        resourceIDs: resourceID,
        dataType: this.dataType,
        dataID: this.dataID,
        delFlag: delFlag ? 'Y' : 'N'
      }
      let res = await axios.put(`/api/catalogresources/${resourceID}/saverela`, obj)
    },
    /** 渲染树样式 */
    renderContent: function (createElement, { node, data, store }) {
      let params = {
        h: createElement,
        treeObj: { node, data, store }
      }
      return util.renderTreeContent(params)
    }
  },
  props: {
    title: {
      type: String,
      default: '图片上传'
    },
    show: {
      type: Boolean,
      required: true
    },
    resourceDialogProps: {
      type: Object,
      required: true
    }// 传递过来的对象，可包含manualAllowType,dataType,dataID,resourceType,siteID
    // catalogID,imageWidth,imageHeight,resourceID,inputType,suffix等多个属性
  },
  components: {
    'catalog-selector': catalogSelector,
    'imagecutting-dialog': commonImageCuttingDialog,
    'water-position-picker': WaterPositionPicker
  }
}
</script>

<style>
/* 在一般情况下dialog宽为680像素，在逻辑分辨率480像素以下dialog宽为96% */
.resource-dialog .el-dialog {
  width: 850px;
}
@media (max-width: 480px) {
  .resource-dialog .el-dialog {
    width: 96%;
  }
}
.resource-dialog .el-tabs__content {
  height: 450px;
  overflow: auto;
}
.resource-dialog .resource-icon {
  width: 100%;
  height: 320px;
  overflow: auto;
  background-color: #f7f7f7;
  margin: 0 auto;
}
.resource-dialog .resource-icon .el-col-offset-1 {
  margin-left: 3.33333%;
}
.resource-dialog .resource-icon .image {
  display: table-cell;
  height: 120px;
  vertical-align: middle;
}
.resource-dialog .resource-icon .el-card {
  border: 0;
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
  box-shadow: 0 0 0 0;
  overflow: hidden;
  height: 150px;
}
.resource-dialog .resource-icon .el-card img {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
.resource-dialog .resource-icon .el-card img:hover {
  background: #fff68f;
}
.resource-dialog .resource-icon .resource-title {
  margin-top: 5px;
}
.resource-dialog .resource-icon .resource-title .el-radio {
  text-overflow: ellipsis;
  overflow: hidden;
}
.resource-dialog .resource-icon .resource-title .el-checkbox .el-radio__label {
  font-weight: 100 !important;
  font-size: 12px;
  padding-left: 2px;
}
.resource-dialog .resource-icon .el-col-6 {
  width: 21%;
}
.resource-dialog .el-table {
  margin: 0;
}
</style>
<style scoped>
.tabs-wrap {
  height: 500px;
  border: 1px solid #ddd;
}

#resources-row {
  height: 450px;
  background-color: #f0f0f0;
}

#resources-col {
  overflow: auto;
  height: 99%;
}

.catalog-tree {
  color: black;
}

#resources-search-div {
  padding: 5px;
  text-align: right;
  border: 1px solid #e6e6e6;
}

.resources-page-bar {
  width: 100%;
  position: relative;
  bottom: 0px;
}

.resources-table {
  width: 100%;
  font-size: 12px;
}

.table-radio {
  font-size: 12px;
  font-weight: normal;
}

.el-upload__tip {
  word-break: break-all;
  word-wrap: break-word;
  line-height: 24px;
}

.floatPicWrap {
  display: none !important;
}

.floatPicCell:hover .floatPicWrap {
  display: block !important;
  position: absolute;
  left: 0;
  top: 0;
  float: left;
  z-index: 2200;
}

.audio-player {
  padding: 2px 0 2px 5px;
}

.audio-player:hover {
  border: 1px solid #ccc;
}
</style>
