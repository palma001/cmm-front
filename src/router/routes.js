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
        path: '',
        name: '',
        component: () => import('pages/NewBilling.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'billing/:module/:id',
        name: 'BillingParam',
        component: () => import('pages/BillingParam.vue')
      },
      {
        path: 'users',
        name: 'User',
        component: () => import('pages/User.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'modules',
        name: 'modules',
        component: () => import('pages/Module.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('pages/Permission.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('pages/Role.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-billing',
        name: 'NewBilling',
        component: () => import('pages/NewBilling.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('pages/Category.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'brands',
        name: 'brands',
        component: () => import('pages/Brand.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import('pages/Client.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'product-commissions',
        name: 'ProductCommission',
        component: () => import('pages/ProductCommission.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'seller-commissions',
        name: 'SellerCommission',
        component: () => import('pages/SellerCommission.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'products',
        name: 'Product',
        component: () => import('pages/Product.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'billings',
        name: 'Billing',
        component: () => import('pages/Billing.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'orders',
        name: 'Order',
        component: () => import('pages/Order.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-order',
        name: 'NewOrder',
        component: () => import('pages/NewOrder.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'quotations',
        name: 'Quotation',
        component: () => import('pages/Quotation.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-quotation',
        name: 'NewQuotation',
        component: () => import('pages/NewQuotation.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-purchase',
        name: 'NewPurchase',
        component: () => import('pages/NewPurchase.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'purchases',
        name: 'Purchase',
        component: () => import('pages/Purchase.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-guide/:module/:id',
        name: 'ReferralGuide',
        component: () => import('pages/ReferralGuide.vue')
      },
      {
        path: 'credit-note/:id',
        name: 'CreditNote',
        component: () => import('pages/CreditNote.vue')
      },
      {
        path: 'expenses',
        name: 'Expense',
        component: () => import('pages/Expense.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-expense',
        name: 'NewExpense',
        component: () => import('pages/NewExpense.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'providers',
        name: 'Provider',
        component: () => import('pages/Provider.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'budget-requests',
        name: 'BudgetRequest',
        component: () => import('pages/BudgetRequest.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'transfers',
        name: 'Transfer',
        component: () => import('pages/Transfer.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-transfer',
        name: 'NewTransfer',
        component: () => import('pages/NewTransfer.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'devolutions',
        name: 'Devolution',
        component: () => import('pages/Devolution.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-devolution',
        name: 'NewDevolution',
        component: () => import('pages/NewDevolution.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-budget-request',
        name: 'NewBudgetRequest',
        component: () => import('pages/NewBudgetRequest.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'kardex-reports',
        name: 'KardexReport',
        component: () => import('pages/KardexReport.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'inventory-reports',
        name: 'InventoryReport',
        component: () => import('src/pages/InventoryReport.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'branch-offices',
        name: 'BranchOffice',
        component: () => import('src/pages/BranchOffice.vue'),
        beforeEnter: validationSessionUnit
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
