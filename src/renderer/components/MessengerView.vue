<template>
  <v-layout row id="wrapper">
    <v-flex xs8 offset-xs2 class="text-xs-center"
        v-if="(user && user.contacts && user.contacts.length === 0) && (conversations && conversations.length === 0)">
        <h2 class="text-xs-center blue--text">Looks like you are alone here!</h2>
        <h4 class="text-xs-center">Add some new contacts and talk with your friends!</h4>
        <div class="text-xs-center">
          <v-btn flat router to="/add-contact">Add new contact</v-btn>
        </div>
    </v-flex>
    <v-flex xs8 offset-xs2 v-else-if="(conversation && conversation.id) && (contact && contact.id)">
        <v-card class="card--flex-toolbar chat--container">
          <v-toolbar card color="white" prominent>
            <v-avatar size="36px">
              <img :src="contact.contactUser.profilePicture" :alt="contact.fullName">
            </v-avatar>
            <v-toolbar-title class="body-4 blue-grey--text">
              {{ contact.fullName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip
                left
                v-if="!isContactOnline"
              >
                <v-btn
                  icon
                  @click.native="reconnect()"
                  slot="activator"
                  class="my-0"
                >
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>Reconnect</span>
             </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn flat color="green lighten-1" :disabled="!isContactOnline">
              {{ isContactOnline ? 'Online': 'Offline' }}
            </v-btn>

            <v-btn icon @click.native.stop="callPartner()">
              <v-icon>videocam</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
              <messages-list
                :messages="conversation.messages"
                :user="user"
                :partner="contact"
                >
              </messages-list>
          <v-divider></v-divider>

          <v-card-actions class="chat--message-composer">
            <message-composer
              v-if="conversation && conversation.id"
              :sendMessage="sendMessage"
            ></message-composer>
          </v-card-actions>
        </v-card>
    </v-flex>
    <v-flex justify-center align-center v-else mt-5>
      <p class="display-3 text-xs-center blue-grey--text">
        Select a chat or go to <router-link to="/contacts">contacts</router-link> and get started.
      </p>
      <p class="display-1 text-xs-center">
        Your chats are secured by WebRTC's end-to-end encryption.
      </p>
    </v-flex>
    <v-dialog
        v-if="contact && contact.fullName"
        v-model="callDialog"
        persistent
        max-width="750"
        >
      <v-card>
        <v-container grid-list-xl>
            <v-layout>
              <v-flex class="video-call">
                <div class="contact-name">
                  <h3>{{ contact.fullName }}</h3>
                </div>
                <div class="remote-stream">
                  <video
                    ref="remoteStream"
                    autoplay
                  >
                  </video>
                </div>
                <div class="local-stream">
                  <video
                    ref="myStream"
                    muted="true"
                    autoplay
                  >
                  </video>
                </div>
                <div class="controls">
                  <v-btn fab large dark color="red" @click.native.stop="endCall()">
                    <v-icon>call_end</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MessagesList from './MessengerView/MessagesList'
import MessageComposer from './MessengerView/MessageComposer'
import getLocalStream from '@/api/getLocalStream'
import getPeer from '@/api/peer'
import eventHub from '@/api/eventHub'

export default {
  name: 'MessengerView',
  components: {
    MessagesList,
    MessageComposer
  },
  computed: {
    ...mapState('auth', {
      user: state => state.user
    }),
    ...mapGetters({
      contact: 'contacts/current',
      conversations: 'conversations/list',
      conversation: 'conversations/current',
      getPeerDataConnection: 'peers/getPeerDataConnection'
    })
  },
  data: () => ({
    call: null,
    callDialog: false,
    callStart: null,
    peer: null,
    peerDataConn: null,
    isContactOnline: false,
    localStream: null
  }),
  created () {
    eventHub.$on('peer-connected', this.peerConnected)
    eventHub.$on('peer-disconnected', this.peerDisconnected)
  },
  beforeDestroy () {
    eventHub.$off('peer-connected', this.peerConnected)
    eventHub.$off('peer-disconnected', this.peerDisconnected)
  },
  mounted () {
    if (this.user && this.user.peerId) {
      const peerId = this.user.peerId
      if (window.peer && window.peer.id !== null) {
        this.peer = window.peer
      } else {
        this.peer = getPeer(peerId)
      }

      if (this.contact && this.contact.fullName) {
        this.peerDataConn = this.connectToContactPeer(this.contact.peerId)
      }
    }
  },
  watch: {
    contact (newVal) {
      if (newVal && newVal.peerId) {
        this.peerDataConn = this.connectToContactPeer(newVal.peerId)
      }
    },
    peerDataConn (newVal) {
      if (newVal && newVal.open) {
        this.isContactOnline = true
      } else {
        this.isContactOnline = false
      }
    },
    peer (newVal) {
      if (newVal.disconnected === true && newVal.destroyed !== true) {
        console.log('Peer disconnected, reconnecting')
        newVal.reconnect()
      }
    }
  },
  methods: {
    peerConnected (peerDataConn) {
      if (peerDataConn) {
        const peer = peerDataConn.peer
        console.log('peerConnected--eventbus ', peer)
        if (this.peerDataConn && this.peerDataConn.peer === peer) {
          this.peerDataConn = peerDataConn
          this.isContactOnline = true
        }
      }
    },
    peerDisconnected (peerId) {
      console.log('Peer disconnected', peerId)
      if (this.peerDataConn && this.peerDataConn.peer === peerId) {
        this.peerDataConn = null
        this.isContactOnline = false
      }
    },
    async sendMessage (text, type = 'TEXT') {
      if (text.trim() === '') {
        return false
      }
      const message = {
        conversationId: this.conversation.id,
        text,
        userId: this.user.id,
        type
      }
      try {
        // save the message server and add it to message list
        const result = await this.$store.dispatch('conversations/sendMessage', message)
        // send it to peer now
        if (this.peerDataConn && this.peerDataConn.open) {
          this.peerDataConn.send(result)
        } else {
          console.log('Peer not open', this.peerDataConn)
        }
      } catch (error) {
        console.log('Message not sent!', error)
      }
    },
    async endCall () {
      this.$store.dispatch('conversations/clearOnCall')
      // close the call
      this.call.close()

      const callEnd = new Date()
      try {
        if (this.callStart === null) {
          console.log('Call was either rejected or an error occurred!')
          return
        }
        const result = await this.saveCallToServer(this.callStart, callEnd)
        console.log('Call saved successfully!', callEnd, result)
        // TODO: send this call details to user
      } catch (err) {
        console.log('Call not saved!', err)
      } finally {
        if (this.localStream !== null) {
          console.log('closing the media tracks')
          this.localStream.getTracks().forEach((track, i) => {
            console.log(`track - ${i}`, track)
            track.stop()
          })
        }
        this.$refs.myStream.srcObject = null
        this.$refs.remoteStream.srcObject = null
        this.localStream = null
        this.remoteStream = null
        this.callDialog = false
      }
    },
    async saveCallToServer (callStart, callEnd) {
      const message = {
        conversationId: this.conversation.id,
        userId: this.user.id,
        type: 'CALL',
        callStart,
        callEnd
      }
      try {
        const result = await this.$store.dispatch('conversations/sendMessage', message)
        console.log('message send', result)
        // TODO: send this call details to user
        return result
      } catch (error) {
        console.log('Message not sent!', error)
        return error
      }
    },
    async callPartner () {
      console.log('calling - ', this.contact.fullName)
      // tell the store we are on call now
      this.$store.dispatch('conversations/onCallNow')
      const localStream = await getLocalStream()
      this.localStream = localStream
      this.callDialog = true
      // show our stream on dialog
      this.$refs.myStream.srcObject = localStream
      this.$refs.myStream.onloadedmetadata = e => {
        this.$refs.myStream.play()
      }
      const call = this.peer.call(this.contact.peerId, localStream)
      this.call = call
      let callAccepted = false
      // wait for 5 seconds, if not answered close it right away..
      window.setTimeout(() => {
        if (this.call.open === false && this.callStart === null) {
          console.log('Call not answered in 5 seconds. closing now')
          this.endCall()
        }
      }, 10000) // change it to 5000
      // call connected
      this.call.on('stream', _remoteStream => {
        if (!callAccepted) {
          callAccepted = true
          this.callStart = new Date()
          console.log('partner accepted')
        }
        this.$refs.remoteStream.srcObject = _remoteStream
        this.$refs.remoteStream.onloadedmetadata = e => {
          this.$refs.remoteStream.play()
        }
      })
      // call ended/closed by remote user
      this.call.on('close', async () => {
        this.$store.dispatch('conversations/clearOnCall')
        this.$refs.myStream.srcObject = null
        this.$refs.remoteStream.srcObject = null
        // if call was rejected by them
        if (this.callStart === null) {
          console.log('Call was rejected by them')
          this.callDialog = false
          this.endCall()
          return
        }
        // close the localStream (audio, video)
        if (this.localStream && this.localStream.getTracks) {
          this.localStream.getTracks().forEach(track => track.stop())
        }
        // save call to server
        try {
          const callEnd = new Date()
          const result = await this.saveCallToServer(this.callStart, callEnd)
          console.log('Call saved successfully!', result)
          // TODO: send this call details to user
          this.peerDataConn.send(result)
          console.log('Call successfully ended')
          console.log(`Call detailes: started at: ${this.callStart}, ended at: ${callEnd}`)
        } catch (err) {
          console.log('Call not saved!', err)
        } finally {
          this.callStart = null
          this.callDialog = false
        }
      })
    },
    reconnect () {
      const peerId = this.contact.peerId
      this.peerDataConn = this.connectToContactPeer(peerId)
    },
    bindDataConnEvents (peerDataConn) {
      if (peerDataConn) {
        // Tell me when the connection opens
        peerDataConn.on('open', () => {
          this.isContactOnline = true
          console.log('Connected', peerDataConn.open)
        })

        // listen to errors on the data connection
        peerDataConn.on('error', err => {
          console.log('Peer connection error', err)
          console.log('Is peer data connection is open? ', peerDataConn.open)
        })
      }
    },
    connectToContactPeer (peerId) {
      if (this.peer.disconnected === true && !this.peer.destroyed) {
        this.peer.reconnect()
      }
      let peerDataConn = this.getPeerDataConnection(peerId)
      if (peerDataConn === null || peerDataConn.open === false) {
        peerDataConn = this.peer.connect(peerId)
        console.log('Created new connection', peerDataConn)
        this.$store.dispatch('peers/addPeer', peerDataConn)
        this.bindDataConnEvents(peerDataConn)
      }
      return peerDataConn
    }
  }
}
</script>

<style scoped>
.card--flex-toolbar {
  margin-top: -80px;
}

.chat--container {
  height: 600px!important;
}

.chat--message-composer {
  bottom: 0;
}

</style>
