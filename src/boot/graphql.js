import graphql from '../../graphql/services'

export default async ({ Vue, app }) => {
  Vue.use(graphql, {
    baseUrl: 'http://127.0.0.1/graphql'
    // baseUrl: 'http://localhost:8000/'
  })
}
