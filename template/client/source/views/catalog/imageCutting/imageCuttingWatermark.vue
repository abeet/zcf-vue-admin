<style scoped>
  .watermark-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    margin: 10px 0 20px;
  }
  .watermark-uploader:hover {
    border-color: #409EFF;
  }
  .watermark-uploader .watermark-uploader-icon,
  .watermark-uploader .file-input {
    position: absolute;

  }
  .watermark-uploader .watermark-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
  }
  .watermark-uploader .file-input {
    display: block;
    width: 98px;
    height: 98px;
    opacity: 0;
  }

  .watermark-preview {
    display: inline-block;
    max-width: 160px;
    margin-top: 10px;
    margin-bottom: 20px;
    position: relative;
  }
  .watermark-preview .watermark {
    max-width: 160px;
    display: block;
  }
  .watermark-preview .clear-btn {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 20px;
    opacity: .6;
    color: #353535;
    cursor: pointer;
  }
  .watermark-preview .clear-btn:hover {
    opacity: .4;
  }

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
  .canvas-wrap .watermark-box {
    position: absolute;
    cursor: move;
    display: none;
  }
  .canvas-wrap .watermark-box.active {
    display: block;
  }

  .watermark-box .watermark-box-content {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
  }

  .watermark-box .box-line {
    position: absolute;
  }

  .watermark-box .box-line.top {
    top: 0;
    /*padding-bottom: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x top left;
  }

  .watermark-box .box-line.bottom {
    bottom: 0;
    /*padding-top: 5px;*/
    background: url(../../../assets/images/border-h.gif) repeat-x bottom left;
  }

  .watermark-box .box-line.top,
  .watermark-box .box-line.bottom {
    left: 0;
    right: 0;
    height: 8px;
    /*cursor: n-resize;*/
  }

  .watermark-box .box-line.left {
    left: 0;
    /*padding-right: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top left;
  }

  .watermark-box .box-line.right {
    right: 0;
    /*padding-left: 5px;*/
    background: url(../../../assets/images/border-v.gif) repeat-y top right;
  }

  .watermark-box .box-line.left,
  .watermark-box .box-line.right {
    top: 0;
    bottom: 0;
    width: 8px;
    /*cursor: w-resize;*/
  }

</style>

<template>
  <cutting-container :loading="isLoading">
    <div class="cut-operate">
      <el-row class="operate-item">
        <el-col :span="24">
          水印图片:
        </el-col>
        <el-col :span="18" :offset="6">
          <div class="watermark-preview" v-if="watermark">
            <i class="el-icon-circle-close clear-btn" @click.stop="handleClearWatermark"></i>
            <img :src="watermark" class="watermark">
          </div>
          <div class="watermark-uploader" v-else>
            <i class="el-icon-plus watermark-uploader-icon"></i>
            <input type="file" class="file-input" accept="image/gif,image/jpeg,image/png" @change="handleFileChange"/>
          </div>
        </el-col>
        <el-col :span="6" class="line-height-28 m-b">
          透明度
        </el-col>
        <el-col :span="18" class="m-b">
          <el-input-number v-model="watermarkOpacity" size="mini" :min="0" :max="1" :step="0.1"></el-input-number>
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
        <div class="watermark-box"
             :class="{ 'active': watermark }"
             :style="{
               top: watermarkBox.top + 'px',
               left: watermarkBox.left + 'px',
               width: watermarkBox.width + 'px',
               height: watermarkBox.height + 'px'
             }" @mousedown.stop="e => handleBoxStart('move', e)">
          <div class="watermark-box-content" :style="{ backgroundImage: watermark ? 'url(' + watermark + ')' : '',opacity: watermarkOpacity }"></div>
          <div class="box-line top"></div>
          <div class="box-line left"></div>
          <div class="box-line right"></div>
          <div class="box-line bottom"></div>
        </div>
      </div>
    </div>
  </cutting-container>
</template>

<script>
  import util from '../../../common/util.js'
  import imageCuttingContainer from './imageCuttingContainer.vue'
  import { imageLoad, readImageFile, cutBoxOperate, watermarkImage, uploadBase64Image } from './imageCuttingUtil'

  let operateInfo = {
    type: '',
  }

  export default {
    data () {
      return {
        isLoading: false,
        realWidth: 0,
        realHeight: 0,
        previewWrap: {
          width: 0,
          height: 0,
        },
        confirmLoading: false,
        watermark: '',
        watermarkOpacity: 1,
        watermarkBox: {
          width: 40,
          height: 40,
          top: 0,
          left: 0,
        }
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
      siteID:{
        type: [String,Number],
        required:true
      },
      path:{
        type:String,
        default:'',
        required:true
      }
    },
    watch: {
      activeTab (val) {
        if (val === 'watermark') {
          this.init()
        }
      },
      imagePath(){
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
        this.watermark = ''
        this.watermarkOpacity = 1
        let img
        try {
          img = await imageLoad(this.imagePath)
        } catch (e) {
          return
        }

        this.realWidth = img.width
        this.realHeight = img.height

        Object.assign(this.previewWrap, {
          width: this.$refs['previewWrap'].offsetWidth,
          height: this.$refs['previewWrap'].offsetHeight
        })

        console.log(this.realWidth, this.realHeight, this.previewWrap)

        this.isLoading = false
      },
      async handleFileChange (e) {
        if(e.target.files.length !== 1) {
          return
        }

        const file = e.target.files[0];

        this.watermark = await readImageFile(file)

        const img = await imageLoad(this.watermark);

        const scale = (img.width / this.realWidth) > (img.height / this.realHeight) ? Math.ceil(img.width / this.realWidth) : Math.ceil(img.height / this.realHeight)

        Object.assign(this.watermarkBox, {
          width: img.width / scale,
          height: img.height / scale,
          top: 0,
          left: 0
        })

      },
      handleClearWatermark (e) {
        this.watermark = ''
      },
      handleBoxStart (type, e) {
        operateInfo ={
          type: type,
          startPosition: { x: e.pageX, y: e.pageY },
          originalCutBox: _.cloneDeep(this.watermarkBox),
          container: {
            width: this.realWidth,
            height: this.realHeight
          }
        }
      },
      handleBoxMove (e) {
        if(!operateInfo.type || operateInfo.type !== 'move' ){
          return;
        }

        this.watermarkBox = cutBoxOperate(operateInfo, {
          pageX: e.pageX,
          pageY: e.pageY
        }, true, true)
      },
      handleBoxEnd () {
        operateInfo = {
          type: ''
        }
      },
      async handleConfirm () {
        this.confirmLoading = true

        if (!this.watermark) {
          this.confirmLoading = false
          util.showError('请先上传水印图片！')
          return
        }

        const newImg = await watermarkImage(this.$refs['watermarkCanvas'], {
          width: this.watermarkBox.width,
          height: this.watermarkBox.height,
          top: this.watermarkBox.top,
          left: this.watermarkBox.left,
          opacity: this.watermarkOpacity,
          watermark: this.watermark
        }, this.imagePath)

        console.log(newImg)

        const res = await uploadBase64Image(newImg, this.path,this.siteID)
        // TODO: 上传完成后的处理
        util.showResponseMessage(res.data)
        if(res.data.status === 1){
          this.$emit('update:imagePath',res.data.previewPath)
          this.$emit('update:path',res.data.path)
          this.init()
        }

        this.confirmLoading = false;

      },
    },
    created () {
    },
    components: {
      'cutting-container': imageCuttingContainer
    }
  }
</script>
