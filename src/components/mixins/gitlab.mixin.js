export default {
  data () {
    return {
      apiGitlab: 'https://fontes.intranet.bb.com.br/api/v4'
    }
  },
  methods: {
    async loadGitlabComments (token) {
      try {
        let { data } = await this.$axios.get(`${this.apiGitlab}`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        return data
      } catch (error) {
        console.log('error', error)
      }
    },
    async loadGitlabRepos (token) {
      try {
        let { data } = await this.$axios.get(`${this.apiGitlab}/user/repos`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        console.log('data', data)
        return data
      } catch (error) {
        console.log('error', error)
      }
    },
    async loadGitlabOrgRepos (token, orgID) {
      try {
        let url = `${this.apiGitlab}/orgs/${orgID}/repos`
        let response = await this.$axios.get(url, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        console.log('response', response)
        let pagination = await this.pagination(response, url, token)
        let data = response.data.concat(pagination)
        console.log('data', data)
        return data
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
    async loadGitlabOrg (token) {
      try {
        let { data } = await this.$axios.get(`${this.apiGitlab}/groups`, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        console.log('data', data)
        return data
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
    async loadGitRepoCommits (token, { owner, repo, since, until, author }) {
      try {
        let url = `${this.apiGitlab}/repos/${owner}/${repo}/commits?since=${since}&until=${until}&author=${author}`
        let response = await this.$axios.get(url, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
        console.log('response', response)
        let pagination = await this.pagination(response, url, token)
        let data = response.data.concat(pagination)
        return data
      } catch (error) {
        console.log('error', error)
        return []
      }
    },
    async loadCommitsFiles (token, { owner, repo, ref }) {
      try {
        let url = `${this.apiGitlab}/repos/${owner}/${repo}/commits/${ref}`
        return this.$axios.get(url, {
          headers: {
            'Authorization': `token ${token}`
          }
        })
      } catch (error) {
        console.log('error', error)
        return new Promise()
      }
    },
    async pagination (response, url, token) {
      let data = []
      console.log('response', response.headers, 'link' in response.headers)
      if ('link' in response.headers) {
        let regex = /<(.*)>; rel="(.*)"/
        let urls = response.headers['link'].split(',')
        let pages = urls.map(u => {
          console.log('url', u)
          let result = regex.exec(u)
          console.log('result regex', result)
          if (result[2] === 'last') {
            let pageRe = /page=(\d)/
            let pageResult = pageRe.exec(result[1])
            console.log('page Result', pageResult[1])
            return pageResult[1]
          }
          return null
        })
        console.log('pages', pages)
        pages = pages.filter(Boolean)[0]
        console.log('pages', pages)
        let reqs = []
        for (let i = 2; i <= pages; i++) {
          reqs.push(this.$axios.get(`${url}?page=${i}`, {
            headers: {
              'Authorization': `token ${token}`
            }
          })
          )
        }
        try {
          console.log('reqs', reqs)
          let result = await Promise.all(reqs)
          data = result.reduce((allData, response) => {
            return allData.concat(response.data)
          }, [])
        } catch (error) {
          console.log('error', error)
        }
      }
      return data
    }
  }
}
