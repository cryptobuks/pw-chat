import feathersClient from '@/api/feathers-client'

const conversationService = feathersClient.service('conversations')
const messageService = feathersClient.service('messages')

export default {
  async getMessages ({ rootState, dispatch }) {
    const userId = rootState.auth.user.id
    if (!userId) {
      return undefined
    }
    const user = rootState.auth.user
    let messagesByMyConversations = await Promise.all(
      user.conversations.map(c => conversationService.get(c.id)))

    let messagesByOthersConversations = await Promise.all(
      user.conversationsByOthers.map(c => conversationService.get(c.id))
    )
    dispatch('addOrUpdateList', messagesByMyConversations)
    dispatch('addOrUpdateList', messagesByOthersConversations)
    return { messagesByMyConversations, messagesByOthersConversations }
  },
  async sendMessage ({ dispatch, rootState, commit }, message) {
    try {
      const result = await messageService.create(message)
      if (message.type === 'CALL') {
        commit('clearCall')
      }
      // add this message to conversation message list
      commit('addMessageToConversation', result)
      return result
    } catch (error) {
      if (message.type === 'CALL') {
        commit('clearCall')
      }
      return error
    }
  },
  onCallNow ({ commit }) {
    commit('setBusyOnCall')
  },
  clearOnCall ({ commit }) {
    commit('clearCall')
  }
}
