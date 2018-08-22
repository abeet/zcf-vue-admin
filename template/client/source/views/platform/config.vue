<template>
  <div class="layout-no-cols">
    <el-toolbar>
      <el-button icon="plus" @click="saveClick">保存</el-button>
    </el-toolbar>
    <div class="layout-content-padding scroll" v-loading="loading">
      <el-row>
        <el-col :span="16">
          <el-form ref="configValidate" label-width="380px" label-position="left" class="platform-config-form">
            <div v-for="config in configs" :key="config.id" class="config-group-wrap">
              <h3 class="header-title">\{{config.name}}</h3>
              <div v-for="item in config.configs" :key="item.id">
                <el-form-item :label="item.name+'：'">
                  <component :is="controlType(item)" v-model="item.value" :config="item"></component>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-col>

        <el-col :span="8">
          <el-card :body-style="{ padding: '15px' }" class="fixed-card" v-show="!loading">
            <ul class="config-type-list">
              <template v-for="(config, index) in configs">
              <li class="config-type-item" @click="itemClickHandler(index)">\{{config.name}}</li>
              </template>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ControlPassword from './components/control/ControlPassword.vue'
import ControlRadio from './components/control/ControlRadio.vue'
import ControlSelect from './components/control/ControlSelect.vue'
import ControlText from './components/control/ControlText.vue'
import ControlTextArea from './components/control/ControlTextArea.vue'
import ControlNumber from './components/control/ControlNumber.vue'
import util from '../../common/util'

export default {
  data() {
    return {
      loading: true,
      configs: {},
      ruleValidate: {}
    }
  },
  methods: {
    async saveClick() {
      try {
        var res = await axios.put('/api/configs/saved', { data: this.configs })
        res = res.data
      } catch (e) {
        util.showErrorNotification(e)
        return
      }
      util.showNotification(res)
    },
    controlType(item) {
      if (item.controlType === 'Text' && item.dataType === 'Long') {
        return 'control-number'
      }
      switch (item.controlType) {
        case 'Password':
          return 'control-password'
          break
        case 'Radio':
          return 'control-radio'
          break
        case 'Select':
          return 'control-select'
          break
        case 'Text':
          return 'control-text'
          break
        case 'TextArea':
          return 'control-text-area'
          break
        default:
          return ''
      }
    },
    itemClickHandler(index) {
      let scrollWrap = document.querySelector('.layout-content-padding'),
        configItems = document.querySelectorAll('.config-group-wrap'),
        topValue = 0

      for (let n = 0; n < index; n++) {
        topValue += configItems[n].offsetHeight
      }
      let padding = index * 10
      topValue += padding
      scrollWrap.scrollTop = topValue
    }
  },
  async created() {
    let data = await axios.get('/api/configs')
    data = data.data
    this.loading = false
    this.configs = data.data
    console.log(data.data)
  },
  components: {
    'control-password': ControlPassword,
    'control-radio': ControlRadio,
    'control-select': ControlSelect,
    'control-text': ControlText,
    'control-text-area': ControlTextArea,
    'control-number': ControlNumber
  }
}
</script>

<style scoped>
.header-title {
  text-indent: 30px;
  margin: 10px 0 20px;
}
.fixed-card {
  position: fixed;
  width: 22.5%;
  margin-left: 20px;
  margin-top: 20px;
}
.config-type-list {
  list-style: none;
  display: block;
}
.config-type-item {
  cursor: pointer;
  font-size: 14px;
  line-height: 2;
}
.config-type-item:hover {
  font-weight: 600;
}
</style>
<style>
.platform-config-form .el-form-item__label {
  text-indent: 60px;
}
</style>
