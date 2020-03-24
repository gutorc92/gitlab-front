<template lang="pug">
  q-list.no-border.no-padding
    q-item.bg-grey-1
      q-item-side(icon="search")
      q-item-main.q-pb-md.text-white
        q-input(v-model="search" float-label="Filtrar Projeto" color="dark" hide-underline)
    q-item.no-padding
      q-scroll-area.projectsSelectorScroll
        .q-pa-md
          q-option-group(
            type='toggle'
            v-model="projectsSelected"
            :options="optionsWithout"
          )
</template>

<style>
</style>

<script>
import fuzzysearch from 'fuzzysearch'
import _ from 'lodash'
export default {
  name: 'ProjectsSelector',
  props: {
    value: {
      type: Array
    },
    group: {
      required: true,
      default: ''
    }
  },
  data () {
    return {
      search: '',
      allProjects: [],
      projectsSelected: []
    }
  },
  computed: {
    personalToken () {
      return this.$store.getters['credentials/getPersonalToken']
    },
    optionsWithout () {
      let auxProjects = this.allProjects
      if (this.search !== '') {
        let token = this.search
        auxProjects = _.filter(auxProjects, function (item) { return fuzzysearch(token, item.name) })
      }
      return _.map(auxProjects, function (p) { return { value: p.id, label: p.name } })
    }
  },
  watch: {
    group () {
      this.allProjects = []
      this.loadProjects(1)
    },
    projectsSelected () {
      let aux = this.projectsSelected
      let response = _.filter(this.allProjects, project => _.includes(aux, project.id))
      this.$store.commit('projects/updateProjectsSelectedState', response)
    }
  },
  created () {
    if (this.group !== '') {
      this.loadProjects(1)
    }
    this.projectsSelected = _.map(this.value, 'id')
  },
  methods: {
    projectSelection (project) {
      console.log('project', project)
    },
    async loadProjects (page) {
      let scope = this
      if (this.personalToken === '') {
        return 0
      }
      this.$axios.get(`https://gitlab.com/api/v4/groups/${this.group}/projects?per_page=50&page=${page}`,
        {
          headers: {
            'Private-Token': this.personalToken
          }
        }).then(function (response) {
        for (let project of response.data) {
          scope.allProjects.push(project)
        }
        if (response.headers['x-total-pages'] >= page) {
          scope.loadProjects(page + 1)
        }
      })
    }
  }
}
</script>
<style>
.projectsSelectorScroll{
  height: calc(100vh - 600px);
  width: 100%;
}
</style>
