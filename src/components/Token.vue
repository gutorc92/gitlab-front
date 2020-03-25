<template lang="pug">
  div
    q-item
      q-item-section(avatar  @click.native="openHelp")
        q-icon(name="help_outline")
        q-tooltip| Clique aqui para saber como criar um token.
      q-item-section
        q-field(borderless label="Chave")
    q-item
      q-item-section(avatar icon="vpn_key")
        q-icon(name="vpn_key")
      q-item-section.q-gutter-y-md
        q-input(v-model="tokenData" type='password')
        q-option-group(
          v-model="api"
          :options="options"
          color="primary"
          inline
          dense)
    q-item
      q-item-section
        q-btn.full-width(flat icon-right="cached" @click='saveToken' label="Salvar token")
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'Token',
  props: {
    value: {
      type: String,
      defualt: '',
      required: false
    }
  },
  data () {
    return {
      api: 'gitlab',
      options: [
        {
          label: 'Github',
          value: 'github'
        },
        {
          label: 'Gitlab',
          value: 'gitlab'
        }
      ],
      tokenData: ''
    }
  },
  watch: {
    tokenData () {
      this.$emit('input', this.tokenData)
    }
  },
  created () {
    this.tokenData = this.value
  },
  methods: {
    saveToken () {
      if (this.tokenData !== '') {
        this.$store.commit('credentials/setToken', {
          token: this.tokenData,
          api: this.api
        })
        this.tokenData = ''
        this.$q.notify({
          color: 'primary',
          message: 'Token adicionado com sucesso',
          position: 'left'
        })
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
