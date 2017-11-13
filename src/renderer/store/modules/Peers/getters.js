export default {
  getPeerDataConnection: state => peerId => {
    return window.peersConnected[peerId] ? window.peersConnected[peerId] : null
  }
}
