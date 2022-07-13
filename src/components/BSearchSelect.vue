<template>
  <q-select
    v-model="valueSelect"
    :use-input="useInput"
    :filled="filled"
    :label="label"
    :behavior="behavior"
    :options="dataOptions"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable"
    :multiple="multiple"
    :option-label="dataLabel"
    :option-value="dataValue"
    :options-selected-class="optionsSelectedClass"
    :input-debounce="inputDebounce"
    :error-message="errorMessageProp"
    :error="error"
    :use-chips="useChips"
    :max-values="maxValue"
    :disable="disable"
    :readonly="readonly"
    @filter="filter"
    @input="input"
    @select="select"
  >
   <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar v-if="scope.opt.icon">
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt[dataLabel]" />
          <q-item-label caption v-if="scope.opt.description">
            {{ scope.opt.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('template.noResults') }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'BSearchSelect',
  props: {
    errorMessage: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      require: false,
      default: ''
    },
    value: {
      type: [String, Object, Number, Array]
    },
    data: {
      type: Array,
      require: true
    },
    filled: {
      type: Boolean,
      default: false
    },
    useInput: {
      type: Boolean,
      default: true
    },
    behavior: {
      type: String
    },
    dense: {
      type: Boolean,
      default: false
    },
    inputDebounce: {
      type: String,
      default: '0'
    },
    outlined: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    optionsSelectedClass: {
      type: String,
      default: 'text-deep-primary'
    },
    dataLabel: {
      type: String,
      default: 'label'
    },
    dataValue: {
      type: String,
      default: 'value'
    },
    dataDescription: {
      type: String
    },
    dataIcon: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    useChips: {
      type: Boolean,
      default: false
    },
    maxValue: {
      type: [String, Number],
      default: 5
    },
    services: {
      type: Array
    },
    queryParams: {
      type: Object
    },
    sync: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valueSelect: null,
      errorMessageProp: '',
      dataFilter: []
    }
  },
  created () {
    this.valueSelect = this.value
  },
  watch: {
    value () {
      this.valueSelect = this.value
    },
    errorMessage () {
      this.errorMessageProp = this.errorMessage
    }
  },
  computed: {
    dataOptions () {
      return this.dataFilter
    }
  },
  methods: {
    // setModelSelect (data) {
    //   if (data) {
    //     if (!Array.isArray(data)) {
    //       return {
    //         label: data[this.dataLabel],
    //         value: data[this.dataValue],
    //         description: data[this.dataDescription],
    //         icon: data[this.dataIcon]
    //       }
    //     } else if (Array.isArray(data) && !this.multiple) {
    //       return this.setModelSelect(data[0])
    //     } else {
    //       return data.map(d => {
    //         return this.setModelSelect(d)
    //       })
    //     }
    //   }
    // },
    /**
     * Event input
     * @type {Object} data input selected
     */
    input (data) {
      data.value = data[this.dataValue]
      this.$emit('input', data)
    },
    /**
     * Event input
     * @type {Object} data input selected
     */
    select (data) {
      this.valueSelect = data
      data.value = data[this.dataValue]
      this.$emit('select', data)
    },
    modelFilter (data, value) {
      const model = {}
      for (const param in data) {
        if (data[param]) {
          model[param] = value
        }
        model[param] = value
      }
      return model
    },
    /**
     * Filter input
     * @param  {Object}
     * @param  {Function}
     */
    filter (val, update) {
      console.log(this.services)
      if (this.sync) {
        this.$services.getData(this.services, {
          ...this.queryParams,
          dataSearch: this.modelFilter(this.queryParams.search, val)
        })
          .then(({ res }) => {
            update(() => {
              this.dataFilter = res.data.data ?? res.data
            })
          })
      } else {
        update(() => {
          const needle = val.toLowerCase()
          this.dataFilter = this.data.filter(v => {
            if (v[this.dataLabel]) {
              return v[this.dataLabel].toLowerCase().indexOf(needle) > -1
            }
          })
        })
      }
    }
  }
}
</script>
