import { getProjectsOffline } from '../services/index'
const UPDATE_STATE = 'UPDATE_STATE';

export default {
  namespaced: true,
  state: {
    projectsRoles: []
  },
  mutations: {
    [UPDATE_STATE](state, { payload, statePropertyToAlter }) {
      state[statePropertyToAlter] = payload;
    },
  },
  actions: {
    async getProjectsOffline({ commit }) {
      const response = await getProjectsOffline();
      commit({
        type: UPDATE_STATE,
        statePropertyToAlter: 'projectsRoles',
        payload: response.value && response.value.data,
      });
    },
  }
}
