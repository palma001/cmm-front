import { date } from 'quasar'
export const quotationConfig = [
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
          name: 'validity_time',
          align: 'left',
          field: row => row.validity_time,
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'delivery_time',
          align: 'left',
          field: row => row.delivery_time,
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
          name: 'shipping_address',
          align: 'left',
          field: row => row.shipping_address,
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
          field: row => row.total.toFixed(2),
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'paid_out',
          align: 'left',
          field: row => row.paid_out.toFixed(2),
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'pending',
          align: 'left',
          field: row => row.pending.toFixed(2),
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
          name: 'options',
          align: 'center',
          visible: true,
          button: {
            label: 'options',
            color: 'primary',
            type: 'dropdown',
            push: true,
            size: 'sm',
            options: [
              // {
              //   label: 'note',
              //   event: 'viewNote',
              //   avatar: {
              //     icon: 'edit',
              //     color: 'orange',
              //     textColor: 'white',
              //     size: 'md'
              //   }
              // },
              // {
              //   label: 'guide',
              //   event: 'viewGuide',
              //   avatar: {
              //     icon: 'dehaze',
              //     color: 'orange',
              //     textColor: 'white',
              //     size: 'md'
              //   }
              // },
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
