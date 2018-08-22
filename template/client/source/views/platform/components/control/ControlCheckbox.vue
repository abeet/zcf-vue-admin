<template>
  <el-checkbox-group :value="value" @input="inputHandler">
    <el-checkbox v-for="(item, index) in options" :key="index" :label="item.key">\{{item.value}}</el-checkbox>
  </el-checkbox-group>
</template>

<style scoped>

</style>

<script>
  import metadataAPI from '../../api/metadataAPI.js';

  export default {
    data() {
      return {
        options: []
      };
    },
    methods: {
      inputHandler(val){
        this.$emit('input', val);
      },
      async updateOptions(config){
        if(config.options && config.options.length){

          this.options = JSON.parse(JSON.stringify(config.options));
          return;
        }

        if(config.listOptions){
          let items = config.listOptions.split(':');
          if(items.length !== 2){
            this.options = [];
            return;
          }

          if(items[0] === 'Input'){
            let list = items[1].split('<br>');
            this.options = list.map(val => {
              return { value: val, key: val };
            });
            return;
          }

          let res = await metadataAPI.getMetadataFieldListOptions(items[0], items[1])
          this.options = res.data;
        }
      }
    },
    watch: {
      config(val){
        this.updateOptions(val);
      }
    },
    props: [
      'value',
      'config'
    ],
    created(){
      this.updateOptions(this.config);
    }
  };
</script>
