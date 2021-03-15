export default {
  /** Return constrained image size and width, maintaining aspect ratio */
  constrain({ width, height }, { MAX_WIDTH, MAX_HEIGHT }) {
    if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
      return { width, height }
    }
    console.log(`Constrain size to ${MAX_WIDTH} x ${MAX_HEIGHT}`)

    const ratio = width / height
    const maxRatio = MAX_WIDTH / MAX_HEIGHT
    // Constrain size
    return {
      width: ratio > maxRatio ? MAX_WIDTH : ratio * MAX_HEIGHT,
      height: ratio > maxRatio ? MAX_WIDTH / ratio : MAX_HEIGHT
    }
  }
}