export const product = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'id',
          align: 'left',
          field: row => row.id,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'brand_id',
          align: 'left',
          field: row => row.brand ? row.brand.name : '-',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'code',
          align: 'left',
          field: row => row.code,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'code',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'supsec',
          align: 'left',
          field: row => row.supsec,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'supsec',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'characteristic',
          align: 'left',
          field: row => row.characteristic,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'characteristic',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'numsec',
          align: 'left',
          field: row => row.numsec,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'numsec',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'margin_percentage',
          align: 'left',
          field: row => row.margin_percentage,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'margin_percentage',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'number',
              dense: true,
              outlined: true
            },
            class: {
              'col-xs-12': true,
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'category_id',
          align: 'left',
          field: row => row.category ? row.category.name : '-',
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'category',
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
              'col-sm-6': true,
              'col-md-6': true,
              'col-lg-6': true,
              'col-xl-6': true
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
          name: 'stock',
          align: 'center',
          visible: true,
          button: {
            color: 'primary',
            type: 'button',
            size: 'sm',
            icon: 'search',
            push: true,
            event: 'viewStock'
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
    targetPropTag: 'category',
    entity: 'category',
    services: ['categories'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  },
  {
    targetPropTag: 'brand',
    entity: 'brand',
    services: ['brands'],
    propData: 'data',
    petitionParams: {
      paginate: false
    }
  }
]

export const productServices = {
  props: propsPanelEdition,
  config: product,
  propData: 'data',
  relationalData: relationalDataConfiguration
}
