import Vue from 'vue'
import services from '../../microservices/services'
import mockData from '../../mockData/services'

Vue.use(services, {
  baseUrl: 'https://ficde.herokuapp.com'
  // baseUrl: 'http://localhost:8000/'
})

Vue.use(mockData, {
  baseUrl: 'http://localhost:8080'
})
