export const clientConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'document',
          align: 'left',
          field: row => `${row.tipo_documento} - ${row.num_documento ?? '-'}`,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'name',
          align: 'left',
          field: row => row.full_name,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'email',
          align: 'left',
          field: row => row.email ?? '-',
          sortable: true,
          visible: true
        }
      }
    ]
  }
]
