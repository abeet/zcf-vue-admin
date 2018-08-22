/* global axios */
const backupAPI = {
  getBackups () {
    return axios.get('/api/backups').then(res => res.data)
  },
  getBackupTables (file) {
    return axios.get('/api/backups/tables', { params: { file: file } }).then(res => res.data)
  },
  getInfos (file) {
    return axios.get('/api/backups/infos', { params: { file: file } }).then(res => res.data)
  },
  deleteBackups (ids) {
    return axios.delete('/api/backups/all', { ids }).then(res => res.data)
  },
  backup () {
    return axios.post('/api/backups').then(res => res.data)
  },
  restore (file) {
    return axios.put('/api/backups/restored', { file: file }).then(res => res.data)
  }
}

export default backupAPI
