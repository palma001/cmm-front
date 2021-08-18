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
