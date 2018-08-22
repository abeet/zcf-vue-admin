/* global axios */
const metadataAPI = {
  getMetadata (typeId, key) {
    return axios
      .get('/api/metadatas', {
        params: {
          typeId,
          key
        }
      })
      .then(res => res.data)
  },
  getMetadataTypes () {
    return axios.get('/api/metadatas/types').then(res => res.data)
  },
  addMetadata (metadata) {
    return axios.post('/api/metadatas', metadata).then(res => res.data)
  },
  updateMetadata (id, metadata) {
    return axios.put(`/api/metadatas/${id}`, metadata).then(res => res.data)
  },
  deleteMetadatas (ids) {
    let strIds = ids.join(',')
    return axios.delete(`/api/metadatas/${strIds}`).then(res => res.data)
  },
  getMetadataGroups (metadataID) {
    return axios
      .get(`/api/metadatas/${metadataID}/groups`)
      .then(res => res.data)
  },
  addMetadataGroup (metadataID, group) {
    return axios
      .post(`/api/metadatas/${metadataID}/groups`, group)
      .then(res => res.data)
  },
  updateMetadataGroup (metadataID, groupId, group) {
    return axios
      .put(`/api/metadatas/${metadataID}/groups/${groupId}`, group)
      .then(res => res.data)
  },
  deleteMetadataGroup (metadataID, groupId) {
    return axios
      .delete(`/api/metadatas/${metadataID}/groups/${groupId}`)
      .then(res => res.data)
  },
  getMetadataFields (metadataID) {
    return axios
      .get(`/api/metadatas/${metadataID}/columns`)
      .then(res => res.data)
  },
  addMetadataField (metadataID, field) {
    return axios
      .post(`/api/metadatas/${metadataID}/columns`, field)
      .then(res => res.data)
  },
  updateMetadataField (metadataID, fieldID, field) {
    return axios
      .put(`/api/metadatas/${metadataID}/columns/${fieldID}`, field)
      .then(res => res.data)
  },
  deleteMetadataField (column) {
    return axios
      .delete(`/api/metadatas/${column.modelID}/columns/${column.ID}`)
      .then(res => res.data)
  },
  getMetadataControlTypes () {
    return axios
      .get(`/api/metadatas/0/columns/controlTypes`)
      .then(res => res.data)
  },
  getMetadataDataTypes () {
    return axios.get('/api/metadatas/0/columns/dataTypes').then(res => res.data)
  },
  getFieldOptionsCodeTypes () {
    return axios.get('/api/metadatas/0/columns/codeTypes').then(res => res.data)
  },
  getMetadataDatas (metadataID) {
    return axios.get(`/api/metadatas/${metadataID}/datas`).then(res => res.data)
  },
  addMetadataDatas (metadataID, pkData) {
    return axios
      .post(`/api/metadatas/${metadataID}/datas`, pkData)
      .then(res => res.data)
  },
  updateMetadataDatas (metadataID, valueID, pkData) {
    return axios
      .put(`/api/metadatas/${metadataID}/datas/${valueID}`, pkData)
      .then(res => res.data)
  },
  deleteMetadataDatas (metadataID, valueID) {
    return axios
      .delete(`/api/metadatas/${metadataID}/datas/${valueID}`)
      .then(res => res.data)
  },
  getMetadataTemplate (metadataID) {
    return axios
      .get(`/api/metadatas/${metadataID}/templates`)
      .then(res => res.data)
  },
  saveMetadataTemplate (metadataID, template) {
    return axios
      .put(`/api/metadatas/${metadataID}/templates/updated`, {
        templateContent: template
      })
      .then(res => res.data)
  },
  getMetadataFieldListOptions (type, method) {
    return axios
      .get(`/api/metadatas/fields/options/${type}`, {
        params: {
          method
        }
      })
      .then(res => res.data)
  }
}

export default metadataAPI
