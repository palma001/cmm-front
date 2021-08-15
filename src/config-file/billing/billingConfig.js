import { date } from 'quasar'
export const billingConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'client',
          align: 'left',
          field: row => row.client.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'created_at',
          align: 'left',
          field: row => date.formatDate(row.created_at, 'DD-MM-YYYY'),
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'expiration_date',
          align: 'left',
          field: row => date.formatDate(row.expiration_date, 'DD-MM-YYYY'),
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'coin',
          align: 'left',
          field: row => row.coin.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'seller',
          align: 'left',
          field: row => row.seller.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'voucher_type',
          align: 'left',
          field: row => row.voucher_type.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'operation_type',
          align: 'left',
          field: row => row.operation_type.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'igv',
          align: 'left',
          field: row => row.igv,
          sortable: false,
          visible: true
        }
      }
    ]
  }
]
