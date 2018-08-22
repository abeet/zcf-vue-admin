/* global axios */
const privAPI = {
  getPermissionTypes () {
    return axios
      .get(`/api/permissions/id/none/type/none/types`)
      .then(res => res.data)
  },
  getMenuPermissions (id, type) {
    return axios
      .get(`/api/permissions/id/${id}/type/${type}/menus`)
      .then(res => res.data)
  },
  saveMenuPermissions (id, type, permissions, permissionsBak) {
    // 只处理差异数据
    let priv = {}
    permissionsBak
      .filter(p => permissions.indexOf(p) == -1)
      .forEach(p => (priv[p] = 0))
    permissions
      .filter(p => permissionsBak.indexOf(p) == -1)
      .forEach(p => (priv[p] = 1))
    return axios
      .put(`/api/permissions/id/${id}/type/${type}/menus`, { data: priv })
      .then(res => res.data)
  }
}
export default privAPI
