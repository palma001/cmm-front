import { MUTATIONS } from './name'
export const mutations = {
  [MUTATIONS.CLEAR_ACCOUNT_STATE]: (state, payload) => {
    state.user_session = null
    state.TOKEN = null
    state.REFRESH_TOKEN = null
    state.id_session = null
    state.expires_in = null
    state.token_type = null
    localStorage.clear()
  },

  [MUTATIONS.SET_TOKEN]: (state, token) => {
    state.TOKEN = token
    localStorage.setItem('TOKEN', token)
  },

  [MUTATIONS.SET_REFRESH_TOKEN]: (state, refreshToken) => {
    state.TOKEN = refreshToken
    localStorage.setItem('REFRESH_TOKEN', refreshToken)
  },

  [MUTATIONS.SET_USER]: (state, user) => {
    state.user_session = user
    localStorage.setItem('user_session', JSON.stringify(user))
  },

  [MUTATIONS.SET_ROLE]: (state, role) => {
    state.user_role = role
    localStorage.setItem('roleSelected', JSON.stringify(role))
  },

  [MUTATIONS.SET_BRANCH_OFFICE]: (state, branchOffice) => {
    state.user_branchOffice = branchOffice
    localStorage.setItem('branchOffice', JSON.stringify(branchOffice))
  },

  [MUTATIONS.SET_ID]: (state, id) => {
    state.id = id
    localStorage.setItem('id_session', id)
  },

  [MUTATIONS.SET_EXPIRE_IN]: (state, expiresIn) => {
    switch (typeof expiresIn) {
      case 'number':
        state.expires_in = new Date(
          new Date().getTime() + expiresIn
        )
        break
      default:
        state.expires_in = expiresIn
    }
    localStorage.setItem('expires_in', state.expires_in)
  }
}
