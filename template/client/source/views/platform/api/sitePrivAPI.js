const sitePrivAPI = {
  getColumns (_typeID, _type) {
    return axios
      .get(`/sitepriv/id/all/type/${_type}/columns`)
      .then(res => res.data)
  },
  getPrivs (_typeID, _type, _search) {
    return axios
      .get(`/sitepriv/id/${_typeID}/type/${_type}/privs`)
      .then(res => res.data)
  },
  savePrivs (id, type, priv) {
    return axios
      .put(`/sitepriv/id/${id}/type/${type}/privs`, { data: priv })
      .then(res => res.data)
  }
}
export default sitePrivAPI
