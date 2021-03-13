<template>
  <v-container>
    <v-row>
      <depth-map-selector @input="onImageSelected" />
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="stripFraction" type="number" label="Horizontal width fraction"></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Test</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DepthMapSelector from './SettingsForm/DepthMapSelector'

export default {

  name: 'SettingsForm',
  components: {
    DepthMapSelector
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      image: null, 
      stripFraction: 8,
    }
  }, 
  methods: {
    onImageSelected(image) {
      console.log("Image was selected", image)
    }
  },
  watch: {
    // $data: {
    //     handler(newval) {
    //     this.$emit(this.$data)
    //   }, 
    //   deep: true,
    //   immediate: true
    // },
  }
}
</script>

<style lang="scss" scoped>
</style>