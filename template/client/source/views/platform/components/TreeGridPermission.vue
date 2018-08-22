<template>
      <el-table :data="value">
        <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :render-header="renderHeaderFunc"
          :width="column.width">
          <template slot-scope="scope">
            <template v-if="index===0">
              <span v-for="levelIndex in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
              <el-checkbox :value="scope.row[column.dataIndex].value" @change="onRowCheckClick($event,scope.row)" :disabled="scope.row[column.dataIndex].disabled"></el-checkbox>
              <span style="margin-left:5px;" class="haschildren-link" @click="loadChildren(scope.row)" v-if="scope.row['hasChildren']">\{{scope.row['name']}}</span>
              <span style="margin-left:5px;" v-else>\{{scope.row['name']}}</span>
            </template>
            <span v-else-if="column.noCheckBox">\{{scope.row[column.dataIndex]}}</span>
            <el-checkbox v-else-if="scope.row[column.dataIndex].disabled!=='disabled'" :value="scope.row[column.dataIndex].value" :disabled="scope.row[column.dataIndex].disabled" @change="checkBoxChangeHandler($event, scope.row,column.dataIndex)">
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
</template>

<style scoped>
  .haschildren-link {
    color: #28b06e;
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
  export default {
    data() {
      return {
        isAllChecked: false,
      }
    },
//由于用了JSON来做拷贝对象的转换方式，所以请使用比较简单的数组，不要用层层嵌套
    props: {
      'value': {
        type: Array,
        required: true,
        default: []
      },
      'columns': {
        type: Array,
        required: true,
        default: []
      }
    },
    computed: {},
    methods: {
      selectedAllHandler() {
        let responseData = JSON.parse(JSON.stringify(this.value))
        if (this.isAllChecked) {
          this.isAllChecked = false;
        } else {
          this.isAllChecked = true;
        }
        responseData.forEach(row => {
          this.columns.forEach((column, index) => {
            if(!column.noCheckBox){
              if (row[column.dataIndex].value != this.isAllChecked&&!row[column.dataIndex].disabled) {
                row[column.dataIndex].value = this.isAllChecked;
              }
            }
          })
        })
        this.$emit("input",responseData);
      },
      renderHeaderFunc(h, { column, $index }) {
        if ($index < 1||this.columns[$index].noCheckBox) {
          return column.label
        } else {
          return h(
            'el-checkbox',
            {
              props: {
                label: column.label,
                type: 'checkbox'
              },
              on: {
                change: val => this.onColumnClick(val, this.columns[$index]),
              }
            },
            column.label
          )
        }
      },
      onColumnClick(isChecked, column) {
        let responseData = JSON.parse(JSON.stringify(this.value))
        let key = column.dataIndex
        responseData.forEach(val => {
          if(!val[key].disabled){
            val[key].value = isChecked
            //遍历所有选项，判断选项是否需要勾选
            let isRowNodeChecked = false;
            if (isChecked) {
              isRowNodeChecked = true;
            } else {
              this.columns.forEach((col, index) => {
                if (index > 0&&!col.noCheckBox) {
                  if (val[col.dataIndex].value) {
                    isRowNodeChecked = true
                  }
                }
              })
            }
            if (val[this.columns[0].dataIndex].value != isRowNodeChecked&&!val[this.columns[0].dataIndex].disabled) {
              val[this.columns[0].dataIndex].value = isRowNodeChecked;
            }
          }
        })
         this.$emit("input",responseData);
      },
      checkBoxChangeHandler(isChecked, row, dataIndex) {
        let responseData = JSON.parse(JSON.stringify(this.value))
        let isRowNodeChecked = false;
        if (isChecked) {
          isRowNodeChecked = true;
        } else {
          this.columns.forEach((val, index) => {
            if (index > 0&&!val.noCheckBox) {
              if (row[val.dataIndex].value) {
                isRowNodeChecked = true;
              }
            }
          })
        }
        let parentID = row.parentID;
        let ID=row.ID
        let firstDataIndex = this.columns[0].dataIndex;
          //遍历所有节点,找到节点以及他的父节点
        responseData.forEach(val=>{
          if(val.ID===ID){
            val[dataIndex].value=isChecked
            if ( val.hasChildren ||  val._level > 0 || isChecked) {
              if ( val[firstDataIndex].value != isRowNodeChecked&&! val[firstDataIndex].disabled) {
                val[firstDataIndex].value = isRowNodeChecked;
              }
            }
          }else if (val.ID == parentID && val[firstDataIndex].value != isRowNodeChecked&& !val[firstDataIndex].disabled) {
            val[firstDataIndex].value = isRowNodeChecked;
          }
        })
         this.$emit("input",responseData)
      },
      onRowCheckClick(isChecked, row) {
        let responseData = JSON.parse(JSON.stringify(this.value))
        let ID = row.ID
        let parentID = row.parentID
        this.columns.forEach((column, index) => {
          //父级节点全选择时，需要把子节点也全选择了
          if (ID != 0&&!column.noCheckBox) {
            responseData.forEach(val => {
              if ((val.parentID === ID||val.ID === ID) && !val[column.dataIndex].disabled) {
                val[column.dataIndex].value = isChecked;
              }
              if (isChecked) {
                if (val.ID === parentID && val[this.columns[0].dataIndex].value != isChecked && !val[column.dataIndex].disabled) {
                  val[this.columns[0].dataIndex].value = isChecked;
                }
              }
            })
          }
        })
         this.$emit("input",responseData);
      },
      loadChildren(row) {
        this.$emit('load-children', row)
      }
    },
    components: {
    }
  }
</script>
