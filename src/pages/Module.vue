<template>
  <q-page class="flex-start q-pa-md">
    <div class="row">
      <DataTable
        module="modules"
        title="listModule"
        :loading="loading"
        :column="moduleConfig"
        :data="modules"
        :optionPagination="pagination"
      />
    </div>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { moduleConfig } from '../config-file/module/moduleConfig'
import { mixins } from '../mixins'
export default {
  name: 'Module',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      /**
       * Config module
       * @type {Array} config module
       */
      moduleConfig: moduleConfig,
      /**
       * All modules
       * @type {Array} modules
       */
      modules: [],
      /**
       * Loading status
       * @type {Boolean} status
       */
      loading: false,
      /**
       * Option paginate
       * @type {Object} Option paginate
       */
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5
        // rowsNumber: xx if getting data from a server
      }
    }
  },
  created () {
    this.getModules()
  },
  methods: {
    /**
     * Get modules
     *
     */
    getModules () {
      this.loading = true
      this.$mockData.getData('modules')
        .then(({ response }) => {
          this.modules = response.data.content
          this.loading = false
        })
    }
  }
}
</script>
