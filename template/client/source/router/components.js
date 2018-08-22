// 会被编译到本app.js中的组件
const components = {
  '_samples/index': require('../views/_samples/index.vue').default,
  '_samples/vueditor': require('../views/_samples/vueditor.vue').default,
  'error/notFound404': require('../views/error/notFound404.vue').default,
  'settings/index': require('../views/catalog/index.vue').default,
  'settings/catalog': require('../views/catalog/catalog.vue').default,
  'settings/dimension': require('../views/catalog/dimension.vue').default,

  'platform/index': require('../views/platform/index.vue').default,
  'platform/systemInfo': require('../views/platform/systemInfo.vue').default,
  'platform/detector': require('../views/platform/detector.vue').default,
  'platform/branch': require('../views/platform/branch.vue').default,
  'platform/role': require('../views/platform/role.vue').default,
  'platform/user': require('../views/platform/user.vue').default,
  'platform/security': require('../views/platform/security.vue').default,
  'platform/code': require('../views/platform/code.vue').default,
  'platform/config': require('../views/platform/config.vue').default,
  'platform/metadata': require('../views/platform/metadata.vue').default,
  'platform/schedule': require('../views/platform/schedule.vue').default,
  'platform/menu': require('../views/platform/menu.vue').default,
  'platform/plugin': require('../views/platform/plugin.vue').default,
  'platform/backup': require('../views/platform/backup.vue').default,
  'logs/log': require('../views/logs/log.vue').default,
  'platform/api': require('../views/platform/api.vue').default
}
export default components
