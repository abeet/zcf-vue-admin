/* global axios */
const branchAPI = {
  getBranches () {
    return axios.get('/api/branches').then(res => res.data)
  },
  addBranch (branch) {
    branch.manager = branch.managerselected.join(',')
    branch.parentInnerCode = branch.parent.branchInnerCode
    return axios.post('/api/branches', branch).then(res => res.data)
  },
  updateBranch (id, branch) {
    return axios.put('/api/branches/' + id,
      branch
    ).then(res => res.data)
  },
  deleteBranch (ids) {
    let strIds = ids.join(',')
    return axios.delete('/api/branches/' + strIds).then(res => res.data)
  },
  getBranchPermissions (branchCode) {
    return axios
      .get(`/api/branches/${branchCode}/permissions`)
      .then(res => res.data)
  },
  updateBranchPermissions (branchCode, type, permissions) {
    return axios
      .put(`/api/branches/${branchCode}/permissions/${type}`, { permissions })
      .then(res => res.data)
  }
}

export default branchAPI
