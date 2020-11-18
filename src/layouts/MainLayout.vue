<template>
  <LayoutComponent
    titleApp="Menu Bais"
    titleMenu="Opciones"
    :data="modules"
  />
</template>

<script>

import LayoutComponent from 'components/LayoutComponent.vue'

export default {
  name: 'MainLayout',
  components: { LayoutComponent },

  data () {
    return {
      /**
       * Data menu
       *
       * @type {Array} data menu
       */
      modules: []
    }
  },

  created () {
    this.getAllModules()
  },

  methods: {
    /**
     * Get all products
     *
     */
    getAllModules () {
      this.$mockData.getData('category-modules')
        .then(({ response }) => {
          this.modules = response.data.content
        })
    }
  }
}
</script>
