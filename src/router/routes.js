
const routes = [
  {
    path: '/products',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'products', component: () => import('pages/Index.vue'), name: 'products' }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '', component: () => import('pages/PWA.vue') }
    ]
  },
  {
    path: '/company',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'company', component: () => import('pages/PWA.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'users', component: () => import('pages/PWA.vue') }
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
