<template>
  <div class="pane-wrap">
    <div class="plugin">
      <div class="panel-card">
        <h4 class="panel-legend">基础平台</h4>
        <shortcut-select :preferences="preferences"></shortcut-select>
      </div>
    </div>
    <user-preferences-extend :preferences="preferences"></user-preferences-extend>
  </div>
</template>

<script>
import ShortcutSelect from './ShortcutSelect.vue'
import util from '../../../common/util.js'
import UserPreferencesExtend from './UserPreferencesExtend.vue'
export default {
  data () {
    return {
      preferences: {}
    }
  },
  methods: {
    async savePreferences () {
      console.log(this.preferences)
      let data = await axios.put('/api/users/preferences', this.preferences).then(res => res.data)
      if (data.status === 1) {
        util.showSuccess(data.message)
        this.$emit('close-dialog')
        if (window.refreshShortcut) {
          document.dispatchEvent(window.refreshShortcut)
        }
      } else {
        util.showErrorMessageBox(data.message)
      }
    }
  },
  components: {
    'shortcut-select': ShortcutSelect,
    'user-preferences-extend': UserPreferencesExtend
  },
  created: async function () {
    let preferenceRes = await axios.get('/api/users/preferences')
    this.preferences = preferenceRes.data.data
  }
}

</script>

<style scoped>
.pane-wrap{
  margin-top: 20px;
}
.plugin{
  border: 1px solid #f7f8fa;
  background-color: #f7f8fa;
}
.plugin .title{
  padding: 20px 10px 0;
}
.plugin .panel-card{
  padding: 10px;
}
</style>
