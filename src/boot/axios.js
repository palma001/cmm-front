import axios from 'axios'
export default async ({ Vue, app }) => {
  Vue.prototype.$axios = axios
}
