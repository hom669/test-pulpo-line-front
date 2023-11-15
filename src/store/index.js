import { createStore } from 'vuex';

export default createStore({
  state: {
    tab: 1,
    refreshComponent: false,
    isAuthenticated: false,
    userConnect: {
      userId: null,
      name: null
    }
  },
  mutations: {
    setTab(state, newTab) {
      state.tab = newTab;
    },
    setUserConnect(state, { key, value }) {
      if (Object.prototype.hasOwnProperty.call(state.userConnect, key)) {
        state.userConnect[key] = value;
      }
    },
    setRefreshComponent(state, refreshComponent) {
      state.refreshComponent = refreshComponent;
    },
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
  },
  actions: {
    updateUserConnect({ commit }, { key, value }) {
      // Utiliza esta acción para actualizar propiedades específicas del layout
      commit('setUserConnect', { key, value });
    }
  },
  getters: {
    getUserConnect(state) {
      return state.userConnect;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
  }
});
