export const categoryModules = [
  // {
  //   name: 'products',
  //   route: 'products',
  //   icon: '',
  //   devices: ['mobile', 'desktop']
  // },
  {
    name: 'security',
    icon: 'clock',
    modules: [
      {
        name: 'permissions',
        route: 'permissions',
        icon: 'clock',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'business',
        route: 'business',
        icon: '',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'modules',
        route: 'modules',
        icon: '',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'users',
        route: 'users',
        icon: '',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'branch-offices',
        route: 'branch-offices',
        icon: '',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'roles',
        route: 'roles',
        icon: '',
        devices: ['mobile', 'desktop']
      }
    ]
  }
]
