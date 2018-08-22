<template>
  <div>
    <div id="hotarea" style="background: url(/assets/images/picture.jpg) no-repeat;">
      <a value="1" v-bind:class="{'selected': selectedIsActive.isActive1}" @click="selectPosition('1')" href="javascript:void(0)"
        style="left: 5px; top: 5px;" :disabled="disabled">左上</a>
      <a value="2" v-bind:class="{'selected': selectedIsActive.isActive2}" @click="selectPosition('2')" href="javascript:void(0)"
        style="left: 37%; top: 5px;" :disabled="disabled">上</a>
      <a value="3" v-bind:class="{'selected': selectedIsActive.isActive3}" @click="selectPosition('3')" href="javascript:void(0)"
        style="right: 5px; top: 5px;" :disabled="disabled">右上</a>
      <a value="4" v-bind:class="{'selected': selectedIsActive.isActive4}" @click="selectPosition('4')" href="javascript:void(0)"
        style="left: 5px; top: 40%" :disabled="disabled">左</a>
      <a value="5" v-bind:class="{'selected': selectedIsActive.isActive5}" @click="selectPosition('5')" href="javascript:void(0)"
        style="left: 37%; top: 40%" :disabled="disabled">中</a>
      <a value="6" v-bind:class="{'selected': selectedIsActive.isActive6}" @click="selectPosition('6')" href="javascript:void(0)"
        style="top: 40%; right: 5px;" :disabled="disabled">右</a>
      <a value="7" v-bind:class="{'selected': selectedIsActive.isActive7}" @click="selectPosition('7')" href="javascript:void(0)"
        style="left: 5px; bottom: 5px;" :disabled="disabled">左下</a>
      <a value="8" v-bind:class="{'selected': selectedIsActive.isActive8}" @click="selectPosition('8')" href="javascript:void(0)"
        style="left: 37%; bottom: 5px;" :disabled="disabled">下</a>
      <a value="9" v-bind:class="{'selected': selectedIsActive.isActive9}" @click="selectPosition('9')" href="javascript:void(0)"
        style="right: 5px; bottom: 5px;" :disabled="disabled">右下</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedIsActive: {
        isActive1: false,
        isActive2: false,
        isActive3: false,
        isActive4: false,
        isActive5: false,
        isActive6: false,
        isActive7: false,
        isActive8: false,
        isActive9: true
      } //水印位置样式绑定flag
    }
  },
  computed: {
    waterPosition: {
      get() {
        return this.position
      },
      set(val) {
        this.$emit('update:position', val)
      }
    }
  },
  watch: {
    waterPosition(val) {
      this.selectPosition(val)
    }
  },
  methods: {
    // 选中水印位置
    selectPosition(ref) {
      for (let i = 0; i < 9; i++) {
        this.selectedIsActive['isActive' + (i + 1)] = false
      }
      this.selectedIsActive['isActive' + ref] = true
      this.waterPosition = ref
    }
  },
  props: {
    position: {
      required: true,
      default: 9
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
#hotarea {
  width: 120px;
  height: 100px;
  position: relative;
}

#hotarea a {
  position: absolute;
  display: block;
  width: 30px;
  height: 20px;
  line-height: 20px;
  border: #fff 1px dashed;
  text-align: center;
  color: #fff;
}

#hotarea a:hover {
  text-decoration: none;
  border: #fff 1px solid;
  color: #fff;
}

#hotarea a.selected {
  background-color: #fff;
}

selected {
  background-color: #fff;
}
</style>
