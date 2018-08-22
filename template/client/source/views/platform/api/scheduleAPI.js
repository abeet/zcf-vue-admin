/* global axios */
const scheduleAPI = {
  getSchedules () {
    return axios.get('/api/schedules').then(res => res.data)
  },
  getScheduleTypes (isUsable) {
    if (isUsable) {
      return axios
        .get('/api/schedules/types', {
          params: {
            usable: 'Y'
          }
        })
        .then(res => res.data)
    }
    return axios.get('/api/schedules/types').then(res => res.data)
  },
  getOptionalSchedule (typeID) {
    return axios
      .get('/api/schedules', {
        params: {
          optional: 'Y',
          typeID: typeID
        }
      })
      .then(res => res.data)
  },
  addSchedule (schedule) {
    return axios.post('/api/schedules', schedule).then(res => res.data)
  },
  updateSchedule (id, schedule) {
    return axios.put('/api/schedules/updated', schedule).then(res => res.data)
  },
  deleteSchedule (id, schedule) {
    return axios
      .delete(`/api/schedules/deleted`, schedule)
      .then(res => res.data)
  },
  execute (schedule) {
    return axios.post('/api/schedules/executed', schedule).then(res => res.data)
  }
}

export default scheduleAPI
