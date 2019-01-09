<template lang="pug">
  q-layout(view='hHh Lpr lFf')
    q-layout-header
      q-toolbar(color='primary', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        q-btn(flat='', dense='', round='', @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title
          | Gitlab Dashboard
    q-layout-drawer(v-model='leftDrawerOpen' side='left')
      token(v-model="tokenUser")
      groups(v-model='groupSelected')
      projects-selector(v-model="projectsSelected", :group="groupSelected")
    q-page-container
      router-view
</template>

<script>
import { openURL } from 'quasar'
import Token from '../components/Token'
import Groups from '../components/Groups'
import ProjectsSelector from '../components/ProjectsSelector'
export default {
  name: 'MyLayout',
  components: {
    Token,
    Groups,
    ProjectsSelector
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      groupSelected: '',
      tokenUser: '',
      projectsSelected: []
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
