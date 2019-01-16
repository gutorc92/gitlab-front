<template lang="pug">
  q-list
    q-item
      q-item-main
        q-field(label='Projetos')
    q-item
      q-input(v-model="search" float-label="Busca")
    q-item
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
      return _.map(auxProjects, function (p) { return {value: p.id, label: p.name} })
    }
  },
  created () {
    if (this.group !== '') {
      this.loadProjects(1)
    }
    this.projectsSelected = _.map(this.value, 'id')
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
