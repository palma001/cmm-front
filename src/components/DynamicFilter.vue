<script>
import BInput from './BInput'
import BSearchSelect from './BSearchSelect'
import { QCheckbox } from 'quasar'
import { mixins } from '../mixins'
export default {
  name: 'DynamicFilter',
  components: {
    BInput,
    BSearchSelect,
    QCheckbox
  },
  mixins: [mixins.containerMixin],
  props: {
    loading: {
      type: Boolean,
      require: false
    },
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
            action: 'cancel',
            label: false,
            props: {
              icon: 'highlight_off',
              color: 'negative',
              glossy: true,
              size: '12px'
            },
            tooltip: {
              text: 'cancel',
              props: {
                'content-class': 'bg-negative'
              }
            }
          },
          {
            name: 'reset',
            action: 'reset',
            label: false,
            props: {
              icon: 'restore',
              color: 'positive',
              glossy: true,
              size: '12px'
            },
            tooltip: {
              text: 'reset',
              props: {
                'content-class': 'bg-positive'
              }
            }
          }
        ]
      }
    },
    /*
     * Name module
     * @type {String} module
     */
    module: {
      type: String,
      require: true
    },
    /*
     * Name primeries key
     * @type {Array} primeries key
     */
    primaryKey: {
      type: Array,
      required: false
    },
    /*
     * Name api key
     * @type {Array} api key
     */
    apiKey: {
      type: Array,
      required: false
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
                  propTag: 'firstname',
                  addible: true,
                  type: 'String',
                  visibleLabel: true,
                  component: {
                    name: 'b-input',
                    props: {
                      type: 'text',
                      outlined: true,
                      dense: true
                    },
                    class: {
                      'col-sm-12': true,
                      'col-md-12': true
                    },
                    directives: [
                      {
                        name: 'validate',
                        value: {
                          required: true
                        }
                      }
                    ]
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
                      outlined: true,
                      dense: true
                    },
                    class: {
                      'col-sm-12': true,
                      'col-md-12': true
                    },
                    directives: [
                      {
                        name: 'validate',
                        value: {
                          required: true
                        }
                      }
                    ]
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
      objectToBind: {},
      loadingAdd: false
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
              align: 'center'
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
                        case 'cancel':
                          self.cancel()
                          break
                        case 'reset':
                          self.reset()
                          break
                        default:
                          self.other(button.action)
                          break
                      }
                    }
                  }
                },
                [
                  this.crateTooltipsButtons(createElement, button, self),
                  (button.label) ? self.$t(`roles.${button.name}`) : ''
                ]
              )
            })
          ]
        )
      )
      return container
    },
    /**
     * Create Tooltips buttons
     * @param {Object} instance
     * @param {Object} config button
     */
    crateTooltipsButtons (createElement, button, self) {
      if (button.tooltip) {
        return createElement('q-tooltip',
          {
            class: {
              ...button.tooltip.class
            },
            props: {
              ...button.tooltip.props
            }
          },
          self.ucwords(self.$t(`${self.module}.${button.tooltip.text}`))
        )
      }
    },
    convertSelect (data) {
      for (const key in data) {
        if (data[key] && Object.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (typeof data[key] === 'object') {
            data[`${key}_id`] = element.value
            delete data[key]
          }
        }
      }
      return data
    },
    /**
     * Cancel action
     */
    cancel () {
      this.$emit('cancel', this.objectToBind)
    },
    /**
     * Reset data
     */
    reset () {
      this.objectToBind = {}
      this.invalidateKey = false
      this.loadingAdd = true
      this.emitEventFilter(self.objectToBind)
      setTimeout(() => {
        this.loadingAdd = false
      }, 500)
    },
    /**
     * Other Actions
     * @type {String} action
     */
    other (action) {
      this.$emit(action, this.objectToBind)
    },
    convertData (data) {
      if (typeof data === 'object') {
        return data.value
      }
      return data
    },
    /**
     * Description
     */
    createInput (createElement, config, self) {
      const inputs = []
      if (!self.loadingAdd) {
        config.map(confi => {
          inputs.push(
            confi.children.map(prop => {
              if (prop.actionable && prop.actionable.filterable) {
                const propTag = prop.actionable.propTag
                prop.actionable.component.props.value = (prop.actionable.component.props.defaultValue) ? prop.actionable.component.props.defaultValue : self.objectToBind[propTag]
                if (prop.actionable.visibleLabel) {
                  prop.actionable.component.props.label = prop.actionable.visibleLabel ? self.ucwords(self.$t(`${self.module}.${propTag}`)) : ''
                }
                return createElement(
                  prop.actionable.component.name,
                  {
                    ref: propTag,
                    props: {
                      ...prop.actionable.component.props,
                      hint: prop.actionable.component.props.hint ? self.ucwords(self.$t(`${self.module}.${prop.actionable.component.props.hint}`)) : ''
                    },
                    class: {
                      ...prop.actionable.component.class
                    },
                    attrs: {
                      name: propTag,
                      ...prop.actionable.component.attrs
                    },
                    on: {
                      input: function (value) {
                        self.objectToBind[propTag] = value
                        self.emitEventFilter(self.objectToBind)
                      },
                      select: function (value) {
                        self.objectToBind[propTag] = value
                        self.emitEventFilter(self.objectToBind)
                      }
                    }
                  }
                )
              }
            })
          )
        })
      }
      return inputs
    },
    emitEventFilter (data) {
      this.$emit('filter', this.convertSelect(data))
    },
    /**
     * Loading state
     * @type {createELement} create element
     * @type {Instance} slef
     */
    loadingBar (createElement, self) {
      return createElement('q-inner-loading',
        {
          props: {
            showing: this.loadingAdd
          }
        },
        [
          createElement('q-spinner-gears', {
            props: {
              color: 'primary',
              size: '70px'
            }
          })
        ]
      )
    }
  },
  render: function (createElement) {
    const self = this
    return createElement('q-card',
      {
        class: {
          column: true,
          'my-card': true
        }
      },
      [
        createElement('q-card-section',
          {
            class: {
              'text-h6': true,
              'items-center': true,
              'bg-primary': true,
              'text-white': true,
              row: true
            }
          },
          [
            self.ucwords(`${self.$t(`${self.module}.filter`)}`),
            createElement('q-space'),
            createElement('q-btn', {
              props: {
                icon: 'close',
                flat: true,
                round: true,
                dense: true
              },
              on: {
                click: () => {
                  self.cancel()
                }
              }
            })
          ]
        ),
        createElement('q-separator'),
        createElement('q-card-section',
          {
            class: {
              col: true,
              scroll: true
            }
          },
          [
            createElement('q-form',
              {
                ref: 'form',
                class: {
                  row: true,
                  'q-col-gutter-xs': true
                }
              },
              [
                createElement(
                  'div',
                  {
                    class: { 'q-pa-xs': true, 'full-width': true }
                  },
                  this.$slots.top
                ),
                self.createInput(createElement, self.config, self),
                createElement(
                  'div',
                  {
                    class: { 'q-pa-xs': true, 'full-width': true }
                  },
                  this.$slots.default
                )
              ]
            )
          ]
        ),
        createElement('q-separator'),
        self.createButtons(createElement, self.buttons, self),
        self.loadingBar(createElement, self)
      ]
    )
  }
}
</script>
