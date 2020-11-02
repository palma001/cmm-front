import axios from 'axios'
import config from './config'

/**
 * Local instance of Axios
 */
const axiosInstance = axios.create()

/**
 * Updates the base url on the config.js file and the default base url on the axios instance
 * @param  {String} url [API url]
 */
export const updateAxiosInstance = function (url) {
  config.baseUrl = url
  axiosInstance.defaults.baseURL = url
}

/**
 * Sets the header on the Axios instance
 * @param {String} key   [Key on the headers array]
 * @param {String} value [Value of the header]
 */
export const setAxiosHeader = function (key, value) {
  axiosInstance.defaults.headers.common[key] = value
}

export default axiosInstance
