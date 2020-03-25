export default {
  data () {
    return {
      apiGithub: 'https://api.github.com'
    }
  },
  methods: {
    async loadGitHubComments (token) {
      try {
        let { data } = await this.$axios.get(`${this.apiGithub}`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        return data
      } catch (error) {
        console.log('error', error)
      }
    },
    async loadGitHubRepos (token) {
      try {
        let { data } = await this.$axios.get(`${this.apiGithub}/user/repos`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        console.log('data', data)
        return data
      } catch (error) {
        console.log('error', error)
      }
    }
  }
}
