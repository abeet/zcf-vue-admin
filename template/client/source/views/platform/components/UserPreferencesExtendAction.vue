<template>
  <div class="plugin">
    <div class="panel-card">
      <h4 class="panel-legend">系统管理</h4>
      <el-row :gutter="20">
        <el-col :span="9"><span>机构列表树初级加载层级：</span></el-col>
        <el-col :span="15">
          <control-number :value="preferences.branchListTreeLevel" @input="changeNumber" :min="1"></control-number>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ControlNumber from './control/ControlNumber.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    'control-number': ControlNumber
  },
  methods:{
    changeNumber(val){
      this.preferences.branchListTreeLevel = val;
    }
  },
  props: ['preferences']
}
</script>

<style scoped>
.plugin{
  border: 1px solid #f7f8fa;
  background-color: #f7f8fa;
}
.plugin .title{
  padding: 20px 10px 0;
}
.plugin .panel-card{
  padding: 10px;
}
.el-input-number{
  width: 115px;
}
</style>
