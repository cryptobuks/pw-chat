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
  }
}
