import Vue from 'vue'
import Vuex from 'vuex'
import login from './module-login'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export const Store = new Vuex.Store({
  modules: {
    login
  },
  strict: process.env.DEV
})
export default function (/* { ssrContext } */) {
  return Store
}
