/**
 * Actions
 */
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const VALID_SESSION = 'VALID_SESION'
const REFRESH_TOKEN = 'REFRESH_TOKEN'
const AUTO_LOGOUT = 'AUTO_LOGOUT'

/**
 * Mutations
 */
const SET_TOKEN = 'SET_TOKEN'
const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
const SET_EXPIRE_IN = 'SET_EXPIRE_IN'
const CLEAR_ACCOUNT_STATE = 'CLEAR_ACCOUNT_STORE'
const SET_USER = 'SET_USER'
const SET_ID = 'SET_ID'
const SET_SUCURSALES = 'SET_SUCURSALES'

/**
 * Getters
 */

const GET_TOKEN = 'GET_TOKEN'
const GET_ID = 'GET_ID'
const GET_USER = 'GET_USER'
/**
 * Actions Login
 * @type {Object}
 */
export const ACTIONS = {
  LOGIN,
  LOGOUT,
  VALID_SESSION,
  REFRESH_TOKEN,
  AUTO_LOGOUT
}

/**
 * Muttations Lgin
 * @type {Object}
 */
export const MUTATIONS = {
  CLEAR_ACCOUNT_STATE,
  SET_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USER,
  SET_EXPIRE_IN,
  SET_ID
}

export const GETTERS = {
  GET_TOKEN,
  GET_ID,
  GET_USER,
  SET_SUCURSALES
}
