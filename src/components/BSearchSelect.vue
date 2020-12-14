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
          <q-item-label v-html="scope.opt.label" />
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
      console.log(this.valueSelect)
      this.valueSelect = this.value
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
        element.description = element[this.dataDescription]
        element.icon = element[this.dataIcon]
        return element
      })
    }
  },
  methods: {
    /**
     * Event input
     * @type {Object} data input selected
     */
    input (data) {
      this.$emit('input', data)
    },
    /**
     * Event input
     * @type {Object} data input selected
     */
    select (data) {
      this.valueSelect = data
      this.$emit('select', data)
    }
  }
}
</script>
