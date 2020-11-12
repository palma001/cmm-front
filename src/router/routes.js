
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'products' }
    ]
  },
  {
    path: '/pwa',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'pwa', component: () => import('pages/PWA.vue') }
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
