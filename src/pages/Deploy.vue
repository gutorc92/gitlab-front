<template lang="pug">
  div
    q-page.bg-dark
      groups(v-model='groupSelected')
      projects-selector(v-model="projectsSelected", :group="groupSelected")
      q-scroll-area.projectsScroll
        .row.full-width
          projects(:projects="projectsSelected")
</template>

<script>
import Groups from '../components/Groups'
import ProjectsSelector from '../components/ProjectsSelector'
import Projects from '../components/Projects'
export default {
  name: 'Inital',
  components: {
    Groups,
    ProjectsSelector,
    Projects
  },
  data () {
    return {
      teste: '',
      groupSelected: '',
      projectsSelected: []
    }
  }
}
</script>

<style lang="css">
.projectsScroll{
  height: calc(100vh - 50px);
  width: 100%;
}
</style>
