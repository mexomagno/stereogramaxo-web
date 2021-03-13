<template>
  <div v-if="imageObject !== null">
    <v-img :src="imageObject.src"
      @load="onImageLoad" />
    <h3>{{imageObject.height}} x {{imageObject.width}}</h3>
    <h2>({{imageObject.size | prettyBytes}})</h2>
  </div>
</template>
<script>
export default {
  props: {
    imageObject: {
      type: Object,
      default: null
    }
  },
  data() {
    return {

    }
  },
}
</script>
<style lang="css"
  scoped>
</style>