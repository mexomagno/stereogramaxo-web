const getDefaultState = () => ({
  stripFraction: 8,
  blurRadius: 0,
})

const state = getDefaultState()

const mutations = {
  setStripFraction(state, fraction) {
    state.stripFraction = fraction
  },
  setBlurRadius(state, radius) {
    state.blurRadius = radius
  },
}


export default {
  namespaced: true,
  state,
  mutations,
}