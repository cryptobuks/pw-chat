<template>
  <v-layout row wrap  justify-center id="wrapper">
      <v-flex class="text-xs-center" xs12>
        <h4 class="text-xs-center">Forgot Password</h4>
        <p class="">Use your registered email to get the password reset link. The password reset link will be valid for short period of time.</p>
      </v-flex>
      <v-flex xs12 md6 class="mt-0">
        <v-form v-model="valid">
          <v-text-field
            v-model="email"
            label="Enter E-mail"
            :error-messages="errors.collect('email')"
            v-validate="'required|email'"
            data-vv-name="email" required>
          </v-text-field>
          <v-btn :disabled="!valid" :loading="loading" block color="primary" @click.stop="sendReset(email)">Request Password Reset</v-btn>
        </v-form>
      </v-flex>
      <v-flex xs12 class="text-xs-center">
        <v-btn flat router color="green darken-2" :to="{name: 'login'}">Login</v-btn>
      </v-flex>
      <v-snackbar
        :timeout="3000"
        :color="color"
        v-model="snackbar"
      >
        {{ message }}
        <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
  </v-layout>
</template>

<script>
import { sendResetPwd } from '@/api/auth-management'

export default {
  $validates: true,
  name: 'ForgotPassword',

  data () {
    return {
      email: '',
      valid: false,
      error: null,
      loading: false,
      snackbar: false,
      message: '',
      color: null
    }
  },
  methods: {
    sendReset (email) {
      if (!email || !this.valid) {
        return false
      }
      this.loading = true
      sendResetPwd(email)
        .then(res => {
          console.log('Request sent!', res)
          this.email = ''
          this.loading = false
          this.message = 'Password reset link has been sent your email. Check your email inbox.'
          this.color = 'info'
          this.snackbar = true
        })
        .catch(err => {
          this.loading = false
          this.email = ''
          this.message = 'There was an error: ' + err.message
          this.color = 'error'
          this.snackbar = true
          console.log('Reset Req failed ', err)
        })
    }
  }
}
</script>
