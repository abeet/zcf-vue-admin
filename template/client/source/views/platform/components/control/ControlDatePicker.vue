<template>
  <el-date-picker :value="value" :type="type" placeholder="选择日期时间" @change="startDateChange" format="yyyy-MM-dd" @input="inputHandler">
  </el-date-picker>
</template>

<style scoped>

</style>

<script>
  export default {
    data() {
      return {
        type: 'date'
      };
    },
    methods: {
      inputHandler(val){
        this.$emit('input', val.toString());
      },
      startDateChange(val){
        this.$emit('input', val.toString());
      }
    },
    watch: {
      config(val){
        this.type = val.type || 'date';
      }
    },
    props: [
      'value',
      'config'
    ],
    created() {
      this.type = this.config.type || 'date';
    }
  };
</script>
