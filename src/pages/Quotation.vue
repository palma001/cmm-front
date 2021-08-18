<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="Agregar cotización"
          @click="$router.push({ name: 'NewQuotation' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="quotation"
          searchable
          :column="quotationConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @search-data="searchData"
          @createBill="createBill"
          @options="options"
        />
      </div>
    </div>
    <div class="q-pa-md">
      <!-- <q-btn label="Filtro de Búsquedas" icon="keyboard_arrow_right" color="primary" @click="open('right')" />
      <q-dialog v-model="dialog" :position="position" seamless>
        <q-card class="column full-height" style="width: 450px">
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar>

            <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section class="col scroll">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select outlined v-model="voucherType" :options="voucherTypes" label="Tipo de comprobante" dense />
                </div>
                <div class="col-6">
                  <q-select outlined v-model="serie" :options="series" label="Serie" dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-input outlined v-model="text" label="Número" dense/>
                </div>
                <div class="col-6">
                  <q-select outlined v-model="client" :options="clients" label="Clientes" dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha inicio" dense/>
                </div>
                <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha término" dense/>
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-select outlined v-model="product" :options="products" label="Productos" dense />
              </div>
              <div class="col-6">
                  <q-select outlined v-model="category" :options="categories" label="Categoria" dense />
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha de emisión" dense />
                </div>
                <div class="col-6">
                  <q-select rounded v-model="state" :options="states" label="Estado"  dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-input outlined v-model="text" label="Orden de compra" dense/>
              </div>
              <div class="col-6">
                <q-toggle v-model="dense" label="Pendiente de pago" />
              </div>
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-actions align="center">
            <q-btn color="primary" icon="search" label="Buscar" no-caps glossy/>
            <q-btn color="primary" icon="highlight_off" label="Limpiar" no-caps glossy/>
          </q-card-actions>
        </q-card>
      </q-dialog> -->
    </div>
  </q-page>
</template>

<script>
import { quotationConfig } from '../config-file/quotation/quotationConfig.js'
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
          created_at: ''
        }
      },
      text: '',
      quotationConfig,
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
      * @param {Object} data quotation selected
      */
    createBill (data) {
      this.$router.push({
        name: 'BillingParam',
        params: {
          module: 'quotations',
          id: data.id
        }
      })
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortquotation = data.sortquotation
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
      this.$services.getData(['quotations'], this.params)
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
