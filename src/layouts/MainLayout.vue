<template>
  <LayoutComponent
    titleApp="Menu Bais"
    titleMenu="Opciones"
    :data="modules"
    @logout="logout"
  />
</template>

<script>

import LayoutComponent from 'components/LayoutComponent.vue'

import { mapActions } from 'vuex'
import { ACTIONS } from '../store/module-login/name.js'
import { CLOSE_BOX_CUT } from '../Graphql/BoxCut/boxCutMutations'
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
     */
    getAllModules () {
      this.$mockData.getData('category-modules')
        .then(({ response }) => {
          this.modules = response.data.content
        })
    },
    /**
     * Log out api
     */
    logout () {
      this[ACTIONS.LOGOUT]({ self: this })
      this.closeBox()
    },

    /**
     * Close box
     */
    async closeBox () {
      if (this.$q.sessionStorage.has('box_cut_id')) {
        await this.$apollo.mutate({
          mutation: CLOSE_BOX_CUT,
          variables: {
            id: this.$q.sessionStorage.getItem('box_cut_id')
          }
        })
      }
      this.$q.sessionStorage.clear()
    },
    ...mapActions([ACTIONS.LOGOUT])
  }
}
</script>
