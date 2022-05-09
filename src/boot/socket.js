// import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from '../store'
import config from '../config'
export default async ({ Vue, app }) => {
  Vue.use(new VueSocketIO(
    {
      debug: false,
      connection: config.ipSocket,
      path: '',
      withCredentials: true,
      transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    }
  ))
}
