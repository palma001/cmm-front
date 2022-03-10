export const currentAccount = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'document_number',
          align: 'left',
          field: row => row.document_number,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'document_number',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'name',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'name',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'last_name',
          align: 'left',
          field: row => row.last_name,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'last_name',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'pending',
          align: 'center',
          field: row => `S/ ${row.pending}`,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'payments',
          align: 'center',
          visible: true,
          button: {
            icon: 'search',
            color: 'teal',
            type: 'button',
            size: 'sm',
            push: true,
            event: 'viewConcepts'
          }
        }
      },
      {
        tabulated: {
          name: 'accountStatus',
          align: 'center',
          visible: true,
          button: {
            icon: 'list',
            color: 'orange',
            type: 'button',
            size: 'sm',
            push: true,
            event: 'accountStatus'
          }
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
    color: 'primary',
    icon: 'edit',
    size: 'sm',
    event: 'view-details'
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
  // {
  //   targetPropTag: 'document_type',
  //   entity: 'document_type',
  //   services: ['document-types'],
  //   propData: 'data',
  //   petitionParams: {
  //     paginate: false
  //   }
  // }
]

export const partnerServices = {
  props: propsPanelEdition,
  config: currentAccount,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
