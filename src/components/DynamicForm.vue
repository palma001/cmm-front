<script>
export default {
  name: 'DynamicForm',
  props: {
    /*
     * Action Button
     * @type {Array} config buttons
     */
    buttons: {
      type: Array,
      default () {
        return [
          {
            name: 'cancel',
            action: 'add',
            label: true,
            icon: {
              icon: 'plus'
            },
            props: {
              color: 'red',
              glossy: true,
              size: '12px'
            }
          },
          {
            name: 'restore',
            action: 'add',
            label: true,
            icon: {
              icon: 'plus'
            },
            props: {
              color: 'warning',
              glossy: true,
              size: '12px'
            }
          },
          {
            name: 'add',
            action: 'add',
            label: true,
            icon: {
              icon: 'plus'
            },
            props: {
              color: 'primary',
              glossy: true,
              size: '12px'
            }
          }
        ]
      }
    },
    /*
     * Config inputs
     * @type {Array} config inpts
     */
    config: {
      type: Array,
      require: true,
      default () {
        return [
          {
            classTag: 'infoPrincipal',
            children: [
              {
                addible: {
                  propTag: 'name',
                  addible: true,
                  type: 'String',
                  visibleLabel: true,
                  component: {
                    name: 'q-input',
                    props: {
                      type: 'text',
                      expanded: true
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },
  data () {
    return {
      objectToBind: {}
    }
  },
  methods: {
    /**
     * Description
     */
    createContainer (createElement, configButtons, self) {
      const container = []
      container.push(
        createElement('q-card-actions',
          {
            props: {
              right: true
            }
          },
          [
            configButtons.map(button => {
              return createElement('q-btn',
                {
                  props: button.props
                },
                self.$t(`roles.${button.name}`)
              )
            })
          ]
        )
      )
      return container
    },
    /**
     * Description
     */
    createInput (createElement, config, self) {
      const inputs = []
      config.map(confi => {
        inputs.push(
          confi.children.map(prop => {
            if (prop.addible && prop.addible.addible) {
              const propTag = prop.addible.propTag
              prop.addible.component.props.value = (prop.addible.component.props.defaultValue) ? prop.addible.component.props.defaultValue : self.objectToBind[propTag]
              return createElement(
                'div', {
                  class: {
                    'col-12': true
                  }
                },
                [
                  createElement(
                    prop.addible.component.name,
                    {
                      props: {
                        ...prop.addible.component.props,
                        label: (() => {
                          if (prop.addible.visibleLabel) {
                            return self.$t(propTag)
                          }
                        })()
                      }
                    }
                  )
                ]
              )
            }
          })
        )
      })
      return inputs
    }
  },
  render: function (createElement) {
    const self = this
    return createElement('q-card',
      [
        createElement('q-card-section',
          {
            props: {
              right: true
            }
          },
          [
            createElement('div',
              {
                class: {
                  row: true
                }
              },
              [
                self.createInput(createElement, self.config, self)
              ]
            )
          ]
        ),
        self.createContainer(createElement, self.buttons, self)
      ]
    )
  }
}
</script>
