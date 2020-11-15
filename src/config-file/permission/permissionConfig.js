export const permissionConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'acronym',
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
      }
    ]
  }
]
