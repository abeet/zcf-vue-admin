<template>
      <el-table :data="permissions" stripe :height="tableHeight">
        <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :render-header="renderHeaderFunc"
          :width="column.width">
          <template slot-scope="scope">
            <template v-if="index===0">
              <span v-for="levelIndex in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
              <el-checkbox :align="left" v-model="scope.row[column.dataIndex].value" @change="onRowCheckClick($event,scope.row)" :disabled="scope.row[column.dataIndex].disabled"></el-checkbox>
              <span style="margin-left:5px;" class="haschildren-link" @click="loadChildren(scope.row)" v-if="scope.row['childCount']>0">\{{scope.row['name']}}</span>
              <span style="margin-left:5px;" v-else>\{{scope.row['name']}}</span>
            </template>
            <el-checkbox v-else v-model="scope.row[column.dataIndex].value" :disabled="scope.row[column.dataIndex].disabled" @change="checkBoxChangeHandler($event, scope.row,column.dataIndex)">
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
</template>

<style scoped>
  .haschildren-link {
    color: #08d
  }

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: '';
  }
</style>

<script>
import util from '../../../common/util'
export default {
  data () {
    return {
      isAllChecked: false,
      tableHeight: 0
    }
  },
  props: {
    'permissions': {
      type: Array,
      required: true,
      default: []
    },
    'columns': {
      type: Array,
      required: true,
      default: []
    },
    'updatedPermissions': {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {},
  methods: {
    selectedAllHandler () {
      if (this.isAllChecked) {
        this.isAllChecked = false
      } else {
        this.isAllChecked = true
      }
      this.permissions.forEach(row => {
        this.columns.forEach((column, index) => {
          let updateKey = ''
          if (index == 0) {
            updateKey = column.dataIndex + row.ID
          } else {
            updateKey = column.dataIndex + '.' + row.ID
          }
          if (row[column.dataIndex].value != this.isAllChecked && !row[column.dataIndex].disabled) {
            this.updatedPermissions[updateKey] = this.isAllChecked ? 1 : 0
            row[column.dataIndex].value = this.isAllChecked
          }
        })
      })
    },
    async applyToChildren () {
      this.saveLoading = true
      let parentPrivMap = {}
      this.permissions.forEach(val => {
        this.columns.forEach((col, index) => {
          if (val[col.dataIndex].value) {
            if (index == 0) {
              parentPrivMap[col.dataIndex + val.ID] = val[col.dataIndex].value ? 1 : 0
            } else {
              parentPrivMap[col.dataIndex + '.' + val.ID] = val[col.dataIndex].value ? 1 : 0
            }
          }
        })
      })
      let privPrefix = this.columns[0].dataIndex
      return { 'parentPrivMap': parentPrivMap, 'privPrefix': privPrefix, 'privMap': this.updatedPermissions }
    },
    renderHeaderFunc (h, { column, $index }) {
      console.log(h)
      if ($index < 1) {
        return column.label
      } else {
        let xx = h(
          'el-checkbox',
          {
            props: {
              label: column.label,
              type: 'checkbox'
            },
            on: {
              change: val => this.onColumnClick(val, this.columns[$index])
            }
          },
          column.label
        )
        console.log(xx)
        return xx
      }
    },
    onColumnClick (isChecked, column) {
      let key = column.dataIndex
      this.permissions.forEach(val => {
        if (!val[key].disabled) {
          val[key].value = isChecked
          this.updatedPermissions[key + '.' + val.ID] = isChecked ? 1 : 0
          // 遍历所有选项，判断区块选项是否需要勾选
          let isRowNodeChecked = false
          if (isChecked) {
            isRowNodeChecked = true
          } else {
            this.columns.forEach((col, index) => {
              if (index > 0) {
                if (val[col.dataIndex].value) {
                  isRowNodeChecked = true
                }
              }
            })
          }
          if (val[this.columns[0].dataIndex].value != isRowNodeChecked && !val[this.columns[0].dataIndex].disabled) {
            val[this.columns[0].dataIndex].value = isRowNodeChecked
            this.updatedPermissions[this.columns[0].dataIndex + val.ID] = isRowNodeChecked ? 1 : 0
          }
        }
      })
    },
    checkBoxChangeHandler (isChecked, row, dataIndex) {
      this.updatedPermissions[dataIndex + '.' + row.ID] = isChecked ? 1 : 0
      let isRowNodeChecked = false
      if (isChecked) {
        isRowNodeChecked = true
      } else {
        this.columns.forEach((val, index) => {
          if (index > 0) {
            if (row[val.dataIndex].value) {
              isRowNodeChecked = true
            }
          }
        })
      }
      let firstDataIndex = this.columns[0].dataIndex
      if (row.childCount == 0 || row._level > 0 || isChecked) {
        if (row[firstDataIndex].value != isRowNodeChecked && !row[firstDataIndex].disabled) {
          row[firstDataIndex].value = isRowNodeChecked
          this.updatedPermissions[firstDataIndex + row.ID] = isRowNodeChecked ? 1 : 0
        }
      }
      if (isRowNodeChecked) {
        let parentID = row.parentID
        // 遍历所有节点，找到父级节点
        for (let i = 0; i < this.permissions.length; i++) {
          if (this.permissions[i].ID == parentID && this.permissions[i][firstDataIndex].value != isRowNodeChecked && !this.permissions[i][firstDataIndex].disabled) {
            this.permissions[i][firstDataIndex].value = isRowNodeChecked
            this.updatedPermissions[firstDataIndex + this.permissions[i].ID] = isRowNodeChecked ? 1 : 0
            break
          }
        }
      }
    },
    onRowCheckClick (isChecked, row) {
      let ID = row.ID
      let parentID = row.parentID
      this.columns.forEach((column, index) => {
        row[column.dataIndex].value = isChecked
        if (index == 0) {
          this.updatedPermissions[column.dataIndex + ID] = isChecked ? 1 : 0
        } else {
          this.updatedPermissions[column.dataIndex + '.' + ID] = isChecked ? 1 : 0
        }
        // 父级节点全选择时，需要把子节点也全选择了
        if (ID != 0) {
          this.permissions.forEach(val => {
            if (val.parentID == ID) {
              val[column.dataIndex].value = isChecked
              if (index == 0) {
                this.updatedPermissions[column.dataIndex + val.ID] = isChecked ? 1 : 0
              } else {
                this.updatedPermissions[column.dataIndex + '.' + val.ID] = isChecked ? 1 : 0
              }
            }
            if (isChecked) {
              if (val.ID == parentID && val[this.columns[0].dataIndex].value != isChecked) {
                val[this.columns[0].dataIndex].value = isChecked
                this.updatedPermissions[this.columns[0].dataIndex + '.' + val.ID] = isChecked ? 1 : 0
              }
            }
          })
        }
      })
    },
    loadChildren (row) {
      this.$emit('loadChildren', row)
    }
  },
  components: {
  },
  mounted () {
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    this.tableHeight = windowHeight * 0.7 - 160
  }
}
</script>
