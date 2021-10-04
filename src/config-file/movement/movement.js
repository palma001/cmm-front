export const movementConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'product',
          align: 'left',
          field: row => row.description,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'warehouse_name',
          align: 'left',
          field: row => row.warehouse_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'stock_product',
          align: 'left',
          field: row => row.stock_product,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'translate',
          align: 'center',
          visible: true,
          button: {
            label: 'translate',
            color: 'primary',
            type: 'button',
            size: 'sm',
            push: true,
            event: 'translate'
          }
        }
      }
    ]
  }
]
