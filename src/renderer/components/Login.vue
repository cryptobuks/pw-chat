<template>

<v-layout align-center justify-center id="wrapper">
    <v-flex xs10 sm6 md5 lg4>
        <v-alert
          color="error"
          icon="warning"
          transition="scale-transition"
          v-model="showAlert"
          v-if="error && error.message"
          dismissible
        >
          {{ error.message }}
        </v-alert>
        <v-card>
            <v-toolbar card color="white" prominent>
              <v-toolbar-title class="blue-grey--text">
                <h4 class="display-1 text-xs-center">Login in to PW Chat</h4>
              </v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>

            <v-card-text>
                <v-form v-model="valid">
                    <v-text-field
                      v-model="email"
                      label="E-mail"
                      :error-messages="errors.collect('email')"
                      v-validate="'required|email'"
                      data-vv-name="email" required>
                    </v-text-field>
                    <v-text-field
                      name="password"
                      data-vv-name="password"
                      v-model="password"
                      label="Enter your password"
                      :error-messages="errors.collect('password')"
                      v-validate="'required'"
                      :append-icon="hidePass ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (hidePass = !hidePass)"
                      type="password"
                      :type="hidePass ? 'password' : 'text'"
                      required
                    >
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      block
                      :loading="isAuthenticatePending"
                      color="primary"
                      @click.stop="submit()"
                      :disabled="isAuthenticatePending"
                    >
                      LOGIN
                    </v-btn>
                </v-form>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
                <v-btn router flat to="/forgot">Forgot Password</v-btn>
                <v-spacer></v-spacer>
                New to app?
                <v-btn router flat to="/signup">Signup</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</v-layout>

</template>

<script>
import { mapMutations, mapState } from 'vuex'
// import feathersClient from '@/api/feathers-client'

export default {
  $validates: true,
  computed: {
    ...mapState('auth', {
      errorOnAuthenticate: state => state.errorOnAuthenticate,
      isAuthenticatePending: state => state.isAuthenticatePending
    })
  },
  watch: {
    showAlert (newValue) {
      if (newValue === false) {
        this.dismissError()
      }
    }
  },
  data () {
    return {
      email: null,
      error: undefined,
      hidePass: true,
      password: null,
      valid: false,
      showAlert: false
    }
  },
  methods: {
    ...mapMutations('auth', {
      clearAuthenticateError: 'clearAuthenticateError'
    }),
    submit () {
      this.$validator.validateAll()

      const errCount = this.errors.all()
      if (errCount.length > 0) {
        return false
      }

      const creds = {
        email: this.email,
        password: this.password,
        strategy: 'local'
      }
      this.$store.dispatch('auth/authenticate', creds)
        .then(res => {
          // const userId = res.payload.userId
          // this.$store.dispatch('users/get', userId).then(user => {
          //   feathersClient.set('user', user)
          this.$router.replace({ path: '/' })
          // })
        })
        .catch(error => {
          console.log('Login error', error)
          // Convert the error to a plain object and add a message.
          let type = error.className
          error = Object.assign({}, error)
          error.message = (type === 'not-authenticated')
            ? 'Incorrect email or password.'
            : 'An error prevented login.'
          this.error = error
          this.showAlert = true
        })
    },
    dismissError () {
      this.error = undefined
      this.clearAuthenticateError()
      this.showAlert = false
      this.clear()
    },
    clear () {
      this.email = null
      this.password = null
      this.$validator.clean()
    }
  }
}
</script>
