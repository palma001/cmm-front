<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <!-- <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <q-select
          use-input
          hide-selected
          fill-input
          outlined
          clearable
          dense
          autocomplete="off"
          input-debounce="0"
          name="movement"
          ref="movementRef"
          v-model="movement"
          data-vv-as="field"
          option-value="id"
          option-label="description"
          label="movement"
          :options="movements"
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
      </div> -->
      <div class="col-12">
        <data-table
          title="list"
          module="movement"
          :column="movementConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @translate="translate"
        />
      </div>
      <q-dialog v-model="alert">
        <q-card style="width: 800px;">
          <q-card-section>
            <div class="text-h6">Trasladar</div>
          </q-card-section>

          <q-card-section class="q-pt-none row q-col-gutter-sm">
            <div class="col-8">
              <q-input outlined dense v-model="productSelected.description" label="Producto" readonly/>
            </div>
            <div class="col-4">
              <q-input outlined dense v-model="productSelected.stock_product" label="Cantidad Actual" readonly/>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none row q-col-gutter-sm">
            <div class="col-8">
              <q-input outlined dense v-model="productSelected.warehouse_name" label="Almacen inicial" readonly/>
            </div>
            <div class="col-4">
              <q-input outlined dense v-model="productSelected.amuntTransfer" label="Cantidad a trasladar"/>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none row q-col-gutter-sm">
            <div class="col-8">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="fromWarehouse"
                v-model="warehouse"
                option-label="full_name"
                option-value="id"
                :label="ucwords($t('transfer.toWarehouse'))"
                :options="warehouses"
                @filter="getWareHouses"
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
            <div class="col-4">
              <q-input outlined dense v-model="reason" label="Motivo"/>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn flat label="Trasladar" color="primary" @click="saveTranfer" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { movementConfig } from '../config-file/movement/movement.js'
import { mixins } from '../mixins'
import { date } from 'quasar'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      reason: null,
      warehouses: [],
      productSelected: {},
      warehouse: null,
      alert: false,
      movement: null,
      value: false,
      movements: [],
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
          field: row => row.movement.description,
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          sortable: true
        }
      ],
      movementSelected: null,
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
          'movement_reason.name': '',
          observation: '',
          created_at: ''
        }
      },
      text: '',
      movementConfig,
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false
    }
  },
  created () {
    this.getInventoryReports()
  },
  methods: {
    /**
     * Model bill
     */
    modelTransfer () {
      const billModel = {
        from_warehouse_id: this.transfer.fromWarehouse.id,
        to_warehouse_id: this.transfer.toWarehouse.id,
        transferDetails: this.dataProduct,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.transfer.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveTransfer(billModel)
    },
    saveTranfer () {

    },
    translate (data) {
      this.alert = true
      this.productSelected = data
    },
    /**
     * Get movements
     * @param {String} value data filter
     */
    getWareHouses (value, update) {
      this.$services.getData(['products'], {
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
      this.params.sortmovement = data.sortmovement
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
    },
    modelProduct (products) {
      const modelProduct = []
      products.forEach(product => {
        product.stock.forEach(stock => {
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
          console.log(res)
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
