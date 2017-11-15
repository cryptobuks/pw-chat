<template>
	<v-layout row wrap justify-center>
    <v-flex xs10 md5 align-center justify-center text-xs-center>
      <v-toolbar color="white">
        <v-toolbar-title v-text="`${user.firstName} ${user.lastName}`"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="mr-3" router :to="{name: 'EditProfile'}">
          <v-icon>edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card class="mt-2">
        <v-card-media :src="user.profilePicture" height="200px">
        </v-card-media>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.email }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        <v-divider inset></v-divider>
        <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo" v-if="user.gender=== 'MALE'">mdi-human-male</v-icon>
              <v-icon color="indigo" v-else-if="user.gender=== 'FEMALE'">mdi-human-female</v-icon>
              <v-icon color="indigo" v-else>mdi-human-male-female</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.gender }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
	</v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProfileView',
  computed: {
    ...mapState('auth', {
      user: state => state.user
    })
  }
}
</script>
