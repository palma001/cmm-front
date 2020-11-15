<template>
  <q-page class="flex-start q-pa-md">
    <div class="row">
      <DataTable
        module="business"
        title="listBusiness"
        :loading="loading"
        :column="businessConfig"
        :data="business"
        :optionPagination="pagination"
        @on-load-data="sortingTable"
        @search-data="eventSearch"
      />
    </div>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { businessConfig } from '../config-file/business/businessConfig'
import { mixins } from '../mixins'
export default {
  name: 'Busines',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      /**
       * Config module
       * @type {Array} config module
       */
      businessConfig: businessConfig,
      /**
       * All Business
       * @type {Array} Business
       */
      business: [],
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
    this.getBusiness()
  },
  methods: {
    /**
     * Get Business
     *
     */
    getBusiness (params) {
      this.loading = true
      this.$mockData.getData('business')
        .then(({ response }) => {
          console.log(response)
          this.business = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getBusiness(data)
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
      this.getBusiness(this.pagination)
    }
  }
}
</script>
