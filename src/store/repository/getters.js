/*
export function someGetter (state) {
}
*/
import { LocalStorage } from 'quasar'
export const getRepos = (state) => {
  if (state.repos.length === 0 && LocalStorage.has('repos')) {
    return LocalStorage.getItem('repos')
  }
  return state.repos
}

export const getOrgs = (state) => {
  if (state.orgs.length === 0 && LocalStorage.has('orgs')) {
    return LocalStorage.getItem('orgs')
  }
  return state.orgs
}
