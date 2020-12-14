import { users } from './data/users'
import { products } from './data/products'
import { modules } from './data/modules'
import { permissions } from './data/permissions'
import { business } from './data/business'
import { branchOffice } from './data/branchOffice'
import { roles } from './data/roles'
import { categoryModules } from './data/categoryModules'
import { authorizations } from './data/authorizations'

const mockData = {
  getData (data, params) {
    switch (data) {
      case 'users': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: users,
                  metadata: {
                    totalElements: users.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'products': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: products,
                  metadata: {
                    totalElements: products.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'modules': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: modules,
                  metadata: {
                    totalElements: modules.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'permissions': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: permissions,
                  metadata: {
                    totalElements: permissions.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'business': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: business,
                  metadata: {
                    totalElements: business.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'branch-offices': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: branchOffice,
                  metadata: {
                    totalElements: branchOffice.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'roles': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: roles,
                  metadata: {
                    totalElements: roles.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'category-modules': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: categoryModules,
                  metadata: {
                    totalElements: categoryModules.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
      case 'authorizations': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              response: {
                data: {
                  content: authorizations,
                  metadata: {
                    totalElements: authorizations.length,
                    number: params, // server data
                    size: 3 // server data
                  }
                }
              }
            })
          }, 2000)
        })
      }
    }
  },
  postData (module, data) {
    switch (module) {
      case 'roles': {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            roles.push(data)
            resolve({
              response: {
                data: {
                  content: data
                }
              }
            })
          }, 2000)
        })
      }
    }
  }
}
const install = function (Vue, options) {
  Vue.prototype.$mockData = mockData
}
export default install
