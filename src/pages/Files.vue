<template lang="pug">
  div
    q-page.bg-grey-6.fit.row.wrap.justify-center.items-start.content-start
      q-card.bg-white.col-10.q-gutter-y-lg
        q-card-section
          div.text-h6 Separação de arquivos
        q-card-section
          div
            q-input(filled='' v-model='initialDate' mask='date' :rules="['date']")
              template(v-slot:append='')
                q-icon.cursor-pointer(name='event')
                  q-popup-proxy(ref='qDateProxy' transition-show='scale' transition-hide='scale')
                    q-date(v-model='initialDate' @input='() => $refs.qDateProxy.hide()')
            q-input(filled='' v-model='finalDate' mask='date' :rules="['date']")
              template(v-slot:append='')
                q-icon.cursor-pointer(name='event')
                  q-popup-proxy(ref='qDateProxy' transition-show='scale' transition-hide='scale')
                    q-date(v-model='finalDate' @input='() => $refs.qDateProxy.hide()')
        q-card-section
          div Teste
          q-list
            q-option-group(
              name="selectedRepos"
              v-model="selectedRepos"
              :options="repos"
              type="checkbox"
              color="primary"
              inline
            )
            q-item(v-for="rep in repos" :key="rep.id")
              q-item-section {{rep.name}}
</template>

<script>
import github from 'src/components/mixins/github.mixin'
export default {
  name: 'Files',
  mixins: [github],
  data () {
    return {
      selectedRepos: [],
      initialDate: '2020/02/01',
      finalDate: '2020/02/02',
      repos: []
    }
  },
  computed: {
    tokens () {
      return this.$store.getters['credentials/getTokens']
    },
    saveRepos () {
      return this.$store.getters['repository/getRepos']
    }
  },
  async created () {
    console.log('get', this.saveRepos)
    if (this.saveRepos.length === 0) {
      this.loadRepos()
    } else {
      this.repos = this.saveRepos
    }
  },
  methods: {
    async loadRepos () {
      console.log('all repos', this.tokens)
      let reps = await this.tokens.reduce(async (allRepos, data) => {
        console.log('all', allRepos, 'data', data)
        if (data.api === 'github') {
          let repos = await this.loadGitHubRepos(data.token)
          for (let i = 0; i < repos.length; i++) {
            allRepos.push({
              value: repos[i].id,
              label: repos[i].name
            })
          }
        }
        return allRepos
      }, [])
      console.log('all reps', reps)
      this.$store.commit('repository/setRepos', reps)
      this.repos = reps
      // try {
      //   let { data } = await this.$axios.get(`https://gitlab.com/api/v4/projects/${project.id}/repository/compare?from=master&to=dev`, {
      //     headers: {
      //       'Private-Token': this.personalToken
      //     }
      //   })
      //   let jobs = await this.loadJobs(project.id)
      //   projectsData.push({
      //     name: project.name,
      //     id: project.id,
      //     branches: [{ name: 'master' }, { name: 'dev' }],
      //     updated: data.commit === null,
      //     jobs: jobs
      //   })
      // } catch (err) {
      //   console.log(err)
      // }
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
