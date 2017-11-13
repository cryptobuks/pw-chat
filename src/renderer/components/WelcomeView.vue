<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-alert color="warning" icon="priority_high" :value="(user && user.id) && !user.isVerified">
      Your email is not verified. To continue using this app it is necessary to verify that it's you who registered to this app. Check your email inbox early possible.
    </v-alert>
    <v-flex xs10 class="mt-3">
      <v-card>
        <v-card-text>
          <h3 class="text-xs-center centered">Welcome to the PW Chat App.</h3>
          <br><br><br>
          <p>It is an app that let's you chat with your friends via Peer-to-Peer technology in realtime.</p>
          <p>We use WebRTC for the communication that is very
            <strong>secure</strong> in nature as there is no third entity (e.i. server) between you and your peer. The data transfered between peers is encrypted and cannot be caught by any third party server or attacker.</p>
        </v-card-text>
      </v-card>
    </v-flex>
      <v-flex xs10 class="mt-4">
        <template v-if="(user && user.id) && user.isVerified">
          <v-card>
            <v-card-actions>
                <v-btn color="teal" block large router to="/chats">Chats</v-btn>
            </v-card-actions>
          </v-card>
        </template>
        <template v-if="!user">
          <v-card>
            <v-card-actions>
              <v-btn color="primary" block large router to="/login">Login</v-btn>
              <v-btn color="teal" class="white--text" block large router to="/signup">Signup</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-flex>
    <v-flex>
      <v-card flat>
        <v-card-text>
          <div class="text-xs-center">
            <span>&copy; 2017 &middot; <strong>PW Chat App</strong> . Project by
              <strong>Hiren Chauhan</strong> and
              <strong>Chirag Rajput</strong>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'welcome',
  computed: {
    ...mapState('auth', {
      user: state => state.user
    })
  }
}
</script>

<style scoped>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 100%;
}

</style>
