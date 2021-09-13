import { date } from 'quasar'
export const devolutionConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'created_at',
          align: 'left',
          field: row => date.formatDate(row.created_at, 'DD-MM-YYYY'),
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'user',
          align: 'left',
          field: row => row.user.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'code',
          align: 'left',
          field: row => row.code,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'devolution_reason',
          align: 'left',
          field: row => row.devolution_reason.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'observation',
          align: 'left',
          field: row => row.observation,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'products',
          align: 'center',
          visible: true,
          button: {
            icon: 'search',
            color: 'primary',
            type: 'button',
            push: true,
            size: 'sm',
            event: 'viewProducts'
          }
        }
      }
    ]
  }
]
