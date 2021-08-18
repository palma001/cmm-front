<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="agregar pedido"
          @click="$router.push({ name: 'NewOrder' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="order"
          searchable
          :column="orderConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @search-data="searchData"
          @options="options"
          @createBill="createBill"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { orderConfig } from '../config-file/order/orderConfig.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      loadingTable: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 1,
        dataSearch: {
          'client.name': '',
          'client.document_number': '',
          'coin.name': '',
          'seller.name': '',
          'client.last_name': '',
          'seller.last_name': '',
          created_at: '',
          expiration_date: ''
        }
      },
      text: '',
      orderConfig,
      visibleColumns: ['id', 'soap', 'dateEmission', 'dateExp', 'client', 'number', 'noteCd', 'state', 'user', 'coin', 'tGravado', 'tExportacion', 'tGratuita', 'tInafecta', 'tExonerado', 'tGravado', 'tIgv', 'total', 'saldo', 'ordenCompra', 'paid', 'downloads', 'actions'],
      data: [],
      dense: false
    }
  },
  created () {
    this.getBillElectronics()
  },
  methods: {
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getBillElectronics(this.params)
    },
    options (data) {
      console.log(data, 'options')
    },
    createBill (data) {
      this.$router.push({
        name: 'BillingParam',
        params: {
          module: 'orders',
          id: data.id
        }
      })
    },
    open (position) {
      this.position = position
      this.dialog = true
    },
    /**
     * Search category
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getBillElectronics()
    },
    /**
     * Get Bill electronis
     */
    getBillElectronics () {
      this.loadingTable = true
      this.$services.getData(['orders'], this.params)
        .then(({ res }) => {
          this.data = res.data.data
          this.loadingTable = false
          this.optionPagination.rowsNumber = res.data.total
        })
        .catch(err => {
          console.log(err)
          this.data = []
          this.loadingTable = false
          this.optionPagination.rowsNumber = 0
        })
    }
  }
}
</script>
