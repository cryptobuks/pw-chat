<template>
  <v-layout row wrap justify-center>
    <v-flex xs10 md8 align-center justify-center text-xs-center>
      <v-toolbar color="white">
        <v-btn icon router :to="{name: 'Profile'}">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Edit Profile</v-toolbar-title>
      </v-toolbar>
      <v-layout row class="mt-5">
        <v-flex class="text-xs-center">
          <template v-if="!changeProfilePic">
              <img
                width="200px"
                height="200px"
                :src="user.profilePicture"
                :alt="`${user.firstName}'s  Profile picture.`"
                style="border-radius: 100px"
                >

            <v-btn
              v-if="!changeProfilePic"
              color="primary"
              flat
              @click.native.stop="changeProfilePic = !changeProfilePic">
              Change Profile Picture
            </v-btn>
          </template>
          <div v-else class="mr-3">
            <vue-dropzone
              ref="myVueDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              @vdropzone-complete="complete" />
          </div>
        </v-flex>
        <v-flex>
          <form
            v-model="formHasErrors"
            ref="updateDetails"
            data-vv-scope="form-1"
            >
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
              required>
            </v-select>
            <v-text-field
              disabled
              ref="email"
              v-model="email"
              label="E-mail">
            </v-text-field>
          </form>
          <v-btn flat @click.native.stop="changePass = !changePass">
            Change password?
          </v-btn>
          <template v-if="changePass">
            <form
              v-model="changePassHasErrors"
              ref="changePassword"
              data-vv-scope="form-2"
              >
              <v-text-field
                ref="oldPass"
                name="oldPass"
                data-vv-name="oldPass"
                v-model="oldPass"
                v-validate="'required'"
                :error-messages="errors.collect('oldPass')"
                label="Enter your old password"
                :append-icon="hideOldPass ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (hideOldPass = !hideOldPass)"
                type="password"
                :type="hideOldPass ? 'password' : 'text'"
                required>
              </v-text-field>
              <v-text-field
                ref="password"
                name="password"
                data-vv-name="password"
                v-model="password"
                label="Enter your new password"
                :error-messages="errors.collect('password')"
                v-validate="'required'"
                :append-icon="hidePass1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (hidePass1 = !hidePass1)"
                type="password"
                :type="hidePass1 ? 'password' : 'text'"
                required>
              </v-text-field>
              <v-text-field
                ref="confirmPassword"
                name="confirmPassword"
                data-vv-name="confirmPassword"
                v-model="confirmPassword"
                label="Confirm your new password"
                :error-messages="errors.collect('confirmPassword')"
                v-validate="'required|min:6'"
                :append-icon="hidePass2 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (hidePass2 = !hidePass2)"
                type="password"
                :type="hidePass2 ? 'password' : 'text'"
                :rules="[() => password === confirmPassword || 'Password does not match']"
                required>
              </v-text-field>
            </form>
          </template>
          <v-btn color="primary" @click.native.stop="saveProfile()">Save Profile</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import { passwordChange } from '@/api/auth-management'
import feathersClient from '@/api/feathers-client'
const userService = feathersClient.service('users')

export default {
  name: 'EditProfile',
  components: {
    vueDropzone: vue2Dropzone
  },
  computed: {
    ...mapState('auth', {
      user: state => state.user
    }),
    profile () {
      let ret = {}
      let isValid = true
      if (this.firstName.trim() !== '') {
        ret.firstName = this.firstName.trim()
      } else {
        isValid = false
      }
      if (this.lastName.trim() !== '') {
        ret.lastName = this.lastName.trim()
      } else {
        isValid = false
      }
      if (this.gender !== '') {
        ret.gender = this.gender
      } else {
        isValid = false
      }

      if (isValid) {
        return ret
      }
      return null
    },
    passwords () {
      let ret = {}
      let isValid = true
      if (this.oldPass.trim() !== '') {
        ret.oldPassword = this.oldPass.trim()
      } else {
        isValid = false
      }
      if (
        this.password.trim() !== '' &&
        this.confirmPassword.trim() !== '' &&
        this.password.trim() === this.confirmPassword.trim()
      ) {
        ret.password = this.password.trim()
      } else {
        isValid = false
      }

      if (isValid) {
        return ret
      }
      return null
    }
  },
  mounted () {
    if (this.user && this.user.id) {
      this.firstName = this.user.firstName
      this.lastName = this.user.lastName
      this.email = this.user.email
      this.gender = this.user.gender
    }
  },
  data: () => ({
    genders: ['MALE', 'FEMALE', 'OTHER'],
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    formHasErrors: false,
    changePassHasErrors: false,
    changePass: false,
    oldPass: '',
    password: '',
    confirmPassword: '',
    hideOldPass: true,
    hidePass1: true,
    hidePass2: true,
    changeProfilePic: false,
    dropzoneOptions: {
      url: 'https://potential-waffle-chat.herokuapp.com/upload',
      method: 'POST',
      accepedFiles: 'image/*',
      thumbnailWidth: 150,
      paramName: 'image',
      maxFiles: 1,
      maxFilesize: 2, // MB
      headers: { 'Authorization': window.localStorage.getItem('feathers-jwt') }
    }
  }),
  methods: {
    complete (result) {
      const res = JSON.parse(result.xhr.response)
      console.log('Uploading has fineshed', res)
      this.$store.dispatch('auth/profilePicUpdated', res.data)
    },
    async saveProfile () {
      // first update the profile
      this.$validator.validateAll()
      console.log(this.errors.all())
      if (this.profile === null) {
        console.log('fill user info')
        return false
      }
      // then change password if requested
      if (this.changePass === true) {
        this.$validator.validateAll('change-password')
        if (this.passwords === null) {
          console.log('fill passwords')
          return false
        }
      }

      console.log('succes all  fine...')
      const infoUpdate = await userService.patch(this.user.id, this.profile)
      console.log('info updated', infoUpdate)
      this.$store.dispatch('auth/userDetailsUpdated', infoUpdate)
      if (this.changePass === true) {
        const passUpdate = await passwordChange({email: this.user.email}, this.passwords.oldPassword, this.passwords.password)
        console.log('Password changed', passUpdate)
      }
    }
  }
}
</script>
