<template>
  <q-page class="flex-start q-pa-md">
      <div align="right">
      <q-btn color="primary" glossy  size="12px" label="Agragar Modulo" />
    </div>
    <div class="row q-mt-md">
      <DataTable
        module="branch-offices"
        title="listBranchOffice"
        :loading="loading"
        :column="branchOfficeConfig"
        :data="branchOffice"
        :optionPagination="pagination"
        @on-load-data="sortingTable"
        @search-data="eventSearch"
      />
    </div>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { branchOfficeConfig } from '../config-file/branchOffice/branchOfficeConfig'
import { mixins } from '../mixins'
export default {
  name: 'BranchOffice',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      /**
       * Config module
       * @type {Array} config module
       */
      branchOfficeConfig: branchOfficeConfig,
      /**
       * All BranchOffice
       * @type {Array} BranchOffice
       */
      branchOffice: [],
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
    this.getBranchOffice()
  },
  methods: {
    /**
     * Get BranchOffice
     *
     */
    getBranchOffice (params) {
      this.loading = true
      this.$mockData.getData('branch-offices')
        .then(({ response }) => {
          console.log(response)
          this.branchOffice = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getBranchOffice(data)
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
      this.getBranchOffice(this.pagination)
    }
  }
}
</script>
