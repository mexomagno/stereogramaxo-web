<template>
  <v-container class="fill-width">
    <v-row>
      <v-col cols="10">
        <v-file-input ref="fileInput" :loading="loading" v-model="image"
          accept="image/*"
          label="Select pattern" />
          <img :src="defaultPattern" alt="" style="display: none" @load="onDefaultLoaded">
      </v-col>
      <!-- img preview -->
      <v-col cols="2" class="text-center">
        <v-progress-circular v-if="loading" indeterminate size="100" width="10" color="primary" />
        <image-preview getter="image/pattern" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ImagePreview from '@/components/ImagePreview'

export default {
  components: { ImagePreview },
  data() {
    return {
      image: null,
      defaultPattern: require('@/assets/patterns/jellybeans4.png')
    }
  },
  computed: {
    loading() {
      return this.$store.state.image.loading
    }
  },
  methods: {
    onDefaultLoaded(event) {
      this.$store.dispatch('image/setPattern', event.srcElement)
    },
    processInput(){
      if (!this.image) {
        return
      }
      console.log("file name: ", this.image.name)
      const fileSize = this.image.size
      
      var reader = new FileReader()
      let vm = this
      reader.readAsDataURL(this.image)
      reader.onload = function(e) {
        console.log("onload", e)
        var img = new Image()
        img.src = e.target.result
        img.size = fileSize
        img.onload = () => {
          vm.$store.dispatch('image/setPattern', img)
          return true
        }
      }
    },
    onImageLoad(event) {
      this.$emit('input', event)
    }, 
  },
  watch: {
    image(newval) {
      this.processInput()
    }
  }
}
</script>
<style lang="css"
  scoped>
</style>