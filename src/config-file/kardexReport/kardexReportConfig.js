import { date } from 'quasar'
export const kardexReportConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'serie',
          align: 'left',
          field: row => row.purchase ? `${row.purchase.serie}-${row.purchase.number}` : `${row.bill_electronic.serie.name}-${row.bill_electronic.number}`,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'providerOrClient',
          align: 'left',
          field: row => row.purchase ? row.purchase.provider.full_name : row.bill_electronic.client.full_name,
          sortable: false,
          visible: true
        }
      },
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
          name: 'voucher_type',
          align: 'left',
          field: row => row.purchase ? row.purchase.voucher_type.name : row.bill_electronic.voucher_type.name,
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
          name: 'item',
          align: 'left',
          field: row => row.item,
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
