import { users } from './data/users'
import { products } from './data/products'

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
    }
  }
}
const install = function (Vue, options) {
  Vue.prototype.$mockData = mockData
}
export default install
