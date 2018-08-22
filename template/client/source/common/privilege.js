/* global localStorage */
const charToFlag = function (flag) {
  var i = 0
  if (flag === 36 || flag === 37) {
    i = flag
  } else if (flag < 58) {
    i = flag - 48
  } else if (flag < 91) {
    i = flag - 27
  } else if (flag < 123) {
    i = flag - 87
  }
  return i
}
const isInt = function (str) {
  str = '' + str
  if (str.trim === '') {
    return false
  }
  return (/^-?\d+$/).test(str)
}

const Privilege = function (obj) {
  if (typeof (obj) === 'string') {
    obj = JSON.parse(obj)
  }
  this.data = obj
  Privilege.instance = this
}

Privilege.prototype.hasPriv = function (k) {
  if (!k) {
    return false
  }
  if(localStorage.adminUserName === localStorage.userName){
    return true
  }
  var index = k.lastIndexOf('.')
  if (index > 0) {
    var id = k.substring(index + 1)
    if (isInt(id)) {
      k = k.substring(0, index)
      var flags = this.data.ids[id]
      if (flags == null) {
        return false
      }
      var order = this.data.types[k]
      if ((order !== 0 && !order) || order >= flags.length * 6) {
        return false
      }
      var flag = flags.charCodeAt(order / 6)
      return (charToFlag(flag) & 1 << (5 - order % 6)) != 0
    } else {
      return this.data.keys[k]
    }
  } else {
    return this.data.keys[k]
  }
}
Privilege.prototype.update = function (obj) {
  if (!obj) {
    return
  }
  if (typeof (obj) === 'string') {
    obj = JSON.parse(obj)
  }
  this.data = obj
}

Privilege.hasPriv = function (privID) {
  var arr = privID.split('||')
  var flag = false
  if (localStorage.adminUserName && localStorage.userName && localStorage.adminUserName === localStorage.userName) {
    flag = true
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        continue
      }
      var item = arr[i]
      if (Privilege.PrivParams) {
        for (var k in Privilege.PrivParams) {
          item = item.replace('${' + k + '}', Privilege.PrivParams[k])// 替换变量
        }
      }
      if (Privilege.instance.hasPriv(item)) {
        flag = true
      }
    }
  }
  return flag
}

export default Privilege
