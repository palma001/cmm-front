export const query = function (vue, query, variable = {}) {
  return vue.$apollo.query({
    query: query,
    variables: variable,
    fetchPolicy: 'no-cache'
  }).then(({ data }) => {
    return {
      status: true,
      res: data
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}

export const mutation = function (vue, mutation, variable = {}) {
  return vue.$apollo.mutate({
    mutation: mutation,
    variables: variable,
    fetchPolicy: 'no-cache'
  }).then(({ data }) => {
    return {
      status: true,
      res: data
    }
  }).catch((err) => {
    if (err) {
      return {
        status: false,
        response: err
      }
    }
  })
}

const services = {
  install (Vue, options = {}) {
    Vue.prototype.$gql = {
      query,
      mutation
    }
  }
}
export default services
