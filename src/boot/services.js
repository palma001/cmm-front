import services from '../../microservices/services'
import nodeServices from '../../microservicesNode/services'
import mockData from '../../mockData/services'

export default async ({ Vue, app }) => {
  Vue.use(services, {
    // baseUrl: process.env.API
    // baseUrl: 'http://backdba.qbitsinc.com/api/'
    baseUrl: 'http://192.168.0.109:8000/api/'

  })

  Vue.use(nodeServices, {
    baseUrl: 'http://192.168.0.107:5000/api/'
    // baseUrl: 'http://mercado.tranjr.com/api/'
  })

  Vue.use(mockData, {
    baseUrl: 'http://localhost:8080'
  })
}
