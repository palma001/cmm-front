<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-mt-md">
      <DataTable module="clients"
        title="listClients"
        :loading="loading"
        :column="clientConfig"
        :data="clients"
        :optionPagination="pagination"
        :action="true"
        @request="sortingTable"
        @on-load-data="sortingTable"
        @search-data="eventSearch" />
    </div>
  </q-page>
</template>

<script>
import DataTable from 'components/DataTable.vue'
import { clientConfig } from '../config-file/client/clientConfig'
import { mixins } from '../mixins'
import { CheckingAccount } from '../Graphql/CheckingAccount/checkingAccountQueries'
export default {
  name: 'Client',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      loading: false,
      clients: [],
      clientConfig,
      /**
       * Option paginate
       * @type {Object} Option paginate
       */
      pagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 23
      }
    }
  },
  // created () {
  //   this.getClients(this.pagination)
  // },
  methods: {
    /**
     * All CLient
     */
    async getClients (params) {
      this.loading = true
      console.log(params)
      const variable = {
        filters: {
          empresa_id: 1,
          commonSearch: {
            rowsPerPage: params.rowsPerPage,
            sortBy: params.sortBy,
            sortOrder: params.descending ? 'desc' : 'asc',
            page: params.page,
            paginate: true
          }
        }
      }
      const { res } = await this.$gql.query(this, CheckingAccount, variable)
      this.clients = res.cuentaCorrientes
      this.pagination = params
      this.loading = false
    },
    /**
     * eventSearch searches data in microservices
     * @param  {String} data data search
     */
    eventSearch (data) {
      console.log(data)
      // for (const field in this.search) {
      //   this.search[field] = data
      // }
      // this.pagination.page = 1
      // this.pagination.search = this.search
      // this.getUsers(this.pagination)
    },
    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      // console.log(data)
      this.pagination = data.pagination ?? data
      this.getClients(this.pagination)
    }
  }
}
</script>
