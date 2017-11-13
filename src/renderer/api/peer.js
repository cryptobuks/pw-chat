import Peer from 'peerjs'

export default function getPeer (peerId) {
  // If we had added the peer connection then reuse it
  if (window.peer) {
    return window.peer
  }
  // or Create a new peer connection
  const peer = new Peer(peerId, {
    key: '0rye6rw7phkt9',
    // host: 'pwc-peer-server.herokuapp.com', // 'potential-waffle-chat.herokuapp.com', // location.hostname,
    // port: 443,
    // secure: true,
    // path: '/',
    config: {
      'iceServers': [
        { url: 'stun:stun1.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        }
      ]
    }
  })
  // add it to global reference so we can reuse it
  window.peer = peer
  return peer
}
