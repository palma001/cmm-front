export const userConfig = [
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
          name: 'first_name',
          align: 'left',
          field: row => row.first_name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'last_name',
          align: 'left',
          field: row => row.last_name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'email',
          align: 'left',
          field: row => row.email,
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
