export const businessConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'document',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'name',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'address',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'number_phone',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
