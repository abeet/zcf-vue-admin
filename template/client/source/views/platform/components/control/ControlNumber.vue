<template>
  <el-input-number :value="value" @change="inputHandler" @input="inputHandler"></el-input-number>
</template>

<script>
export default {
  methods: {
    inputHandler (val) {
      this.$emit('input', val)
    }
  },
  props: [
    'value',
    'config'
  ],
  created () {
  }
}
</script>

<style>

</style>
