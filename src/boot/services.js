import Vue from 'vue'
import services from '../../microservices/services'
import nodeServices from '../../microservicesNode/services'
import mockData from '../../mockData/services'

Vue.use(services, {
  baseUrl: 'http://127.0.0.1:8000/api/'
  // baseUrl: 'http://mercado.tranjr.com/api/'
})

Vue.use(nodeServices, {
  baseUrl: 'http://127.0.0.1:5000/api/'
  // baseUrl: 'http://mercado.tranjr.com/api/'
})

Vue.use(mockData, {
  baseUrl: 'http://localhost:8080'
})
