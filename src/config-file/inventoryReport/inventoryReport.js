export const inventoryReportConfig = [
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
          name: 'category',
          align: 'left',
          field: row => row.category.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'purchase_price',
          align: 'left',
          field: row => row.purchase_price,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'sale_price',
          align: 'left',
          field: row => row.sale_price,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'brand',
          align: 'left',
          field: row => row.brand.name,
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
      }
    ]
  }
]
