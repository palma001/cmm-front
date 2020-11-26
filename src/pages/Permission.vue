<template>
  <q-page class="flex-start q-pa-md">
        <div align="right">
      <q-btn color="primary" glossy  size="12px" label="Agragar Modulo" />
    </div>
    <div class="row q-mt-md">
      <DataTable
        module="permissions"
        title="listPermission"
        :loading="loading"
        :column="permissionConfig"
        :data="permissions"
        :optionPagination="pagination"
        @on-load-data="sortingTable"
        @search-data="eventSearch"
      />
    </div>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { permissionConfig } from '../config-file/permission/permissionConfig'
import { mixins } from '../mixins'
export default {
  name: 'Permission',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      /**
       * Config module
       * @type {Array} config module
       */
      permissionConfig: permissionConfig,
      /**
       * All Permissions
       * @type {Array} Permissions
       */
      permissions: [],
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
    this.getPermissions()
  },
  methods: {
    /**
     * Get Permissions
     *
     */
    getPermissions (params) {
      this.loading = true
      this.$mockData.getData('permissions')
        .then(({ response }) => {
          this.permissions = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getPermissions(data)
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
      this.getPermissions(this.pagination)
    }
  }
}
</script>
