<template>
  <div v-if="image">
    <v-img :src="image.src"
      @load="onImageLoad" />
    <h3>{{image.height}} x {{image.width}}</h3>
    <h2 v-if="image.size">({{image.size | prettyBytes}})</h2>
  </div>
</template>
<script>
export default {
  props: {
    getter: {
      type: String,
      required: true
    }
  },
  computed: {
    image() {
      return this.$store.getters[this.getter]
    }
  },
  methods: {
    onImageLoad(){

    }
  }
}
</script>
<style lang="css"
  scoped>
</style>