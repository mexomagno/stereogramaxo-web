const getDefaultState = () => ({
  depthMap: null,
  pattern: null,
  loading: false,
})

const state = getDefaultState()

const actions = {
  setDepthMap({ commit }, img) {
    commit('setLoading', true)
    commit('setDepthMap', img)
    commit('setLoading', false)
  }
}
const mutations = {
  setDepthMap(state, img) {
    state.depthMap = {
      height: img.height,
      width: img.width,
      src: img.src,
      size: img.size
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}
const getters = {
  depthMap: state => state.depthMap
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}