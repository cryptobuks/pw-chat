export default {
  addPeerConnection (state, dataConnection) {
    if (dataConnection && dataConnection.peer) {
      const { peer } = dataConnection
      if (!window.peersConnected[peer]) {
        window.peersConnected[peer] = dataConnection
        return true
      }
    }
    return false
  },
  peerRemoved (state, peer) {
    delete window.peersConnected[peer]
  }
}
