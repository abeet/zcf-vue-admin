<template>
  <div>
    <div  class="upload-img-box">
      <img :src="imgPath ? sPath: 'assets/images/addpicture.png'" onerror="this.src='assets/images/picture404.png';" :style="sLogoStyle" border="0" align="absmiddle" @click="editLogo"/>
    </div>

    <div v-if="editPosition === 'bottom'"></div>
    <div v-else class="upload-operate-box">
      <i title="编辑" @click="editLogo" class="fa fa-pencil-square-o"></i>
      <i title="清空" @click="clearLogo" class="fa fa-window-close-o"></i>
      <i v-if="path && !path.toLowerCase().startsWith('http')" title="图片处理" @click="cutLogo" class="fa fa-scissors"></i>
    </div>
    <!-- 图片上传/选择 -->
    <resource-dialog :title="uploadTitle" :resourceDialogProps="resourceDialogProps" :show.sync="resourceModal" @callback="resourceCallback"></resource-dialog>
    <imagecutting-dialog :show.sync="imageCuttingModal" :dimension-id="resourceDialogProps.dimensionID" :imagePath="imgPath" @callback="imageCuttingCallback"></imagecutting-dialog>
  </div>
</template>
<script>
import resourceDialog from '../resourceDialog.vue'
import commonImageCuttingDialog from '../commonImageCuttingDialog.vue'
export default {
  components: {
    'imagecutting-dialog': commonImageCuttingDialog,
    'resource-dialog': resourceDialog
  },
  props: {
    path: {
      required: true
    }, //绑定图片路径
    prefix: {
      type: String,
      default: function() {
        return window.app ? window.app.prefix : window.opener && window.opener.app ? window.opener.app.prefix : ''
      }
    }, //图片预览路径前缀
    previewPath: {
      type: String,
      default: ''
    }, //图片预览路径
    editPosition: {
      type: String,
      default: 'bottom'
    }, //图片操作按钮位置，bottom/right
    uploadTitle: {
      default: '图片上传'
    }, //图片上传组件标题
    resourceDialogProps: {
      type: Object,
      default: function() {
        return {}
      }
    }, //图片上传组件参数
    disabled: {
      type: Boolean,
      default: false
    }, //是否禁用所有功能
    fixed: {
      type: Boolean,
      default: false
    }, //是否
    logoStyle: {
      type: String
    },
    logoMemo: {
      type: String,
      default: '上传图片'
    },
    dimensionId: {
      type: [Number,String],
      default: 0
    },
  },
  data() {
    return {
      resourceModal: false,
      imageCuttingModal: false
    }
  },
  computed: {
    imgPath: {
      get() {
        return this.path
      },
      set(val) {
        this.$emit('update:path', val)
      }
    },
    sPath: {
      get() {
        if (this.path.toLowerCase().startsWith('http')) {
          return this.path
        } else {
          return !!this.previewPath ? this.previewPath : this.prefix + this.path
        }
      },
      set(val) {
        this.$emit('update:previewPath', val)
      }
    },
    sLogoStyle: {
      get() {
        return this.logoStyle
          ? this.logoStyle
          : this.fixed ? 'width:120px;height:90px;cursor:pointer' : `maxWidth:260px;maxHeight:175px;cursor:pointer`
      },
      set(val) {}
    }
  },
  methods: {
    editLogo() {
      if (this.disabled) {
        return
      }
      this.resourceModal = true
    },
    clearLogo() {
      if (this.disabled || !this.imgPath) {
        return
      }
      this.imgPath = ''
      this.sPath = 'assets/images/addpicture.png'
    },
    cutLogo() {
      if (this.disabled || !this.imgPath) {
        return
      }
      if (this.imgPath.toLowerCase().startsWith('http')) {
        this.$alert('网络图片不能剪切！', '提示', {
          type: 'info'
        })
        return
      }
      this.imageCuttingModal = true
    },
    resourceCallback(sPath, path) {
      this.sPath = sPath
      this.imgPath = path
    },
    imageCuttingCallback(sPath, path) {
      this.sPath = sPath
      this.imgPath = path
    }
  }
}
</script>
