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
  .line-height-28{
    line-height: 28px;
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
  .canvas-wrap {
    position: absolute;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: #fff;
  }
  .canvas-wrap .watermark-canvas {
    width: 100%;
    height: 100%;
  }
  .canvas-wrap .text-box {
    position: absolute;
    cursor: move;
    height: auto;
  }

  .text-box .box-line {
    position: absolute;
  }

  .text-box .box-line.top {
    top: 0;
    /*padding-bottom: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x top left;
  }

  .text-box .box-line.bottom {
    bottom: 0;
    /*padding-top: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x bottom left;
  }

  .text-box .box-line.top,
  .text-box .box-line.bottom {
    left: 0;
    right: 0;
    height: 8px;
    /*cursor: n-resize;*/
  }

  .text-box .box-line.left {
    left: 0;
    /*padding-right: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top left;
  }

  .text-box .box-line.right {
    right: 0;
    /*padding-left: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top right;
  }

  .text-box .box-line.left,
  .text-box .box-line.right {
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: w-resize;
  }

  .watermark-content-input {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0 none;
    background-color: transparent;
    resize: none;
    outline: 0;
  }
</style>

<template>
  <cutting-container>
    <div class="cut-operate">
      <el-row class="operate-item">
        <el-col :span="24">文字设置：</el-col>
        <el-col :span="6" class="m-b line-height-28">字体</el-col>
        <el-col :span="18" class="m-b">
          <el-select v-model="textWatermark.fontFamily" size="mini" placeholder="请选择">
            <el-option label="宋体" value="SimSun"></el-option>
            <el-option label="微软雅黑" value="Microsoft YaHei"></el-option>
          </el-select>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">颜色</el-col>
        <el-col :span="18" class="m-b">
          <el-color-picker size="mini" v-model="textWatermark.color"></el-color-picker>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">字号</el-col>
        <el-col :span="18" class="m-b">
          <el-input-number size="mini" v-model="textWatermark.fontSize" :min="12" :max="100" :step="1"></el-input-number>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">透明度</el-col>
        <el-col :span="18" class="m-b">
          <el-input-number size="mini" v-model="textWatermark.opacity" :min="0" :max="1" :step=".1"></el-input-number>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">加粗：</el-col>
        <el-col :span="18" class="m-b line-height-28">
          <el-switch szie="mini" v-model="textWatermark.isBold">
          </el-switch>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">斜体：</el-col>
        <el-col :span="18" class="m-b line-height-28">
          <el-switch szie="mini" v-model="textWatermark.isItalic">
          </el-switch>
        </el-col>

        <el-col :span="6" class="m-b line-height-28">下划线：</el-col>
        <el-col :span="18" class="m-b">
          <el-switch szie="mini" v-model="textWatermark.isUnderline">
          </el-switch>
        </el-col>

      </el-row>

      <el-row class="operate-item">
        <el-col :span="24">描边设置：</el-col>
        <el-col :span="18" :offset="6" class="m-b">
          <el-switch szie="mini" v-model="textWatermark.isTextStroke">
          </el-switch>
        </el-col>
        <el-col :span="6" class="m-b line-height-28">大小</el-col>
        <el-col :span="18" class="m-b">
          <el-input-number size="mini" :min="1" :max="100" :step="1"
                           :disabled="!textWatermark.isTextStroke" v-model="textWatermark.textStrokeSize"></el-input-number>
        </el-col>
        <el-col :span="6" class="m-b line-height-28">颜色</el-col>
        <el-col :span="18" class="m-b">
          <el-color-picker size="mini" :disabled="!textWatermark.isTextStroke"
                           v-model="textWatermark.textStrokeColor"></el-color-picker>
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
        <canvas class="watermark-canvas" ref="watermarkCanvas"></canvas>
      </div>
      <div class="canvas-wrap" :style="{
          top: previewImageTop + 'px',
          left: previewImageLeft + 'px',
          width: realWidth + 'px',
          height: realHeight + 'px',
          backgroundImage: 'url(' + imagePath + ')'
      }" @mousemove="handleBoxMove" @mouseup="handleBoxEnd" @mouseleave="handleBoxEnd">
        <div class="text-box"
             :style="{
               top: this.textWatermark.top + 'px',
               left: this.textWatermark.left + 'px',
               width: this.textWatermark.width + 'px'
             }" @mousedown.stop="e => handleBoxStart('move', e)">
          <textarea class="watermark-content-input"
                    v-model="textWatermark.content"
                    :style="{
                      opacity: this.textWatermark.opacity,
                      fontFamily: this.textWatermark.fontFamily,
                      fontSize: this.textWatermark.fontSize + 'px',
                      lineHeight: this.textWatermark.lineHeight,
                      color: this.textWatermark.color,
                      fontWeight: this.textWatermark.isBold ? 'bold' : 'normal',
                      fontStyle: this.textWatermark.isItalic ? 'italic' : 'normal',
                      textDecoration: this.textWatermark.isUnderline ? 'underline' : 'none',
                      webkitTextStroke: this.textWatermark.isTextStroke ? this.textWatermark.textStrokeSize + 'px ' + this.textWatermark.textStrokeColor : '',
                      textStroke: this.textWatermark.isTextStroke ? this.textWatermark.textStrokeSize + 'px ' + this.textWatermark.textStrokeColor : ''
                    }" ref="watermarkContentInput"></textarea>
          <div class="box-line top"></div>
          <div class="box-line left" @mousedown.stop="e => handleBoxStart('left', e)"></div>
          <div class="box-line right" @mousedown.stop="e => handleBoxStart('right', e)"></div>
          <div class="box-line bottom"></div>
        </div>
      </div>
    </div>
  </cutting-container>
</template>

<script>
import util from '../../../common/util.js'
import imageCuttingContainer from './imageCuttingContainer.vue'
import { imageLoad, cutBoxOperate, watermarkText, uploadBase64Image, autoTextarea} from './imageCuttingUtil'

let operateInfo = {
  type: ''
}

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
      textWatermark: {
        content: '请输入文字！',
        top: 0,
        left: 0,
        width: 98,
        fontFamily: 'Microsoft YaHei',
        fontSize: 16,
        lineHeight: 1.8,
        color: '#353535',
        opacity: 1,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isTextStroke: false,
        textStrokeSize: 1,
        textStrokeColor: '#ffffff'
      },
      isInputMode: false
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
      if (val === 'textWatermark') {
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

      Object.assign(this.textWatermark, {
        content: '请输入文字！',
        top: 0,
        left: 0,
        width: 98,
        fontFamily: 'Microsoft YaHei',
        fontSize: 16,
        lineHeight: 1.8,
        color: '#353535',
        opacity: 1,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isTextStroke: false,
        textStrokeSize: 1,
        textStrokeColor: '#ffffff'
      })

      Object.assign(this.previewWrap, {
        width: this.$refs['previewWrap'].offsetWidth,
        height: this.$refs['previewWrap'].offsetHeight
      })

      this.isLoading = false
    },
    handleBoxStart (type, e) {
      operateInfo = {
        type: type,
        startPosition: { x: e.pageX, y: e.pageY },
        originalCutBox: {
          top: this.textWatermark.top,
          left: this.textWatermark.left,
          width: this.textWatermark.width,
          height: this.textWatermark.fontSize * 1.8
        },
        container: {
          width: this.realWidth,
          height: this.realHeight
        }
      }
    },
    handleBoxMove (e) {
      if (!operateInfo.type || !['move', 'left', 'right'].includes(operateInfo.type)) {
        return
      }

      let box = cutBoxOperate(operateInfo, {
        pageX: e.pageX,
        pageY: e.pageY
      }, false, false)

      Object.assign(this.textWatermark, box)
    },
    handleBoxEnd () {
      operateInfo = {
        type: ''
      }
    },
    handleInputStart () {
      this.isInputMode = true
    },
    handleInput (e) {
      console.log(e.target.innerText)
      this.textWatermark.content = e.target.innerText
    },
    handleInputEnd (e) {
      this.isInputMode = false
      this.textWatermark.content = e.target.innerText
      // console.log(this.textWatermark.content)
    },
    async handleConfirm () {
      console.log(this.textWatermark)
      this.confirmLoading = true

      if (!this.textWatermark.content) {
        this.confirmLoading = false
        util.showError('请输入水印文字！')
        return
      }
      // TODO： 文字渲染到canvas上，位置、换行与下划线 有bug，查canvas资料
      const newImg = await watermarkText(this.$refs['watermarkCanvas'], this.textWatermark, this.imagePath)

      const res = await uploadBase64Image(newImg, this.path, this.siteID)

      util.showResponseMessage(res.data)
      if (res.data.status === 1) {
        this.$emit('update:imagePath', res.data.previewPath)
        this.$emit('update:path', res.data.path)
        this.init()
      }

      this.confirmLoading = false
    }
  },
  created () {
  },
  mounted () {
    console.log(this.$refs['watermarkContentInput'])
    autoTextarea(this.$refs['watermarkContentInput'])
  },
  components: {
    'cutting-container': imageCuttingContainer
  }
}
</script>
