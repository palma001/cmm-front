import { date } from 'quasar'
export const inventoryReportConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'created_at',
          align: 'left',
          field: row => `${date.formatDate(row.created_at, 'DD-MM-YYYY')} ${date.formatDate(row.created_at, 'HH:ss:mm')}`,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'product',
          align: 'left',
          field: row => row.product.description,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'transaction_type',
          align: 'left',
          field: row => row.purchase_id ? 'Compra' : 'Venta',
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'amount',
          align: 'left',
          field: row => row.purchase_id ? `+${row.amount}` : `-${row.amount}`,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'stock',
          align: 'left',
          field: row => row.stock,
          sortable: false,
          visible: true
        }
      }
    ]
  }
]
