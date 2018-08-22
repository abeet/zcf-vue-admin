/*! DataTable
 */
; (function () {
  var DataTable
  var DataRow

  window.DataTable = DataTable = function (options) {
    this.Columns = null
    this.Values = null
    this.Rows = null
    this.ColMap = {}
    if (options && options.Columns && options.Values) {
      this.init(options.Columns, options.Values)
    }
  }

  DataTable.prototype.getRowCount = function () {
    return this.Rows.length
  }

  DataTable.prototype.getColCount = function () {
    return this.Columns.length
  }

  DataTable.prototype.getColName = function (i) {
    return this.Columns[i]
  }

  DataTable.prototype.getAt = function (i, j) {
    return this.Rows[i].getAt(j)
  }

  DataTable.prototype.get = function (i, str) {
    return this.Rows[i].get(str)
  }

  DataTable.prototype.getDataRow = function (i) {
    return this.Rows[i]
  }
  DataTable.prototype.indexOf = function (dataRow) {
    for (var i = 0, len = this.Rows.length; i < len; i++) {
      if (this.Rows[i] === dataRow) {
        return i
      }
    }
    return -1
  }
  DataTable.prototype.deleteRow = function (i) {
    this.Values.splice(i, 1)
    this.Rows.splice(i, 1)
    for (var k = i; k < this.Rows.length; k++) {
      this.Rows[k].Index = k
    }
  }

  // 插入行 values参数为一维数组
  DataTable.prototype.insertRow = function (i, values) {
    this.Values.splice(i, 0, values)
    this.Rows.splice(i, 0, new DataRow(this, i))
    for (var k = i; k < this.Rows.length; k++) {
      this.Rows[k].Index = k
    }
  }

  // 插入多行 values参数为二维数组 2013-03-26
  DataTable.prototype.insertRows = function (index, valuesArray) {
    Array.prototype.splice.apply(this.Values, [index, 0].concat(valuesArray))
    var rowsArray = new Array(valuesArray.length)
    for (var i = 0, len = valuesArray.length; i < len; i++) {
      rowsArray[i] = new DataRow(this, i + index)
    }
    Array.prototype.splice.apply(this.Rows, [index, 0].concat(rowsArray))
    for (var k = index; k < this.Rows.length; k++) {
      this.Rows[k].Index = k
    }
  }

  DataTable.prototype.insertColumn = function (name) {
    if (this.hasColumn(name)) {
      return
    }
    var col = {}
    col.Name = name.toLowerCase()
    col.Type = 1 // string
    this.Columns.push(col)
    this.ColMap[col.Name] = this.Columns.length - 1
    for (var i = 0; i < this.Values.length; i++) {
      this.Values[i].push(null) // 置空值
    }
  }

  DataTable.prototype.hasColumn = function (name) {
    name = name.toLowerCase()
    for (var j = 0; j < this.Columns.length; j++) {
      if (this.Columns[j].Name === name) {
        return true
      }
    }
    return false
  }
  /**
   DataTable接受的数据结构
  "DataTable": {
    "Columns": [{
      "Name": "ID",
      "Type": 1
      },
      {
      "Name": "Name",
      "Type": 1
    }],
    "Values": [
      ["com.zving.contentworkflow.PublishMethod", "发布内容文档"],
      ["com.zving.contentworkflow.WaitPublishMethod", "内容文档转为待发布"]
    ]
  }
  或
  "DataTable": {
    "Columns": [
      ["ID", 1],
      ["Name", 1]
    ],
    "Values": [
      ["com.zving.contentworkflow.PublishMethod", "发布内容文档"],
      ["com.zving.contentworkflow.WaitPublishMethod", "内容文档转为待发布"]
    ]
  }
  */
  DataTable.prototype.init = function (cols, values) {
    this.Values = values || []
    this.Columns = []
    this.Rows = []
    var i
    for (i = 0; i < cols.length; i++) {
      var col = {}

      if (cols[i].length && cols[i][0]) { // datagrid输出的
        col.Name = cols[i][0]
        col.Type = cols[i][1]
      } else {
        col = cols[i]
      }
      col.Name = col.Name.toLowerCase()
      this.Columns[i] = col
      this.ColMap[col.Name] = i
    }
    for (i = 0; i < values.length; i++) {
      var row = new DataRow(this, i)
      this.Rows[i] = row
    }
  }

  DataTable.prototype.toJSON = function () {
    var obj = z.mix({}, {
      '@type': 'DataTable',
      Columns: this.Columns,
      Values: this.Values
    })
    return obj
  }

  DataRow = function (dt, index) {
    this.DT = dt
    this.Index = index
  }

  DataRow.prototype.getColCount = function () {
    return this.DT.Columns.length
  }

  DataRow.prototype.getIndex = function () {
    return this.Index
  }

  DataRow.prototype.getColName = function (i) {
    return this.DT.Columns[i]
  }

  DataRow.prototype.getAt = function (i) {
    return this.DT.Values[this.Index][i]
  }

  DataRow.prototype.getValues = function (i) {
    return this.DT.Values[this.Index]
  }

  DataRow.prototype.get = function (str) {
    str = str
    var c = this.DT.ColMap[str]
    if (typeof (c) === 'undefined') {
      if (/[A-Z]/.test(str)) {
        return this.get(str.toLowerCase())
      } else {
        return
      }
    }
    if (this.DT.Values[this.Index]) {
      return this.DT.Values[this.Index][c]
    }
  }

  DataRow.prototype.set = function (str, value) {
    str = str.toLowerCase()
    var c = this.DT.ColMap[str]
    if (typeof (c) === 'undefined') {
      return
    }
    if (this.DT.Values[this.Index]) {
      this.DT.Values[this.Index][c] = value
    }
  }

  DataRow.prototype.setAt = function (i, value) {
    this.DT.Values[this.Index][i] = value
  }
  DataRow.prototype.each = function (func, scope) {
    var cols = this.DT.Columns
    var vals = this.DT.Values[this.Index]
    for (var i = 0, l = cols.length; i < l; i++) {
      if (func.call(scope || vals[i], vals[i], cols[i].Name, l) === false) {
        break
      }
    }
  }
  DataRow.prototype.toJSON = function () {
    var obj = {}
    var cols = this.DT.Columns
    var vals = this.DT.Values[this.Index]
    for (var i = 0, l = cols.length; i < l; i++) {
      obj[cols[i].Name] = vals[i]
    }
    return obj
  }
})()
