<template lang='pug'>
  q-btn.q-mr-sm(
    :icon="icon"
    flat round
    @click="openPopover = true"
    :loading="loading")
    q-popover(v-model="openPopover" anchor="bottom right" :offset="[0, 4]" self="top right")
      slot(name="body")
</template>
<script>
export default {
  name: 'BtnPopover',
  props: {
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      openPopover: false
    }
  },
  async created () {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
<style lang="css" scoped>
.notificationsSection{
  width: 400px;
  max-width: 100%;
  height: 250px;
}
.emptyNotification{
  background: url('https://s3-sa-east-1.amazonaws.com/plataforma-nova/empty_state___inbox.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
