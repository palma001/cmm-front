<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="{ name: module.route }"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'Error404',
  data: () => {
    return {
      module: null
    }
  },
  created () {
    this.getModules()
  },
  methods: {
    getModules () {
      const role = JSON.parse(LocalStorage.getItem('roleSelected'))
      this.module = role.modules[0]
    }
  }
}
</script>
