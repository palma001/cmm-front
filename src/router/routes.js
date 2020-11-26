const routes = [
  {
    path: '/products',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'products' }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/business',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'business', component: () => import('pages/Business.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'users', component: () => import('pages/User.vue') }
    ]
  },
  {
    path: '/modules',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'modules', component: () => import('pages/Module.vue') }
    ]
  },
  {
    path: '/permissions',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'permissions', component: () => import('pages/Permission.vue') }
    ]
  },
  {
    path: '/branch-offices',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'branch-offices', component: () => import('pages/BranchOffice.vue') }
    ]
  },
  {
    path: '/roles',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'roles', component: () => import('pages/Role.vue') }
    ]
  },
  {
    path: '/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'add', component: () => import('pages/AddModule.vue') }
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
