<template>
  <div class="text-center">
    <v-card-title>debug canvas</v-card-title>
    <canvas ref="debugCanvas"
      id="debugCanvas"
      :width="width"
      :height="height"></canvas>
    <div v-if="debugCanvas">{{ debugCanvas.width }} x {{ debugCanvas.height }}</div>
    <canvas ref="canvas"
      :width="width"
      :height="height"></canvas>
    <h4>Drew {{100000}} in {{dt}}ms</h4>
  </div>
</template>
<script>
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
      debugCanvas: null
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.debugCanvas = this.$refs.debugCanvas
      // this.drawAnimatedNoise(10)
    })
  },
  computed: {
    depthMap() {
      return this.$store.getters['image/depthMap']
    },
    width() {
      return this.depthMap?.width ?? DEFAULT_SIZE.width
    },
    height() {
      return this.depthMap?.height ?? DEFAULT_SIZE.height
    },
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
    drawNoise(amount = 100000) {
      this.$nextTick().then(() => {
        const ctx = this.$refs.canvas.getContext('2d')

        t0 = Date.now()
        ctx.clearRect(0, 0, this.width, this.height)

        var id = ctx.getImageData(0, 0, this.width, this.height);
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
        ctx.putImageData(id, 0, 0);
        this.dt = Date.now() - t0
      })
    },
    drawAnimatedNoise(delay) {
      this.timeout = window.setTimeout(() => {
        this.drawNoise()
        this.drawAnimatedNoise(delay)
      }, delay)
    },
    stopAnimatedNoise() {
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
    drawPattern() {},
    toGrayscale(ctx) {
      let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      let pixels = imgData.data;
      for (var i = 0; i < pixels.length; i += 4) {
        let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

        pixels[i] = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
      }
      ctx.putImageData(imgData, 0, 0);
      console.log("Converted to grayscale")
    },
    blur(ctx, amount = 10 /*px*/ ) {
      console.log("Blurring", amount, "px")

      var blur = amount; 
      var blurRange = blur * 3;
      var gaussparam = new Array;

      for (var i = 0; i <= blurRange; i++) {
        gaussparam[i] = Math.exp(-i * i / (2 * blur * blur));
      }

      const switchXY = (width, height, data, clockwiseFlg) => {
        // 行列入れ替え
        var newData = new Array;
        if (clockwiseFlg) {
          for (var i = 0, len = width * height; i < len; i++) {
            var k = (i % width) * height + ((i / width) | 0);
            newData[k * 4] = data[i * 4];
            newData[k * 4 + 1] = data[i * 4 + 1];
            newData[k * 4 + 2] = data[i * 4 + 2];
            newData[k * 4 + 3] = data[i * 4 + 3];
          }
        } else {
          for (var i = 0, len = width * height; i < len; i++) {
            var k = (i % width) * height + ((i / width) | 0);
            newData[i * 4] = data[k * 4];
            newData[i * 4 + 1] = data[k * 4 + 1];
            newData[i * 4 + 2] = data[k * 4 + 2];
            newData[i * 4 + 3] = data[k * 4 + 3];
          }
        }
        return newData;
      }
      const blurX = (width, height, dataOrigine) => {
        var canvasDraw = document.createElement('canvas');
        canvasDraw.width = width;
        canvasDraw.height = height;
        canvasDraw.crossOrigin = 'anonymous';
        var ctxDraw = canvasDraw.getContext('2d');
        var imageDataDraw = ctxDraw.getImageData(0, 0, width, height);
        var dataDraw = imageDataDraw.data;
        var ox, oy, gauss, count, R, G, B, A;
        for (var i = 0, len = width * height; i < len; i++) {
          gauss = count = R = G = B = A = 0;
          ox = i % width;
          oy = (i / width) | 0; // = Math.floor(i / width);          
          for (var x = -1 * blurRange; x <= blurRange; x++) {
            var tx = ox + x;
            if ((0 <= tx) && (tx < width)) {
              gauss = gaussparam[x < 0 ? -x : x]; // = [Math.abs(x)]
              var k = i + x;
              R += dataOrigine[k * 4 + 0] * gauss;
              G += dataOrigine[k * 4 + 1] * gauss;
              B += dataOrigine[k * 4 + 2] * gauss;
              A += dataOrigine[k * 4 + 3] * gauss;
              count += gauss;
            }
          }
          dataDraw[i * 4 + 0] = (R / count) | 0;
          dataDraw[i * 4 + 1] = (G / count) | 0;
          dataDraw[i * 4 + 2] = (B / count) | 0;
          dataDraw[i * 4 + 3] = (A / count) | 0;
        }
        return imageDataDraw
      }

      // setting
      var width = ctx.canvas.width;
      var height = ctx.canvas.height;
      var imageData = ctx.getImageData(0, 0, width, height);
      var newData, newImageData;
      // blur y
      newData = switchXY(width, height, imageData.data, true);
      newImageData = blurX(width, height, newData);
      // blur x
      newData = switchXY(width, height, newImageData.data, false);
      newImageData = blurX(width, height, newData);
      // draw
      ctx.putImageData(newImageData, 0, 0);
    }
  },
  beforeUnmount() {
    this.stopAnimatedNoise()
  },
  watch: {
    depthMap: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.$nextTick().then(() => {
            // Get new canvas
            const { width, height, src } = newVal

            const MAX_WIDTH = 400,
              MAX_HEIGHT = 300

            const ratio = width / height
            const maxRatio = MAX_WIDTH / MAX_HEIGHT
            // Constrain size

            let canvasWidth = width
            let canvasHeight = height
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              console.log(`Constrain size to ${MAX_WIDTH} x ${MAX_HEIGHT}`)
              canvasWidth = ratio > maxRatio ? MAX_WIDTH : ratio * MAX_HEIGHT
              canvasHeight = ratio > maxRatio ? MAX_WIDTH / ratio : MAX_HEIGHT
            }

            this.debugCanvas = this.$refs.debugCanvas
            this.debugCanvas.width = canvasWidth
            this.debugCanvas.height = canvasHeight
            const newImg = new Image()
            newImg.onload = () => {
              const ctx = this.debugCanvas.getContext('2d')
              ctx.drawImage(newImg, 0, 0, canvasWidth, canvasHeight)
              // Convert to grayscale
              this.toGrayscale(ctx)
              this.blur(ctx, 10)

            }
            newImg.src = src
          })
        }
        this.drawNoise()
      }
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