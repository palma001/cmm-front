import { ACTIONS, MUTATIONS } from './name'
/**
 * Login
 * @param {Object} context
 * @param {Object} credentials user
 */

export const actions = {
  [ACTIONS.LOGIN]: ({ commit, dispatch }, { self, param }) => {
    self.btnDisable = true
    self.$services.postData(['authentication', 'login'], param)
      .then(({ res }) => {
        commit(MUTATIONS.SET_TOKEN_TYPE, res.data.token_type)
        commit(MUTATIONS.SET_TOKEN, res.data.access_token)
        commit(MUTATIONS.SET_REFRESH_TOKEN, res.data.refresh_token)
        commit(MUTATIONS.SET_USER, res.data.user)
        commit(MUTATIONS.SET_EXPIRE_IN, Number(res.data.expires_in))
        commit(MUTATIONS.SET_EXPIRE_IN, Number(res.data.expires_in))
        commit(MUTATIONS.SET_ID, Number(res.data.user.id))
        dispatch(ACTIONS.AUTO_LOGOUT, Number(res.data.expires_in))
        commit(MUTATIONS.SET_ROLE, res.data.user.roles[0])
        commit(MUTATIONS.SET_BRANCH_OFFICE, res.data.user.branch_offices[0])
        self.$router.push({ name: res.data.user.roles[0].modules[0].route })
        self.btnDisable = false
      })
      .catch((err) => {
        console.log(err)
        self.$q.notify({
          position: 'top',
          color: 'negative',
          icon: 'report_problem',
          message: 'Las credenciales son incorrectas'
        })
        self.btnDisable = false
      })
  },
  /**
   * Logout of the app
   * @param {Object} context
   */
  [ACTIONS.LOGOUT]: ({ commit }, { self }) => {
    commit(MUTATIONS.CLEAR_ACCOUNT_STATE)
    self.$router.push({ name: 'login' })
  },
  /**
   * Valiad session active
   */
  [ACTIONS.VALID_SESSION]: ({ commit, dispatch }) => {
    const user = JSON.parse(localStorage.getItem('user_session'))
    const role = JSON.parse(localStorage.getItem('roleSelected'))
    const token = localStorage.getItem('TOKEN')
    const tokenType = localStorage.getItem('TOKEN_TYPE')
    const branchOffice = typeof localStorage.getItem('branchOffice') === 'string' ? JSON.parse(localStorage.getItem('branchOffice')) : localStorage.getItem('branchOffice')
    // const userActive = localStorage.getItem('session_active')
    const invalidUser = !user || user === null || role === null || token === null || tokenType === null
    if (invalidUser) {
      commit(MUTATIONS.CLEAR_ACCOUNT_STATE)
      return false
    }
    commit(MUTATIONS.SET_USER, user)
    commit(MUTATIONS.SET_ROLE, role)
    commit(MUTATIONS.SET_TOKEN, token)
    commit(MUTATIONS.SET_TOKEN_TYPE, tokenType)
    commit(MUTATIONS.SET_BRANCH_OFFICE, branchOffice)
    return true
  },
  /**
   * Refresh user token
   * @param {Object} context
   */
  [ACTIONS.REFRESH_TOKEN]: ({ commit, dispatch }, { self }) => {
    // self.$apollo.mutate({
    //   mutation: gql`mutation ($refresh_token: String!) {
    //     refreshToken(input: {
    //       refresh_token: $refresh_token
    //     })
    //     {
    //       access_token
    //       refresh_token
    //       expires_in
    //       token_type
    //     }
    //   }`,
    //   variables: {
    //     refresh_token: localStorage.getItem('REFRESH_TOKEN')
    //   },
    //   update: (store, { data: { refreshToken } }) => {
    //     commit(MUTATIONS.SET_TOKEN, refreshToken.access_token)
    //     commit(MUTATIONS.SET_REFRESH_TOKEN, refreshToken.refresh_token)
    //     commit(MUTATIONS.SET_EXPIRE_IN, Number(refreshToken.expires_in))
    //     dispatch(ACTIONS.AUTO_LOGOUT, Number(refreshToken.expires_in))
    //   }
    // })
  },
  /**
   * Starts user time session
   * @param {number} expireIn
   */
  [ACTIONS.AUTO_LOGOUT]: ({ commit }, expiresIn) => {
    setTimeout(() => {
      commit(MUTATIONS.SET_TOKEN, null)
      commit(MUTATIONS.SET_EXPIRE_IN, null)
    }, expiresIn)
  }
}
