<style scoped>
  .operate-item {
    font-size: 12px;
    margin-bottom: 6px;
    border-bottom: 1px solid #eee;
  }

  .operate-item:last-child {
    margin-bottom: 0;
    border-bottom: 0 none;
  }
  .m-b{
    margin-bottom: 4px;
  }
  .btn {
    width: 100%;
  }

  .preview-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    user-select: none;
    position: relative;
  }

  .preview-image-wrap {
    position: absolute;
    background-color: #fff;
  }

  .preview-image-wrap .preview-image{
    display: block;
    width: 100%;
    height: 100%;
  }

  .canvas-wrap {
    position: absolute;
  }
  .canvas-wrap .preview-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>

<template>
  <cutting-container :loading="isLoading">
    <div class="cut-operate">
      <el-row class="operate-item">
        <el-col :span="24">旋转方式：</el-col>
        <el-col :span="10" :offset="8" class="m-b">
          <el-button class="btn" @click="handleRotate(-90)">左转</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="m-b">
          <el-button class="btn"  @click="handleRotate(90)">右转</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="m-b">
          <el-button class="btn"  @click="handleScaleX()">水平旋转</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="m-b">
          <el-button class="btn"  @click="handleScaleY()">垂直旋转</el-button>
        </el-col>
      </el-row>

      <el-row class="operate-item">
        <el-col :span="8" :offset="8">
          <el-button type="primary" class="btn" @click="handleConfirm" :loading="confirmLoading">应用</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="preview-wrap" ref="previewWrap" slot="preview">
      <div class="canvas-wrap" :style="{
          top: previewImageTop + 'px',
          left: previewImageLeft + 'px',
          width: realWidth + 'px',
          height: realHeight + 'px'
      }">
        <canvas class="preview-canvas" ref="previewCanvas"></canvas>
      </div>
    </div>
  </cutting-container>
</template>

<script>
import util from '../../../common/util.js'
import imageCuttingContainer from './imageCuttingContainer.vue'
import { imageLoad, getImageType, uploadBase64Image } from './imageCuttingUtil'

export default {
  data () {
    return {
      isLoading: false,
      realWidth: 0,
      realHeight: 0,
      previewWrap: {
        width: 0,
        height: 0
      },
      confirmLoading: false,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      image: {}
    }
  },
  props: {
    imagePath: {
      type: String,
      default: '',
      required: true
    },
    activeTab: {
      type: String,
      default: ''
    },
    siteID: {
      type: [String, Number],
      required: true
    },
    path: {
      type: String,
      default: '',
      required: true
    }
  },
  watch: {
    activeTab (val) {
      if (val === 'rotate') {
        this.init()
      }
    },
    imagePath () {
      if (this.activeTab === 'rotate') {
        this.init()
      }
    }
  },
  computed: {
    previewImageTop () {
      if (this.realHeight >= this.previewWrap.height) return 0

      return (this.previewWrap.height - this.realHeight) / 2
    },
    previewImageLeft () {
      if (this.realWidth >= this.previewWrap.width) return 0

      return (this.previewWrap.width - this.realWidth) / 2
    }
  },
  methods: {
    async init () {
      this.isLoading = true
      let img
      try {
        img = await imageLoad(this.imagePath)
      } catch (e) {
        return
      }

      this.realWidth = img.width
      this.realHeight = img.height
      this.image = img
      this.angle = 0

      Object.assign(this.previewWrap, {
        width: this.$refs['previewWrap'].offsetWidth,
        height: this.$refs['previewWrap'].offsetHeight
      })

      this.renderCanvas()

      this.isLoading = false
    },
    renderCanvas () {
      const canvas = this.$refs['previewCanvas']
      const img = this.image
      if (Math.abs(this.angle) === 90 || Math.abs(this.angle) === 270) {
        this.realWidth = img.height
        this.realHeight = img.width

        canvas.height = img.width
        canvas.width = img.height
      } else {
        this.realWidth = img.width
        this.realHeight = img.height

        canvas.width = img.width
        canvas.height = img.height
      }

      const context = canvas.getContext('2d')

      // const x = canvas.width / 2
      // const y = canvas.height / 2
      context.clearRect(0, 0, canvas.width, canvas.height)
      // context.translate(x, y)
      // todo: 水平翻转，垂直翻转有bug，待我查查文档
      // context.scale(this.scaleX, this.scaleY);
      context.rotate((Math.PI / 180) * this.angle)
      // context.translate(-x, -y)

      if (this.angle === 90 || this.angle === -270) {
        context.drawImage(img, 0, -img.height, img.width, img.height)
      } else if (this.angle === -90 || this.angle === 270) {
        context.drawImage(img, -img.width, 0, img.width, img.height)
      } else if (Math.abs(this.angle) === 180) {
        context.drawImage(img, -img.width, -img.height, img.width, img.height)
      } else {
        context.drawImage(img, 0, 0, img.width, img.height)
      }
    },
    async handleConfirm () {
      this.confirmLoading = true

      const canvas = this.$refs['previewCanvas']
      const type = getImageType(this.imagePath)
      const newImg = canvas.toDataURL(type)

      const res = await uploadBase64Image(newImg, this.path, this.siteID)
      util.showResponseMessage(res.data)
      if (res.data.status === 1) {
        this.$emit('update:imagePath', res.data.previewPath)
        this.$emit('update:path', res.data.path)
        this.init()
      }
      this.confirmLoading = false
    },
    handleRotate (offsetAngle) {
      if (this.angle + offsetAngle === -360 || this.angle + offsetAngle === 360) {
        this.angle = 0
      } else {
        this.angle += offsetAngle
      }

      this.renderCanvas()
    },
    handleScaleX () {
      this.scaleX = this.scaleX === 1 ? -1 : 1

      this.renderCanvas()
    },
    handleScaleY () {
      this.scaleY = this.scaleY === 1 ? -1 : 1

      this.renderCanvas()
    }
  },
  created () {
  },
  components: {
    'cutting-container': imageCuttingContainer
  }
}
</script>
