import peersActions from './actions'
import peersMutations from './mutations'
import peersState from './state'
import peersGetters from './getters'

export default {
  namespaced: true,
  state: peersState,
  mutations: peersMutations,
  actions: peersActions,
  getters: peersGetters
}
