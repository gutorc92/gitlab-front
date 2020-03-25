/*
export function someMutation (state) {
}
*/
import { LocalStorage } from 'quasar'
export const setRepos = (state, repos) => {
  state.repos = repos
  LocalStorage.set('repos', state.repos)
}
