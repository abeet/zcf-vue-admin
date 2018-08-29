<template>
  <div>
    <template v-for="extend in UIExtends">
      <component :is="extend"  :preferences="preferences" :key="'key_'+extend"></component>
    </template>
  </div>
</template>

<script>
import SystemPreferencesExtend from '../../platform/components/UserPreferencesExtendAction.vue'
import CatalogPreferencesExtend from '../../catalog/components/UserPreferencesExtendAction.vue'
import BlockPreferencesExtend from '../../block/components/UserPreferencesExtendAction.vue'
import ArticlePreferencesExtend from '../../article/components/UserPreferencesExtendAction.vue'

export default {
  data () {
    return {
      UIExtends: ['system-preference', 'catalog-preference', 'block-preference', 'article-preference']
    }
  },
  components: {
    'system-preference': SystemPreferencesExtend,
    'catalog-preference': CatalogPreferencesExtend,
    'block-preference': BlockPreferencesExtend,
    'article-preference': ArticlePreferencesExtend
  },
  props: ['preferences']
}
</script>
