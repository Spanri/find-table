import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: [{ df: "df" }]
  },
  getters: {
    data: state => state.data
  },
  mutations: {
    inputData(state, data) {
      state.data = data;
    }
  },
  actions: {
    inputData({ commit }, data) {
      commit("inputData", data);
    }
  },
  modules: {}
});
