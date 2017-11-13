<template>
  <v-app id="inspire">
    <template
      v-if="isVerifiedAndHasConversations">
      <v-navigation-drawer
        app
        :mini-variant.sync="mini"
        :enable-resize-watcher="true"
      >
         <v-list>
           <template v-for="(conversation, i) in conversations">
            <v-list-tile
              v-if="hasMessages(conversation)"
              avatar
              ripple
              @click="selectChat(conversation)"
              :key="conversation.id">

              <v-list-tile-avatar>
                <img :src="conversation.partner.profilePicture"></v-list-tile-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ getPartnerName(conversation) }}
                </v-list-tile-title>
                <template
                  v-if="lastMessages[conversation.id] && lastMessages[conversation.id].text">
                  <v-list-tile-sub-title
                    v-if="!isReadByUser(lastMessages[conversation.id])"
                    class="grey--text text--darken-4">
                    {{ lastMessages[conversation.id].text.substr(0, 30) + '...' }}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>
                    {{ lastMessages[conversation.id].text.substr(0, 30) + '...' }}
                  </v-list-tile-sub-title>
                </template>
              </v-list-tile-content>
              <v-list-tile-action v-if="!mini">
                <v-list-tile-action-text
                  v-if="lastMessages[conversation.id] && lastMessages[conversation.id].text">
                  {{ getMessageTime(lastMessages[conversation.id].createdAt) }}
                </v-list-tile-action-text>
                <v-icon
                  color="grey lighten-1"
                >chevron_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
            v-if="i + 1 < conversations.length"
            :key="conversation.id">
            </v-divider>
          </template>
        </v-list>
      </v-navigation-drawer>
    </template>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      flat
      :extended="conversation !== null"
      transition="fade-transition"
    >
      <v-btn v-if="isVerifiedAndHasConversations" icon @click.native.stop="mini = !mini">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="user && user.id">
        <v-btn icon>
          <v-avatar size="36px">
            <img :src="user.profilePicture" alt="">
          </v-avatar>
        </v-btn>
        <v-btn icon @click.native.stop="rightDrawer = !rightDrawer">
          <v-icon>menu</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
    </main>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title class="headline">Add this User to your conatcts?</v-card-title>
        <v-card-text>
          <strong>This is required!</strong>
          This application requires the two user to be  in each others contact list for communicating to each
          other via this application
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog = false">Cancel</v-btn>
          <v-btn
            router
            :to="{name: 'AddContact', params: {preName, preEmail}}"
            color="green darken-1" flat
            @click.native="dialog = false"
          >
            Add to contact
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="callPrompt" persistent>
      <v-card>
        <v-card-title class="headline"> {{ callerName }} is calling you</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click.native="acceptCall()">Accept</v-btn>
          <v-btn color="red darken-1"  @click.native="endCall()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="callDialog" persistent fullscreen
        max-width="750">
      <v-card>
        <v-card-title class="headline">{{ callerName }}</v-card-title>
        <v-container grid-list-xl>
            <v-layout>
              <v-flex class="text-xs-center">
                <video
                  class="video remote-video"
                  ref="remoteStream"
                  autoplay
                ></video>
              </v-flex>
              <v-flex class="text-xs-center">
                <video
                  class="video my-video"
                  ref="myStream"
                  muted="true"
                  autoplay
                ></video>
              </v-flex>
            </v-layout>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="endCall()">End Call</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      temporary
      clipped
      right
      app
      v-if="user && user.id"
      dark class="blue lighten-3"
      v-model="rightDrawer"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="user.profilePicture" :alt="user.firstName + ' ' +user.lastName">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.firstName + ' ' + user.lastName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile
          router
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar
          :timeout="3000"
          bottom
          right
          v-model="snackbar"
        >
          {{ onlineStatus }}
          <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// Modern date library
import isToday from 'date-fns/is_today'
import isYesterday from 'date-fns/is_yesterday'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import format from 'date-fns/format'

import feathersClient from './api/feathers-client'

import getLocalStream from '@/api/getLocalStream'
import getPeer from '@/api/peer'

// Event Hub for all components
import eventHub from '@/api/eventHub'

const userService = feathersClient.service('users')

export default {
  name: 'pwc',
  computed: {
    ...mapState('auth', {
      user: state => state.user
    }),

    ...mapState('conversations', {
      onCall: state => state.onCall
    }),

    ...mapGetters({
      contacts: 'contacts/list',
      conversations: 'conversations/list',
      conversation: 'conversations/current'
    }),

    isVerifiedAndHasConversations () {
      const user = this.user
      const conversations = this.conversations
      return (user && user.id) && user.isVerified === true && (conversations && conversations.length > 0)
    },

    lastMessages () {
      if (!this.conversations || !this.conversations.length) return null
      let convs = this.conversations.map(c => {
        if (this.hasMessages(c)) {
          let msgCount = c.messages.length
          let msg = c.messages[msgCount - 1]
          if (msg && msg.text !== null) {
            return msg
          } else {
            let i = msgCount - 1
            while (c.messages[i].text === null) {
              if (i < 0) break
              i--
            }
            if (i >= 0) {
              return c.messages[i]
            }
            return null
          }
        }
        return null
      })
      convs = convs.filter(c => c !== null)
      let result = {}
      convs.forEach((c) => {
        result[c.conversationId] = c
      })
      return result
    }
  },

  data: () => ({
    items: [
      { icon: 'account_circle', title: 'Profile', to: '/profile' },
      { icon: 'forum', title: 'Chats', to: '/chats' },
      { icon: 'contacts', title: 'Contacts', to: '/contacts' },
      { icon: 'exit_to_app', title: 'Logout', to: '/logout' }
    ],
    dialog: false,
    mini: false,
    rightDrawer: false,
    title: 'PW Chat',
    preName: '',
    preEmail: '',
    callPrompt: false,
    callDialog: false,
    callerName: null,
    peer: null,
    snackbar: false,
    onlineStatus: '',
    missedCalls: []
  }),

  watch: {
    // When the user is set, redirect to the Chat page.
    async user (newVal) {
      console.log('User changed ', newVal) // eslint-disable-line
      if (newVal === undefined || newVal === null || !newVal) {
        this.$router.replace({ name: 'login' })
      } else {
        if (this.user && this.user.isVerified) {
          feathersClient.set('user', this.user)
          let peer
          const userPeerId = this.user.peerId

          if (window.peer && window.peer.id !== null) {
            peer = window.peer
          } else {
            peer = getPeer(userPeerId)
          }
          peer.on('open', this.handleOpenPeerConnection)
          peer.on('error', error => {
            console.log('There was some error conecting to peer server', error)
            if (peer.disconnected === true && peer.destroyed === false) {
              console.log('disconnected from server, reconnecting...')
              peer.reconnect()
            }
          })
          this.peer = peer
          peer.on('call', this.promptCall)
          // Another peer connects to you using your peerId
          peer.on('connection', _dataConnection => {
            // Add it to PeerConncetion Store so that other components
            // can reuse this dataConection, also help in reusing the same connection for our
            // tranmission as well
            // Tell All the components (well MessengerView here) that we have a new peer connected
            eventHub.$emit('peer-connected', _dataConnection)
            this.$store.dispatch('peers/addPeer', _dataConnection)
          })

          const user = await userService.patch(this.user.id, { isOnline: true })
          feathersClient.set('user', user)
          await this.$store.dispatch('conversations/getMessages')
          await this.$store.dispatch('contacts/copyContacts')
          this.$router.replace({name: 'chat'})
        } else {
          this.$router.replace({name: 'welcome-view'})
        }
      }
    }
  },

  async mounted () {
    try {
      await this.$store.dispatch('auth/authenticate')
    } catch (error) {
      if (!error.message.includes('Could not find stored JWT')) {
        console.error(error) // eslint-disable-line
      } else {
        console.log('Login failed', error) // eslint-disable-line
      }
    }
    window.onoffline = function onoffline () {
      this.onlineStatus = 'Your are online now!'
      this.snackbar = true
      console.log('You are offline now')
    }.bind(this)
    window.ononline = function ononline () {
      this.onlineStatus = 'Your are online now!'
      this.snackbar = true
      console.log('You are online now')
    }.bind(this)
    window.onclose = function onclose () {
      if (this.user && this.user.id) {
        userService.patch(this.user.id, { isOnline: false }).catch(e => {
          console.log('Failed to update user')
        })
      }
      window.peer.disconnect()
      window.peer.destroy()
      // remove the peer
      delete window.peer
      // remove all the conneccted peer data connections
      delete window.peersConnected
    }.bind(this)
  },

  methods: {
    handleOpenPeerConnection () {
      console.log('Peer connection opened!')
    },
    hasMessages (conversation) {
      return conversation && conversation.messages && conversation.messages.length !== 0
    },
    getPartnerName (conversation) {
      const userId = this.user.id
      let contact
      if (conversation.userId === userId) {
        contact = this.contacts.find(c => c.fk_contactId === conversation.fk_partnerId)
      } else {
        contact = this.contacts.find(c => c.fk_contactId === conversation.userId)
      }
      if (contact) {
        return contact.fullName
      } else {
        return conversation.partner.name
      }
    },

    async selectChat (conversation) {
      const userId = this.user.id
      let contact
      if (conversation.userId === userId) {
        contact = this.contacts.find(c => c.fk_contactId === conversation.fk_partnerId)
      } else {
        contact = this.contacts.find(c => c.fk_contactId === conversation.userId)
      }
      if (!contact) {
        this.preName = conversation.partner.name
        this.preEmail = conversation.partner.email
        this.dialog = true
        return false
      }
      // get the contact, conversation
      await this.$store.dispatch('contacts/get', contact.id)
      await this.$store.dispatch('conversations/get', conversation.id)
      if (this.$route.name !== 'chat') {
        this.$router.replace({ name: 'chat' })
      }
    },

    getMessageTime (msgDate) {
      if (isToday(msgDate)) {
        const diff = differenceInSeconds(new Date(), msgDate)
        if (diff < 30) {
          return 'now'
        }
        return format(msgDate, 'h:MM A')
      } else if (isYesterday(msgDate)) {
        return 'Yesterday'
      } else {
        return format(msgDate, 'D MMM')
      }
    },

    isMessageByUser (message) {
      if (!message && message.userId) return false
      const userId = message.userId
      return userId === this.user.id
    },

    isReadByUser (message) {
      if (!this.isMessageByUser(message)) {
        return message.status === 'READ'
      }
      return false
    },

    async promptCall (call) {
      console.log('getting a new call..', call)
      if (this.onCall) {
        call.close()
        return
      }
      const callerPeerId = call.peer
      console.log('The Calling PeerID', callerPeerId)
      const caller = this.contacts.find(c => c.peerId === callerPeerId)
      this.callerName = (caller && caller.fullName) ? caller.fullName : 'Unknown Caller'
      this.call = call
      this.callPrompt = true
      // wait for 5 seconds, if user not accept the call,  end it right away...
      window.setTimeout(() => {
        if (this.call && this.call.open === false && this.callPrompt === true) {
          console.log('Waited for 5 seconds but not answered call')
          this.endCall()
          this.missedCalls.push({
            callerName: this.callerName,
            time: new Date()
          })
        }
      }, 5000)
    },

    async acceptCall () {
      // hide the call prompt
      this.callPrompt = false
      const localStream = await getLocalStream()
      this.$refs.myStream.src = URL.createObjectURL(localStream)
      // show  the video call interface model
      this.callDialog = true
      this.call.answer(localStream)
      console.log('answering the call', this.call)
      // Set onCall so no other user can call you during the call
      this.$store.dispatch('conversations/onCallNow')
      // call connected
      this.call.on('stream', _remoteStream => {
        this.$refs.remoteStream.src = URL.createObjectURL(_remoteStream)
      })
      // call ended/closed by remote user
      this.call.on('close', () => {
        console.log('call ended')
        this.callDialog = false
        this.call = null
        this.$refs.myStream.src = ''
        this.$refs.remoteStream.src = ''

        localStream.getTracks().forEach(track => track.stop())

        this.$store.dispatch('conversations/clearOnCall')
      })
    },

    endCall () {
      console.log('closing this.call', this.call)
      this.call.close()
      this.callPrompt = false
      this.callDialog = false
      this.call = null
      this.$store.dispatch('conversations/clearOnCall')
    }
  }
}
</script>

<style lang="stylus">
  @import './assets/stylus/main.styl';
</style>


<style>
  @import url('../../node_modules/material-design-icons/iconfont/material-icons');
  @import url('../../node_modules/mdi/css/materialdesignicons');
  @import url('../../node_modules/roboto-fontface/css/roboto/roboto-fontface');

  ::-webkit-scrollbar {
    width: 5px;
    background-color: #F5F5F5;
  }
  ::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(0,0,0,0.1);
    border: 1px solid #ccc;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: linear-gradient(left, #fff, #e4e4e4);
    border: 1px solid #aaa;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #fff;
  }

  ::-webkit-scrollbar-thumb:active {
    background: linear-gradient(left, #22ADD4, #1E98BA);
  }
  .video {
    border: 0 none;
    margin: 5px auto;
  }

  .video.my-video {
    margin-top: 5px;
    width: 150px;
    height: auto;
    background-color: #eee;
  }

  .video.remote-video {
    width: 350px;
    height: 300px;
    max-height: 480px;
    background-color: #eee;
  }
</style>
