<template>
  <v-container class="fill-width">
    <v-row>
      <v-col cols="10">
        <v-file-input :loading="loading" v-model="image"
          accept="image/*"
          label="Select depth map" />
      </v-col>
      <!-- img preview -->
      <v-col cols="2" class="text-center">
        <v-progress-circular v-if="loading" indeterminate size="100" width="10" color="primary" />
        <image-preview :imageObject="$store.getters['image/depthmap']" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ImagePreview from '@/components/ImagePreview'

export default {
  components: { ImagePreview },
  props: {
    wallEyed: {
      type: Boolean,
      default: true
    },
    stripFraction: {
      type: Number,
      default: 8
    },
  },
  data() {
    return {
      image: null,
      size: null,
      loading: false
    }
  },
  mounted() {
    this.loadDefault()
  },
  methods: {
    loadDefault() {
      this.imageSrc = require('@/assets/depthmaps/shark.png')
    },
    processInput(){
      if (!this.image) {
        return
      }
      console.log("file name: ", this.image.name)
      this.size = this.image.size
      
      var reader = new FileReader()
      let vm = this
      reader.readAsDataURL(this.image)
      reader.onload = function(e) {
        console.log("onload", e)
        var img = new Image()
        img.src = e.target.result
        img.onload = () => {
          vm.$store.dispatch('image/setDepthMap', img)
          return true
        }
      }
    },
    onImageLoad(event) {
      this.$emit('input', event)
    }, 
    toGrayscale(img) {

    },
    createCanvas(){
    }
  },
  watch: {
    image(newval) {
      this.loading = true
      this.processInput()
    }
  }
}
</script>
<style lang="css"
  scoped>
</style>