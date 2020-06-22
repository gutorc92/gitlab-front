/*
export function someGetter (state) {
}
*/
import { LocalStorage } from 'quasar'

export const getPersonalToken = (state) => {
  if (state.personalToken === undefined || state.personalToken === null || state.personalToken === '') {
    if (window.localStorage.getItem('personalToken') !== null) {
      state.personalToken = window.localStorage.getItem('personalToken')
    }
  }
  return state.personalToken
}

export const getTokens = (state) => {
  console.log('getters tokens', state.tokens)
  if (state.tokens.length === 0 && LocalStorage.has('tokens')) {
    return LocalStorage.getItem('tokens')
  }
  return state.tokens
}
