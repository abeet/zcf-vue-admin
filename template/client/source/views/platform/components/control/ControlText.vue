<template>
  <el-input :value="value" @input="inputHandler" :maxlength="max"></el-input>
</template>

<script>
export default {
  computed: {
    max () {
      if (this.config.dataType === 'ShortText') {
        return 50
      }
      if (this.config.dataType === 'LargeText') {
        return 200
      }

      return null
    }
  },
  methods: {
    inputHandler (val) {
      this.$emit('input', val)
    }
  },
  props: [
    'value',
    'config'
  ]
}
</script>

<style>

</style>
