<template>
  <li class="clearfix">
    <div v-if="isFromUser" :class="{ 'message-data': true, 'align-right': true }">
      <span class="message-data-time" >{{ messageTime }}</span> &nbsp; &nbsp;
      <span class="message-data-name" >{{ userName }}</span>
      <v-menu bottom left>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="deleteMessage(message)">
            <v-list-tile-title>Delete this Message</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div v-else class="message-data">
      <span class="message-data-name" >{{ userName }}</span>   &nbsp; &nbsp;
      <span class="message-data-time" >{{ messageTime }}</span>
      <v-menu bottom right>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click.native.stop="() => deleteMessage(message)">
            <v-list-tile-title>Delete this Message</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div :class="{ message: true, 'float-right': isFromUser, 'my-message': isFromUser, 'other-message': !isFromUser }">
        {{ message.text }}
    </div>
  </li>
</template>
<script>
export default {
  name: 'TextMessage',
  props: [ 'isFromUser', 'userName', 'messageTime', 'message', 'deleteMessage' ]
}
</script>
