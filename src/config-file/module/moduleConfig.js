export const moduleConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'name',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true,
          class: 'text-capitalize'
        }
      },
      {
        tabulated: {
          name: 'route',
          align: 'left',
          field: row => row.name,
          sortable: true,
          visible: true,
          class: 'text-capitalize'
        }
      }
    ]
  }
]
