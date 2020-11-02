import Vue from 'vue'
import services from '../../microservices/services'

Vue.use(services, {
  baseUrl: 'https://ficde.herokuapp.com'
  // baseUrl: 'http://localhost:8000/'
})
