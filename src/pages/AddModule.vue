<template>
  <div class="q-pa-md row items-start">
    <div class="text-h6 text-primary">
      Agragar Módulo
    </div>
    <div class="q-pa-md col-12">
      <div class="col-12">
        <q-input v-model="text"
          label="Registro 1"
          expanded/>
      </div>
      <div class="col-12">
        <q-input v-model="text"
          label="Registro 2"
          expanded/>
      </div>
      <div class="col-12">
        <q-input v-model="text"
          label="Registro 3"
          expanded/>
      </div>
      <div class="col-12">
        <q-input v-model="text"
          label="Registro 4"
          expanded/>
      </div>
      <div class="col-12">
        <q-input v-model="text"
          label="Registro 3"
          expanded/>
      </div>
      <div class="q-pa-md q-gutter-sm"
        align="center">
        <q-btn color="primary"
          glossy
          v-close-popup
          size="12px"
          label="Regrsar" />
        <q-btn color="primary"
          glossy
          size="12px"
          :loading="loading1"
          @click="simulateProgress(1)"
          label="Guardar" />
      </div>
    </div>

  </div>
</template>

<script>

export default {
  data () {
    return {
      loading1: false
    }
  },
  methods: {
    simulateProgress (number) {
      // we set loading state
      this[`loading${number}`] = true
      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        this[`loading${number}`] = false
      }, 3000)
    }
  }
}
</script>
