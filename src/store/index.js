import { createStore } from 'vuex';

export default createStore({
  state: {
    tab: 1,
    refreshComponent: false,
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
  },
  actions: {
    updateUserConnect({ commit }, { key, value }) {
      // Utiliza esta acción para actualizar propiedades específicas del layout
      commit('setUserConnect', { key, value });
    }
  },
  getters: {
    gettUserConnect(state) {
      return state.userConnect;
    }
  }
});
