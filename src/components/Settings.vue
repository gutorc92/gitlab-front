<template lang="pug">
  q-card
    q-card-section
      div.text-h6 Settings
    q-separator
    q-card-section.no-padding
      q-scroll-area(style="width: 400px; max-width: 100%; height: 250px").q-px-md.bg-white
        q-item
          q-item-section
            q-input(v-model="timeUpdate" type='number' @change="val => timeUpdate = val")
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      timeUpdate: ''
    }
  },
  computed: {
    updateTime: {
      get () {
        return this.$store.state.credentials.personalToken
      },
      set (val) {
        this.$store.commit('credentials/updatePersonalTokenState', val)
      }
    }
  },
  watch: {
    timeUpdate () {
      this.$emit('input', this.tokenData)
    }
  },
  created () {
    this.tokenData = this.value
  },
  methods: {
    saveTimeUpdate () {
      if (this.timeUpdate !== '') {
        this.updateTime = this.timeUpdate
      }
    }
  }
}
</script>
<style lang="css">

</style>
