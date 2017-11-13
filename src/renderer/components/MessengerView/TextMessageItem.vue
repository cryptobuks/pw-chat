<template>
  <li class="clearfix">
    <div v-if="isFromUser" :class="{ 'message-data': true, 'align-right': true }">
      <span class="message-data-time" >{{ messageTime }}</span> &nbsp; &nbsp;
      <span class="message-data-name" >{{ userName }}</span>
    </div>
    <div v-else class="message-data">
      <span class="message-data-name" >{{ userName }}</span>   &nbsp; &nbsp;
      <span class="message-data-time" >{{ messageTime }}</span>
    </div>
    <div :class="{ message: true, 'float-right': isFromUser, 'my-message': isFromUser, 'other-message': !isFromUser }">
        {{ message.text }}
    </div>
  </li>
</template>
<script>
export default {
  name: 'TextMessage',
  props: [ 'isFromUser', 'userName', 'messageTime', 'message' ]
}
</script>
