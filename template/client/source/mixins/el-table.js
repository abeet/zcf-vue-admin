/* global axios Vue */
/*
- 通过mixin增强表格功能，点击行时勾选中多选框
- 通过mixin增强表格功能，自动添加翻页条

配置data-read-url和page-size，这两项配置后会自动加翻页条，
data-read-url="/api/codes" :page-size="15" 这是在视图载入时从接口 /api/codes 载入数据，并且向后台请求数据时传递了参数 pageSize=15
:auto-get-data="false"  这是在视图载入时，不再自动载入数据
pagination-layout="sizes, ->, prev, next, jumper" 使用简化的翻页条
*/
import { Loading } from 'element-ui'
import Sortable from 'sortablejs'
export default {
  props: {
    dataReadUrl: {
      type: [String, Function],
      default: ''
    },
    pageSize: {
      type: Number
    },
    currentPage: {
      type: Number,
      default: 1
    },
    autoGetData: {
      type: Boolean,
      default: true
    },
    paginationLayout: {
      type: String,
      default: 'total, sizes, ->, prev, pager, next, jumper'
    },
    strict: {
      type: Boolean,
      default: false
    },
    // 是否开启row拖拽
    draggable: {
      type: Boolean,
      default: false
    },
    multiOperates: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data () {
    return {
      total: 0,
      selectedRows: [],
      tmpPageSize: 0,
      tmpCurrentPage: 0,
      sortable: null,
      afterSortData: [],
      hasSelection: false
    }
  },
  computed: {
    operateFuncs(){
      let obj = {}
      for(let i = 0; i < this.multiOperates.length; i++) {
        let opt = this.multiOperates[i]
        obj[opt.value] = opt.fn
      }
      return obj
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.doLayout()
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === 'selection') {
          this.hasSelection = true
          break
        }
      }
      if (this.hasSelection) {
        this.initRowEvent()
      }
      if (this.pageSize) {
        this.initPagination()
      }
      this.tmpPageSize = this.pageSize
      this.tmpCurrentPage = this.currentPage
      if (this.dataReadUrl && this.autoGetData) {
        // 当存在dataReadUrl时，从url获取数据，并更新data
        this.getData(this.tmpCurrentPage)
      }
    })
  },
  methods: {
    setSortable () {
      const self = this
      const el = self.$el.getElementsByClassName('el-table__body')[0].getElementsByTagName('tbody')[0]
      self.sortable = Sortable.create(el, {
        onEnd: evt => {
          let oldData = [...self.afterSortData]
          const row = self.afterSortData.splice(evt.oldIndex, 1)[0]
          self.afterSortData.splice(evt.newIndex, 0, row)

          let emitData = {
            dragRow: Object.assign({}, row), // 拖拽的行
            oldIndex: evt.oldIndex, // 旧索引
            newIndex: evt.newIndex, // 新索引
            oldData: oldData, // table旧数据
            newData: [...self.afterSortData], // table新数据
            initialData: [...self.data] // table初始数据
          }
          self.$emit('after-sort', emitData)
        }
      })
    },
    initRowEvent () {
      this.$on('row-click', (row, event, column) => {
        if (this.strict) {
          return
        }
        if (column.type !== 'selection') {
          if (this.store.states.selection.length === 1 && this.store.states.selection[0] === row) {
            // 在已勾选的行上点击，则取消勾选
            this.clearSelection()
          } else {
            // 取消所有勾选，再勾选当前行
            this.clearSelection()
            this.toggleRowSelection(row)
          }
        }
      })
      this.$on('selection-change', selection => {
        this.selectedRows = selection.concat()
        if (this.pagination) {
          this.changeSelectAllStatus()
        }
      })
    },
    changeSelectAllStatus () {
      if (this.selectedRows.length === this.data.length) {
        this.pagination.selectAllChecked = true
      } else {
        this.pagination.selectAllChecked = false
      }
    },
    initPagination () {
      let self = this
      this.pagination = new (Vue.extend({
        template: `<div class="el-table__footer-wrapper">
                    <div class="el-multi-operate" v-if="$parent.hasSelection && $parent.multiOperates.length > 0 && $parent.total > 0">
                    <el-checkbox @change="selectAllChanged" v-model="selectAllChecked">选择</el-checkbox><el-select v-show="$parent.selection.length > 1 && multiOperates.length > 0" value="" @change="selectOperate" placeholder="请选择操作项">
                      <el-option
                        v-for="item in multiOperates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <el-pagination class="page"
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="$parent.tmpCurrentPage"
                    :page-size.sync="$parent.tmpPageSize"
                    :total="$parent.total"
                    :layout="paginationLayout">
                  </el-pagination>
                  </div>`,
        data () {
          return {
            selectAllChecked: false,
            multiOperates: self.multiOperates
          }
        },
        beforeMount () {
          this.pageSize = this.$parent.pageSize
          this.paginationLayout = this.$parent.paginationLayout
        },
        methods: {
          selectAllChanged(val) {
            if(val) {
              this.$parent.store.isAllSelected = false
              this.$parent.store.mutations.toggleAllSelection.call(this.$parent.store, this.$parent.store.states)
            } else {
              this.$parent.store.clearSelection()
            }
          },
          selectOperate(e) {
            let fn = this.$parent.operateFuncs[e]
            if (typeof fn === 'function') {
              fn(this.$parent.store.states.selection)
            }
          },
          sizeChangeHandler (val) {
            this.$parent.tmpPageSize = val
          },
          currentChangeHandler (val) {
            this.$parent.tmpCurrentPage = val
          }
        }
      }))()
      this.pagination.$parent = this
      this.pagination.$mount()
      this.$el.appendChild(this.pagination.$el)
    },
    getData (pageIndex) {
      if (!pageIndex) {
        this.tmpCurrentPage = 1
      }
      let rows = this.selectedRows.concat()
      return new Promise(async (resolve, reject) => {

        const self = this
        let loadingInstance = Loading.service({ target: self.$el })
        let readUrl
        let options
        try{
          if (typeof this.dataReadUrl === 'string') {
            readUrl = this.dataReadUrl
            options = {
              params: {
                pageIndex: this.tmpCurrentPage,
                pageSize: this.tmpPageSize
              }
            }
          } else if (typeof this.dataReadUrl === 'function') {
            const result = this.dataReadUrl()
            readUrl = result[0]
            options = result[1]
            options.params = options.params || {}
            options.params.pageIndex = this.tmpCurrentPage
            options.params.pageSize = this.tmpPageSize
          }

          let res = await axios.get(readUrl, options)
          if (res.data.status === 0) {
            self.total = 0
            self.data.splice.apply(self.data, [0, self.data.length])
            loadingInstance.close()
            reject(res.data.message || `从接口${this.dataReadUrl}获取数据失败 ！`)
          }
          if (!res.data.total && res.data.data) {
            if (res.data.total === 0) {
              self.total = res.data.total
            } else if (res.data.data.length > 0 && this.pageSize) {
              reject('接口 ' + this.dataReadUrl + ' 没有返回 total ，无法设置数据表格的总记录数！')
            }
          } else {
            self.total = res.data.total
          }
          if (!Array.isArray(res.data.data)) {
            self.total = 0
            self.data.splice.apply(self.data, [0, self.data.length])
            reject('接口 ' + this.dataReadUrl + ' 没有返回 data ，无法设置数据表格的数据！')
          } else {
            self.data.splice.apply(self.data, [0, self.data.length].concat(res.data.data))
            self.afterSortData = [...self.data]
            self.$nextTick(() => {
              self.draggable && self.setSortable()
            })
            self.data.forEach(o => {
              rows.forEach(row => {
                if (this.compare(o, row)) {
                  self.toggleRowSelection(o)
                }
              })
            })
          }
          this.$nextTick(() => {
            loadingInstance.close()
          })
          resolve()
        }catch(e){
          loadingInstance.close()
        }
      })
    },
    compare (x, y) {
      if (x.ID && y.ID && x.ID === y.ID) {
        return true
      }

      for (let i in x) {
        if (!y.hasOwnProperty(i) || x[i] !== y[i]) {
          return false
        }
      }
      for (let i in y) {
        if (!x.hasOwnProperty(i) || x[i] !== y[i]) {
          return false
        }
      }
      return true
    }
  },
  watch: {
    tmpPageSize (val, oldVal) {
      // 当存在dataReadUrl时，且不是第一次挂载时获取的传值，从url获取数据，并更新data
      if (this.dataReadUrl && oldVal !== 0) {
        this.getData(this.tmpCurrentPage)
      }
    },
    tmpCurrentPage (val, oldVal) {
      // 当存在dataReadUrl时，且不是第一次挂载时获取的传值，从url获取数据，并更新data
      if (this.dataReadUrl && oldVal !== 0) {
        this.getData(this.tmpCurrentPage)
      }
    }
  }
}
