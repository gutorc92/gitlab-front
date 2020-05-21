<template lang="pug">
  div
    q-page.bg-grey-6.fit.row.wrap.justify-center.items-start.content-start
      q-card.bg-white.col-10.q-gutter-y-lg
        q-card-section
          div.text-h6 Selecionar commits
        q-separator
        q-card-section(v-if="tokens.length > 0")
          div Organizações
          q-option-group(
              name="selectedOrgs"
              v-model="selectedOrgs"
              :options="orgs"
              type="checkbox"
              color="primary"
            )
          q-btn(label="Carregar repositorios" @click="loadRepos")
        q-card-section(v-else)
          div Você precisa adicionar o token de alguma plataforma
        q-card-section(v-if="reposOptions.length > 0")
          div Repositórios
          q-option-group(
            name="selectedRepos"
            v-model="selectedRepos"
            :options="reposOptions"
            type="checkbox"
            color="primary"
            inline
          )
          div
            q-input(filled='' v-model='initialDate' mask='date' :rules="['date']")
              template(v-slot:append='')
                q-icon.cursor-pointer(name='event')
                  q-popup-proxy(ref='qDateProxy' transition-show='scale' transition-hide='scale')
                    q-date(v-model='initialDate'  mask="YYYY-MM-DD" @input='() => $refs.qDateProxy.hide()')
            q-input(filled='' v-model='finalDate' mask='date' :rules="['date']")
              template(v-slot:append='')
                q-icon.cursor-pointer(name='event')
                  q-popup-proxy(ref='qDateProxy' transition-show='scale' transition-hide='scale')
                    q-date(v-model='finalDate' mask="YYYY-MM-DD" @input='() => $refs.qDateProxy.hide()')
          q-btn(label="Carregar arquivos" @click="loadFiles")
        q-card-section(v-if="commits.length > 0")
          div Arquivos
          q-list
            q-item(v-for="commit in commits" :key="commit.sha")
              q-item-section
                div {{commit.commit.message}}
                div(v-for="file in commit.files")
                  span {{file.name}}
                  span {{file.raw_url}}
          q-btn(label="Organizar arquivos" @click="nextFiles")
</template>

<script>
import github from 'src/components/mixins/github.mixin'
export default {
  name: 'Files',
  mixins: [github],
  data () {
    return {
      loading: false,
      selectedRepos: [],
      selectedOrgs: [],
      initialDate: '2020/02/01',
      finalDate: '2020/02/02',
      repos: [],
      reposOptions: [],
      orgs: [],
      commits: []
    }
  },
  computed: {
    tokens () {
      return this.$store.getters['credentials/getTokens']
    },
    saveRepos () {
      return this.$store.getters['repository/getRepos']
    },
    savedOrgs () {
      return this.$store.getters['repository/getOrgs']
    },
    savedAuthor () {
      return this.$store.getters['settings/getCommitAuthor']
    }
  },
  async created () {
    console.log('get', this.saveRepos)
    // if (this.saveRepos.length === 0) {
    //   this.loadRepos()
    // } else {
    //   this.repos = this.saveRepos
    // }
    try {
      this.loading = true
      if (this.savedOrgs.length === 0) {
        await this.loadOrgs()
      } else {
        this.orgs = this.savedOrgs
      }
      this.loading = false
    } catch (error) {
      console.log('error', error)
    }
  },
  methods: {
    nextFiles () {
      this.$store.commit('repository/setCommits', this.commits)
      this.$router.push('/of')
    },
    async loadOrgs () {
      try {
        let orgs = await this.tokens.reduce(async (allOrgs, data) => {
          let orgs = await this.loadGitHubOrg(data.token)
          orgs.map(org => {
            allOrgs.push({
              value: org.login,
              label: org.description ? org.description : org.login
            })
          })
          return allOrgs
        }, [])
        this.$store.commit('repository/setOrgs', orgs)
        console.log('orgs', orgs)
        this.orgs = orgs
      } catch (err) {
        console.log('error')
      }
    },
    async loadRepos () {
      this.commits = []
      console.log('all repos', this.tokens)
      let reps = await this.tokens.reduce(async (allRepos, data) => {
        console.log('all', allRepos, 'data', data)
        if (data.api === 'github') {
          let requests = this.selectedOrgs.map(org => this.loadGitHubOrgRepos(data.token, org))
          let result = await Promise.all(requests)
          console.log('result', result)
          for (let i = 0; i < result.length; i++) {
            allRepos = allRepos.concat(result[i])
          }
          // let repos = await this.loadGitHubRepos(data.token)
          // for (let i = 0; i < repos.length; i++) {
          //   allRepos.push({
          //     value: repos[i].id,
          //     label: repos[i].name
          //   })
          // }
        }
        return allRepos
      }, [])
      this.$store.commit('repository/setRepos', reps)
      let reposOptions = []
      for (let j = 0; j < reps.length; j++) {
        if ('id' in reps[j] && 'name' in reps[j]) {
          reposOptions.push({
            value: reps[j].id,
            label: reps[j].name
          })
        }
      }
      this.reposOptions = reposOptions
      this.repos = reps
    },
    async loadFiles () {
      try {
        let repos = this.repos
        let commits = await this.tokens.reduce(async (allCommits, data) => {
          let reqs = this.selectedRepos.map(async (repo) => {
            console.log('repo', repo, repos)
            let rep = repos.find(r => r.id === repo)
            console.log('rep', rep)
            let commits = await this.loadGitRepoCommits(data.token, {
              owner: rep.owner.login,
              repo: rep.name,
              since: `${this.initialDate}T00:00:00Z`,
              until: `${this.finalDate}T00:00:00Z`,
              author: data.author
            })
            return commits.map(commit => {
              return this.loadCommitsFiles(data.token, {
                owner: rep.owner.login,
                repo: rep.name,
                ref: commit.sha
              })
            })
          })
          console.log('reqs', reqs)
          let result = await Promise.all(reqs)
          console.log('result', result)
          let commits = result.reduce((allCommits, data) => {
            return allCommits.concat(data)
          }, [])
          return commits
        }, [])
        commits = await Promise.all(commits)
        commits = commits.reduce((allCommits, data) => {
          return allCommits.concat(data.data)
        }, [])
        this.commits = commits
      } catch (error) {
        console.log('error', error)
      }
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
