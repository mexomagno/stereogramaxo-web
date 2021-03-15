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
const blurX = (width, height, dataOrigine, blurRange, gaussParam) => {
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
        gauss = gaussParam[x < 0 ? -x : x]; // = [Math.abs(x)]
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

export default {
  noise(ctx, amount = 10000) {
    const {width, height} = {width: ctx.canvas.width, height: ctx.canvas.height}
    ctx.clearRect(0, 0, width, height)

    var id = ctx.getImageData(0, 0, width, height);
    var pixels = id.data;

    for (var i = 0; i < amount; ++i) {
      var x = Math.floor(Math.random() * width);
      var y = Math.floor(Math.random() * height);
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
  },
  grayscale(ctx) {
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
    if (!amount) return
    console.log("Blurring", amount, "px")

    const blurRange = amount * 3;
    var gaussParam = new Array;

    for (var i = 0; i <= blurRange; i++) {
      gaussParam[i] = Math.exp(-i * i / (2 * amount * amount));
    }

    // setting
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    var newData, newImageData;
    // blur y
    newData = switchXY(width, height, imageData.data, true);
    newImageData = blurX(width, height, newData, blurRange, gaussParam);
    // blur x
    newData = switchXY(width, height, newImageData.data, false);
    newImageData = blurX(width, height, newData, blurRange, gaussParam);
    // draw
    ctx.putImageData(newImageData, 0, 0);
  },
  tesselate(patternctx, ctx) {

  }
}