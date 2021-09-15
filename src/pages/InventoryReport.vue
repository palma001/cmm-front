<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <q-select
          use-input
          hide-selected
          fill-input
          outlined
          clearable
          dense
          autocomplete="off"
          input-debounce="0"
          name="warehouse"
          ref="warehouseRef"
          v-model="warehouse"
          data-vv-as="field"
          option-value="id"
          option-label="description"
          label="Almacén"
          :options="warehouses"
          :rules="[ val => val || 'Este campo es requerido' ]"
          @filter="getWareHouses"
          @input="getInventoryReports"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
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
      </div> -->
      <div class="col-12">
        <data-table
          title="list"
          module="inventoryReport"
          :column="inventoryReportConfig"
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
import { inventoryReportConfig } from '../config-file/inventoryReport/inventoryReport.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      warehouse: null,
      value: false,
      warehouses: [],
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
          field: row => row.warehouse.description,
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          sortable: true
        }
      ],
      inventoryReportSelected: null,
      viewProductModal: null,
      loadingTable: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 100,
        rowsNumber: 100,
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
          'user.name': '',
          'user.last_name': '',
          'inventoryReport_reason.name': '',
          observation: '',
          created_at: ''
        }
      },
      text: '',
      inventoryReportConfig,
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false
    }
  },
  methods: {
    /**
     * Get warehouses
     * @param {String} value data filter
     */
    getWareHouses (value, update) {
      this.$services.getData(['warehouses'], {
        dataSearch: {
          description: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.warehouses = res.data.data
          })
        })
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortinventoryReport = data.sortinventoryReport
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
    },
    modelProduct (products) {
      const modelProduct = []
      products.forEach(product => {
        product.stock.filter(stock => {
          return this.warehouse.id === stock.warehouse_id || this.warehouse === null
        })
          .forEach(stock => {
            product.stock_product = stock.stock_product
            product.warehouse_name = stock.warehouse_name
            product.warehouse_id = stock.warehouse_id
            product.sale_price = stock.sale_price
            product.purchase_price = stock.purchase_price
            modelProduct.push(product)
          })
      })
      return modelProduct
    },
    /**
     * Get Bill electronis
     */
    getInventoryReports () {
      this.loadingTable = true
      this.$services.getData(['products'], this.params)
        .then(({ res }) => {
          this.data = this.modelProduct(res.data.data)
          console.log(this.data)
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
