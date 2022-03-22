export const boxClosure = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'from_date',
          align: 'left',
          field: row => row.from_date,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'from_date',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: false,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true,
              hint: 'to_date'
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
          name: 'to_date',
          align: 'left',
          field: row => row.to_date,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'to_date',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: false,
          component: {
            name: 'b-input',
            props: {
              type: 'date',
              dense: true,
              outlined: true,
              hint: 'from_date'
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
          name: 'user',
          align: 'left',
          field: row => row.user.full_name,
          sortable: true,
          visible: true
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
    color: 'orange',
    icon: 'print',
    size: 'sm',
    event: 'print'
  },
  {
    color: 'primary',
    icon: 'edit',
    size: 'sm',
    event: 'view-details',
    class: 'q-ml-sm'
  },
  {
    color: 'negative',
    icon: 'delete',
    size: 'sm',
    event: 'delete',
    class: 'q-ml-sm'
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
  }
]

export const boxClosureServices = {
  props: propsPanelEdition,
  config: boxClosure,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
