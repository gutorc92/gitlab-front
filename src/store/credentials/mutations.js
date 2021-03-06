/*
export function someMutation (state) {
}
*/
import { LocalStorage } from 'quasar'

export const updatePersonalTokenState = (state, token) => {
  state.personalToken = token
  window.localStorage.setItem('personalToken', token)
}

export const setToken = (state, { token = '', api = 'gitlab', author = '' }) => {
  state.tokens.push({
    token,
    api,
    author
  })
  LocalStorage.set('tokens', state.tokens)
}
