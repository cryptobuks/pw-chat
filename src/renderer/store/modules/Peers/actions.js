import eventHub from '@/api/eventHub'

export default {
  addPeer ({ commit }, dataConnection) {
    if (dataConnection) {
      commit('addPeerConnection', dataConnection)

      // listen to its `data` event, so we can catch messages sent by them
      dataConnection.on('data', data => {
        commit('conversations/addMessageToConversation', data, { root: true })
      })
      dataConnection.on('close', () => {
        commit('peerRemoved', dataConnection.peer)
        eventHub.$emit('peer-disconnected', dataConnection.peer)
      })
    }
  }
}
