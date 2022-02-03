export const settingAccountingSeatConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'origin_account',
          align: 'left',
          field: row => row.origin_account.description,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'origin_account',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [],
              dataValue: 'id',
              dataLabel: 'description',
              behavior: 'menu',
              dense: true,
              clearable: true,
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
          name: 'accounting_plan',
          align: 'left',
          field: row => row.accounting_plan.description,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'accounting_plan',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [],
              dataValue: 'id',
              dataLabel: 'description',
              behavior: 'menu',
              dense: true,
              clearable: true,
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
          name: 'name_field',
          align: 'left',
          field: row => row.name_field,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'name_field',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [
                {
                  label: 'Total',
                  value: 'total'
                },
                {
                  label: 'Total Igv',
                  value: 'total_igv'
                },
                {
                  label: 'Subtotal',
                  value: 'subtotal'
                },
                {
                  label: 'Monto',
                  value: 'amount'
                }
              ],
              dataValue: 'value',
              dataLabel: 'label',
              behavior: 'menu',
              dense: true,
              clearable: true,
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
          name: 'account_type',
          align: 'left',
          field: row => row.account_type,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'account_type',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [
                {
                  label: 'Debe',
                  value: 'debe'
                },
                {
                  label: 'Haber',
                  value: 'Haber'
                }
              ],
              dataValue: 'value',
              dataLabel: 'label',
              behavior: 'menu',
              dense: true,
              clearable: true,
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
    targetPropTag: 'accounting_plan',
    entity: 'accounting_plan',
    services: ['accounting-plans'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'origin_account',
    entity: 'origin_account',
    services: ['origin-accounts'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  }
]

export const settingAccountingSeatServices = {
  props: propsPanelEdition,
  config: settingAccountingSeatConfig,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
