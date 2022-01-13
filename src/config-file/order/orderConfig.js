import { date } from 'quasar'
export const orderConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'client',
          align: 'left',
          field: row => row.client.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'created_at',
          align: 'left',
          field: row => date.formatDate(row.created_at, 'DD-MM-YYYY'),
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'expiration_date',
          align: 'left',
          field: row => date.formatDate(row.expiration_date, 'DD-MM-YYYY'),
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'coin',
          align: 'left',
          field: row => row.coin.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'seller',
          align: 'left',
          field: row => row.seller.full_name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'total',
          align: 'left',
          field: row => row.total,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'products',
          align: 'center',
          visible: true,
          button: {
            icon: 'search',
            color: 'orange',
            type: 'button',
            size: 'sm',
            push: true,
            event: 'viewProduct'
          }
        }
      },
      {
        tabulated: {
          name: 'download',
          align: 'center',
          visible: true,
          button: {
            label: 'download',
            color: 'primary',
            type: 'dropdown',
            icon: 'file_download',
            push: true,
            splits: true,
            glossy: true,
            size: 'sm',
            options: [
              // {
              //   label: 'XML',
              //   event: 'downloadXML',
              //   avatar: {
              //     icon: 'file_download',
              //     color: 'secondary',
              //     textColor: 'white',
              //     size: 'md'
              //   }
              // },
              {
                label: 'PDF',
                event: 'downloadPDF',
                avatar: {
                  icon: 'file_download',
                  color: 'secondary',
                  textColor: 'white',
                  size: 'md'
                }
              }
              // {
              //   label: 'CDR',
              //   event: 'downloadCDR',
              //   avatar: {
              //     icon: 'file_download',
              //     color: 'secondary',
              //     textColor: 'white',
              //     size: 'md'
              //   }
              // }
            ]
          }
        }
      },
      {
        tabulated: {
          name: 'options',
          align: 'center',
          visible: true,
          button: {
            label: 'options',
            color: 'primary',
            type: 'dropdown',
            size: 'sm',
            push: true,
            options: [
              {
                label: 'createBill',
                event: 'createBill',
                avatar: {
                  icon: 'edit',
                  color: 'orange',
                  textColor: 'white',
                  size: 'md'
                }
              }
              // {
              //   label: 'options',
              //   event: 'options',
              //   avatar: {
              //     icon: 'chevron_right',
              //     color: 'primary',
              //     textColor: 'white',
              //     size: 'md'
              //   }
              // }
            ]
          }
        }
      }
    ]
  }
]
