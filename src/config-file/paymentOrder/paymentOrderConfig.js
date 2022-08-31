
export const paymentOrderConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'payment_date',
          align: 'left',
          field: row => row.payment_date,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'payment_date',
          addible: true,
          editable: true,
          filterable: true,
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
          name: 'ownerable_type',
          align: 'left',
          field: row => row.ownerable_type,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'ownerable_type',
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
              dataLabel: 'full_name',
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
          name: 'operation_type_id',
          align: 'left',
          field: row => row.operation_type.name,
          sortable: true,
          visible: true,
          visibleColumn: false
        },
        actionable: {
          propTag: 'operation_type',
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
          name: 'concept_id',
          align: 'left',
          field: row => row.concept.name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'concept',
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
          name: 'status',
          align: 'left',
          field: row => row.status,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'status',
          addible: true,
          editable: true,
          filterable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'text',
              dense: true,
              outlined: true,
              align: 'right'
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
          name: 'coin_id',
          align: 'left',
          field: row => row.coin.name,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'coin',
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
          name: 'entity_id',
          align: 'left',
          field: row => row.entity.name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'entity',
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
          filterable: true,
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
          align: 'right',
          field: row => row.pending,
          sortable: false,
          visible: true,
          visibleColumn: true
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
          filterable: true,
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
    petitionParams: {
      paginate: false
    }
  }
]

export const paymentOrderServices = {
  props: propsPanelEdition,
  config: paymentOrderConfig,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
