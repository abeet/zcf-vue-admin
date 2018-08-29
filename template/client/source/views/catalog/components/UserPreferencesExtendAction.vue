<template>
  <div class="plugin">
    <div class="panel-card">
      <h4 class="panel-legend">内容核心</h4>
      <el-row :gutter="20">
        <el-col :span="9"><span>是否默认显示副标题与短标题 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.showSubTitleAndShortTitle" active-value="Y" inactive-value="N"></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>内容复制默认为映射 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.copyDefaultMapping" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>栏目树初次加载层级 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <control-number :value="preferences.catalogTreeLevel" @input="changeCatalogTreeLevel" :min="1"></control-number>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>文档列表是否加载子级栏目内容 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.listShowSubcatalogContent" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>是否默认显示隐藏的栏目 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.showHiddenCatalog" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>是否自动填充内容作者 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.autoFillContentAuthor" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>是否自动填充内容编辑 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.autoFillContentEditor" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9"><span>插入图片是否显示图片名称 ：</span></el-col>
        <el-col :span="15">
          <div class="p-b">
            <el-switch v-model="preferences.showImageName" active-value="Y" inactive-value="N" ></el-switch>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ControlNumber from '../../platform/components/control/ControlNumber.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    'control-number': ControlNumber
  },
  methods: {
    changeCatalogTreeLevel (val) {
      this.preferences.catalogTreeLevel = val
    }
  },
  props: ['preferences']
}
</script>

<style scoped>
.plugin {
  border: 1px solid #f7f8fa;
  background-color: #f7f8fa;
}
.plugin .title {
  padding: 20px 10px 0;
}
.plugin .panel-card {
  padding: 10px;
}
.el-input-number{
  width: 115px;
}
.p-b{
  padding-bottom: 10px;
}
</style>
