<template>
  <div>
  <v-file-input accept="image/*" label="Select depth map" />
  </div>
</template>

<script>
export default {

  name: 'ImageSelector',

  data () {
    return {
      image: null
    }
  }
}
</script>

<style lang="css" scoped>
</style>