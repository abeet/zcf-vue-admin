const catalogPrivAPI = {
  getCatalogColumns (_typeID, _type) {
    return axios
      .get(`catalogpriv/id/all/type/${_type}/catalogcolumns`, {
        params: { siteID: 1 }
      })
      .then(res => res.data)
  },
  getCatalogPrivs (_typeID, _type, _search) {
    return axios
      .get(`catalogpriv/id/${_typeID}/type/${_type}/catalogprivs`, {
        params: { siteID: 1 }
      })
      .then(res => res.data)
  },
  getContentColumns (_typeID, _type) {
    return axios
      .get(`catalogpriv/id/all/type/${_type}/contentcolumns`, {
        params: { siteID: 1 }
      })
      .then(res => res.data)
  },
  getContentPrivs (_typeID, _type, _search) {
    return axios
      .get(`catalogpriv/id/${_typeID}/type/${_type}/contentprivs`, {
        params: { siteID: 1 }
      })
      .then(res => res.data)
  },
  savePrivs (id, type, priv) {
    return axios
      .put(`/catalogpriv/id/${id}/type/${type}/privs`, { data: priv })
      .then(res => res.data)
  }
}
export default catalogPrivAPI
