/*
export function someMutation (state) {
}
*/
import { LocalStorage } from 'quasar'
export const setRepos = (state, repos) => {
  state.repos = repos
  LocalStorage.set('repos', state.repos)
}
export const setOrgs = (state, orgs) => {
  state.orgs = orgs
  LocalStorage.set('orgs', state.orgs)
}

export const setCommits = (state, commits) => {
  state.commits = commits
  LocalStorage.set('commits', state.commits)
}
