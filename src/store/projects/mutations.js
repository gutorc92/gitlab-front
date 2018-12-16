/*
export function someMutation (state) {
}
*/

export const updateProjectsSelectedState = (state, projects) => {
  state.projectsSelected = projects
  window.localStorage.setItem('projectsSelected', projects)
}
