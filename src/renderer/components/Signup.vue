<template>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-alert
        :color="success ? 'success': 'error'"
        :icon="success ? 'check_circle': 'warning'"
        v-model="alert"
        transition="scale-transition"
        dismissible
      >
        {{ message }}
      </v-alert>
      <v-card ref="form">
        <v-toolbar card color="white" prominent>
          <v-toolbar-title class="blue-grey--text text-xs-center">
            <h4 class="display-1">Register for PW Chat</h4>
          </v-toolbar-title>
          </v-toolbar>
        <v-card-text>
          <v-form v-model="formHasErrors">
            <v-layout row>
              <v-flex xs12 sm6>
                  <v-text-field
                      ref="firstName"
                      v-model="firstName"
                      label="First name"
                      :error-messages="errors.collect('firstName')"
                      v-validate="'required'"
                      data-vv-name="firstName"
                      required>
                  </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                  <v-text-field
                      ref="lastName"
                      v-model="lastName"
                      label="Last name"
                      :error-messages="errors.collect('lastName')"
                      v-validate="'required'"
                      data-vv-name="lastName"
                      required>
                  </v-text-field>
            </v-flex>
          </v-layout>
          <v-select
            label="Gender"
            :items="genders"
            v-model="gender"
            :error-messages="errors.collect('gender')"
            placeholder="Select gender"
            ref="gender"
            v-validate="'required'"
            data-vv-name="gender"
            autocomplete
            required></v-select>
          <v-text-field
            ref="email"
            v-model="email"
            label="E-mail"
            :error-messages="errors.collect('email')"
            v-validate="'required|email'"
            data-vv-name="email"
            required></v-text-field>
          <v-text-field
            ref="password"
            name="password"
            data-vv-name="password"
            v-model="password"
            label="Enter your password"
            :error-messages="errors.collect('password')"
            v-validate="'required'"
            :append-icon="hidePass1 ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (hidePass1 = !hidePass1)"
            type="password"
            :type="hidePass1 ? 'password' : 'text'"
            required></v-text-field>
          <v-text-field
            ref="confirmPassword"
            name="confirmPassword"
            data-vv-name="confirmPassword"
            v-model="confirmPassword"
            label="Confirm your password"
            :error-messages="errors.collect('confirmPassword')"
            v-validate="'required'"
            :append-icon="hidePass2 ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (hidePass2 = !hidePass2)"
            type="password"
            :type="hidePass2 ? 'password' : 'text'"
            :rules="[() => password === confirmPassword || 'Password does not match']"
            required></v-text-field>
        </v-form>
        </v-card-text>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <p>Have an account?  <v-btn flat color="info" router :to="{name: 'login'}">Login</v-btn></p>
          <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip
              left
              v-if="showReset"
            >
              <v-btn
                icon
                @click="resetForm"
                slot="activator"
                class="my-0"
              >
                <v-icon>refresh</v-icon>
              </v-btn>
              <span>Refresh form</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn
            :loading="loading"
            color="primary"
            @click.native.stop="submit()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import feathersClient from '@/api/feathers-client'
const userService = feathersClient.service('users')

export default {
  $validates: true,
  data () {
    return {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      email: '',
      genders: ['MALE', 'FEMALE', 'OTHER'],
      gender: null,
      hidePass1: true,
      hidePass2: true,
      errorMessages: [],
      showReset: false,
      formHasErrors: false,
      message: '',
      success: false,
      alert: false,
      loading: false
    }
  },
  computed: {
    form () {
      return {
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        password: this.password.trim(),
        confirmPassword: this.confirmPassword.trim(),
        email: this.email.trim(),
        gender: this.gender
      }
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll()

      if ((this.errors.all()).length !== 0) {
        this.showReset = true
        console.log('Errors', this.errors.all())
        return false
      }
      this.loading = true
      userService.create(this.form)
        .then(res => {
          this.loading = false
          this.success = true
          this.message = 'You have signed up successfuly. Please check your email inbox for email verification.'
          this.alert = true
          // clear form values, validations, etc.
          this.resetForm()
          // redirect to login
          // this.$router.replace({ name: 'login' })
        }).catch(e => {
          console.error('Signup failed', e)
          this.success = false
          this.loading = false
          this.message = 'There was some error. Please try again ' + e.message
          this.alert = true
        })
    },
    resetForm () {
      this.firstName = null
      this.lastName = null
      this.password = null
      this.confirmPassword = null
      this.email = null
      this.gender = null
      this.showReset = false
      this.$validator.reset()
    }
  }
}
</script>

