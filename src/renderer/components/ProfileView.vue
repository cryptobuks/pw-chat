<template>
	<v-layout row wrap align-center justify-center>
    <v-flex xs6 md5 align-center justify-center text-xs-center>
      <v-card>
        <v-card-media :src="user.profilePicture" height="200px">
          <v-layout column class="media">
            <v-card-title color="primary">
              <div class="display-1 white--text" v-text="`${user.firstName} ${user.lastName}`"></div>
              <v-spacer></v-spacer>
              <v-btn dark icon class="mr-3" @click.native.stop="edit = !edit">
                <v-icon v-if="edit === true">close</v-icon>
                <v-icon v-else>edit</v-icon>
              </v-btn>
            </v-card-title>
          </v-layout>
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
  data: () => ({
    edit: false
  }),
  computed: {
    ...mapState('auth', {
      user: state => state.user
    })
  }
}
</script>
