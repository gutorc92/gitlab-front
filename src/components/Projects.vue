<template lang="pug">
    .col-md-6.col-xs-12
      .row
        q-card(v-for='(project, key) in projectsData' :key="key")
          q-card-title.bg-grey-6 {{project.name}}
          q-card-separator
          q-card-main.text-white.text-weight-light.no-padding(:class="cardColor(project.branches)")
            q-item(v-for="(branch, index) in project.branches" :key="index")
              q-item-main
                div {{branch.name}}
                div {{formatDate(branch.commit.created_at)}}
          q-card-separator
          q-card-actions
            q-btn(@click="create_merge_request(project.id)") Merge request
</template>

<style>
</style>

<script>
import _ from 'lodash'
export default {
  name: 'Projects',
  data () {
    return {
      projectsData: []
    }
  },
  computed: {
    personalToken () {
      return this.$store.getters['credentials/getPersonalToken']
    },
    projects () {
      return this.$store.getters['projects/getPrpkectsSelected']
    }
  },
  created () {
  },
  watch: {
    projects () {
      this.loadProjectData()
    }
  },
  methods: {
    formatDate (val) {
      let date = new Date(val)
      let day = date.getDate()
      let monthIndex = date.getMonth()
      let year = date.getFullYear()

      return day + '/' + monthIndex + '/' + year
    },
    cardColor (branches) {
      if (branches.length === 2) {
        let firstDate = new Date(branches[0].commit.created_at)
        let secondDate = new Date(branches[1].commit.created_at)
        firstDate.setHours(0, 0, 0, 0)
        secondDate.setHours(0, 0, 0, 0)
        if (firstDate.getTime() !== secondDate.getTime()) {
          return 'bg-red-4'
        }
      }
      return 'bg-green-4'
    },
    loadProjectData () {
      if (this.personalToken === '') {
        return 0
      }
      this.projectsData = []
      let projectsData = this.projectsData
      for (let project of this.projects) {
        this.$axios.get(`https://gitlab.com/api/v4/projects/${project.id}/repository/branches`,
          {
            headers: {
              'Private-Token': this.personalToken
            }
          }).then(function (response) {
          projectsData.push({name: project.name, id: project.id, branches: _.filter(response.data, function (item) { return _.includes(['dev', 'master'], item.name) })})
        })
      }
    },
    async create_merge_request (id) {
      try {
        let response = await this.$axios.post(`https://gitlab.com/api/v4/projects/${id}/merge_requests`, {
          source_branch: 'dev',
          target_branch: 'master',
          title: 'Deploy prod'
        },
        {
          headers: {
            'Private-Token': this.personalToken
          }
        })
        console.log('response', response)
        this.$q.notify({
          message: 'Merge request criado',
          type: 'positive'
        })
      } catch (err) {
        this.$q.notify({
          message: 'Merge não pode ser criado'
        })
      }
    }
  }
}
</script>
