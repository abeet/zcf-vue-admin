<template>
  <div class="layout-no-cols">
    <el-toolbar>
    </el-toolbar>
    <div class="layout-content-padding">
      <el-table :data="detectors" stripe tooltip-effect="dark" style="width: 100%" v-loading="dataLoading">
        <el-table-column type="index" :index="indexMethod" label="序号" width="76" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" width="150"></el-table-column>
        <el-table-column prop="code" label="项" width="180"></el-table-column>
        <el-table-column label="结果" width="76" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.result==='Y'"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="仪表盘显示" width="110" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.dashboard==='Y'"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="定时刷新" width="100" align="center">
          <template slot-scope="scope">
            <i class="fa fa-check icon-success" v-if="scope.row.timer==='Y'"></i>
            <i class="fa fa-times icon-danger" v-else></i>
          </template>
        </el-table-column>
        <el-table-column  label="信息">
          <template slot-scope="scope">
                <div v-html="scope.row.info"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataLoading: true,
      detectors: []
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    }
  },
  async created () {
    const resp = await axios.get('/api/detectors')
    this.detectors = resp.data.data
    this.dataLoading = false
  }
}

</script>
