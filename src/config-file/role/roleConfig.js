export const roleConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'acronym',
          align: 'left',
          field: row => row.acronym,
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
          name: 'description',
          align: 'left',
          field: row => row.description,
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
