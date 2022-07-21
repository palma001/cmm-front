import { Store } from '../store/'
import { ACTIONS } from '../store/module-login/name'
import { LocalStorage } from 'quasar'
export const validationSession = async (to, from, next) => {
  const validation = await Store.dispatch(ACTIONS.VALID_SESSION)
  if (!validation) {
    return next('/login')
  }
  next()
}

export const validationNotSession = async (to, from, next) => {
  const validation = await Store.dispatch(ACTIONS.VALID_SESSION)
  if (validation) {
    return next('/')
  }
  next()
}

export const validationSessionUnit = async (to, from, next) => {
  const validation = await Store.dispatch(ACTIONS.VALID_SESSION)
  if (validation) {
    const role = JSON.parse(LocalStorage.getItem('roleSelected'))
    const moduleFind = role.modules.find(module => module.route === to.name)
    if (from.name === 'login') {
      return next()
    }
    return moduleFind ? next() : next('*')
  }
}
