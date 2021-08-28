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
        name: 'newBilling',
        route: 'NewBilling',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'billing',
        route: 'Billing',
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
        name: 'orders',
        route: 'Order',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'quotations',
        route: 'Quotation',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      // {
      //   name: 'productCommissions',
      //   route: 'ProductCommission',
      //   icon: 'money',
      //   devices: ['mobile', 'desktop']
      // },
      {
        name: 'sellerCommissions',
        route: 'SellerCommission',
        icon: 'money',
        devices: ['mobile', 'desktop']
      }
    ]
  },
  {
    name: 'purchase',
    icon: 'all_inbox',
    modules: [
      {
        name: 'newPurchase',
        route: 'NewPurchase',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'purchase',
        route: 'Purchase',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'expense',
        route: 'Expense',
        icon: 'receipt',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'provider',
        route: 'Provider',
        icon: 'group',
        devices: ['mobile', 'desktop']
      },
      {
        name: 'budgetRequest',
        route: 'BudgetRequest',
        icon: 'receipt',
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
