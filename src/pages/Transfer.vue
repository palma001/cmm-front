<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="Agregar traslado"
          @click="$router.push({ name: 'NewTransfer' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="transfer"
          searchable
          :column="transferConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @search-data="searchData"
          @viewProducts="viewProducts"
          @options="options"
        />
      </div>
    </div>
    <q-dialog v-model="viewProductModal">
      <q-card v-if="transferSelected" style="width: 400px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Detalles del traslado
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
              row-key="name"
              wrap-cells
              virtual-scroll
              :data="transferSelected.transfer_details"
              :columns="columns"
              :rows-per-page-options="[]"
              hide-bottom
            />
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
import { transferConfig } from '../config-file/transfer/transferConfig.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
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
        }
      ],
      transferSelected: null,
      viewProductModal: null,
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
          'to_warehouse.description': '',
          'from_warehouse.description': '',
          created_at: ''
        }
      },
      text: '',
      transferConfig,
      visibleColumns: ['id', 'soap', 'dateEmission', 'dateExp', 'client', 'number', 'noteCd', 'state', 'user', 'coin', 'tGravado', 'tExportacion', 'tGratuita', 'tInafecta', 'tExonerado', 'tGravado', 'tIgv', 'total', 'saldo', 'ordenCompra', 'paid', 'downloads', 'actions'],
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false,
      voucherType: '',
      serie: '',
      client: '',
      product: '',
      category: '',
      state: '',
      filter: '',
      voucherTypes: [
        'Factura electrónica', 'Boleta de venta electrónica', 'Nota de credito', 'Nota de débito'
      ],
      series: [
        'Serie 1', 'Serie 2', 'Serie 3', 'Serie 4'
      ],
      clients: [
        '26.545.123 - Luis Salazar', '12.548.125 - Carlos Gonzaléz', '4.521.983 - Samantha Rodríguez', '12.256.123 - Carlos Alcala'
      ],
      products: [
        '0001 - Harina de trigo', '0002  - Arroz', '0003 - Harina de maíz', '0005 - Leche'
      ],
      categories: [
        'Alimentos', 'Cerraduras', 'HP', 'Pinturas'
      ],
      states: [
        'Registrado', 'Enviado', 'Aceptado', 'Observado', 'Rechazado', 'Anulado', 'Por anular'
      ]
    }
  },
  created () {
    this.getBillElectronics()
  },
  methods: {
    /**
      * Get billing
      * @param {Object} data transfer selected
      */
    viewProducts (data) {
      this.viewProductModal = true
      this.transferSelected = data
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sorttransfer = data.sorttransfer
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getBillElectronics(this.params)
    },
    options (data) {
      console.log(data, 'options')
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
      this.$services.getData(['transfers'], this.params)
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
