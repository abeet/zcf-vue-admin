<style>
.image-cutting-dialog .el-dialog__body {
  padding: 0 20px 20px;
}
.image-cutting-dialog .el-tabs--border-card > .el-tabs__content {
  padding: 15px;
}
</style>

<style scoped>

</style>

<template>
  <el-dialog title="图片处理" :visible.sync="isShow" @open="dialogOpen" width="60%" class="image-cutting-dialog" :append-to-body="true">
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane label="裁剪&缩略" name="cut">
        <image-cut :image-path.sync="prePath" :path.sync="path" :siteID="siteID" :active-tab="activeTabName" @close="handleClose"></image-cut>
      </el-tab-pane>
      <el-tab-pane label="图片旋转" name="rotate">
        <image-rotate :image-path.sync="prePath" :path.sync="path" :siteID="siteID" :active-tab="activeTabName"></image-rotate>
      </el-tab-pane>
      <el-tab-pane label="图片水印" name="watermark">
        <image-watermark :image-path.sync="prePath" :path.sync="path" :siteID="siteID" :active-tab="activeTabName"></image-watermark>
      </el-tab-pane>
      <el-tab-pane label="文字水印" name="textWatermark">
        <image-text-watermark :image-path.sync="prePath" :path.sync="path" :siteID="siteID" :active-tab="activeTabName"></image-text-watermark>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import imageCuttingCut from './imageCutting/imageCuttingCut.vue'
import imageCuttingRotate from './imageCutting/imageCuttingRotate.vue'
import imageCuttingWatermark from './imageCutting/imageCuttingWatermark.vue'
import imageCuttingTextWatermark from './imageCutting/imageCuttingTextWatermark.vue'

export default {
  props: {
    siteID: {
      type: [Number, String],
      default: 0
    },
    imagePath: {
      default: '',
      required: true
    },
    show: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      activeTabName: 'cut',
      path: '',
      prePath: ''
    }
  },
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    async dialogOpen () {
      let res = await axios.get('/api/commonimagecutting/init', {
        params: {
          path: this.imagePath,
          siteID: this.siteID
        }
      })
      this.path = res.data.data.path
      this.prePath = res.data.data.prefix + res.data.data.path
    },
    confirm () {
      this.$emit('callback', this.prePath, this.path)
      this.isShow = false
    },
    handleClose (val) {
      this.isShow = val
    }
  },
  created () {},
  components: {
    'image-cut': imageCuttingCut,
    'image-rotate': imageCuttingRotate,
    'image-watermark': imageCuttingWatermark,
    'image-text-watermark': imageCuttingTextWatermark
  }
}
</script>
