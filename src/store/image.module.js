const getDefaultState = () => ({
  depthMap: null,
  pattern: null,
})

const state = getDefaultState()

const actions = {
  setDepthMap({ commit }, img) {
    commit('setDepthMap', img)
  }
}
const mutations = {
  setDepthMap(state, img) {
    state.depthMap = {
      ...img
    }
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