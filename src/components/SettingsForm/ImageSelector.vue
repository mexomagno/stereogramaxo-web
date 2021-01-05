<template>
  <v-container class="fill-width">
    <v-row>
      <v-col cols="10">
        <v-file-input :loading="loading" v-model="image"
          accept="image/*"
          label="Select depth map" />
      </v-col>
      <v-col cols="2" class="text-center">
        <v-progress-circular v-if="loading" indeterminate size="100" width="10" color="primary" />
        <v-img v-else :src="imageSrc" />
        <h3 v-if="height && width">{{height}} x {{width}}</h3>
        <h2 v-if="size">({{size | prettyBytes}})</h2>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {

  name: 'ImageSelector',

  data() {
    return {
      image: null,
      height: null,
      width: null,
      imageSrc: '', 
      size: null,
      loading: false
    }
  },
  methods: {
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
          console.log("image load", img)
          vm.height = img.height
          vm.width = img.width
          vm.imageSrc = img.src
          vm.loading = false
          return true
        }
      }
    }
  },
  watch: {
    image(newval) {
      this.loading = true
      console.log("Image was input")
      this.processInput()
    }
  }
}
</script>
<style lang="css"
  scoped>
</style>