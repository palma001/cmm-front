export const entryPayment = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'payment_method_id',
          align: 'left',
          field: row => row.payment_method ? row.payment_method.name : '-',
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'payment_method',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [],
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
              'col-xl-12': true,
              'q-mt-sm': true
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
          name: 'entry_id',
          align: 'left',
          field: row => row.entry ? `Recibo Nro ${row.entry.id}` : '-',
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'amount',
          align: 'left',
          field: row => row.amount,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'amount',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'text',
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
                  required: false
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
          visible: true
        },
        actionable: {
          propTag: 'description',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'textarea',
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
                  required: false
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
    targetPropTag: 'payment_method',
    entity: 'payment_method',
    services: ['payment-methods'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'entry',
    entity: 'entry',
    services: ['entries'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  }
]
export const entryPaymentServices = {
  props: propsPanelEdition,
  config: entryPayment,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
