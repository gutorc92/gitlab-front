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
  console.log('set token', token, 'api', api, 'author', author)
  console.log('set tokens', state.tokens)
  state.tokens.push({
    token: token,
    api: api,
    author: author
  })
  console.log('state', state)
  LocalStorage.set('tokens1', state.tokens)
  if (LocalStorage.has('tokens')) {
    let actualtokens = LocalStorage.getItem('tokens')
    actualtokens.push({ token: token, api: api, author: author })
    LocalStorage.set('tokens', actualtokens)
  } else {
    LocalStorage.set('tokens', state.tokens)
  }
}
