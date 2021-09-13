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
        component: () => import('pages/NewBilling.vue')
      },
      {
        path: 'billing/:module/:id',
        name: 'BillingParam',
        component: () => import('pages/BillingParam.vue')
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
        path: 'new-billing',
        name: 'NewBilling',
        component: () => import('pages/NewBilling.vue')
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
      },
      {
        path: 'products',
        name: 'Product',
        component: () => import('pages/Product.vue')
      },
      {
        path: 'billings',
        name: 'Billing',
        component: () => import('pages/Billing.vue')
      },
      {
        path: 'orders',
        name: 'Order',
        component: () => import('pages/Order.vue')
      },
      {
        path: 'new-order',
        name: 'NewOrder',
        component: () => import('pages/NewOrder.vue')
      },
      {
        path: 'quotations',
        name: 'Quotation',
        component: () => import('pages/Quotation.vue')
      },
      {
        path: 'new-quotation',
        name: 'NewQuotation',
        component: () => import('pages/NewQuotation.vue')
      },
      {
        path: 'new-purchase',
        name: 'NewPurchase',
        component: () => import('pages/NewPurchase.vue')
      },
      {
        path: 'purchases',
        name: 'Purchase',
        component: () => import('pages/Purchase.vue')
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
        component: () => import('pages/Expense.vue')
      },
      {
        path: 'new-expense',
        name: 'NewExpense',
        component: () => import('pages/NewExpense.vue')
      },
      {
        path: 'providers',
        name: 'Provider',
        component: () => import('pages/Provider.vue')
      },
      {
        path: 'budget-requests',
        name: 'BudgetRequest',
        component: () => import('pages/BudgetRequest.vue')
      },
      {
        path: 'transfers',
        name: 'Transfer',
        component: () => import('pages/Transfer.vue')
      },
      {
        path: 'new-transfer',
        name: 'NewTransfer',
        component: () => import('pages/NewTransfer.vue')
      },
      {
        path: 'devolutions',
        name: 'Devolution',
        component: () => import('pages/Devolution.vue')
      },
      {
        path: 'new-devolution',
        name: 'NewDevolution',
        component: () => import('pages/NewDevolution.vue')
      },
      {
        path: 'new-budget-request',
        name: 'NewBudgetRequest',
        component: () => import('pages/NewBudgetRequest.vue')
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
