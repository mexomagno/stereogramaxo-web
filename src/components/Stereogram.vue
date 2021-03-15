<template>
  <div class="text-center">
    <v-card-title>debug canvas</v-card-title>
    <div v-if="loading" :style="`height: ${height}px; width: ${width}px`" class="d-flex justify-center align-center ml-auto mr-auto">
      <v-progress-circular size="100" color="primary" width="20" indeterminate />
    </div>
    <h3>Pattern</h3>
    <canvas ref="patternCanvas"
      :width="patternWidth"
      :height="patternHeight"></canvas>
    <h3>Depthmap</h3>
    <canvas v-show="!loading" ref="dmCanvas"
      :width="width"
      :height="height"></canvas>
    <div v-if="dmCanvas">{{ dmCanvas.width }} x {{ dmCanvas.height }}</div>
    <h3>Result</h3>
    <canvas v-show="!loading" ref="canvas"
      :width="width"
      :height="height"></canvas>
    <div v-if="canvas">{{ canvas.width }} x {{ canvas.height }}</div>
    <h4>Drew {{100000}} in {{dt}}ms</h4>
  </div>
</template>
<script>
import filters from '@/utils/filters'
import utils from '@/utils'

const MAX_DIMENSION = 1500 // px
const PATTERN_FRACTION = 8.0
const OVERSAMPLE = 1.8
const SHIFT_RATIO = 0.3
const LEFT_TO_RIGHT = false // Defines how the pixels will be shifted (left to right or center to sides)
const DOT_OVER_PATTERN_PROBABILITY = 0.3 // Defines how often dots are chosen over pattern on random pattern selection

const DEFAULT_SIZE = { width: 800, height: 600 }

function hex2rgb(s) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default {
  name: 'Stereogram',
  props: {
    settings: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      context: null,
      timeout: null,
      dt: 0,
      dmCanvas: null,
      patternCanvas: null,
      canvas: null
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.dmCanvas = this.$refs.dmCanvas
      this.patternCanvas = this.$refs.patternCanvas
      this.canvas = this.$refs.canvas
      // this.drawAnimatedNoise(10)
    })
  },
  computed: {
    depthMap() {
      return this.$store.getters['image/depthMap']
    },
    pattern() {
      return this.$store.getters['image/pattern']
    },
    width() {
      return this.depthMap?.width ?? DEFAULT_SIZE.width
    },
    height() {
      return this.depthMap?.height ?? DEFAULT_SIZE.height
    },
    patternWidth() {
      return this.pattern?.width ?? 0
    },
    patternHeight() {
      return this.pattern?.height ?? 0
    },
    loading(){
      return this.$store.state.image.loading
    }
  },
  methods: {
    // Testing
    // drawDebug(image) {
    //   if (!image) return
    //   console.log("Draw debug image: ", image)
    //   this.$nextTick().then(() => {
    //     const ctx = document.querySelector('#debugCanvas').getContext('2d')
    //     ctx.drawImage(image, 0, 0)
    //   })
    // },
    onDebugReady() {
      console.log("debug ready")
    },
    // drawNoise(amount = 100000) {
    //   this.$nextTick().then(() => {
    //     this.$refs.canvas.width = this.$refs.debugCanvas.width
    //     this.$refs.canvas.height = this.$refs.debugCanvas.height

    //     const ctx = this.$refs.canvas.getContext('2d')
    //     t0 = Date.now()
        
    //     this.dt = Date.now() - t0
    //   })
    // },
    // drawAnimatedNoise(delay) {
    //   this.timeout = window.setTimeout(() => {
    //     this.drawNoise()
    //     this.drawAnimatedNoise(delay)
    //   }, delay)
    // },
    // stopAnimatedNoise() {
    //   if (this.timeout) {
    //     window.clearTimeout(this.timeout)
    //     this.timeout = null
    //   }
    // },
    // Actual workings
    render() {
      if (!this.depthMap || !this.pattern) return
      this.$nextTick().then(() => {
        // flush pattern to its canvas
        const pCtx = this.$refs.patternCanvas.getContext('2d')
        const pImg = new Image()
        pImg.src = this.$store.state.image.pattern.src
        pCtx.drawImage(pImg, 0, 0, pImg.width, pImg.height)


        // Flush depthmap to its canvas
        // get depthmap
        const MAX_WIDTH = 800,
        MAX_HEIGHT = 600
        const dmSize = utils.constrain({width: this.depthMap.width, height: this.depthMap.height}, {MAX_WIDTH, MAX_HEIGHT})
        this.$refs.dmCanvas.width = dmSize.width
        this.$refs.dmCanvas.height = dmSize.height
        const dmCtx = this.$refs.dmCanvas.getContext('2d')
        const dmImg = new Image()
        dmImg.src = this.depthMap.src

        dmCtx.drawImage(dmImg, 0, 0, dmSize.width, dmSize.height)
        filters.grayscale(dmCtx)
        filters.blur(dmCtx, this.$store.state.settings.blurRadius)
        filters.compressGrays(dmCtx, 0.8, 1.0)

        this.canvas = this.$refs.canvas
        this.canvas.width = Math.round(dmCtx.canvas.width * (1+1/this.$store.state.settings.stripFraction))
        this.canvas.height = dmCtx.canvas.height
        
        const ctx = this.$refs.canvas.getContext('2d')

        // create background from pattern
        const patternWidth = Math.round(dmCtx.canvas.width * 1/this.$store.state.settings.stripFraction)
        // const patternHeight = pattern.height
        filters.noise(ctx, 10000)
        filters.tesselate(ctx, pImg, patternWidth)
        filters.applyDepthMap(ctx, dmCtx)

      })
      // Create blank canvas
      const pattern_w = parseInt(10)
      // Create pattern
      // From image
      // Random dots

      // Start shifting pixels

    },
    // refreshDepthMap() {
    //   if (!this.depthMap) return
    //   this.$store.commit('image/setLoading', true)
    //   // Get new canvas
    //   const { width, height, src } = this.depthMap

    //   const MAX_WIDTH = 400,
    //     MAX_HEIGHT = 300

    //   const newSize = utils.constrain({width, height}, {MAX_WIDTH, MAX_HEIGHT})

    //   this.dmCanvas = this.$refs.dmCanvas
    //   this.dmCanvas.width = newSize.width
    //   this.dmCanvas.height = newSize.height
    //   const newImg = new Image()
    //   newImg.onload = () => {
    //     const ctx = this.dmCanvas.getContext('2d')
    //     ctx.drawImage(newImg, 0, 0, newSize.width, newSize.height)
    //     // Convert to grayscale
    //     filters.grayscale(ctx)
    //     filters.blur(ctx, this.$store.state.settings.blurRadius)
    //   }
    //   newImg.src = src
    //   this.$store.commit('image/setLoading', false)
    // }
  },
  beforeUnmount() {
    // this.stopAnimatedNoise()
  },
  watch: {
    // depthMap: {
    //   immediate: true,
    //   deep: true,
    //   handler(newVal) {
    //     this.render()
    //   }
    // },
    '$store.state.image.depthMap': {
      handler(newVal) {
        this.render()
      }
    },
    '$store.state.image.pattern': {
      handler(newVal) {
        this.render()
      }
    },
    '$store.state.settings': {
      handler(newVal) {
        this.render()
      },
      deep: true,
      immediate: true,
    }
  }
}
</script>
<style lang="css"
  scoped>
canvas {
  border: 1px solid red;
}
</style>