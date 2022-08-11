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
        path: 'coins',
        name: 'Coin',
        component: () => import('src/pages/Coin.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'concept-types',
        name: 'ConceptType',
        component: () => import('src/pages/ConceptType.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'operation-types',
        name: 'OperationType',
        component: () => import('src/pages/OperationType.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'beneficiaries',
        name: 'Beneficiary',
        component: () => import('src/pages/Beneficiary.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'responsables',
        name: 'Responsable',
        component: () => import('src/pages/Responsable.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'organizations',
        name: 'Organization',
        component: () => import('src/pages/Organization.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'fields',
        name: 'Field',
        component: () => import('src/pages/Field.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'entities',
        name: 'Entity',
        component: () => import('src/pages/Entity.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'new-transaction',
        name: 'NewOrder',
        component: () => import('src/pages/NewOrder.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'concepts',
        name: 'Concept',
        component: () => import('src/pages/Concept.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'field-supervisors',
        name: 'FieldSupervisor',
        component: () => import('src/pages/FieldSupervisor.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'banks',
        name: 'Bank',
        component: () => import('src/pages/Bank.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'roles',
        name: 'Role',
        component: () => import('src/pages/Role.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'delivery-notes',
        name: 'DeliveryNote',
        component: () => import('src/pages/DeliveryNote.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'providers',
        name: 'Provider',
        component: () => import('src/pages/Provider.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'clients',
        name: 'Client',
        component: () => import('src/pages/Client.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'states',
        name: 'State',
        component: () => import('src/pages/State.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'users',
        name: 'User',
        component: () => import('src/pages/User.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'drivers',
        name: 'Driver',
        component: () => import('src/pages/Driver.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'actives',
        name: 'Active',
        component: () => import('src/pages/Active.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'guides',
        name: 'Guide',
        component: () => import('src/pages/Guide.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'trailers',
        name: 'Trailer',
        component: () => import('src/pages/Trailer.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'vehicles-types',
        name: 'VehicleType',
        component: () => import('src/pages/VehicleType.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'provider-rates',
        name: 'Rate',
        component: () => import('src/pages/ProviderRate.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'tickets',
        name: 'Ticket',
        component: () => import('src/pages/Ticket.vue'),
        beforeEnter: validationSessionUnit
      },
      {
        path: 'cash-flows',
        name: 'CashFlow',
        component: () => import('src/pages/CashFlow.vue'),
        beforeEnter: validationSessionUnit
      }
      // {
      //   path: 'collection-receipts',
      //   name: 'CollectionReceipt',
      //   component: () => import('src/pages/CollectionReceipt.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'entries',
      //   name: 'Entries',
      //   component: () => import('src/pages/Entries.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'partners',
      //   name: 'Partner',
      //   component: () => import('src/pages/Partner.vue'),
      //   beforeEnter: validatiosrc/pages/Beneficiary.vue
      // },
      // {
      //   path: 'workers',
      //   name: 'Worker',
      //   component: () => import('src/pages/Worker.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'egresses',
      //   name: 'Egresses',
      //   component: () => import('src/pages/Egresses.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'users',
      //   name: 'User',
      //   component: () => import('src/pages/User.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'current-accounts',
      //   name: 'CurrentAccount',
      //   props: route => ({ query: route.query.partner }),
      //   component: () => import('src/pages/CurrentAccount.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'box-closures',
      //   name: 'BoxClosure',
      //   component: () => import('src/pages/BoxClosure.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'reports',
      //   name: 'Report',
      //   component: () => import('src/pages/Report.vue'),
      //   beforeEnter: validationSessionUnit
      // },
      // {
      //   path: 'new-payment/:id',
      //   name: 'NewPayment',
      //   component: () => import('src/pages/NewPayment.vue')
      // }
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
