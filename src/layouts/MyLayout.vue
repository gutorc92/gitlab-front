<template lang="pug">
  q-layout(view='hHh Lpr lFf')
    q-header
      q-toolbar(color='grey-10' :inverted="$q.theme === 'ios'")
        q-btn(flat='', dense='', round='', @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title
          | Gitlab Dashboard
        q-menu
          q-list
            q-item
              settings
    q-drawer(v-model='leftDrawerOpen' side='left')
      token(v-model="tokenUser")
    q-page-container
      router-view
</template>

<script>
import { openURL } from 'quasar'
import Token from '../components/Token'
import Settings from '../components/Settings'

export default {
  name: 'MyLayout',
  components: {
    Token,
    Settings
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      tokenUser: ''
    }
  },
  computed: {
    personalToken: {
      get () {
        return this.$store.getters['credentials/getPersonalToken']
      }
    }
  },
  created () {
    if (this.personalToken !== '') {
      this.tokenUser = this.personalToken
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
