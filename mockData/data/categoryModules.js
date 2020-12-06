export const categoryModules = [
  // {
  //   name: 'products',
  //   route: 'products',
  //   icon: '',
  //   devices: ['mobile', 'desktop']
  // },
  {
    name: 'organization',
    icon: '',
    modules: [
      {
        name: 'permissions',
        route: 'permissions',
        icon: '',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'branch-offices',
        route: 'branch-offices',
        icon: '',
        devices: ['mobile', 'desktop']
      }
    ]
  },
  {
    name: 'security',
    icon: '',
    modules: [
      {
        name: 'permissions',
        route: 'permissions',
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
        name: 'roles',
        route: 'roles',
        icon: '',
        devices: ['mobile', 'desktop']
      }
    ]
  }
]
