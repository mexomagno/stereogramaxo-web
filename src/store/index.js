import Vue from 'vue';
import Vuex from 'vuex';

import image from './image.module';
import settings from './settings.module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    image,
    settings
  },
});
