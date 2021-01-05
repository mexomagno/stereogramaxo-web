<template>
  <div class="text-center">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
    <h4>Drew {{100000}} in {{dt}}ms</h4>
  </div>
</template>
<script>
const MAX_DIMENSION = 1500  // px
const PATTERN_FRACTION = 8.0
const OVERSAMPLE = 1.8
const SHIFT_RATIO = 0.3
const LEFT_TO_RIGHT = false  // Defines how the pixels will be shifted (left to right or center to sides)
const DOT_OVER_PATTERN_PROBABILITY = 0.3  // Defines how often dots are chosen over pattern on random pattern selection

function hex2rgb(s){
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
    width: {
      type: [String, Number],
      default: 800
    },
    height: {
      type: [String, Number],
      default: 600
    },
    depthMap: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      context: null,
      timeout: null,
      dt: 0
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.context = this.$refs.canvas.getContext('2d')
      // this.drawAnimatedNoise(10)
      this.draw()
    })
  },
  methods: {
    // Testing
    drawNoise(amount = 100000) {
      t0 = Date.now()
      this.context.clearRect(0, 0, this.width, this.height)

      var id = this.context.getImageData(0, 0, this.width, this.height);
      var pixels = id.data;

      var t0 = new Date().getTime();

      for (var i = 0; i < amount; ++i) {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var off = (y * id.width + x) * 4;
        pixels[off] = r;
        pixels[off + 1] = g;
        pixels[off + 2] = b;
        pixels[off + 3] = 255;
      }
      this.context.putImageData(id, 0, 0);
      this.dt = Date.now() - t0
    },
    drawAnimatedNoise(delay) {
      this.timeout = window.setTimeout(() => {
        this.drawNoise()
        this.drawAnimatedNoise(delay)
      }, delay)
    }, 
    stopAnimatedNoise(){
      if (this.timeout) {
        window.clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    // Actual workings
    draw() {
      // Create blank canvas
      const pattern_w = parseInt(10)
      // Create pattern
      // From image
      // Random dots

      // Start shifting pixels

    },
    drawPattern() {}
  },
  beforeUnmount() {
    this.stopAnimatedNoise()
  }
}
</script>

<style lang="css" scoped>
canvas {
  border: 1px solid red;
}
</style>