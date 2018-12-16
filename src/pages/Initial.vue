<template lang="pug">
  div
    q-toolbar.no-padding
        q-toolbar-title(shrink) Projetos
    q-page(class="flex")
      div
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

</style>
