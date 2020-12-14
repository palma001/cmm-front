export const billingConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'cliente',
          align: 'left',
          field: row => row.cliente.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'typeOfVoucher',
          align: 'left',
          field: row => `${row.tipo_comprobante}-${row.num_comprobante}`,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'created_at',
          align: 'left',
          field: row => row.created_at,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'total',
          align: 'left',
          field: row => row.total_format,
          sortable: false,
          visible: true
        }
      }
    ]
  }
]
