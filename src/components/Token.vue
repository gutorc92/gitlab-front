<template lang="pug">
  div
    q-item
      q-item-side(icon="help_outline" @click.native="openHelp")
        q-tooltip| Clique aqui para saber como criar um token.
      q-item-main
        q-field(label="Chave")
    q-item
      q-item-main
        q-input(v-model="tokenData" type='password' @change="val => tokenData = val")
    q-item
      q-item-main
        q-btn(icon-right="send" label="Carregar grupos" @click='saveToken')
</template>

<script>
import { openURL } from 'quasar'
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
    },
    openHelp () {
      openURL('https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html')
    }
  }
}
</script>
<style lang="css">

</style>
