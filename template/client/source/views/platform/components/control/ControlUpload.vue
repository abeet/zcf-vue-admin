<template>
  <div>
    <div v-if="resourceType === 'Image'" class="image-operate">
      <img @click="uploadResource" :src="resourceSrc" @error="setErrorImg" width="120">
    </div>
    <div v-if="resourceType === 'File'">
      <span><a href="javascript:void(0);" @click="downloadFile()">\{{resourceName}}</a></span>
    </div>
    <div v-if="resourceType === 'Audio'">
      <span >\{{resourceName}}</span>
      <!-- <audio-player :src="resourceSrc" :title="resourceName" :auto-play="false"></audio-player> -->
      <audio ref="audioPlayer" :src="resourceSrc" @ended="audioEnded">您的浏览器不支持 audio 标签</audio>
      <div style="margin: 0 10px">
        <i v-if="!isAudioStarted" title="播放" @click="audioStart" class="fa fa-play"></i>
        <i v-if="isAudioStarted" title="暂停" @click="audioPause" class="fa fa-pause"></i>
        <i title="停止" @click="audioStop" class="fa fa-stop"></i>
      </div>
    </div>
    <div v-if="resourceType === 'Video'">
      <span>\{{resourceName}}</span>
      <!-- <video-player :src="resourceSrc" width="300px" height="240px"  :auto-play="false"></video-player> -->
      <video :src="resourceSrc" controls="controls" width="180">您的浏览器不支持 video 标签</video>
    </div>
    <div style="margin: 0 10px">
      <i title="编辑" @click="uploadResource" class="fa fa-pencil-square-o"></i>
      <i title="清空" @click="clearResource" class="fa fa-window-close-o"></i>
      <i v-if="resourceType === 'Image'" title="图片处理" @click="dealImage" class="fa fa-scissors"></i>
    </div>
    <resource-dialog
      :title="resourceUpload.title"
      :show.sync="resourceUpload.isShowModal"
      :resourceDialogProps="resourceUpload.props"
      @callback="resourceSelectCallback">
    </resource-dialog>
    <image-cutting-dialog
      :show.sync="imageCuttingDlg.isShowModal"
      :image-path.sync="resourceURL">
    </image-cutting-dialog>
  </div>
</template>

<style scoped>

</style>

<script>
import resourceDialog from '../../../catalog/resourceDialog.vue'
import imageCuttingDialog from '../../../catalog/commonImageCuttingDialog.vue'
import videoPlayer from '../../../../components/VideoPlayer.vue'
import audioPlayer from '../../../../components/AudioPlayer.vue'
export default {
  data () {
    return {
      resourceType: '',
      resourceSrc: '',
      resourceURL: '',
      previewPrefix: '',
      resourceUpload: {
        title: '',
        isShowModal: false,
        props: {}
      },
      imageCuttingDlg: {
        isShowModal: false
      },
      resourceName: '',
      isAudioStarted: false
    }
  },
  methods: {
    uploadResource () {
      this.resourceUpload.title = this.getResourceTypeName(this.resourceType)
      this.resourceUpload.props = {
        resourceType: this.resourceType.toLowerCase(),
        selectorURL: this.resourceType.toLowerCase() + 'Resources',
        supportNetSource: 'false',
        sourceType: 'upload',
        imageWidth: 120,
        imageHeight: 120
      }
      this.resourceUpload.isShowModal = true
    },
    getResourceTypeName (resourceType) {
      switch (resourceType) {
        case 'Image':
          return '图片'
          break
        case 'Audio':
          return '音频'
          break
        case 'File':
          return '文件'
          break
        case 'Video':
          return '视频'
          break
        default:
          return '资源'
      }
    },
    clearResource () {
      if (this.resourceType === 'Image') {
        this.resourceURL = this.resourceSrc = '/assets/images/addpicture.png'
      } else {
        this.resourceSrc = ''
        this.resourceURL = ''
        this.resourceName = ''
      }
    },
    dealImage () {
      this.imageCuttingDlg.isShowModal = true
    },
    setErrorImg (e) {
      e.target.src = '/assets/images/picture404.png'
    },
    resourceSelectCallback (src, path) {
      this.resourceSrc = src
      this.resourceURL = path
      this.resourceName = path.substring(path.lastIndexOf('/') + 1, path.length)
    },
    downloadFile () {
      window.location.href = `${axios.defaults.baseURL}api/metadatafile/downloadfile?filePath=${this.resourceURL}&fileName=${this.resourceName}`
    },
    audioStart () {
      let audio = this.$refs['audioPlayer']
      audio.play()
      this.isAudioStarted = true
    },
    audioPause () {
      let audio = this.$refs['audioPlayer']
      audio.pause()
      this.isAudioStarted = false
    },
    audioStop () {
      let audio = this.$refs['audioPlayer']
      audio.currentTime = 0
      audio.pause()
      this.isAudioStarted = false
    },
    audioEnded () {
      this.isAudioStarted = false
    },
    async loadPreviewPrefix () {
      let res = await axios.get('/api/metadatafile/previewprefix')
      this.previewPrefix = res.data.previewPrefix
    }
  },
  watch: {
    config (val) {
      this.resourceType = val.resourceType
    },
    resourceURL (val) {
      this.$emit('input', val)
      if (val === '/assets/images/addpicture.png') {
        this.$emit('input', '')
      }
    },
    value (val) {
      if (val) {
        this.resourceSrc = this.previewPrefix + val
        this.resourceURL = val
        this.resourceName = this.resourceURL.substring(this.resourceURL.lastIndexOf('/') + 1, this.resourceURL.length)
      } else {
        this.resourceSrc = this.resourceURL = this.resourceName = ''
        if (this.resourceType === 'Image') {
          this.resourceURL = this.resourceSrc = '/assets/images/addpicture.png'
        }
      }
    }
  },
  props: [
    'value',
    'config'
  ],
  async created () {
    await this.loadPreviewPrefix()
    this.resourceType = this.config.resourceType
    if (this.value) {
      this.resourceSrc = this.previewPrefix + this.value
      this.resourceURL = this.value
      this.resourceName = this.resourceURL.substring(this.resourceURL.lastIndexOf('/') + 1, this.resourceURL.length)
    } else {
      this.resourceSrc = this.resourceURL = this.resourceName = ''
      if (this.resourceType === 'Image') {
        this.resourceURL = this.resourceSrc = '/assets/images/addpicture.png'
      }
    }
  },
  components: {
    'image-cutting-dialog': imageCuttingDialog,
    'resource-dialog': resourceDialog,
    'video-player': videoPlayer,
    'audio-player': audioPlayer
  }
}
</script>
<style scoped>
  div {
    display: inline;
  }

</style>
