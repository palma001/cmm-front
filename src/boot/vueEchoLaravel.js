import Vue from 'vue'
import VueEcho from 'vue-echo-laravel'
import Echo from 'laravel-echo'
window.Pusher = require('pusher-js')

const EchoInstance = new Echo({
  broadcaster: 'pusher',
  wsHost: '192.168.0.116',
  wsPort: 6001,
  forceTLS: false,
  appId: 1463683,
  secret: 'c395ce3f72f8865d804e',
  cluster: 'us2',
  key: '5ad9d002d6375a1bd08b',
  disableStats: true,
  enabledTransports: ['ws', 'wss']
})

Vue.use(VueEcho, EchoInstance)
