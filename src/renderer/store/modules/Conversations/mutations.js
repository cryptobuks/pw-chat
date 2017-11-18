export default {
  setBusyOnCall (state) {
    state.onCall = true
  },
  clearCall (state) {
    state.onCall = false
  },
  addMessageToConversation (state, message) {
    const {conversationId} = message
    const conversation = state.keyedById[conversationId]
    conversation.messages.push(message)
    state.keyedById[conversationId] = conversation
  },
  removeMessageFromConversation (state, message) {
    const {id, conversationId} = message
    const conversation = Object.assign({}, state.keyedById[conversationId])
    const { messages } = conversation

    const newMessages = messages.filter(m => m.id !== id)

    conversation.messages = newMessages
    state.keyedById[conversationId] = conversation
  },
  removeConversation (state, conversation) {
    const { id } = conversation
    delete state.keyedById[id]
  }
}
