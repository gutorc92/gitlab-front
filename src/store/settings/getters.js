import { LocalStorage } from 'quasar'

export const getUpdateTime = (state) => {
  if (state.updateTime === 0 && LocalStorage.has('updateTime')) {
    return LocalStorage.getItem('updateTime')
  }
  return state.updateTime
}

export const getCommitAuthor = (state) => {
  if (state.commitAuthor === '' && LocalStorage.has('commitAuthor')) {
    return LocalStorage.getItem('commitAuthor')
  }
  return state.commitAuthor
}
