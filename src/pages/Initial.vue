<template lang="pug">
q-page(class="flex flex-center")
    div
      token(v-model="tokenUser")
      groups(v-model='groupSelected')
      projects-selector(v-model="projectsSelected", :group="groupSelected")
      projects(:projects="projectsSelected")
</template>

<script>
import Token from '../components/Token'
import Groups from '../components/Groups'
import ProjectsSelector from '../components/ProjectsSelector'
import Projects from '../components/Projects'
export default {
  name: 'Inital',
  components: {
    Token,
    Groups,
    ProjectsSelector,
    Projects
  },
  data () {
    return {
      teste: '',
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
    console.log('calling')
    if (this.personalToken !== '') {
      this.tokenUser = this.personalToken
    }
  }
}
</script>

<style lang="css">

</style>
