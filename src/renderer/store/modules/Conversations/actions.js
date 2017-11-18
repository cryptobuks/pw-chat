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
  async sendMessage ({ commit }, message) {
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
  async deleteMessage ({ commit }, opts) {
    try {
      const { id, data } = opts
      const res = await messageService.patch(id, data)
      console.log('Action -- delete message -- ', res)
      commit('removeMessageFromConversation', res)
      return true
    } catch (error) {
      console.log('Error at deleting message', error)
      return false
    }
  },

  async deleteConversation ({ commit }, opts) {
    try {
      const { id, data } = opts
      const res = await conversationService.patch(id, data)
      console.log('conversation deleted', res)
      commit('removeConversation', res)
      return true
    } catch (error) {
      console.log('Error at deleting message', error)
      return false
    }
  },
  onCallNow ({ commit }) {
    commit('setBusyOnCall')
  },
  clearOnCall ({ commit }) {
    commit('clearCall')
  }
}
