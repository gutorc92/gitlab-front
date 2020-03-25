import { LocalStorage } from 'quasar'

export const setUpdateTime = (state, updateTime) => {
  state.updateTime = updateTime
  LocalStorage.set('updateTime', state.updateTime)
}
export const setCommitAuthor = (state, commitAuthor) => {
  state.commitAuthor = commitAuthor
  LocalStorage.set('commitAuthor', state.commitAuthor)
}
