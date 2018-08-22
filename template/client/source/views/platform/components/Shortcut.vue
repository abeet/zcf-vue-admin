<template>
  <div class="shortcut-list">
    <el-row>
      <el-col :span="layoutCol" v-for="shortcut in shortcuts" v-bind:key="shortcut.ID">
        <div class="shortcut-item" @click="redirectUrl(shortcut.URL)">
          <i class="shortcut-item-icon" v-bind:class="shortcut.icon"></i>
          <div class="label">\{{ shortcut.name }}</div>
        </div>
      </el-col>
      <div class="btn-wrap">
        <el-button v-if="!hideBtn" @click="openUserSetting" size="small"><i class="el-icon-plus"></i>添加新的快捷功能</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shortcuts: [],
    };
  },
  methods: {
    async getShortcutList() {
      let shortcutRes = await axios
        .get('/api/users/shortcuts', { params: { menuIDs: this.menuIds } })
      this.shortcuts = shortcutRes.data.data;
    },
    openUserSetting() {
      let self = this;
      document.dispatchEvent(window.openUserSettingDialog);
      window.refreshShortcut = new Event('refreshshortcut');
      document.addEventListener('refreshshortcut', function() {
        self.getShortcutList();
      });
    },
    redirectUrl(url) {
      if (url) {
        document.dispatchEvent(window.closeUserSettingDialog);
        window.location.hash = url;
        localStorage.lastRoutePath = url;
      }
    },
  },
  watch: {
    menuIds: function() {
      this.getShortcutList();
    },
  },
  created: async function() {
    this.getShortcutList();
  },
  props: ['menuIds', 'layoutCol', 'hideBtn'],
};
</script>

<style scoped>
.shortcut-item {
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.shortcut-item-icon {
  display: inline-block;
}
.shortcut-item > .label {
  color: #999;
  display: block;
}
.btn-wrap {
  display: inline-block;
  margin-top: 5px;
}
</style>
