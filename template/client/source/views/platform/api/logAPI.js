const logAPI = {
  getLogsTree () {
    return axios.get('/api/logs/tree').then(res => res.data)
  },
  getRealTimeLog (id) {
    return axios
      .get('/api/logs/realtimelog', {
        params: {
          lastid: id
        }
      })
      .then(res => res.data)
  },
  getSqlLogs (type, userName, ip, message, pageIndex, pageSize) {
    return axios
      .get('/api/logs/sqllog', {
        params: {
          type,
          userName,
          ip,
          message,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getSecurityLogs (type, userName, ip, message, pageIndex, pageSize) {
    return axios
      .get('/api/logs/securitylog', {
        params: {
          type,
          userName,
          ip,
          message,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getCronLogs (type, message, pageIndex, pageSize) {
    return axios
      .get('/api/logs/cronlog', {
        params: {
          type,
          message,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getUserLogs (userName, dateInterval, ip, message, pageIndex, pageSize) {
    return axios
      .get('/api/logs/userlog', {
        params: {
          userName,
          startTime: dateInterval[0] ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval[1] ? Date.parse(dateInterval[1]) : null,
          ip,
          message,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getUserLoginLogs (userName, dateInterval, ip, message, pageIndex, pageSize) {
    return axios
      .get('/api/logs/userloginlog', {
        params: {
          userName,
          startTime: dateInterval[0] ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval[1] ? Date.parse(dateInterval[1]) : null,
          ip,
          message,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getDownLogs (fileName, dateInterval, pageIndex, pageSize) {
    return axios
      .get('/api/logs/downlog', {
        params: {
          fileName,
          startTime: dateInterval[0] ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval[1] ? Date.parse(dateInterval[1]) : null,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  },
  getUserOperateLogs (userName, dateInterval, pageIndex, pageSize) {
    return axios
      .get('/api/logs/useroperatelog', {
        params: {
          userName,
          startTime: dateInterval[0] ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval[1] ? Date.parse(dateInterval[1]) : null,
          pageIndex,
          pageSize
        }
      })
      .then(res => res.data)
  }
}

export default logAPI
