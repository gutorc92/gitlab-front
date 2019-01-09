export const getProjectsSelected = (state) => {
  if (state.projectsSelected === undefined || state.projectsSelected === null || state.projectsSelected === '') {
    if (window.localStorage.getItem('projectsSelected') !== null) {
      state.projectsSelected = window.localStorage.getItem('projectsSelected')
    }
  }
  console.log('state', state)
  return state.projectsSelected
}
