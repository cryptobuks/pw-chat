<template>
  <v-layout row>
      <v-flex xs12>
        <v-text-field
          v-model="text"
          multi-line
          auto-grow
          full-width
          :rows="1"
          append-icon="send"
          :append-icon-cb="() => send(text)"
          placeholder="Type your message here.."
          counter
          required
        >
        </v-text-field>
      </v-flex>
      <!-- <v-flex xs1>
        <v-btn large color="indigo lighten-3" icon @click="sendMessage(text)">
          <v-icon large>send</v-icon>
        </v-btn>
      </v-flex> -->
  </v-layout>
</template>

<script>
export default {
  props: ['sendMessage'],
  data: () => ({
    text: '',
    valid: false
  }),
  methods: {
    send (text) {
      if (text.trim() === '') {
        return false
      }
      this.sendMessage(text.trim())
      this.text = ''
      this.valid = false
    }
  }
}
</script>
