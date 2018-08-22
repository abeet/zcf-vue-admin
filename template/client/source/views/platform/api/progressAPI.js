const progressAPI = {
  getInfos (id) {
    return axios.get(`/api/framework/longtimetasks/${id}`).then(res => res.data)
  },
  stop (id) {
    return axio
      .put('/api/framework/longtimetasks/stoped', { params: { id: id } })
      .then(res => res.data)
  }
}

export default progressAPI
