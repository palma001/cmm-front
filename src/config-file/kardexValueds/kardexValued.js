export const kardexValuedConfig = [
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
          name: 'brand',
          align: 'left',
          field: row => row.brand.name,
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
          name: 'physicalUnitsSold',
          align: 'left',
          field: row => row.bill_electronic_details_count,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'stock',
          align: 'center',
          visible: true,
          button: {
            color: 'primary',
            type: 'button',
            size: 'sm',
            icon: 'search',
            push: true,
            event: 'viewStock'
          }
        }
      }
    ]
  }
]