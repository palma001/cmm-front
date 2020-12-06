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
    :options-selected-class="optionsSelectedClass"
    :input-debounce="inputDebounce"
    :error-message="errorMessageProp"
    :error="error"
    :use-chips="useChips"
    @input="input"
    @filter="filterFn"
  >
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
    label: {
      type: String
    },
    value: {
      type: [String, Object]
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
    }
  },
  data () {
    return {
      valueSelect: null,
      errorMessageProp: ''
    }
  },
  watch: {
    value () {
      this.valueSelect = this.value
      console.log(this.valueSelect)
    },
    errorMessage () {
      this.errorMessageProp = this.errorMessage
    }
  },
  computed: {
    dataOptions () {
      return this.data.map(element => {
        element.label = element[this.dataLabel]
        element.value = element[this.dataValue]
        element.description = [this.dataDescription]
        element.icon = element[this.dataIcon]
        return element
      })
    }
  },
  methods: {
    /**
     * Event fiter data
     * @type {String} value filter
     * @type {callback} function callback
     */
    filterFn (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        this.dataOptions.filter(v => {
          return v.label.toLowerCase().indexOf(needle) > -1
        })
      })
    },
    /**
     * Event input
     * @type {Object} data input selected
     */
    input (data) {
      this.$emit('input', data)
    }
  }
}
</script>
