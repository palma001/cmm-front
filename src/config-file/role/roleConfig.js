export const roleConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'acronym',
          align: 'left',
          field: row => row.acronym,
          sortable: true,
          visible: true
        },
        addible: {
          propTag: 'acronym',
          addible: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'text',
              outlined: true,
              dense: true
            },
            class: {
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
        addible: {
          propTag: 'name',
          addible: true,
          type: 'String',
          visibleLabel: true,
          component: {
            name: 'b-input',
            props: {
              type: 'text',
              outlined: true,
              dense: true
            },
            class: {
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
          visible: true
        },
        addible: {
          propTag: 'description',
          addible: true,
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

export const buttonsRole = [
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
