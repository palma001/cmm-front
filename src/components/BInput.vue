<template>
  <q-input
    v-model="valueProp"
    :error-message="errorMessageProp"
    :label="label"
    :type="type"
    :error="error"
    :filled="filled"
    :rounded="rounded"
    :standout="standout"
    :outlined="outlined"
    :dense="dense"
    @input="input"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object],
      required: true,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    error: {
      type: Boolean,
      default: false
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
    }
  }
}
</script>
