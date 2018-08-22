<template>
  <el-dialog :title="title" :visible="isShowModal" @update:visible="closeHandler">
    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
    <p class="progress-text" v-if="text">\{{text}}</p>
  </el-dialog>
</template>

<script>
  export default {
    methods: {
      closeHandler(val){
//        console.log(val);
        this.$emit('close', val);
      }
    },
    props: {
      'isShowModal': {
        type: Boolean,
        required: true
      },
      'percentage': {
        type: Number,
        required: true
      },
      'text': {
        type: String,
        default: ''
      },
      'title': {
        type: String,
        default: ''
      }
    }
  }
</script>

<style>

</style>