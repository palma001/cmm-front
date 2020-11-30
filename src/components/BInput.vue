<template>
  <q-input v-model="valueProp" :label="label" :type="type" @input="input"/>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      valueProp: ''
    }
  },
  watch: {
    value () {
      this.valueProp = this.value
    }
  },
  methods: {
    input (value) {
      this.$emit('input', value)
    }
  }
}
</script>
