<template>
  <q-input
    v-model="valueProp"
    :error-message="errorMessageProp"
    :label="label"
    :type="type"
    :error="error"
    @input="input"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
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
