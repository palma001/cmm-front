export const trailerConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'ownerable_type',
          align: 'left',
          field: row => row.ownerable_type.name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'ownerable_type',
          addible: true,
          editable: true,
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
                  id: 'App\\Models\\MaterialSupplier',
                  name: 'Empresa comercializadora',
                  api: 'material-suppliers'
                },
                {
                  id: 'App\\Models\\Organization',
                  name: 'Organización',
                  api: 'organizations'
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
          name: 'ownerable_id',
          align: 'left',
          field: row => row.ownerable.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'ownerable',
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
          name: 'color',
          align: 'left',
          field: row => row.color,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'color',
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
          name: 'brand',
          align: 'left',
          field: row => row.brand,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'brand',
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
          name: 'model',
          align: 'left',
          field: row => row.model,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'model',
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
          name: 'plate',
          align: 'left',
          field: row => row.plate,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'plate',
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
          name: 'status',
          align: 'left',
          field: row => row.status,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'status',
          addible: false,
          editable: false,
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
  {
    targetPropTag: 'ownerable',
    entity: 'ownerable',
    services: ['material-suppliers'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  }
]

export const trailerServices = {
  props: propsPanelEdition,
  config: trailerConfig,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
