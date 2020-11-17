export const branchOfficeConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'document',
          align: 'left',
          field: row => row.document,
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
          field: row => row.address,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'number_phone',
          align: 'left',
          field: row => row.number_phone,
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
