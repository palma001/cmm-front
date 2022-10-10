
export const transactionConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'date',
          align: 'left',
          field: row => row.date,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'date',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'description',
          align: 'left',
          field: row => row.description,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'description',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'full_description',
          align: 'left',
          field: row => row.full_description,
          sortable: false,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'full_description',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'beneficiary',
          align: 'left',
          field: row => row.payment_order.ownerable.full_name,
          sortable: false,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'beneficiary',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'reference',
          align: 'left',
          field: row => row.reference,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'reference',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'amount',
          align: 'right',
          field: row => row.amount,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'amount',
          addible: true,
          editable: true,
          sync: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            events: [{
              nameEvents: 'depends',
              affected: ['ownerable']
            }],
            props: {
              data: [
                {
                  name: 'Contrato',
                  id: 'App\\Models\\Field',
                  fieldName: 'Contrato',
                  fieldValue: 'id',
                  fieldLabel: 'denomination',
                  api: 'fields'
                },
                {
                  name: 'Proveedor',
                  id: 'App\\Models\\Provider',
                  fieldName: 'Proveedores',
                  fieldValue: 'id',
                  fieldLabel: 'name',
                  api: 'providers'
                },
                {
                  name: 'Personal',
                  id: 'App\\Models\\Personal',
                  fieldName: 'Personal',
                  fieldValue: 'id',
                  fieldLabel: 'name',
                  api: 'personals'
                },
                {
                  name: 'Cliente',
                  id: 'App\\Models\\Client',
                  fieldName: 'Cliente',
                  fieldValue: 'id',
                  fieldLabel: 'name',
                  api: 'clients'
                },
                {
                  name: 'Oficina',
                  id: 'App\\Models\\BranchOffice',
                  fieldName: 'Oficina',
                  fieldValue: 'id',
                  fieldLabel: 'name',
                  api: 'branch-offices'
                }
              ],
              dataValue: 'id',
              dataLabel: 'name',
              behavior: 'menu',
              dense: true,
              clearable: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true,
              'col-lg-12': true,
              'col-xl-12': true
            },
            directives: [
              {
                name: 'validate',
                value: {
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'action',
          align: 'center'
        }
      }
    ]
  }
]

/**
* Actions buttons
* @type {Array} array buttons
*/
export const buttonsActions = [
  {
    color: row => {
      if (row.status === 'approved') {
        return 'secondary'
      }
      return 'positive'
    },
    icon: row => {
      if (row.status === 'approved') {
        return 'restore'
      }
      return 'check'
    },
    visible: row => {
      return row.pending === row.amount
    },
    size: 'sm',
    event: 'changeStatus'
  },
  {
    color: 'primary',
    icon: 'edit',
    size: 'sm',
    event: 'view-details',
    visible: true,
    class: 'q-ml-sm'
  },
  {
    color: 'negative',
    icon: 'delete',
    size: 'sm',
    class: 'q-ml-sm',
    event: 'delete',
    visible: true
  }
]

export const propsPanelEdition = {
  data: {},
  buttons: [
    {
      name: 'cancel',
      action: 'cancel',
      label: false,
      props: {
        icon: 'highlight_off',
        color: 'negative',
        glossy: true,
        size: '12px'
      },
      tooltip: {
        text: 'cancel',
        props: {
          'content-class': 'bg-negative'
        }
      }
    },
    {
      name: 'reset',
      action: 'reset',
      label: false,
      props: {
        icon: 'restore',
        color: 'positive',
        glossy: true,
        size: '12px'
      },
      tooltip: {
        text: 'reset',
        props: {
          'content-class': 'bg-positive'
        }
      }
    },
    {
      name: 'update',
      action: 'update',
      label: false,
      props: {
        color: 'primary',
        glossy: true,
        size: '12px',
        icon: 'edit'
      },
      tooltip: {
        text: 'update',
        props: {
          'content-class': 'bg-primary'
        }
      }
    }
  ]
}
export const relationalDataConfiguration = [
  {
    targetPropTag: 'entity',
    entity: 'entity',
    services: ['entities'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'concept',
    entity: 'concept',
    services: ['concepts'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'coin',
    entity: 'coin',
    services: ['coins'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'operation_type',
    entity: 'operation_type',
    services: ['operation-types'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'ownerable',
    entity: 'ownerable',
    services: ['providers'],
    propData: 'data',
    sync: true,
    petitionParams: {
      paginate: false
    }
  }
]

export const paymentOrderServices = {
  props: propsPanelEdition,
  config: transactionConfig,
  propData: 'data',
  relationalData: relationalDataConfiguration
}

// const listStatus = {
//   approved: 'Aprobado',
//   pending_approval: 'Por aprobar',
//   canceled: 'Cancelado'
// }
