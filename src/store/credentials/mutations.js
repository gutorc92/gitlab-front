/*
export function someMutation (state) {
}
*/
export const updatePersonalTokenState = (state, token) => {
  state.personalToken = token
  window.localStorage.setItem('personalToken', token)
}
