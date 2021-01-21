<script>
import BInput from './BInput'
import BSearchSelect from './BSearchSelect'
import { mixins } from '../mixins'
export default {
  name: 'DynamicForm',
  components: {
    BInput,
    BSearchSelect
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
          },
          {
            name: 'add',
            action: 'add',
            label: false,
            props: {
              color: 'primary',
              glossy: true,
              size: '12px',
              icon: 'add_circle'
            },
            tooltip: {
              text: 'add',
              props: {
                'content-class': 'bg-primary'
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
     * Name microservice
     * @type {String} microservice
     */
    microservices: {
      type: String,
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
      loadingAdd: false,
      invalidateKey: false
    }
  },
  watch: {
    loading () {
      this.objectToBind = {}
      this.loadingAdd = this.loading
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
                        case 'add':
                          self.addData(self)
                          break
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
    /**
     * Add data
     */
    addData (self) {
      self.validateBeforeSubmit()
        .then(res => {
          if (res && !self.invalidateKey) {
            self.$emit('save', self.objectToBind)
          }
        })
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
      setTimeout(() => {
        this.loadingAdd = false
      }, 500)
    },
    /**
     * Get validation primary key
     * @type {Object} data get
     *
     */
    getPrimaryKey (data) {
      this.$services.getDataParams(
        [this.microservices, this.module],
        data[this.primaryKey[0]])
        .then(res => {
          if (res.res.status === 200) {
            this.invalidateKey = true
            this.errorValidation(this.primaryKey[0])
          } else {
            this.invalidateKey = false
          }
        })
    },
    /**
     * Other Actions
     * @type {String} action
     */
    other (action) {
      this.$emit(action, this.objectToBind)
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
              if (prop.actionable && prop.actionable.addible) {
                const propTag = prop.actionable.propTag
                prop.actionable.component.props.value = (prop.actionable.component.props.defaultValue) ? prop.actionable.component.props.defaultValue : self.objectToBind[propTag]
                return createElement(
                  prop.actionable.component.name,
                  {
                    ref: propTag,
                    props: {
                      ...prop.actionable.component.props,
                      label: prop.actionable.visibleLabel ? self.ucwords(self.$t(`${self.module}.${propTag}`)) : '',
                      errorMessage: (self.errorValidation(propTag)) ? (self.errorValidation(propTag)) : '',
                      error: this.errors.has(propTag)
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
                      },
                      select: function (value) {
                        self.objectToBind[propTag] = value
                      }
                    },
                    directives: (function () {
                      if (prop.actionable.component.directives) {
                        const directives = [
                          ...prop.actionable.component.directives
                        ]
                        return directives
                      }
                    })()
                  }
                )
              }
            })
          )
        })
      }
      return inputs
    },
    /**
     * Validations the errors
     * @param  {String} propTag data fromulary
     * @return {String} errors
     */
    errorValidation (propTag) {
      if (this.errors.has(propTag) || !this.invalidateKey) {
        return this.errors.first(propTag)
      } else {
        return this.messageErrorPrimary(propTag)
      }
    },
    /**
     * Verify formulary error
     * @param {String} event form to change
     */
    validateBeforeSubmit () {
      return this.$validator.validateAll()
        .then((result) => {
          return result
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * Message primary key
     * @param  {String} propTag
     * @return {String} message the error
     */
    messageErrorPrimary (propTag) {
      if (this.invalidateKey && propTag === this.primaryKey[0]) {
        return this.$t('invalidatePrimaryKey', 'message')
      } else {
        return ''
      }
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
              row: true
            }
          },
          [
            self.ucwords(`${self.$t(`${self.module}.add`)}`),
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
                  'justify-evenly': true,
                  'q-gutter-sm': true
                }
              },
              [
                self.createInput(createElement, self.config, self)
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
<style lang="stylus" scoped>
  .my-card
    @media (min-width: $breakpoint-xs-min)
      min-width : 280px;

    @media (min-width: $breakpoint-sm-min)
      min-width : 450px;
    @media (max-width: $breakpoint-sm-max)
      max-width : 450px;

    @media (min-width: $breakpoint-md-min)
      min-width : 450px
    @media (max-width: $breakpoint-md-max)
      max-width : 450px;

    @media (min-width: $breakpoint-lg-min)
      min-width : 450px;
    @media (max-width: $breakpoint-lg-max)
      max-width : 450px;

    @media (min-width: $breakpoint-xl-min)
      min-width : 450px;
    @media (max-width: $breakpoint-xl-max)
      max-width : 450px;
</style>
