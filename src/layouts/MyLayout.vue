<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-layout-header
      q-toolbar(color='primary', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        q-btn(flat='', dense='', round='', @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title
          | Gitlab Dashboard
    q-page-container
      router-view
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
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
