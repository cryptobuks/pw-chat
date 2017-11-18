<template>
  <li class="video-call-item">
    <div class="text-xs-center">
        <span class="call">
          <v-icon>video_call</v-icon>
          <v-icon v-if="isFromUser">call_made</v-icon>
          <v-icon v-else>call_received</v-icon>
          <small>
            {{ callTime }}
          </small>
          |
          <span>{{ callDuration }}</span>
        </span>
    </div>
  </li>
</template>
<script>
export default {
  name: 'VideCall',
  props: ['call', 'userName', 'callTime', 'isFromUser', 'callDuration']
}
</script>
<style lang="stylus">
.call
  background #e1e4e8
  padding 2px 15px
  border-radius 2px 4px
</style>
