import { validationSession, validationNotSession } from './validations-router'
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
        path: '',
        name: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/products',
        component: () => import('pages/Index.vue'),
        name: 'products'
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('pages/User.vue')
      },
      {
        path: 'modules',
        name: 'modules',
        component: () => import('pages/Module.vue')
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('pages/Permission.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('pages/Role.vue')
      },
      {
        path: 'billing',
        name: 'billing',
        component: () => import('pages/Billing.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('pages/Category.vue')
      },
      {
        path: 'brands',
        name: 'brands',
        component: () => import('pages/Brand.vue')
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import('pages/Client.vue')
      },
      {
        path: 'product-commissions',
        name: 'ProductCommission',
        component: () => import('pages/ProductCommission.vue')
      },
      {
        path: 'seller-commissions',
        name: 'SellerCommission',
        component: () => import('pages/SellerCommission.vue')
      }
    ]
  },
  {
    path: '/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'add',
        component: () => import('pages/AddModule.vue')
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
