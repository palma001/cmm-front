export const categoryModules = [
  // {
  //   name: 'products',
  //   route: 'products',
  //   icon: '',
  //   devices: ['mobile', 'desktop']
  // },
  {
    name: 'sales',
    icon: 'all_inbox',
    modules: [
      {
        name: 'billing',
        route: 'billing',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'voucher-list',
        route: 'VoucherList',
        icon: 'subject',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'categories',
        route: 'categories',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'brands',
        route: 'brands',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'clients',
        route: 'clients',
        icon: 'group',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'products',
        route: 'Product',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'productCommissions',
        route: 'ProductCommission',
        icon: 'money',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'sellerCommissions',
        route: 'SellerCommission',
        icon: 'money',
        devices: ['mobile', 'desktop']
      }
    ]
  }
  // {
  //   name: 'organization',
  //   icon: '',
  //   modules: [
  //     {
  //       name: 'business',
  //       route: 'business',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     },
  //     {
  //       name: 'branch-offices',
  //       route: 'branch-offices',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     }
  //   ]
  // },
  // {
  //   name: 'security',
  //   icon: '',
  //   modules: [
  //     {
  //       name: 'permissions',
  //       route: 'permissions',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     },
  //     {
  //       name: 'modules',
  //       route: 'modules',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     },
  //     {
  //       name: 'users',
  //       route: 'users',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     },
  //     {
  //       name: 'roles',
  //       route: 'roles',
  //       icon: '',
  //       devices: ['mobile', 'desktop']
  //     }
  //   ]
  // }
]
