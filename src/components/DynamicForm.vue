<script>
import BInput from './BInput'

export default {
  name: 'DynamicForm',
  components: {
    BInput
  },
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
                  propTag: 'registros',
                  addible: true,
                  type: 'String',
                  visibleLabel: true,
                  component: {
                    name: 'b-input',
                    props: {
                      type: 'text',
                      expanded: true
                    }
                  }
                }
              },
              {
                addible: {
                  propTag: 'lastname',
                  addible: true,
                  type: 'String',
                  visibleLabel: true,
                  component: {
                    name: 'b-input',
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
    createButtons (createElement, configButtons, self) {
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
                  props: {
                    ...button.props
                  },
                  on: {
                    click: function () {
                      switch (button.action.toLowerCase()) {
                        case 'add':
                          self.addData()
                          break
                        case 'cancel':
                          self.cancel()
                          break
                        case 'restore':
                          self.restore()
                          break
                        default:
                          self.other(button.action)
                          break
                      }
                    }
                  }
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
     * Add data
     */
    addData () {
      this.$emit('save', this.objectToBind)
    },
    /**
     * Add data
     */
    cancel () {
      this.$emit('cancel', this.objectToBind)
    },
    /**
     * Add data
     */
    restore () {
      this.$emit('cancel', this.objectToBind)
    },
    /**
     * Add data
     */
    other (action) {
      this.$emit(action, this.objectToBind)
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
                        label: prop.addible.visibleLabel ? self.$t(propTag) : ''
                      },
                      class: {
                        ...prop.addible.component.class
                      },
                      attrs: {
                        name: propTag,
                        ...prop.addible.component.attrs
                      },
                      on: {
                        input: function (value) {
                          self.objectToBind[propTag] = value
                          // self.createInput(createElement, config, self)
                        },
                        select: function (value) {
                          self.objectToBind[propTag] = value
                        }
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
              align: 'right'
            }
          },
          [
            self.createInput(createElement, self.config, self)
          ]
        ),
        self.createButtons(createElement, self.buttons, self)
      ]
    )
  }
}
</script>
