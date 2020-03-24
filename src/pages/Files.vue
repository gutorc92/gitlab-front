<template lang="pug">
  div
    q-page.bg-dark
      q-scroll-area.projectsScroll
        .row.full-width
          projects(:projects="projectsSelected")
</template>

<script>

import Projects from '../components/Projects'
export default {
  name: 'Inital',
  components: {
    Projects
  },
  data () {
    return {
      teste: '',
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
