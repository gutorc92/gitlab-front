/*
export function someGetter (state) {
}
*/
export const getPersonalToken = (state) => {
  if (state.personalToken === undefined || state.personalToken === null || state.personalToken === '') {
    if (window.localStorage.getItem('personalToken') !== null) {
      state.personalToken = window.localStorage.getItem('personalToken')
    }
  }
  return state.personalToken
}
