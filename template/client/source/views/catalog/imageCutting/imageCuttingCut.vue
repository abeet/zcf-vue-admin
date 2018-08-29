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

  .radio-group-row .el-radio:nth-child(3n + 1) {
    margin-left: 0;
  }

  .line-height-28 {
    line-height: 28px;
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

  .cut-canvas-wrap,
  .preview-image {
    position: absolute;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: #fff;
  }

  .cut-canvas-wrap {
    overflow: hidden;
  }

  .cut-canvas-wrap .cut-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .cut-box {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .cut-box .shade {
    position: absolute;
    background-color: rgba(0, 0, 0, .4);
  }

  .cut-box .shade.top {
    top: 0;
  }

  .cut-box .shade.left {
    left: 0;
    top: 0;
    bottom: 0;
  }

  .cut-box .shade.right {
    right: 0;
    top: 0;
    bottom: 0;
  }

  .cut-box .shade.bottom {
    bottom: 0;
  }

  .cut-box .cut-box-content {
    position: absolute;
    background-color: transparent;
    cursor: move;
  }

  .cut-box-content .cut-box-line {
    position: absolute;
  }

  .cut-box-content .cut-box-line.top {
    top: 0;
    /*padding-bottom: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x top left;
  }

  .cut-box-content .cut-box-line.bottom {
    bottom: 0;
    /*padding-top: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x bottom left;
  }

  .cut-box-content .cut-box-line.top,
  .cut-box-content .cut-box-line.bottom {
    left: 0;
    right: 0;
    height: 8px;
    cursor: n-resize;
  }

  .cut-box-content .cut-box-line.left {
    left: 0;
    /*padding-right: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top left;
  }

  .cut-box-content .cut-box-line.right {
    right: 0;
    /*padding-left: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top right;
  }

  .cut-box-content .cut-box-line.left,
  .cut-box-content .cut-box-line.right {
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: w-resize;
  }

  .cut-box-content .cut-box-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid #353535;
    background-color: #353535;
  }

  .cut-box-content .cut-box-dot.top-left {
    top: 0;
    left: 0;
    cursor: nw-resize;
  }

  .cut-box-content .cut-box-dot.top {
    top: 0;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
  }

  .cut-box-content .cut-box-dot.top-right {
    top: 0;
    right: 0;
    cursor: ne-resize;
  }

  .cut-box-content .cut-box-dot.right {
    top: 50%;
    right: 0;
    margin-top: -3px;
    cursor: w-resize;
  }

  .cut-box-content .cut-box-dot.bottom-right {
    bottom: 0;
    right: 0;
    cursor: nw-resize;
  }

  .cut-box-content .cut-box-dot.bottom {
    bottom: 0;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
  }

  .cut-box-content .cut-box-dot.bottom-left {
    bottom: 0;
    left: 0;
    cursor: ne-resize;
  }

  .cut-box-content .cut-box-dot.left {
    top: 50%;
    left: 0;
    margin-top: -3px;
    cursor: w-resize;
  }

  .defined-size-btn {
    margin-bottom: 4px;
  }
</style>

<template>
  <cutting-container :loading="isLoading">
    <div class="cut-operate">
      <el-row class="operate-item">
        <el-col :span="4" class="line-height-28">宽度</el-col>
        <el-col :span="6">
          <el-input size="mini" v-model="cutBox.width" placeholder="宽"></el-input>
        </el-col>
        <el-col :span="2" class="line-height-28">px</el-col>

        <el-col :span="4" class="line-height-28">高度</el-col>
        <el-col :span="6">
          <el-input size="mini" v-model="cutBox.height" placeholder="高"></el-input>
        </el-col>
        <el-col :span="2" class="line-height-28">px</el-col>

        <el-col :span="20" :offset="4">
          <el-checkbox v-model="isLockSize">锁定高宽</el-checkbox>
        </el-col>
      </el-row>

      <el-row class="operate-item">
        <el-col :span="8">预设比例：</el-col>
        <el-col :span="16">
          <el-checkbox v-model="isLockRatio">约束比例</el-checkbox>
        </el-col>

        <el-col :span="24">
          <el-radio-group v-model="cutBoxRatio" class="radio-group-row">
            <el-radio label="1:1">1:1</el-radio>
            <el-radio label="1:2">1:2</el-radio>
            <el-radio label="2:1">2:1</el-radio>
            <el-radio label="4:3">4:3</el-radio>
            <el-radio label="3:4">3:4</el-radio>
            <el-radio label="16:9">16:9</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-row class="operate-item">
        <el-col :span="24">缩略：( \{{previewImageWidth}}×\{{previewImageHeight}} \{{scaling}}% )</el-col>
        <el-col :span="10" :offset="7">
          <el-button size="mini" :type="scaling === 100 ? 'primary' : ''" @click="handleRealSizeClick">实际大小</el-button>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-slider :step="1" v-model="scaling" :min="1" :max="100"></el-slider>
        </el-col>
      </el-row>

      <el-row class="operate-item">
        <el-col :span="24">预设尺寸：</el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 60 || previewImageHeight < 60"
                     @click="handleDefinedSize(60, 60)">60x60</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 80 || previewImageHeight < 60"
                     @click="handleDefinedSize(80, 60)">80x60</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 80 || previewImageHeight < 80"
                     @click="handleDefinedSize(80, 80)">80x80</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 136 || previewImageHeight < 96"
                     @click="handleDefinedSize(136, 96)">136x96</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 200 || previewImageHeight < 100"
                     @click="handleDefinedSize(200, 100)">200x100</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 310 || previewImageHeight < 230"
                     @click="handleDefinedSize(310, 230)">310x230</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 360 || previewImageHeight < 270"
                     @click="handleDefinedSize(360, 270)">360x270</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 450 || previewImageHeight < 250"
                     @click="handleDefinedSize(450, 250)">450x250</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="mini" class="defined-size-btn"
                     :disabled="previewImageWidth < 480 || previewImageHeight < 270"
                     @click="handleDefinedSize(480, 270)">480x270</el-button>
        </el-col>
      </el-row>

      <el-row class="operate-item">
        <el-col :span="8" :offset="8">
          <el-button type="primary" class="btn" @click="handleConfirm" :loading="confirmLoading">应用</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="preview-wrap" ref="previewWrap" slot="preview">
      <div class="cut-canvas-wrap" :style="{
              top: previewImageTop + 'px',
              left: previewImageLeft + 'px',
              width: previewImageWidth + 'px',
              height: previewImageHeight + 'px'
           }">
        <canvas class="cut-canvas" ref="cutCanvas1"></canvas>
        <canvas class="cut-canvas" ref="cutCanvas2"></canvas>
      </div>
      <div class="preview-image"
           :style="{
              top: previewImageTop + 'px',
              left: previewImageLeft + 'px',
              width: previewImageWidth + 'px',
              height: previewImageHeight + 'px',
              backgroundImage: 'url(' + imagePath + ')'
           }">
        <div class="cut-box" @mousemove="handleCutBoxMove" @mouseup="handleCutBoxEnd" @mouseleave="handleCutBoxEnd">
          <div class="shade top" :style="{
            height: cutBox.top + 'px',
            width: cutBox.width + 'px',
            left: cutBox.left + 'px'
          }"></div>
          <div class="shade left" :style="{
            width: cutBox.left + 'px'
          }"></div>
          <div class="cut-box-content" :style="{
            top: cutBox.top + 'px',
            left: cutBox.left + 'px',
            width: cutBox.width + 'px',
            height: cutBox.height + 'px'
          }" @mousedown.stop="e => handleCutBoxStart('move', e)">
            <div class="cut-box-line top" @mousedown.stop="e => handleCutBoxStart('top', e)"></div>
            <div class="cut-box-line left" @mousedown.stop="e => handleCutBoxStart('left', e)"></div>
            <div class="cut-box-line right" @mousedown.stop="e => handleCutBoxStart('right', e)"></div>
            <div class="cut-box-line bottom" @mousedown.stop="e => handleCutBoxStart('bottom', e)"></div>
            <div class="cut-box-dot top-left" @mousedown.stop="e => handleCutBoxStart('top-left', e)"></div>
            <div class="cut-box-dot top" @mousedown.stop="e => handleCutBoxStart('top', e)"></div>
            <div class="cut-box-dot top-right" @mousedown.stop="e => handleCutBoxStart('top-right', e)"></div>
            <div class="cut-box-dot right" @mousedown.stop="e => handleCutBoxStart('right', e)"></div>
            <div class="cut-box-dot bottom-right" @mousedown.stop="e => handleCutBoxStart('bottom-right', e)"></div>
            <div class="cut-box-dot bottom" @mousedown.stop="e => handleCutBoxStart('bottom', e)"></div>
            <div class="cut-box-dot bottom-left" @mousedown.stop="e => handleCutBoxStart('bottom-left', e)"></div>
            <div class="cut-box-dot left" @mousedown.stop="e => handleCutBoxStart('left', e)"></div>
          </div>
          <div class="shade right" :style="{
            width: rightShadeWidth + 'px'
          }"></div>
          <div class="shade bottom" :style="{
            height: bottomShadeHeight + 'px',
            width: cutBox.width + 'px',
            left: cutBox.left + 'px'
          }"></div>
        </div>
      </div>
    </div>
  </cutting-container>
</template>

<script>
import util from '../../../common/util.js'
import imageCuttingContainer from './imageCuttingContainer.vue'
import { operateType, imageLoad, cutBoxOperate, cutImage, uploadBase64Image } from './imageCuttingUtil'
import _ from 'lodash'

let operateInfo = {
  type: ''
}

export default {
  data () {
    return {
      isLoading: true,
      realWidth: 0,
      realHeight: 0,
      scaling: 100,
      previewWrap: {
        width: 0,
        height: 0
      },
      cutBox: {
        width: 40,
        height: 40,
        top: 0,
        left: 0
      },
      isLockSize: false,
      isLockRatio: false,
      confirmLoading: false
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
  computed: {
    previewImageWidth () {
      return parseInt(this.scaling / 100 * this.realWidth)
    },
    previewImageHeight () {
      return parseInt(this.scaling / 100 * this.realHeight)
    },
    previewImageTop () {
      if (this.previewImageHeight >= this.previewWrap.height) return 0

      return (this.previewWrap.height - this.previewImageHeight) / 2
    },
    previewImageLeft () {
      if (this.previewImageWidth >= this.previewWrap.width) return 0

      return (this.previewWrap.width - this.previewImageWidth) / 2
    },
    bottomShadeHeight () {
      return this.previewImageHeight - this.cutBox.top - this.cutBox.height
    },
    rightShadeWidth () {
      return this.previewImageWidth - this.cutBox.left - this.cutBox.width
    },
    cutBoxRatio: {
      get () {
        if (this.cutBox.width === this.cutBox.height) return '1:1'
        if (this.cutBox.width === this.cutBox.height / 2) return '1:2'
        if (this.cutBox.width / 2 === this.cutBox.height) return '2:1'
        if (this.cutBox.width / 4 === this.cutBox.height / 3) return '4:3'
        if (this.cutBox.width / 3 === this.cutBox.height / 4) return '3:4'
        if (this.cutBox.width / 16 === this.cutBox.height / 9) return '16:9'
        return ''
      },
      set (val) {
        let ratio1 = parseInt(val.split(':')[0])
        let ratio2 = parseInt(val.split(':')[1])
        let _size = this.previewImageWidth > this.previewImageHeight ? this.previewImageHeight : this.previewImageWidth
        let _min = ratio1 > ratio2 ? _size / ratio1 : _size / ratio2

        this.cutBox = {
          width: parseInt(_min * ratio1),
          height: parseInt(_min * ratio2),
          top: 0,
          left: 0
        }
      }
    }
  },
  methods: {
    handleRealSizeClick () {
      this.scaling = 100
    },
    // 初始化
    async init () {
      this.isLoading = true
      let img
      try {
        img = await imageLoad(this.imagePath)
      } catch (e) {
        await util.showErrorMessageBox('图片加载错误！')
        this.$emit('close', false)
        // console.log(e.toString())
        return
      }

      this.realWidth = img.width
      this.realHeight = img.height

      this.scaling = 100

      Object.assign(this.previewWrap, {
        width: this.$refs['previewWrap'].offsetWidth,
        height: this.$refs['previewWrap'].offsetHeight
      })

      Object.assign(this.cutBox, {
        width: this.previewImageWidth,
        height: this.previewImageHeight,
        top: 0,
        left: 0
      })

      this.isLoading = false
    },
    handleCutBoxStart (key, e) {
      operateInfo = {
        type: key,
        startPosition: { x: e.pageX, y: e.pageY },
        originalCutBox: _.cloneDeep(this.cutBox),
        container: {
          width: this.previewImageWidth,
          height: this.previewImageHeight
        }
      }
    },
    handleCutBoxMove (e) {
      if (!operateInfo.type || !operateType.includes(operateInfo.type)) {
        return
      }

      this.cutBox = cutBoxOperate(operateInfo, {
        pageX: e.pageX,
        pageY: e.pageY
      }, this.isLockSize, this.isLockRatio)
    },
    handleCutBoxEnd () {
      operateInfo = {
        type: ''
      }
    },
    handleDefinedSize (w, h) {
      this.cutBox = {
        width: w,
        height: h,
        top: 0,
        left: 0
      }
    },
    async handleConfirm (e) {
      this.confirmLoading = true

      const newImg = await cutImage(this.$refs['cutCanvas1'], this.$refs['cutCanvas2'], {
        previewImageHeight: this.previewImageHeight,
        previewImageWidth: this.previewImageWidth
      }, this.cutBox, this.imagePath)

      console.log(newImg)

      const res = await uploadBase64Image(newImg, this.path, this.siteID)
      // TODO: 上传完成后的处理
      util.showResponseMessage(res.data)
      if (res.data.status === 1) {
        this.$emit('update:imagePath', res.data.previewPath)
        this.$emit('update:path', res.data.path)
        this.init()
      }

      this.confirmLoading = false
    },
    handleCancel (e) {

    }
  },
  watch: {
    scaling () {
      this.cutBox = {
        width: this.previewImageWidth,
        height: this.previewImageHeight,
        top: 0,
        left: 0
      }
    },
    activeTab (val) {
      if (val === 'cut') {
        this.init()
      }
    },
    imagePath () {
      if (this.activeTab === 'cut') {
        this.init()
      }
    }
  },
  created () {
  },
  components: {
    'cutting-container': imageCuttingContainer
  }
}
</script>
