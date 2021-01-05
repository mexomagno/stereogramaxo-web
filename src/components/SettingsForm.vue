<template>
  <v-container>
    <v-row>
      <image-selector />
    </v-row>
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Test</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ImageSelector from './SettingsForm/ImageSelector'

export default {

  name: 'SettingsForm',
  components: {
    ImageSelector
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>