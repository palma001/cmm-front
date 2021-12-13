<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
        <q-select
          use-input
          hide-selected
          fill-input
          outlined
          clearable
          dense
          autocomplete="off"
          input-debounce="0"
          name="product"
          ref="productRef"
          v-model="product"
          data-vv-as="field"
          option-value="id"
          option-label="full_name"
          :label="value ? 'C-P-D' : 'Productos'"
          :options="products"
          :rules="[ val => val || 'Este campo es requerido' ]"
          @filter="filterProducts"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:append>
            <q-toggle
              v-model="value"
              color="primary"
              dense
            >
              <q-tooltip>
                Activar filtro por CPD
              </q-tooltip>
            </q-toggle>
          </template>
        </q-select>
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
        <q-input
          type="date"
          outlined
          dense
          v-model="from"
          hint="Fecha inicio"
        />
      </div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
        <q-input
          type="date"
          outlined
          dense
          v-model="to"
          hint="Fecha término"
        />
      </div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
        <q-btn icon="search" color="primary" @click="filterReport"/>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="kardexReport"
          :column="kardexReportConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { kardexReportConfig } from '../config-file/kardexReport/kardexReportConfig.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      product: null,
      value: false,
      products: [],
      from: '2021/12/20',
      to: null,
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
      kardexReportSelected: null,
      viewProductModal: null,
      loadingTable: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 0,
        rowsNumber: 0,
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
        filterReports: true,
        dataSearch: {
          'user.name': '',
          'user.last_name': '',
          'kardexReport_reason.name': '',
          observation: '',
          created_at: ''
        }
      },
      text: '',
      kardexReportConfig,
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false
    }
  },
  methods: {
    filterReport () {
      this.params.product_id = this.product.id
      this.params.dateFilter = {
        from: this.from,
        to: this.to,
        field: 'created_at'
      }
      this.getKardexReports()
    },
    /**
     * Filter primary
     */
    filterPrimary (value, update) {
      const valeArray = value.split('-')
      const param = {
        filterProduct: {
          code: valeArray[1],
          'brand.name': valeArray[0],
          supsec: valeArray[2]
        }
      }
      this.getProducts(param, update)
    },
    /**
     * Filter Products
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterProducts (value, update) {
      if (this.value) {
        this.filterPrimary(value, update)
      } else {
        const param = {
          dataSearch: {
            description: value,
            code: value
          }
        }
        this.getProducts(param, update)
      }
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getProducts (value, update) {
      this.$services.getData(['products'], {
        ...value,
        paginate: true,
        perPage: 10
      })
        .then(({ res }) => {
          update(() => {
            this.products = res.data.data
          })
        })
    },
    /**
      * Get billing
      * @param {Object} data kardexReport selected
      */
    viewProducts (data) {
      this.viewProductModal = true
      this.kardexReportSelected = data
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortkardexReport = data.sortkardexReport
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getKardexReports(this.params)
    },
    options (data) {
      console.log(data, 'options')
    },
    open (position) {
      this.position = position
      this.dialog = true
    },
    /**
     * Get Bill electronis
     */
    getKardexReports () {
      this.loadingTable = true
      this.$services.getData(['kardex-reports'], this.params)
        .then(({ res }) => {
          this.data = res.data
          this.loadingTable = false
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
