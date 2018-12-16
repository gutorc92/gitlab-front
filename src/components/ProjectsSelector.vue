<template lang="pug">
  q-item
    q-item-main
      q-field(label='Projetos')
        q-select(v-model="projectsSelected" placeholder="Projetos" v-if="group !== ''" multiple :options="optionsWithout")
</template>

<style>
</style>

<script>
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
      allProjects: [],
      projectsSelected: []
    }
  },
  computed: {
    personalToken () {
      return this.$store.getters['credentials/getPersonalToken']
    },
    optionsWithout () {
      return _.map(this.allProjects, function (p) { return {value: p.id, label: p.name} })
    }
  },
  created () {
    console.log('calling')
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
      console.log('project selector', response)
      this.$store.commit('projects/updateProjectsSelectedState', response)
    }
  },
  methods: {
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
