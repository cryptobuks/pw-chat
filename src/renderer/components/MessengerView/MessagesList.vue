<template>
  <ul
    ref="messageList"
    class="mt-2 chat-history"
    transition="slide-y-reverse-transition"
    v-chat-scroll>
    <template
      v-for="(message, i) in messages"
      >
        <text-message-item
          :key="i"
          :message="message"
          :isFromUser="isFromUser(message)"
          :userName="getUserName(message)"
          :messageTime="getMessageTime(message.createdAt)"
          v-if="message.type === 'TEXT'">
        </text-message-item>
        <video-call-item
          :key="i"
          :call="message"
          :isFromUser="isFromUser(message)"
          :userName="getUserName(message)"
          :callTime="getMessageTime(message.createdAt)"
          v-else>
        </video-call-item>
    </template>
  </ul>
</template>

<script>
// Modern Date Library
import isToday from 'date-fns/is_today'
import isYesterday from 'date-fns/is_yesterday'
import format from 'date-fns/format'
import differenceInSeconds from 'date-fns/difference_in_seconds'

import TextMessageItem from './TextMessageItem'
import VideoCallItem from './VideoCallItem'

export default {
  props: ['messages', 'user', 'partner'],
  components: {
    TextMessageItem,
    VideoCallItem
  },
  methods: {
    isFromUser (message) {
      const userId = this.user.id
      return (userId === message.userId)
    },
    getUserName (message) {
      if (this.isFromUser(message)) {
        return this.user.firstName
      }
      return this.partner.fullName
    },
    getMessageTime (msgDate) {
      if (isToday(msgDate)) {
        if (differenceInSeconds(new Date(), msgDate) < 30) {
          return 'just now'
        }
        return format(msgDate, 'h:MM A')
      } else if (isYesterday(msgDate)) {
        return `Yesterday ${format(msgDate, 'h:MM A')}`
      } else {
        return format(msgDate, 'D MMM h:MM A')
      }
    }
  }
}
</script>

<style lang="stylus">
$green = #86bb71
$blue = #94c2ed
$orange = #e38968
$gray = #92959e

ul
  list-style: none

.chat-history
  padding: 30px 30px 20px
  height: 450px
  overflow-y: scroll
  border-bottom: 2px solid white
  .message-data
    margin-bottom: 15px
  .message-data-time
    color: lighten($gray, 8%)
    padding-left: 6px
  .message
    color: white
    padding: 18px 20px
    line-height: 26px
    font-size: 16px
    border-radius: 7px
    margin-bottom: 30px
    width: 90%
    position: relative
    &:after
      bottom: 100%
      left: 93%
      border: solid transparent
      content: " "
      height: 0
      width: 0
      position: absolute
      pointer-events: none
      border-bottom-color: $green
      border-width: 10px
      margin-left: -10px
  .my-message
    background: $green
  .other-message
    background: $blue
    &:after
      border-bottom-color: $blue
      left: 7%
.align-left
  text-align: left
.align-right
  text-align: right
.float-right
  float: right
.clearfix:after
  visibility: hidden
  display: block
  font-size: 0
  content: " "
  clear: both
  height: 0
</style>
