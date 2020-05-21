<template lang="pug">
  q-layout(view='hHh Lpr lFf')
    q-header
      q-toolbar(color='grey-10' :inverted="$q.theme === 'ios'")
        q-btn(flat='', dense='', round='', @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title| Gitlab Dashboard
        q-btn-dropdown(flat round dense icon="more_vert" label="Menu")
          q-list
            q-item
              settings
    q-drawer(v-model='leftDrawerOpen' side='left')
      token
      div.row
        q-btn.col-5.q-ma-sm(label="Deploy" to='/deploy')
        q-btn.col-5.q-ma-sm(label="Files" to="/files")
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
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
