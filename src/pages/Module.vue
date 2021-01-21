<template>
  <q-page class="flex-start q-pa-md">
    <div align="right">
      <q-btn color="primary"
        icon="add"
        glossy
        dense
        size="12px"
        label="Agregar Modulo"
        @click="addModule = true" />
    </div>
    <div class="row q-mt-md">
      <DataTable module="modules"
        title="listModule"
        :loading="loading"
        :column="moduleConfig"
        :data="modules"
        :optionPagination="pagination"
        @on-load-data="sortingTable"
        @search-data="eventSearch" />
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
      addModule: false,
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
        rowsPerPage: 25,
        search: {}
        // rowsNumber: xx if getting data from a server
      },
      /**
       * Paramaters for search
       * @type {Array}
       */
      search: {
        name: '',
        route: ''
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
    getModules (params) {
      this.loading = true
      this.$mockData.getData('modules')
        .then(({ response }) => {
          this.modules = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getModules(data)
    },
    /**
     * eventSearch searches data in microservices
     * @param  {String} data data search
     */
    eventSearch (data) {
      for (const field in this.search) {
        this.search[field] = data
      }
      this.pagination.page = 1
      this.pagination.search = this.search
      this.getModules(this.pagination)
    }
  }
}
</script>
