export const billingConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'document',
          align: 'left',
          field: row => row.document,
          sortable: true,
          visible: true
        },
        actionable: {
          propTag: 'cliente_id',
          addible: true,
          editable: true,
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
          name: 'first_name',
          align: 'left',
          field: row => row.first_name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'last_name',
          align: 'left',
          field: row => row.last_name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'email',
          align: 'left',
          field: row => row.email,
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
