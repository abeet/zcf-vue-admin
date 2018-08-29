<style scoped>
  .cutting-wrap {
    height: calc(50vh);
    min-height: 418px;
    *zoom: 1;
  }
  .cutting-wrap:before,
  .cutting-wrap:after {
    display: table;
    content: "";
  }
  .cutting-wrap:after {
    clear: both;
  }

  .cutting-wrap .cutting-left {
    float: left;
    width: 240px;
    height: 100%;
    padding: 10px;
    border: 1px solid #eee;
  }
  .cutting-wrap .cutting-right {
    margin-left: 255px;
    height: 100%;
    padding: 10px;
    background-color: #eee;
  }
</style>

<template>
  <div class="cutting-wrap" v-loading="loading">
    <div class="cutting-left">
      <slot>
        cutting
      </slot>
    </div>
    <div class="cutting-right">
      <slot name="preview">
        cutting preview
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {},
  created () {
  }
}
</script>
