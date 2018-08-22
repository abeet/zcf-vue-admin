<template>
  <div class="layout-no-cols">
        <el-toolbar>
      <el-button :icon="login.isCan ? 'circle-cross' : 'circle-check'" @click="disableOrEnableLoginClickHandler" :loading="login.loading" priv="Platform.SystemInfo.ChangeLoginStatus">\{{login.isCan ? '禁止登陆' : '允许登陆'}}</el-button>
      <el-button icon="star-off" :loading="logOffLoading" @click="logOffSessionClickHandler" priv="Platform.SystemInfo.ForceExit">强制注销所有会话</el-button>
      <el-button icon="caret-bottom" @click="exportDatabaseClickHandler" priv="Platform.SystemInfo.Export">导出数据库</el-button>
      <el-button icon="caret-top" @click="importDatabaseClickHandler" priv="Platform.SystemInfo.Import">导入数据库</el-button>
      <el-button icon="upload" @click="onlineUpdateClickHandler" priv="Platform.SystemInfo.Update">在线更新</el-button>
      <el-button icon="upload2" @click="localUpdateClickHandler" priv="Platform.SystemInfo.Update">本地更新</el-button>
    </el-toolbar>

        <div class="layout-content-padding scroll" v-loading="dataLoading">
            <el-row :gutter="16">
                <el-col :sm="24" :lg="12" class="info-col" v-for="item in info" :key="item.id">
                    <h3 class="info-title">\{{item.title}}</h3>
                    <el-table :data="item.data" style="width: 100%">
                        <el-table-column prop="item" align="right" label="项"></el-table-column>
                        <el-table-column prop="value" label="值"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <!--导入数据库上传框-->
        <el-dialog title="导入数据库" :visible.sync="importDatabase.isShowFileModal" @before-close="importDialogCloseHandler">
            <el-upload
                class="upload-demo"
                action=""
                ref="uploadDB"
                :limit="1"
                :http-request="fileUploadHandler"
                :multiple="false"
                :on-change="selectFileChangeHandler"
                :file-list="importDatabase.fileList"
                :disabled="importDatabase.isShowProgress"
                accept=".zbf,.zdt">
                <el-button type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 .zbf .zdt 文件</div>
            </el-upload>
        </el-dialog>
        <!--在线更新选择框-->
        <el-dialog title="在线更新" :visible.sync="onlineUpdate.isShowSelectModal">
            <el-form label-width="120px">
                <el-form-item label="选择更新站点">
                    <el-select v-model="onlineUpdate.server" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in onlineUpdate.serverItems"
                            :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="onlineUpdate.isShowSelectModal = false">取 消</el-button>
                <el-button type="primary" :confirm-loading="true" @click="confirmOnlineUpdateClickHandler">确 定</el-button>
            </div>
        </el-dialog>
        <!--在线更新框-->
        <el-dialog title="在线更新" :visible.sync="onlineUpdate.isShowUpdateModal">
            <el-input
                type="textarea"
                :rows="16"
                placeholder="更新日志"
                :readonly="true"
                v-model="onlineUpdate.updateLogs">
            </el-input>
            <div slot="footer">
                <el-button :disabled="onlineUpdate.startUpdate"
                           @click="onlineUpdate.isShowUpdateModal = false">取 消</el-button>
                <el-button type="primary" :loading="onlineUpdate.startUpdate"
                           @click="startOnlineUpdateClickHandler">开始更新</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import util from '../../common/util.js';
export default {
    data() {
        return {
            info: [],
            dataLoading: true,
            login: {
                loading: false,
                isCan: true
            },
            logOffLoading: false,
            importDatabase: {
                isShowFileModal: false,
                fileList: []
            },
            onlineUpdate: {
                isShowSelectModal: false,
                server: 'http://release.update.zving.com/',
                serverItems: ['http://release.update.zving.com/', 'http://beta.update.zving.com/'],
                isShowUpdateModal: false,
                startUpdate: false,
                updateLogs: ''
            },
            localUpdate: {
                isShowModal: false,
            }
        };
    },
    methods: {
        // 禁止登陆
        async disableOrEnableLoginClickHandler() {
          let handle = async () => {
            this.login.loading = true;
            if(this.login.isCan){
              let res = await axios.delete('/api/info/logined').catch(e=>console.log(e))
              res = res.data
              this.login.isCan = res.state;
              util.showNotification(res);
              this.login.loading = false;
              return res.status === 1;
            }else{
              let res = await axios.put('/api/info/logined').catch(e=>console.log(e))
              res = res.data
              this.login.isCan = res.state;
              util.showNotification(res);
              this.login.loading = false;
              return res.status === 1;
            }
          };

          if(this.login.isCan) {
            await this.$confirm('临时禁止登录后，除admin之外的其他用户都不能登录。是否确认？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            handle();
          } else {
            handle();
          }
        },
        // 注销所有会话
        async logOffSessionClickHandler() {
          try {
            await this.$confirm('除当前用户之外的其他用户都将被强制注销。是否确认？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
          } catch (e) {
            return
          }
          this.logOffLoading = true;
          let res = await axios.delete('/api/info/sessions').catch(e=>console.log(e))
          res = res.data
          this.logOffLoading = false;
          util.showNotification(res);
        },
        // 导出数据库
        async exportDatabaseClickHandler(){
          try {
            await this.$confirm('确认导出数据库吗？', '请确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            let res = await axios.get('/api/info/database/backups')
            if(res.data.status===1){
              await util.showProgress( res.data.data.taskID,'正在导出数据库')
              window.location.href = `${axios.defaults.baseURL}/api/info/database/downloads?fileName=${res.data.data.path}`
            }else{
              util.showMessage(res)
            }
          } catch(e) {
            util.showErrorNotification(e)
            return
          }
        },
        // 导入数据库
        importDatabaseClickHandler(){
            this.importDatabase.fileList = [];
            this.importDatabase.isShowFileModal = true;
        },
        selectFileChangeHandler(file, files) {
            this.importDatabase.fileList = files.slice(-1);
        },
        async fileUploadSuccessHandler(res){
          await util.showProgress( res.taskID,'正在导入数据库')
          this.importDatabase.isShowFileModal = false
        },
        //导入模板包Dialog关闭事件
        importDialogCloseHandler() {
          this.$refs.upload.abort();
          this.$refs.upload.clearFiles();
        },
        async fileUploadHandler(event){
            const { file, onSuccess, onProgress, onError } = event;
            const formData = new FormData();
            formData.append('file', file);
            try{
              let onUploadProgress = (event) => { onProgress(event, file) }
              let res = await axios.post('/api/info/database', formData, {
                onUploadProgress: function(event){
                    console.log(event);
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              })
              if(res.data.status===1){
                onSuccess(res.data.data)
              }else{
                util.showMessage(res)
              }
            }catch(e){
              util.showErrorNotification(e)
              return
            }
        },
        // 在线更新
        onlineUpdateClickHandler(){
            this.onlineUpdate.updateLogs = '';
            this.onlineUpdate.startUpdate = false;
            this.onlineUpdate.isShowUpdateModal = false;
            this.onlineUpdate.isShowSelectModal = true;
        },
        confirmOnlineUpdateClickHandler(){
            this.onlineUpdate.isShowSelectModal = false;
            this.onlineUpdate.isShowUpdateModal = true;
        },
        async startOnlineUpdateClickHandler(){
            this.onlineUpdate.startUpdate = true;
            this.onlineUpdate.updateLogs = '更新开始！\n';
            this.onlineUpdate.updateLogs += `开始连接服务器 ${this.onlineUpdate.server}\n`;
            let pollingTask = async (id) => {
                let fetchInfo = async () => {
                    let res = await axios.get(`/api/info/promotion/${id}`).catch(e=>console.log(e))
                    let data = res.data
                    this.onlineUpdate.updateLogs += `${data.data.text}\n`
                    return data
                };
                return new Promise((resolve)=>{
                    let intervalId = setInterval(() => {
                        fetchInfo().then(data => {
                            if(data.data.progress === 100){
                                clearInterval(intervalId);
                                resolve(data);
                            }
                        })
                    }, 1000);
                });
            };
            let server = this.onlineUpdate.server
            let res = await axios.post('/api/info/promotion', { server }, {online: true})
            let data = res.data
            this.onlineUpdate.updateLogs += `${data.message}\n`
            data = pollingTask(data.data.taskId)
            this.onlineUpdate.isShowUpdateModal = false
            util.showNotification(data)
        },
        // 本地更新
        async localUpdateClickHandler(){
            try {
              await this.$confirm('确定要执行该任务吗？', '请确认', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              })
              let res = await axios.post('/api/info/promotion', null, {local: true})
              if(res.data.status===1) {
                await util.showProgress( res.data.data.taskID,'正在更新数据库')
                this.localUpdate.isShowModal = false
              }else{
                util.showMessage(res)
              }
            } catch(e) {
              util.showErrorNotification(e)
              return
            }
        }
    },
    created() {
        this.dataLoading = true;
        Promise.all([
          axios.get('/api/info').then(res => res.data),
          axios.get('/api/info/logined').then(res => res.data)
        ]).then(datas => {
            this.info = datas[0].data;
            this.login = {
              loading: false,
              isCan: !!datas[1].state
            };
            this.dataLoading = false;
        });
    }
}
</script>

<style scoped>
.info-col {
    margin-bottom: 1.5em;
}

.info-title {
    text-align: center;
    margin: .6em 0;
}
.progress-text {
    text-align: center;
}
</style>
