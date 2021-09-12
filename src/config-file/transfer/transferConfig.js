import { date } from 'quasar'
export const transferConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'from_warehouse',
          align: 'left',
          field: row => row.from_warehouse.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'to_warehouse',
          align: 'left',
          field: row => row.to_warehouse.full_name,
          sortable: false,
          visible: true
        }
      },
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
          name: 'amount',
          align: 'left',
          field: row => row.transfer_details_count,
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
