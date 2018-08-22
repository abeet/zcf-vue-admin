/* global localStorage */
window.namespace = function (p) {
  p = p.split('.')
  let o = window
  for (let i = 0; i < p.length; ++i) {
    o = o[p[i]] = o[p[i]] || {}
  }
  return o
}

let pathName = window.location.pathname.substring(1)
let contextPath = pathName === '' || pathName === undefined ? '' : pathName.substring(0, pathName.indexOf('/'))
let localURL = localStorage.serverURL || 'http://localhost/'
if (window.BABEL_ENV !== 'development' && window.location.host !== 'localhost:3000') {
  if (contextPath === '') {
    localURL = window.location.protocol + '//' + window.location.host + '/'
  } else {
    localURL = window.location.protocol + '//' + window.location.host + '/' + contextPath + '/'
  }
}
const serverURL = localURL

// 配置
export default {
  serverURL: serverURL,
  axios: {
    baseURL: serverURL,
    timeout: 30000,
    headers: {
      post: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    },
    withCredentials: true
  }
}
