<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
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
          module="kardexValued"
          :column="kardexValuedConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @viewStock="viewStock"
        />
      </div>
      <q-dialog v-model="stockDialog">
        <q-card v-if="kardexSelected">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">
              {{ kardexSelected.brand.name }} - {{ kardexSelected.code }} - {{ kardexSelected.supsec }} / {{ kardexSelected.description }}
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-markup-table>
              <thead>
                <tr class="text-left">
                  <th colspan="4">
                    <span class="text-h6">
                      Stock
                    </span>
                  </th>
                </tr>
                <tr>
                  <th class="text-left">Almacen</th>
                  <th class="text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="kardexSelected.stock.length <= 0">
                  <td class="text-center" colspan="4">Producto sin stock</td>
                </tr>
                <tr v-else v-for="stockOne in kardexSelected.stock" :key="stockOne.id">
                  <td class="text-left">{{ stockOne.warehouse_name }}</td>
                  <td class="text-right">{{ stockOne.stock_product }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { kardexValuedConfig } from '../config-file/kardexValueds/kardexValued.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      stockDialog: false,
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
      kardexValuedSelected: null,
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
          'kardexValued_reason.name': '',
          observation: '',
          created_at: ''
        }
      },
      text: '',
      kardexValuedConfig,
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false,
      kardexSelected: null
    }
  },
  created () {
    this.getInventoryReports()
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
      this.params.sortkardexValued = data.sortkardexValued
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
    },
    modelProduct (products) {
      const modelProduct = []
      products.forEach(product => {
        product.stock.filter(stock => {
          const inventory = { ...product }
          inventory.stock_product = stock.stock_product
          inventory.description = product.description
          inventory.warehouse_id = stock.warehouse_id
          inventory.sale_price = stock.sale_price
          inventory.purchase_price = stock.purchase_price
          modelProduct.push(inventory)
        })
      })
      return modelProduct
    },
    /**
     * View stock product
     * @param {Object} data data product
     */
    viewStock (data) {
      this.kardexSelected = data
      this.stockDialog = true
    },
    /**
     * Get Bill electronis
     */
    getInventoryReports () {
      this.loadingTable = true
      this.$services.getData(['products'], this.params)
        .then(({ res }) => {
          this.data = this.modelProduct(res.data.data)
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
