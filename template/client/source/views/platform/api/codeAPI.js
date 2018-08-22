const codeAPI = {
  getCodes (pageIndex = 1, pageSize = 15) {
    return axios
      .get('/api/codes?pageIndex=' + pageIndex + '&pageSize=' + pageSize)
      .then(res => res.data)
  },
  addCode (code) {
    return axios.post('/api/codes', code).then(res => res.data)
  },
  updateCode (code) {
    return axios.put(`/api/codes/${code.codeType}`, code).then(res => res.data)
  },
  deleteCodes (ids) {
    let strIds = ids.join(',')
    return axios.delete(`/api/codes/${strIds}`).then(res => res.data)
  },
  getCodeItems (codeID) {
    return axios.get(`/api/codes/${codeID}/items`).then(res => res.data)
  },
  // 多个删除的时候，需要通过"__ZVING__SPLIT__"隔开,这个删除方法有点特殊
  deleteCodeItem (codeItem) {
    return axios
      .delete(`/api/codes/${codeItem.codeType}/items/${codeItem.codeType}`, {
        params: { codevalues: codeItem.codeValue }
      })
      .then(res => res.data)
  },
  addCodeItem (codeItem) {
    return axios
      .post(`/api/codes/${codeItem.codeType}/items`, codeItem)
      .then(res => res.data)
  },
  updateCodeItem (codeItem) {
    return axios
      .put(
        `/api/codes/${codeItem.codeType}/items/${codeItem.oldvalue}`,
        codeItem
      )
      .then(res => res.data)
  }
}

export default codeAPI
