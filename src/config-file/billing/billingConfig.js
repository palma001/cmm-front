import { date } from 'quasar'
export const billingConfig = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'serie_id',
          align: 'left',
          field: row => `${row.serie.name}-${row.number}`,
          sortable: true,
          visible: true
        }
      },
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
          field: row => date.formatDate(`${row.expiration_date} 12:00:00`, 'DD-MM-YYYY'),
          sortable: true,
          visible: false
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
          visible: false
        }
      },
      {
        tabulated: {
          name: 'voucher_type',
          align: 'left',
          field: row => row.voucher_type.name,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'operation_type',
          align: 'left',
          field: row => row.operation_type.name,
          sortable: false,
          visible: false
        }
      },
      {
        tabulated: {
          name: 'igv',
          align: 'left',
          field: row => row.total_igv.toFixed(2),
          sortable: true,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'purchase_price',
          align: 'left',
          field: row => row.total_bill.toFixed(2),
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
      // {
      //   tabulated: {
      //     name: 'book',
      //     align: 'center',
      //     visible: true,
      //     button: {
      //       icon: 'search',
      //       color: 'teal',
      //       type: 'button',
      //       size: 'sm',
      //       push: true,
      //       event: 'viewPlan'
      //     }
      //   }
      // },
      {
        tabulated: {
          name: 'payment',
          align: 'center',
          visible: true,
          button: {
            label: 'payment',
            color: 'primary',
            type: 'button',
            size: 'sm',
            push: true,
            event: 'viewPayment'
          }
        }
      },
      {
        tabulated: {
          name: 'download',
          align: 'center',
          visible: false,
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
              {
                label: 'XML',
                event: 'downloadXML',
                avatar: {
                  icon: 'file_download',
                  color: 'secondary',
                  textColor: 'white',
                  size: 'md'
                }
              },
              {
                label: 'PDF',
                event: 'downloadPDF',
                avatar: {
                  icon: 'file_download',
                  color: 'secondary',
                  textColor: 'white',
                  size: 'md'
                }
              },
              {
                label: 'CDR',
                event: 'downloadCDR',
                avatar: {
                  icon: 'file_download',
                  color: 'secondary',
                  textColor: 'white',
                  size: 'md'
                }
              }
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
            splits: true,
            options: [
              {
                label: 'note',
                event: 'viewNote',
                avatar: {
                  icon: 'edit',
                  color: 'orange',
                  textColor: 'white',
                  size: 'md'
                }
              },
              {
                label: 'guide',
                event: 'viewGuide',
                avatar: {
                  icon: 'dehaze',
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
