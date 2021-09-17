import Vue from 'vue'
import services from '../../microservices/services'
import mockData from '../../mockData/services'

Vue.use(services, {
  baseUrl: 'http://sudamerica.tranjr.com/api/'
  // baseUrl: 'http://127.0.0.1:8000/api/'
})

Vue.use(mockData, {
  baseUrl: 'http://localhost:8080'
})
