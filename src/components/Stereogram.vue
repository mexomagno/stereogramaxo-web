<template>
  <div class="text-center">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>
<script>
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
    }
  },
  data() {
    return {
      context: null
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.context = this.$refs.canvas.getContext('2d')
      this.drawNoise()
    })
  },
  methods: {
    drawNoise(amount = 100000) {
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
    }
  }
}
</script>

<style lang="css" scoped>
canvas {
  border: 1px solid red;
}
</style>