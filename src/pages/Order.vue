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
          @viewProduct="viewProduct"
        />
      </div>
    </div>
    <q-dialog v-model="viewProductModal">
      <q-card v-if="orderSelected" style="width: 700px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Productos / {{ orderSelected.client.full_name }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            row-key="name"
            wrap-cells
            virtual-scroll
            :data="orderSelected.order_details"
            :columns="columns"
            :filter="productFilter"
          >
            <template v-slot:top>
              <q-space />
              <q-input dense debounce="300" color="primary" v-model="productFilter">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cerrar" size="md" @click="viewProductModal = false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      orderSelected: null,
      productFilter: '',
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
        {
          name: 'cpd',
          align: 'left',
          label: 'C-P-D',
          field: row => `${row.product.brand.name}-${row.product.code}-${row.product.supsec}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: 'Descripción',
          field: row => row.product.description,
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          sortable: true
        },
        {
          name: 'purchase_price',
          label: 'Precio de compra',
          field: 'purchase_price',
          sortable: true
        }
      ],
      viewProductModal: false,
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
    viewProduct (data) {
      this.viewProductModal = true
      this.orderSelected = data
    },
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
