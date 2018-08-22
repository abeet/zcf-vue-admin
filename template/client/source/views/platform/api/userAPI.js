/* global axios */
const userAPI = {
  getUsers (pageIndex, pageSize) {
    return axios
      .get(`/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(res => res.data)
  },
  deleteUsers (ids) {
    let strIds = ids.join(',')
    return axios.delete('/api/users/' + strIds).then(res => res.data)
  },
  modifyUsers (ids) {
    let strIds = ids.join(',')
    return axios.put('/api/users/modify/' + strIds).then(res => res.data)
  },
  disableUsers (id) {
    return axios.put('/api/users/disable/' + id).then(res => res.data)
  },
  enableUsers (id) {
    return axios.put('/api/users/enable/' + id).then(res => res.data)
  },
  updatePassword (userName, password) {
    return axios
      .put('/api/users/password', { userName, password })
      .then(res => res.data)
  },
  addUser (user) {
    user.branchInnerCode = user.branch.branchInnerCode
    user.roleCode = user.roles.map(val => val.roleCode).join(',')
    return axios.post('/api/users', user).then(res => res.data)
  },
  editUser (id, user) {
    return axios.put(`/api/users/${id}`, user).then(res => res.data)
  },
  getUserPermissionTypes (userName) {
    return axios
      .get(`/api/users/${userName}/permissions/types`)
      .then(res => res.data)
  },
  getUserMenuPermissions (userName) {
    return axios
      .get(`/api/users/${userName}/permissions/menus`)
      .then(res => res.data)
  },
  saveUserMenuPermissions (userName, permissions, permissionsBak) {
    // 只处理差异数据
    let priv = {}
    permissionsBak
      .filter(p => permissions.indexOf(p) == -1)
      .forEach(p => (priv[p] = 0))
    permissions
      .filter(p => permissionsBak.indexOf(p) == -1)
      .forEach(p => (priv[p] = 1))
    return axios
      .put(`/api/users/${userName}/permissions/menus`, { data: priv })
      .then(res => res.data)
  },
  getUserSitePermissions (userName, search) {
    return axios
      .get(`/api/users/${userName}/permissions/sites`, {
        params: { search }
      })
      .then(res => res.data)
  },
  saveUserSitePermissions (userName, permissions) {
    return axios
      .put(`/api/users/${userName}/permissions/sites`, permissions)
      .then(res => res.data)
  },
  getUserDocPermissions (userName, type) {
    return axios
      .get(`/api/users/${userName}/permissions/docs/${type}`)
      .then(res => res.data)
  },
  saveUserDocPermissions (userName, type, permissions) {
    return axios
      .put(`/api/users/${userName}/permissions/docs/${type}`, permissions)
      .then(res => res.data)
  }
}
export default userAPI
