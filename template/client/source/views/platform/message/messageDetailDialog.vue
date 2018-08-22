<template>
  <div>
    <el-dialog title="查看" :visible.sync="showLookMessageDialog" class="message-detail-dialog">
      <div style="height:360px; overflow:auto">
        <el-card class="box-card">
          <div v-if="userType==='to'" class="text item">
            <strong>接收人：</strong> <span v-html="tmpMessageDetail.toUser"></span>
          </div>
          <div v-else class="text item">
            <strong>发送人：</strong> <span v-html="tmpMessageDetail.fromUser"></span>
          </div>
          <div class="text item">
            <strong>发送时间：</strong> <span v-html="tmpMessageDetail.addTime"></span>
          </div>
          <div class="text item">
            <strong>标题：</strong> <span v-html="tmpMessageDetail.subject"></span>
          </div>
          <div class="text item">
            <strong>内容：</strong> <span v-html="tmpMessageDetail.content"></span>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showLookMessageDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    showLookMessageDialog: {
      get() {
        return this.showLookMessageShow
      },
      set(val) {
        this.$emit('update:showLookMessageShow', val)
      },
    },
  },
  methods: {},

  created() {},
  props: ['showLookMessageShow', 'tmpMessageDetail', 'userType'],
}
</script>
<style>
/* 在一般情况下dialog宽为700像素，在逻辑分辨率480像素以下dialog宽为96% */
.message-detail-dialog .el-dialog {
  width: 700px;
}
@media (max-width: 480px) {
  .message-detail-dialog .el-dialog {
    width: 96%;
  }
}
</style>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 10px 0;
}
</style>
