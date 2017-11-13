<template>
  <v-layout row wrap justify-center id="wrapper">
      <v-flex xs12 class="mt-2 text-xs-center">
          <h4>Add new contact</h4>
      </v-flex>

      <v-flex xs12 sm6 md4 class="mt-0">
        <v-card flat v-if="showAlert">
          <v-alert
            :icon="success ? 'check_circle' : 'warning'"
            :color="success ? 'success' : 'error'"
            dismissible
            v-model="showAlert"
            v-text="message"
            transition="scale-transition"
            >
          </v-alert>
        </v-card>
        <v-form v-model="valid">
          <v-text-field
            v-model="fullName"
            label="Full Name"
            :error-messages="errors.collect('fullName')"
            v-validate="'required|max:50'"
            data-vv-name="fullName"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="E-mail"
            :error-messages="errors.collect('email')"
            v-validate="'required|email'"
            data-vv-name="email"
            required
          ></v-text-field>
          <v-btn
            color="primary" @click.stop="submit"
            :loading="isCreatePending">Save</v-btn>
          <v-btn @click.stop="clear">clear</v-btn>
        </v-form>
      </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AddContact',

  $validates: true,
  computed: {
    ...mapState('contacts', {
      isCreatePending: state => state.isCreatePending,
      errorOnCreate: state => state.errorOnCreate
    })
  },
  data () {
    return {
      showAlert: false,
      valid: false,
      fullName: this.$route.params.preName || '',
      email: this.$route.params.preEmail || '',
      message: '',
      success: false
    }
  },
  methods: {
    async submit () {
      this.$validator.validateAll()

      if ((this.errors.all()).length !== 0) {
        return false
      }
      const data = {
        fullName: this.fullName.trim(),
        email: this.email.trim()
      }
      try {
        const contact = await this.$store.dispatch('contacts/create', data)
        this.success = true
        this.message = 'Contact added successfully'
        console.log('Created a contact', contact)
      } catch (e) {
        this.success = false
        if (this.errorOnCreate && this.errorOnCreate.name === 'Error') {
          this.message = 'There was an error: ' + this.errorOnCreate.message
        } else {
          this.message = e.message
        }
        console.log(e)
      } finally {
        this.showAlert = true
        this.clear()
      }
    },
    clear () {
      this.fullName = ''
      this.email = ''
      this.$validator.reset()
    }
  }
}
</script>
