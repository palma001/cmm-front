import { ALL_BOX } from '../../Graphql/Box/boxQueries'
export const boxCutConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'monto',
          align: 'left',
          field: row => row.acronym,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'monto',
          addible: true,
          editable: true,
          type: 'Number',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'number',
              outlined: true,
              dense: true
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
        actionable: {
          propTag: 'caja_id',
          addible: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-search-select',
            props: {
              data: [],
              dataValue: 'id',
              dataLabel: 'nombre_caja',
              behavior: 'menu',
              outlined: true,
              dense: true,
              clearable: true
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
          name: 'descripcion',
          align: 'left',
          field: row => row.descripcion,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'descripcion',
          addible: true,
          editable: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'textarea',
              outlined: true,
              dense: true
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
      }
    ]
  }
]

export const buttonsBoxCut = [
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
    name: 'add',
    action: 'add',
    label: false,
    props: {
      color: 'primary',
      glossy: true,
      size: '12px',
      icon: 'add_circle'
    },
    tooltip: {
      text: 'add',
      props: {
        'content-class': 'bg-primary'
      }
    }
  }
]

export const relationalData = [
  {
    targetPropTag: 'caja_id',
    query: ALL_BOX,
    propData: 'data',
    nameQuery: 'cajas',
    variables: {
      sucursal_id: 1,
      vendedor_id: null
    }
  }
]

export const propsPanelEdition = {
  data: {}
}

export const boxCutServices = {
  props: propsPanelEdition,
  config: boxCutConfig,
  propData: 'data',
  relationalData: relationalData
}
