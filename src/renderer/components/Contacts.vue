<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="teal" dark>
          <v-toolbar-title class="text-xs-center">
            Contacts
          </v-toolbar-title>
        </v-toolbar>
        <v-list>
          <v-list-tile
            avatar v-for="(contact, i) in contacts"
            v-bind:key="i"
            @click="findOrCreateConversation(contact)">
              <v-list-tile-avatar>
                <img :src="contact.contactUser.profilePicture"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                  <v-list-tile-title v-html="contact.fullName">
                  </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                  <v-icon color="teal">chat_bubble</v-icon>
              </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-btn
      color="pink"
      dark
      fixed
      bottom
      right
      fab
      to="/add-contact"
      >
      <v-icon>add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Contacts',
  computed: {
    ...mapGetters({
      contacts: 'contacts/list',
      conversations: 'conversations/list'
    })
  },
  methods: {
    async findOrCreateConversation (contact) {
      let conversation = this.conversations.find(c => {
        // check if contact has a conversation created by them
        if (c.userId === contact.fk_contactId) {
          return true
        }
        // or else, the the conversation is created by you with contact
        if (c.fk_partnerId === contact.fk_contactId) {
          return true
        }
        return false
      })
      console.log(conversation)
      try {
        if (conversation !== undefined) {
          await this.$store.dispatch('contacts/get', contact.id)
          await this.$store.dispatch('conversations/get', conversation.id)
          this.$router.replace({ name: 'chat' })
          return
        }
        // Not Found, Create the new one!
        const data = {
          userId: contact.userId,
          fk_partnerId: contact.fk_contactId
        }

        conversation = await this.$store.dispatch('conversations/create', data)

        await this.$store.dispatch('contacts/get', contact.id)
        await this.$store.dispatch('conversations/get', conversation.id)
        this.$router.replace({ name: 'chat' })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
