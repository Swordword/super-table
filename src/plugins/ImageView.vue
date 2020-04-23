<template>
  <div
    v-loading="imgLoading"
    class="image-view"
    :class="{
      'adaptive':adaptive
    }"
    :style="{ width: width, height: height }"
    style="overflow:hidden"
  >
    <img
      class="vertical-image"
      :src="url&&url.length === 0 ? defImg : compress ? compression(url) : url"
      :onerror="imgErr"
      :style="
        (preview && url&&url.length > 0 ? 'cursor:pointer;' : '') +
          (!adaptive?'width: '+width+';height:'+height:'max-width:100%;max-height:100%')
      "
      @load="getOnload"
      @click="handlePreview(url)"
    />
    <el-dialog
      v-if="preview&&dialogPreviewVisible"
      append-to-body
      :visible.sync="dialogPreviewVisible"
      :title="name"
      custom-class="image-viewer-dialog"
      width="60%"
    >
      <ImageViewer v-if="dialogPreviewVisible" :images="dialogPreviewImageUrl">
        <!-- 图片exif信息查看 -->
        <template v-slot:exif>
          <ImageExif v-if="imageExifInfo" :image-exif-info="imageExifInfo" :image-viewer="true" />
        </template>
      </ImageViewer>
    </el-dialog>
    <slot />
  </div>
</template>

<script>
import noimg from './noimg.png'
// import ImageViewer from '@/components/ImageViewer'
// import ImageExif from '@/components/ImageExif'
export default {
  components: {
    // ImageViewer,
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: '图片查看'
    },
    // 默认图片地址
    def: {
      type: String,
      default: '',
      required: false
    },

    // eslint-disable-next-line vue/require-default-prop
    width: {
      type: String,
      required: false
      // default: '100%'
    },

    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: String,
      required: false
      // default: '100%'
    },
    preview: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否压缩
    compress: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否自适应显示
    adaptive: {
      type: Boolean,
      required: false,
      default: false
    },
    // 显示图片exifInfo
    imageExifInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imgErr: "this.src='" + noimg + "'",
      defImg: noimg,
      dialogPreviewImageUrl: [],
      dialogPreviewVisible: false,
      imgLoading: 'fasle'
    }
  },
  created() {
    if (this.def.length > 0) {
      this.defImg = this.def
      this.imgErr = "this.src='" + this.def + "'"
    }
    this.imgLoading = true
  },
  methods: {
    // 压缩图片
    compression(url) {
      if (url.indexOf('.png') > 0) {
        return url.replace('.png', '/256.png')
      } else if (url.indexOf('.jpeg') > 0) {
        return url.replace('.png', '/256.jpeg')
      } else {
        return url.replace('.jpg', '/256.jpg')
      }
    },
    handlePreview(imgUrl) {
      if (!imgUrl || imgUrl === null || imgUrl.length === 0) {
        return
      }
      const imgObj = {
        key: imgUrl,
        cover: imgUrl
      }
      // 图片预览一次只会预览一张 无需缓存之前的图片
      const dialogPreviewImageUrl = []
      dialogPreviewImageUrl.push(imgObj)
      this.dialogPreviewImageUrl = dialogPreviewImageUrl
      this.dialogPreviewVisible = true
    },
    getOnload() {
      this.imgLoading = false
    }
  }
}
</script>
<style lang="css" scope>
.image-view {
  border-radius: 4px;
  text-align: left;
}
.image-view .adaptive {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.vertical-image {
  display: inline-block;
  vertical-align: middle;
}
.image-viewer-dialog {
  top: 50%;
  margin-top: -380px !important;
}
</style>
