export const guideConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'material_supplier',
          align: 'left',
          field: row => row.material_supplier.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'material_supplier',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            events: [{
              nameEvents: 'depends',
              affected: ['vehicle', 'driver', 'trailer']
            }],
            props: {
              data: [],
              dataValue: 'id',
              dataLabel: 'full_name',
              behavior: 'menu',
              dense: true,
              sync: true,
              clearable: true,
              outlined: true,
              services: ['material-suppliers'],
              queryParams: {
                search: {
                  name: null,
                  document_number: null
                },
                paginate: false
              }
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
          name: 'vehicle',
          align: 'left',
          field: row => row.vehicle.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'vehicle',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              services: ['vehicles'],
              data: [],
              sync: true,
              dataValue: 'id',
              dataLabel: 'full_name',
              behavior: 'menu',
              dense: true,
              clearable: true,
              outlined: true,
              queryParams: {
                search: {
                  plate: null,
                  brand: null
                },
                paginate: false
              }
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
          name: 'trailer',
          align: 'left',
          field: row => row.trailer.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'trailer',
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
          name: 'driver',
          align: 'left',
          field: row => row.driver.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'driver',
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
          name: 'client',
          align: 'left',
          field: row => row.client.full_name,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'client',
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
          name: 'start_date',
          align: 'left',
          field: row => row.start_date,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'start_date',
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
              hint: 'start_date'
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
          name: 'deadline',
          align: 'left',
          field: row => row.deadline,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'deadline',
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
              hint: 'deadline'
            },
            class: {
              'col-xs-12': true,
              'col-sm-12': true,
              'col-md-12': true,
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
          name: 'code_runpa',
          align: 'left',
          field: row => row.code_runpa,
          sortable: true,
          visible: true,
          visibleColumn: true
        },
        actionable: {
          propTag: 'code_runpa',
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
              'col-md-12': true,
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
          name: 'origin_address',
          align: 'left',
          field: row => row.origin_address,
          sortable: true,
          visible: true,
          visibleColumn: false
        },
        actionable: {
          propTag: 'origin_address',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'destination_address',
          align: 'left',
          field: row => row.destination_address,
          sortable: true,
          visible: true,
          visibleColumn: false
        },
        actionable: {
          propTag: 'destination_address',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'material',
          align: 'left',
          field: row => row.material,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'material',
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
                  required: true
                }
              }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'documents',
          align: 'center',
          visible: true,
          visibleColumn: true,
          button: {
            label: 'documents',
            color: 'secondary',
            type: 'dropdown',
            icon: 'receipt',
            push: true,
            splits: true,
            size: 'sm',
            options: [
              {
                label: 'swornDeclaration',
                event: 'swornDeclaration',
                avatar: {
                  icon: 'receipt',
                  color: 'secondary',
                  textColor: 'white',
                  size: 'md'
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
    targetPropTag: 'material_supplier',
    entity: 'material_supplier',
    services: ['material-suppliers'],
    propData: 'data',
    sync: true
  },
  {
    targetPropTag: 'vehicle',
    entity: 'vehicle',
    services: ['vehicles'],
    propData: 'data',
    sync: true
  },
  {
    targetPropTag: 'client',
    entity: 'client',
    services: ['clients'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'trailer',
    entity: 'trailer',
    services: ['trailers'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'driver',
    entity: 'driver',
    services: ['drivers'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  }
]

export const guideServices = {
  props: propsPanelEdition,
  config: guideConfig,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
