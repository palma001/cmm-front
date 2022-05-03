/**
 * Configuration of the library
 * @type {Object}
 */
let config = {
  /*
    Base url
   */
  baseUrl: 'http://127.0.0.1:8080',

  /**
   * Formatter of the data
   * @param  {String} value [Value to format]
   * @return {String}       [Formatted value]
   */
  formatter: (value) => {
    return value.toUpperCase()
  }
}

export default config

export const setConfig = value => { config = value }
