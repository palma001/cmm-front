import { Store } from '../store/'
import { ACTIONS } from '../store/module-login/name'

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
