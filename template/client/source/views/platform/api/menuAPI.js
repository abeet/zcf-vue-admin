const menuAPI = {
  getMenus (pluginid) {
    return axios
      .get('/api/menus', { params: { pluginid } })
      .then(res => res.data)
  },
  resetMenus () {
    return axios
      .put('/api/menus/reset', null, {
        params: {
          reset: true
        }
      })
      .then(res => res.data)
  },
  disableOrEnableMenus (strIds, status) {
    let ids = strIds.join(',')
    return axios
      .put('/api/menus/status', {
        ids,
        status
      })
      .then(res => res.data)
  },
  moveMenu (id, offset) {
    return axios
      .put('/api/menus/sortmenu', {
        id,
        offset
      })
      .then(res => res.data)
  },
  getPluginList () {
    return axios.get('/api/menus/getpluginlist').then(res => res.data)
  }
}

export default menuAPI
