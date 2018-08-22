<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="addClick" priv="Platform.Code.Add">添加</el-button>&nbsp;
      <el-button icon="edit" :disabled="selectedRows.length !== 1 || selectedRows[0].isFixed" @click="editClick" priv="Platform.Code.Edit">编辑</el-button>&nbsp;
      <el-button icon="edit" :disabled="selectedRows.length !== 1 || selectedRows[0].isFixed" @click="showCodeItemsClick" priv="Platform.Code.Edit">编辑代码项</el-button>&nbsp;
      <el-button icon="minus" :disabled="selectedRows.length === 0 || selectedRows[0].isFixed" @click="deleteClickHandler" priv="Platform.Code.Delete">删除</el-button>&nbsp;
    </el-toolbar>

    <div class="layout-content-padding">
      <div class="layout-data-search layout-data-search-3 layout-data-search-con">
        <el-input placeholder="请输入代码类别或名称" v-model="searchCodeType" ></el-input>
        <el-button type='primary' @click="searchClickHandler">搜 索</el-button>
      </div>
      <el-table stripe tooltip-effect="dark" ref="table" @selection-change="onSelectionChange" :data-read-url="getData" :page-size="15">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="代码类别">
          <template slot-scope="scope">
            <a class="code-type" href="javascript:void(0)" @click="cellClickHandler(scope.row)">\{{scope.row.codeType}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="codeName" label="代码名称"></el-table-column>
        <el-table-column label="固定配置项" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" :style="{'color':'#67C23A'}" v-if="scope.row.isFixed"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
      </el-table>

    </div>

    <!--添加编辑框-->
    <el-dialog :title="editCodeMode === 1 ? '添加代码类别' : '编辑代码类别'" :visible.sync="editCodeDialog" class="codes-dialog">
      <el-form :model="tmpCode" :rules="codeRules" ref="codeForm" label-width="100px">
        <el-form-item label="代码类别" prop="codeType">
          <el-input v-model="tmpCode.codeType" :disabled="editCodeMode===2" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="代码名称" prop="codeName">
          <el-input v-model="tmpCode.codeName" style="width:250px"></el-input>
          <i class="fa fa-language" @click="langBtnClickHandler('codeName',tmpCode.codeName,tmpCode.name_I18N)"></i>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tmpCode.memo" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCodeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmClickHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!--代码项框-->
    <el-dialog title="代码项" :visible.sync="codeItemsDialog" size="large">
      <div class="items-dialog-wrap" v-loading="codeItemsLoading">
        <el-toolbar>
          <el-button icon="plus"
                     @click="addCodeItemClick">添加</el-button>&nbsp;
          <el-button icon="edit"
                     :disabled="codeItemSelectedRows.length !== 1 || codeItemSelectedRows[0].isFixed"
                     @click="editCodeItemClick">编辑</el-button>&nbsp;
          <el-button icon="minus"
                     :disabled="codeItemSelectedRows.length === 0 || codeItemSelectedRows[0].isFixed"
                     @click="deleteCodeItemClickHandler">删除</el-button>&nbsp;
        </el-toolbar>
        <el-table :data="codeItems" stripe tooltip-effect="dark" @selection-change="onCodeItemSelectionChange">
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <el-table-column prop="codeValue" label="值"></el-table-column>
          <el-table-column prop="codeName" label="名称"></el-table-column>
          <el-table-column prop="codeType" label="代码类别"></el-table-column>
          <el-table-column label="固定配置项" width="120" align="center">
            <template slot-scope="scope">
              <i class="fa fa-check icon-success" v-if="scope.row.isFixed"></i>
              <i class="fa fa-times icon-danger" v-else></i>
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="备注"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--添加编辑代码项-->
    <el-dialog :title="editCodeItemMode === 1 ? '添加代码项' : '编辑代码项'" :visible.sync="editCodeItemDialog" class="codes-dialog">
      <el-form :model="tmpCodeItem" :rules="codeItemRules" ref="codeItemForm" label-width="100px">
        <el-form-item label="代码" prop="codeType">
          <el-input v-model="tmpCodeItem.codeType" :readonly="true" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="codeValue" >
          <el-input v-model="tmpCodeItem.codeValue" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="codeName">
          <el-input v-model="tmpCodeItem.codeName" style="width:250px"></el-input>
          <i class="fa fa-language"
          @click="langBtnClickHandler('codeName',tmpCodeItem.codeName,tmpCodeItem.name_I18N)"></i>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tmpCodeItem.memo" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCodeItemDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmCodeItemClickHandler">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 多语言编辑器 -->
    <lang-edit-dlg
      :show.sync="langDialog.isShowModal"
      :ID="langDialog.ID"
      :targetValue="langDialog.targetValue"
      :languages="langDialog.languages"
      @callback="getI18nBack">
    </lang-edit-dlg>
  </div>
</template>

<style scoped>
.items-dialog-wrap {
  margin-left: -20px;
  margin-right: -20px;
}
.code-type:hover {
  color: #f80;
  text-decoration: none;
}
</style>

<script>
import util from '../../common/util.js'
import langEditDialog from '../member/langEditDialog.vue'
export default {
    components: {
    'lang-edit-dlg': langEditDialog
  },
  data() {
    return {
      langDialog: {
        isShowModal: false,
        ID: '',
        languages: '',
        targetValue: '',
      },
      codes: [],
      selectedRows: [],
      editCodeMode: 1, // 1： 添加， 2：编辑
      tmpCode: {},
      searchCodeType: '', /**查询关键字 */
      codeRules: {
        codeType: [
          { required: true, message: '请输入类别', trigger: 'blur' },
          {
              pattern: /^[\w\.\-_$]{0,40}$/,
              message: '请输入字母、数字、下划线、点且长度不超过40个字符',
              trigger: 'blur,change',
          }
        ],
        codeName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
              pattern: /^[\.-\w-\u4e00-\u9fa5]{0,2000}$/,
              message: '请输入汉字、字母、数字、点且长度不超过2000个字符',
              trigger: 'blur,change',
          }
        ]
      },
      editCodeDialog: false,
      codeItemsDialog: false,
      codeItems: [],
      codeItemsLoading: false,
      codeItemSelectedRows: [],
      editCodeItemMode: 1, // 1： 添加， 2：编辑
      tmpCodeItem: {},
      codeItemRules: {
        codeType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
        codeName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
              pattern: /^[\.-\w-\u4e00-\u9fa5]{0,2000}$/,
              message: '请输入汉字、字母、数字、点且长度不超过2000个字符',
              trigger: 'blur,change',
          }
        ],
        codeValue: [
          { required: true, message: '请输入值', trigger: 'blur' },
          {
              pattern: /^[\.-\w-\u4e00-\u9fa5]{0,40}$/,
              message: '请输入汉字、字母、数字、点且长度不超过40个字符',
              trigger: 'blur,change',
          }
        ]
      },
      editCodeItemDialog: false
    }
  },
  methods: {
    getI18nBack(data){
      this.tmpCode.name_I18N = data.data
    },
     /**打开多语言编辑框 */
    langBtnClickHandler(ID, value, languages) {
      this.langDialog.isShowModal = true
      this.langDialog.ID = ID
      this.langDialog.languages = languages
      this.langDialog.targetValue = value
    },
    onSelectionChange(selection) {
      this.selectedRows = selection
    },
    searchClickHandler() {
      this.$refs.table.getData()
    },
    /**获取表格数据 */
    getData() {
      return [
        '/api/codes',
        {
          params: {
            searchCodeType: this.searchCodeType
          }
        }
      ]
    },
    /**某一列被点击时触发事件 */
    async cellClickHandler(row) {
      if (!row || !row.codeType) {
        return
      }
      this.codeItemsDialog = true
      this.codeItemsLoading = true
      let res = await axios.get(`/api/codes/${row.codeType}/items`)
      this.codeItems = res.data.data
      this.codeItemsLoading = false
    },
    addClick() {
      this.editCodeMode = 1
      this.tmpCode = {
        codeType: '',
        codeName: '',
        isFixed: false,
        memo: ''
      }
      this.editCodeDialog = true
    },
    editClick() {
      this.editCodeMode = 2
      this.tmpCode = Object.assign({}, this.selectedRows[0])
      this.editCodeDialog = true
    },
    async confirmClickHandler() {
      let addForm = async () => {
        let res = await axios.post('/api/codes', this.tmpCode)
        if (res.data.status === 1) {
          util.showMessage(res)
          this.editCodeDialog = false
          this.$refs.table.getData()
        } else {
          util.showErrorMessageBox(res.data.message)
        }
      }
      let editForm = async () => {
        let res = await axios.put(`/api/codes/${this.tmpCode.codeType}`, this.tmpCode)

        if (res.data.status === 1) {
          util.showMessage(res)
          this.editCodeDialog = false
          this.$refs.table.getData()
        } else {
          util.showErrorMessageBox(res.data.message)
        }
      }
      try {
        await util.validateForm(this.$refs['codeForm'])
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      let res = ''
      if (this.editCodeMode === 1) {
        await addForm()
      }
      if (this.editCodeMode === 2) {
        await editForm()
      }
    },
    async deleteClickHandler() {
      let isEditable = !this.selectedRows.find(val => val.isFixed)
      if (!isEditable) {
        this.$alert('固定配置项不能被删除哦！', '不能被删除', {
          confirmButtonText: '确定'
        })
        return
      }
      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      let codeTypes = []
      this.selectedRows.forEach(function(row) {
        codeTypes.push(row.codeType)
      })
      let res = await axios.delete(`/api/codes/${codeTypes.join()}`)
      if (res.data.status === 1) {
        util.showMessage(res)
        this.$refs.table.getData()
      } else {
        util.showErrorMessageBox(res.data.message)
      }
    },
    async showCodeItemsClick() {
      this.codeItemsDialog = true
      this.codeItemsLoading = true
      let res = await axios.get(`/api/codes/${this.selectedRows[0].codeType}/items`)
      this.codeItems = res.data.data
      this.codeItemsLoading = false
    },
    onCodeItemSelectionChange(selection) {
      this.codeItemSelectedRows = selection
    },
    addCodeItemClick() {
      this.tmpCodeItem = {
        codeType: this.selectedRows[0].codeType,
        isFixed: false,
        codeName: '',
        codeValue: '',
        memo: ''
      }
      this.editCodeItemMode = 1
      this.editCodeItemDialog = true
    },
    editCodeItemClick() {
      this.tmpCodeItem = Object.assign({}, this.codeItemSelectedRows[0])
      this.tmpCodeItem.oldvalue = this.tmpCodeItem.codeValue
      this.editCodeItemMode = 2
      this.editCodeItemDialog = true
    },
    async confirmCodeItemClickHandler() {
      let addForm = async () => {
        let res = await axios.post(`/api/codes/${this.tmpCodeItem.codeType}/items`, this.tmpCodeItem)
        if (res.data.status === 1) {
          util.showMessage(res)
          this.editCodeItemDialog = false
          this.showCodeItemsClick()
        } else {
           util.showErrorMessageBox(res.data.message)
        }
      }
      let editForm = async () => {
        let res = await axios.put(`/api/codes/${this.tmpCodeItem.codeType}/items/${this.tmpCodeItem.oldvalue}`, this.tmpCodeItem)
        if (res.data.status === 1) {
          util.showMessage(res)
          this.editCodeItemDialog = false
          this.showCodeItemsClick()
        } else {
          util.showErrorMessageBox(res.data.message)
        }
      }
      try {
        await util.validateForm(this.$refs['codeItemForm'])
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      if (this.editCodeItemMode === 1) {
        await addForm()
      }
      if (this.editCodeItemMode === 2) {
        await editForm()
      }
    },
    async deleteCodeItemClickHandler() {
      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      let codeValues = []
      this.codeItemSelectedRows.forEach(function(row) {
        codeValues.push(row.codeValue)
      })
      let res = await axios.delete(`/api/codes/${this.codeItemSelectedRows[0].codeType}/items/${codeValues.join()}`)
      if (res.data.status === 1) {
        util.showMessage(res)
        this.editCodeItemDialog = false
        this.showCodeItemsClick()
      } else {
        util.showErrorMessageBox(res.data.message)
      }
    }
  },
  created() {}
}
</script>

<style>
/* 在一般情况下dialog宽为450像素，在逻辑分辨率480像素以下dialog宽为96% */
.codes-dialog .el-dialog {
  width: 450px;
}
@media (max-width: 480px) {
  .codes-dialog .el-dialog{
    width: 96%;
  }
}
</style>
<style scoped>
</style>
