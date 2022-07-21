import Vue from 'vue'
import services from '../../microservices/services'
import nodeServices from '../../microservicesNode/services'
import mockData from '../../mockData/services'

Vue.use(services, {
  baseUrl: process.env.API
  // baseUrl: 'http://mercado.tranjr.com/api/'
})

Vue.use(nodeServices, {
  baseUrl: 'http://192.168.0.107:5000/api/'
  // baseUrl: 'http://mercado.tranjr.com/api/'
})

Vue.use(mockData, {
  baseUrl: 'http://localhost:8080'
})
