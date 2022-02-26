import { date } from 'quasar'
export const egress = [
  {
    classTag: 'infoUsers',
    index: 0,
    children: [
      {
        tabulated: {
          name: 'worker',
          align: 'left',
          field: row => row.worker.full_name,
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
          name: 'amount',
          align: 'left',
          field: row => row.amount,
          sortable: false,
          visible: true
        }
      },
      {
        tabulated: {
          name: 'concept',
          align: 'left',
          field: row => row.concept,
          sortable: false,
          visible: true
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
                label: 'PDF',
                event: 'downloadPDF',
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
