<template lang="pug">
.q-pa-md.row.full-width
  .col-xl-3.col-md-4.col-xs-12.col-sm-6(v-for='(project, key) in projectsData' :key="key").q-pa-md
    q-card
      q-card-title.bg-faded.text-white {{project.name}}
      q-card-separator.bg-grey
      q-card-main.bg-white.text-white.text-weight-light.no-padding(:class="cardColor2(project.updated)")
        q-item(v-for="(branch, index) in project.branches" :key="index")
          q-item-main
            div {{branch.name}}
      q-card-separator.bg-grey
      q-card-main.bg-white
        q-list.no-padding.row(no-border)
          q-item.no-padding(v-for="(job, index) in project.jobs" :key="index")
            q-item-side(:icon="job.status === 'success' ? 'radio_button_checked' : 'error_outline'"
                        :color="job.status === 'success' ? 'green': 'red'")
              q-tooltip| {{job.ref}}
      q-card-separator.bg-grey
      q-card-actions.bg-white
        q-btn.full-width(flat @click="create_merge_request(project.id)") Merge request
</template>

<style>
</style>

<script>
export default {
  name: 'Projects',
  data () {
    return {
      projectsData: [],
      projectsTimer: null
    }
  },
  computed: {
    personalToken () {
      return this.$store.getters['credentials/getPersonalToken']
    },
    projects () {
      return this.$store.getters['projects/getProjectsSelected']
    }
  },
  created () {
  },
  mounted () {
    let scope = this
    this.projectsTimer = setInterval(function () {
      scope.loadProjectData()
    }, 1 * 60 * 1000)
  },
  watch: {
    projects: {
      handler () {
        this.loadProjectData()
      },
      deep: true
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
    cardColor2 (updated) {
      return updated ? 'bg-green-4' : 'bg-red-4'
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
    async loadProjectData () {
      if (this.personalToken === '') {
        return 0
      }
      this.projectsData = []
      let projectsData = this.projectsData
      for (let project of this.projects) {
        try {
          let {data} = await this.$axios.get(`https://gitlab.com/api/v4/projects/${project.id}/repository/compare?from=master&to=dev`, {
            headers: {
              'Private-Token': this.personalToken
            }
          })
          let jobs = await this.loadJobs(project.id)
          projectsData.push({
            name: project.name,
            id: project.id,
            branches: [{name: 'master'}, {name: 'dev'}],
            updated: data.commit === null,
            jobs: jobs
          })
        } catch (err) {
          console.log(err)
        }
      }
    },
    async loadJobs (projectId) {
      let jobs = []
      try {
        let {data} = await this.$axios.get(`https://gitlab.com/api/v4/projects/${projectId}/jobs`, {
          headers: {
            'Private-Token': this.personalToken
          }
        })
        for (let i = 0; i < 3; i++) {
          jobs.push(data[i])
        }
      } catch (err) {
        console.log(err)
      }
      return jobs
    },
    async create_merge_request (id) {
      try {
        await this.$axios.post(`https://gitlab.com/api/v4/projects/${id}/merge_requests`, {
          source_branch: 'dev',
          target_branch: 'master',
          title: 'Deploy prod'
        },
        {
          headers: {
            'Private-Token': this.personalToken
          }
        })
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
  },
  beforeDestroy () {
    clearInterval(this.projectsTimer)
  }
}
</script>
<style scoped>
</style>
