import Vue from 'vue'
import services from '../../microservices/services'
import mockData from '../../mockData/services'

Vue.use(services, {
  baseUrl: 'http://localhost:8000/api/'
  // baseUrl: 'http://mercado.tranjr.com/api/'
})

Vue.use(mockData, {
  baseUrl: 'http://localhost:8080'
})
