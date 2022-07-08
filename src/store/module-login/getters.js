import { GETTERS } from './name'

export const getters = {
  /**
   * Status of de expire date
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_TOKEN]: (state) => {
    return state.TOKEN
  },
  /**
   * Status of de expire date
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_REFRESH_TOKEN]: (state) => {
    return state.REFRESH_TOKEN
  },
  /**
   * Status of de expire date
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_TOKEN_TYPE]: (state) => {
    return state.TOKEN_TYPE
  },
  /**
   * Status of de Roles
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_ID]: (state) => {
    return state.id
  },
  /**
   * Status of de email
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_USER]: (state) => {
    return state.user_session
  },
  /**
   * Status of de role
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_ROLE]: (state) => {
    return state.user_role
  },

  /**
   * Status of de role
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  [GETTERS.GET_BRANCH_OFFICE]: (state) => {
    return state.user_branchOffice
  }
}
