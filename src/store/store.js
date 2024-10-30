import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
      localStorage.setItem('token', token);
    },
    loadToken({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
      }
    },
    clearToken({ commit }) {
      commit('clearToken');
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getToken: state => state.token,
  },
});

export default store;
