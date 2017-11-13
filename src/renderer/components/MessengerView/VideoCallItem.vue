<template>
  <li class="video-call-item">
    <div class="call">
      video call by {{ userName }}, at {{ callTime }}
    </div>
  </li>
</template>
<script>
export default {
  name: 'VideCall',
  props: ['call', 'userName', 'callTime', 'isFromUser']
}
</script>
