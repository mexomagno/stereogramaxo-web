<template>
  <v-container>
    <v-row>
      <depth-map-selector />
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="stripFraction" type="number" min="1" max="20" label="Horizontal width fraction"></v-text-field>
        <v-text-field v-model="blurRadius" type="number" min="0" label="Blur"></v-text-field>
      </v-col>
      <v-col cols="4">
        <pattern-selector />
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
import PatternSelector from './SettingsForm/PatternSelector'

export default {

  name: 'SettingsForm',
  components: {
    DepthMapSelector,
    PatternSelector
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
    }
  }, 
  methods: {
    onImageSelected(image) {
      console.log("Image was selected", image)
    }
  },
  computed: {
    stripFraction: {
      get() {
        return this.$store.state.settings.stripFraction
      },
      set(value) {
        this.$store.commit('settings/setStripFraction', parseInt(value))
      }
    },
    blurRadius: {
      get() {
        return this.$store.state.settings.blurRadius
      },
      set(value) {
        this.$store.commit('settings/setBlurRadius', parseInt(value))
      }
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