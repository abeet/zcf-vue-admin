/* global axios */
const ruleAPI = {
  getRoles () {
    return axios.get('/api/roles').then(res => res.data)
  },
  getRolesByBranch (id) {
    return axios
      .get('/api/roles', {
        params: {
          branchInnerCode: id
        }
      })
      .then(res => res.data)
  },
  getUsersByRole (roleCode) {
    return axios.get(`/api/roles/${roleCode}/users`).then(res => res.data)
  },
  getUsersNotRole (roleCode) {
    return axios
      .get(`/api/roles/${roleCode}/users`, {
        params: {
          optional: true
        }
      })
      .then(res => res.data)
  },
  getMenuPermissionsByRole (roleCode) {
    return axios
      .get(`/api/roles/${roleCode}/permissions/menu`)
      .then(res => res.data)
  },
  addRole (role) {
    role.branchInnerCode = role.branch.branchInnerCode
    return axios.post('/api/roles', role).then(res => res.data)
  },
  editRole (id, role) {
    return axios.put(`/api/roles/${id}`, role).then(res => res.data)
  },
  deleteRole (id) {
    return axios.delete(`/api/roles/${id}`).then(res => res.data)
  },
  addUsers (ids, roleCode) {
    let userNames = ids.join(',')
    return axios
      .put(`/api/roles/${roleCode}/users`, { userNames })
      .then(res => res.data)
  },
  removeUsers (ids, roleCode) {
    let userNames = ids.join(',')
    return axios
      .delete(`/api/roles/${roleCode}/users`, {
        params: { userNames }
      })
      .then(res => res.data)
  }
}

export default ruleAPI
