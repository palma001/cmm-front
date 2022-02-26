import { validationSession, validationNotSession, validationSessionUnit } from './validations-router'
const routes = [
  {
    path: '/login',
    name: 'login',
    beforeEnter: validationNotSession,
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    beforeEnter: validationSession,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'new-entry',
        name: 'NewEntry',
        component: () => import('src/pages/NewEntry.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'entries',
        name: 'Entries',
        component: () => import('src/pages/Entries.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'partners',
        name: 'Partner',
        component: () => import('src/pages/Partner.vue'),
        beforeEnter: validationSessionUnit
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
