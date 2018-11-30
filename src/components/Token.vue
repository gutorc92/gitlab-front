<template lang="pug">
  div
    q-item
      q-item-main
        q-field(label="Chave")
          q-input(v-model="tokenData" @change="val => tokenData = val")
      q-item-side(rigth)
        q-btn(icon='search', @click='saveToken')
</template>

<script>
export default {
  name: 'Token',
  props: {
    value: {
      type: String,
      defualt: '',
      required: true
    }
  },
  data () {
    return {
      tokenData: ''
    }
  },
  computed: {
    personalToken: {
      get () {
        return this.$store.state.credentials.personalToken
      },
      set (val) {
        this.$store.commit('credentials/updatePersonalTokenState', val)
      }
    }
  },
  created () {
    console.log('calling')
    this.tokenData = this.value
  },
  watch: {
    tokenData () {
      this.$emit('input', this.tokenData)
    }
  },
  methods: {
    saveToken () {
      if (this.tokenData !== '') {
        this.personalToken = this.tokenData
      }
    }
  }
}
</script>
<style lang="css">

</style>
