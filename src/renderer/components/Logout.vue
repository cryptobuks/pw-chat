<template>
  <h1>Logging out...</h1>
</template>

<script>
import { mapState } from 'vuex'

import feathersClient from '@/api/feathers-client'

const userService = feathersClient.service('users')

export default {
  name: 'Logout',
  computed: {
    ...mapState('auth', {
      user: state => state.user
    })
  },
  mounted () {
    // redirection to login has been handled by App
    userService.patch(this.user.id, { isOnline: false })
      .then(_ => {
        console.log('Updated User successfully!')
        this.$store.dispatch('auth/logout')
          .then(res => {
            // console.log('Logout success ', res)
            // this.$store.commit('users/clearAll')

            this.$store.commit('conversations/clearAll')
            this.$store.commit('contacts/clearAll')
            // disconnnect and destroy the peer
            window.peer.disconnect()
            window.peer.destroy()
            // remove the peer
            delete window.peer
            // remove all the conneccted peer data connections
            delete window.peersConnected
            // redirect the  user to login view
            this.$router.replace({ name: 'login' })
          })
          .catch(error => {
            console.error('Error while logout', error)
          })
      })
      .catch(e => {
        console.log('Error in updating user offline status.', e)
      })
  }
}
</script>
