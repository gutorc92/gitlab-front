<template lang="pug">
    .col-md-6.col-xs-12
      .row
        q-card(v-for='(project, key) in projectsData' :key="key")
          q-card-title Projeto {{project.name}}
          q-card-separator
          q-card-main
            q-item(v-for="(branch, index) in project.branches" :key="index")
              q-item-side {{branch.name}}
              q-item-main {{formatDate(branch.commit.created_at)}}
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
    create_merge_request (id) {
      this.$axios.post(`https://gitlab.com/api/v4/projects/${id}/merge_requests`, {
        source_branch: 'dev',
        target_branch: 'master',
        title: 'Deploy prod'
      },
      {
        headers: {
          'Private-Token': this.personalToken
        }
      })
    }
  }
}
</script>
