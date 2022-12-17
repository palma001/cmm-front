// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
// export default async (/* { app, router, Vue ... } */) => {
//   // something to do
// }
import Vue from 'vue'
import * as Ably from 'ably'
const ably = new Ably.Realtime({
  key: 'AlEvEw.8o-f5A:poBDB_uFDUH946ii',
  clientId: `${Math.random() * 1200000}`
})
Vue.prototype.$ably = ably
