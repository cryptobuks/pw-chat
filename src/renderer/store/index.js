import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'

import feathersClient from '@/api/feathers-client'
import conversationsModule from './modules/Conversations'
import contactsActions from './modules/Contacts/actions'

// Peers
import peers from './modules/Peers'

const { service, auth } = feathersVuex(feathersClient)

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    peers
  },
  plugins: [
    // service('users'),
    service('conversations', conversationsModule),
    service('contacts', {
      actions: contactsActions
    }),
    auth({
      userService: 'users'
    })
  ],
  strict: process.env.NODE_ENV !== 'production'
})

export default store
