<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="modelDevolution" ref="formTransfer">
      <q-card class="my-card">
        <q-card-section class="q-pb-sm row q-col-gutter-sm">
          <div class="col-8">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ ucwords($t('devolution.newDevolution')) }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-4">
            <q-input
              type="date"
              dense
              outlined
              label="Fec. Emisión"
              v-model="devolution.created_at"
            />
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="devolutionReason"
                v-model="devolution.devolutionReason"
                option-label="name"
                option-value="id"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :label="ucwords($t('devolution.devolutionReason'))"
                :options="devolutionReasons"
                @filter="getDevolutionReason"
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
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-input
                type="textarea"
                label="Observación"
                outlined
                dense
                rows="2"
                v-model="devolution.observation"
              />
            </div>
            <div class="col-auto q-gutter-sm">
              <q-btn
                icon="add"
                color="primary"
                label="producto"
                style="height: 40px;"
                @click="modalProduct = true"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="q-pa-xs col-12">
            <q-table
              row-key="name"
              wrap-cells
              virtual-scroll
              :data="dataProduct"
              :columns="columns"
              :rows-per-page-options="[50]"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-btn size="xs" color="negative" icon="close" @click="deleteProduct(props)"/>
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="description_warehouse" :props="props">
                    {{ props.row.description_warehouse }}
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                    <q-popup-edit v-model.number="props.row.amount" auto-save>
                      <q-input
                        type="number"
                        dense
                        autofocus
                        v-model.number="props.row.amount"
                        @input="recalculate(props.row)"
                      />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar devolución" @click="cancelBill"/>
          <q-btn color="primary" label="Generar devolución" type="submit" :disable="dataProduct.length <= 0"/>
        </q-card-actions>
      </q-card>
    </q-form>
    <q-dialog
      v-model="modalProduct"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-form @submit="setTable">
          <q-card-section>
            <div class="text-h6">Agregar Producto</div>
          </q-card-section>
          <q-card-section class="row justify-between q-col-gutter-x-sm q-pb-none">
            <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
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
            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
              <q-input
                label="Cantidad"
                type="number"
                dense
                outlined
                v-model="amount"
              />
            </div>
          </q-card-section>
          <q-card-section>
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
              ref="warehouse"
              v-model="warehouse"
              v-validate="'required'"
              data-vv-as="field"
              label="Almacen"
              option-value="id"
              option-label="full_name"
              :rules="[ val => val || 'Este campo es requerido' ]"
              :options="warehouses"
              @filter="getWarehouse"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="negative" v-close-popup />
            <q-btn label="Agregar" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  name: 'devolution',
  mixins: [mixins.containerMixin],
  data () {
    return {
      warehouses: [],
      devolutionReasons: [],
      warehouse: null,
      loadingForm: false,
      addDialig: false,
      documentNumber: null,
      lastName: null,
      name: null,
      businessName: null,
      documentType: null,
      documentTypes: [],
      value: false,
      description: null,
      tab: 'payments',
      igvs: [{ label: 'Gravado - Operación Onerosa', value: 12 }],
      igv: { label: 'Gravado - Operación Onerosa', value: 12 },
      modalProduct: false,
      loadingCLose: false,
      product: null,
      modalPaid: false,
      paymentMethod: null,
      paymentMethods: [],
      paymentDestination: null,
      paymentDestinations: [],
      payments: [],
      paymentAmount: 0,
      paymentReference: null,
      totalPaid: 0,
      /**
       * Visible loading page
       * @type {Boolean} status loading page
       */
      visible: false,
      /**
       * Total sale
       * @type {Number} total sale
       */
      totalSale: 0,
      igvTotal: 0,
      totalUnitValue: 0,
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
        {
          name: 'Opciones',
          headerClasses: 'bg-primary text-white',
          classes: 'bg-grey-2 ellipsis',
          align: 'left',
          label: 'Opciones',
          field: 'opciones'
        },
        {
          name: 'description',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Descripción',
          field: 'description',
          sortable: true
        },
        {
          name: 'description_warehouse',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Almacén',
          field: 'description_warehouse',
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * devolution Model
       * @type {Object} devolution model
       */
      devolution: {
        devolutionReason: null,
        voucherType: null,
        exchange: 0,
        expiration_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * Product List
       * @type {Array} Product List
       */
      products: [],
      /**
       * Amount product
       * @type {Number} amuntproduct
       */
      amount: 1,
      /**
       * Data product devolution
       * @type {Array} data devolution
       */
      dataProduct: [],
      /**
       * discount product
       * @type {Number} discount product
       */
      discount: 0,
      /**
       * Operation Type
       * @type {Array} Operation type
       */
      operationTypes: [],
      /**
       * Type of vouchers
       * @type {Array} type of vouchers
       */
      voucherTypes: [],
      /**
       * Coin list
       * @type {Array} Coin list
       */
      coins: [],
      /**
       * Coin change
       * @type {Object} coin value
       */
      coin: null,
      /**
       * Inventories product selected
       * @type {Object} stock product selected
       */
      stock: {},
      totalProduct: 0,
      userSession: null,
      branchOfficeSession: null,
      residenceCondition: null,
      status: null
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
    /**
     * Get payment destination
     * @param {String} value data filter
     */
    getWarehouse (value, update) {
      this.$services.getData(['warehouses'], {
        dataSearch: {
          name: value
        },
        dataFilter: {
          branch_office_id: this.branchOfficeSession.id
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
     * Model bill
     */
    modelDevolution () {
      const devolutionModel = {
        devolution_reason_id: this.devolution.devolutionReason.id,
        observation: this.devolution.observation,
        branch_office_id: this.branchOfficeSession.id,
        devolution_details: this.dataProduct,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.devolution.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveTransfer(devolutionModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveTransfer (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['devolutions'], data)
        .then(res => {
          this.notify(this, 'devolution.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'devolution.error', 'negative', 'warning')
          this.visible = false
        })
    },
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataProduct = []
      this.devolution = {}
      this.devolution.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.product = null
      this.amount = 1
      this.modalProduct = false
      this.resetValidations(this.$refs.formTransfer)
    },
    /**
     * Open dialog operation
     * @param {String} data name tab
     */
    openOptionDialog (data) {
      this.modalPaid = true
      this.paymentAmount = this.totalSale - this.totalPaid
    },
    /**
     * Delete payment
     * @param {Number} index indiex payment
     */
    deleteSelectedGuide (index) {
      this.guides.splice(index, 1)
    },
    /**
     * Delete payment
     * @param {Number} index indiex payment
     */
    deletePayment (index) {
      this.payments.splice(index, 1)
      this.totalPayemnts()
      this.paymentAmount = this.totalSale - this.totalPaid
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        ref.resetValidation()
      }, 100)
    },
    /**
     * Set Data in table
     * @param {Object} val value product
     */
    setTable () {
      if (this.validateArray(this.dataProduct, this.product)) {
        this.addAmountProduct(this.dataProduct, this.product)
      } else {
        this.pushArray(this.dataProduct, this.product)
      }
    },
    /**
     * Set data in table product
     * @param {Array} array list porduct
     */
    pushArray (array) {
      array.push({
        id: this.product.id,
        product_id: this.product.id,
        warehouse_id: this.warehouse.id,
        description: this.product.full_name,
        description_warehouse: this.warehouse.full_name,
        amount: this.amount,
        user_created_id: this.userSession.id
      })
    },
    /**
     * Print product error
     * @param {Number} code product code
     */
    errorSearch (code) {
      this.$q.notify({
        message: `(${code}) - ${this.ucwords(this.$t('template.errorSearchProduct'))}`,
        color: 'negative',
        position: 'top',
        icon: 'warning'
      })
    },
    /**
     * Format number less than ten
     * @param {Number} number number format
     * @return {Number} number formated
     */
    formatOnCero (number) {
      if (number < 10) {
        return `0${number}`
      }
      return number
    },
    /**
     * Validations the errors
     * @param  {String} propTag data fromulary
     * @return {String} errors
     */
    errorValidation (propTag) {
      if (this.errors.has(propTag)) {
        return this.errors.first(propTag)
      }
    },
    /**
     * Verify formulary error
     * * @return {String} errors
     */
    validateBeforeSubmit () {
      return this.$validator.validateAll()
        .then((result) => {
          return result
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * Validate array in product table
     * @param {Array} data the product table
     * @param {Object} index product table index
     */
    validateArray (data, index) {
      return data.find((product) => product.product_id === index.id)
    },
    /**
     * Add product price in table
     * @param {Array} product table
     * @param {Object} index product table index
     */
    addAmountProduct (product, index) {
      product.map(product => {
        if (product.product_id === index.id) {
          product.amount = Number(product.amount) + Number(this.amount) ?? Number(product.amount)
          return product
        }
      })
    },
    /**
     * All toWarehouse
     */
    getDevolutionReason (value, update) {
      this.$services.getData(['devolution-reasons'], {
        dataSearch: {
          description: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.devolutionReasons = res.data.data
          })
        })
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
      this.$services.getData(['select-products'], {
        ...value,
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.products = res.data.data
          })
        })
    },
    /**
     * Delete product
     * @param {Object} data data product
     */
    deleteProduct (data) {
      this.dataProduct.splice(data.rowIndex, 1)
    }
  }
}
</script>
