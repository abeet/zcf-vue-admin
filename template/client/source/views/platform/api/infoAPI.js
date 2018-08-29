/* global axios */
const infoAPI = {
  getInfo () {
    return axios.get('/api/info').then(res => res.data)
  },
  isCanLogin () { // 是否可以登录
    return axios.get('/api/info/logined').then(res => res.data)
  },
  enableLogin () { // 启用登录
    return axios.put('/api/info/logined').then(res => res.data)
  },
  disableLogin () { // 禁止登陆
    return axios.delete('/api/info/logined').then(res => res.data)
  },
  logOffSession () { // 注销所有会话
    return axios.delete('/api/info/sessions').then(res => res.data)
  },
  createDatabaseBackups () { // 创建一个数据库备份任务
    return axios.get('/api/info/database/backups').then(res => res.data)
  },
  getDatabaseBackupsInfo (id) { // 查询一个数据库备份任务进度
    return axios.get(`/api/info/database/backups/${id}`).then(res => res.data)
  },
  createDatabaseRecovery (file) { // 创建一个数据库恢复任务
    return axios.post('/api/info/database/recovery', { file }).then(res => res.data)
  },
  getDatabaseRecoveryInfo (id) { // 查询一个数据库恢复任务进度
    return axios.get(`/api/info/database/recovery/${id}`).then(res => res.data)
  },
  createOnlineUpdate (server) { // 创建一个在线更新任务
    return axios.post('/api/info/promotion', { server }, {
      online: true
    }).then(res => res.data)
  },
  getOnlineUpdateInfo (id) { // 查询一个在线更新任务进度
    return axios.get(`/api/info/promotion/${id}`).then(res => res.data)
  },
  createLocalUpdate () { // 创建一个本地更新任务
    return axios.post('/api/info/promotion', null, {
      local: true
    }).then(res => res.data)
  },
  getLocalUpdateInfo (id) { // 查询一个本地更新任务进度
    return axios.get(`/api/info/promotion/${id}`).then(res => res.data)
  },
  uploadDatabase (formData, onUploadProgress) {
    return axios.post('/api/info/database', formData, {
      onUploadProgress: function (event) {
        console.log(event)
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => res.data)
  }
}

export default infoAPI
