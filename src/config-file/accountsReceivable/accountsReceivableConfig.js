import { date } from 'quasar'
export const accountsReceivableConfig = [
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
          visible: true
        }
      },
      {
        tabulated: {
          name: 'igv',
          align: 'left',
          field: row => row.igv,
          sortable: true,
          visible: false
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
          visible: false,
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