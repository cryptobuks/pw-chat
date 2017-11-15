import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import VueChatScroll from 'vue-chat-scroll'

import App from './App'
import router from './router'
import store from './store'

// WebRTC Adapter (adapter.js) A WebRTC sheem
require('webrtc-adapter')

Vue.use(Vuetify)
Vue.use(VeeValidate)
Vue.use(VueChatScroll)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// setup peersConnected container object
window.peersConnected = {}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
