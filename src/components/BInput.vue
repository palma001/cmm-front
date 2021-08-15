<template>
  <q-input
    v-model="valueProp"
    :error-message="errorMessageProp"
    :error="error"
    :label="label"
    :type="type"
    :filled="filled"
    :rounded="rounded"
    :standout="standout"
    :outlined="outlined"
    :dense="dense"
    :disable="disable"
    :readonly="readonly"
    @input="input"
    @blur="blur"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object, Number],
      required: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    rounded: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    standout: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      valueProp: '',
      errorMessageProp: ''
    }
  },
  created () {
    this.valueProp = this.value
  },
  watch: {
    value () {
      this.valueProp = this.value
    },
    errorMessage () {
      this.errorMessageProp = this.errorMessage
    }
  },
  methods: {
    input (value) {
      this.$emit('input', value)
    },
    blur (value) {
      this.$emit('blur', this.valueProp)
    }
  }
}
</script>
