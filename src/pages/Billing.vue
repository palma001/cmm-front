<template>
  <q-page padding @keyup.113="saveSale">
    <q-card class="my-card">
      <q-card-section class="q-pb-sm row q-col-gutter-sm">
        <div class="col-8">
          <div class="row justify-between">
            <div class="col-auto">
              <p class="text-h5">
                {{ ucwords($t('billing.newBilling')) }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-2">
          <q-input type="date" dense outlined label="Fec. Emisión" v-model="billing.created_at"/>
        </div>
        <div class="col-2">
          <q-input type="date" dense outlined label="Fec. Vencimiento" v-model="billing.expiration_date"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-pb-none">
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="operationType"
              ref="operationTypeRef"
              v-model="billing.operationType"
              v-validate="'required'"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              :label="ucwords($t('billing.typeOfSale'))"
              :options="operationTypes"
              :error-message="errorValidation('operationType')"
              :error="errors.has('operationType')"
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              input-debounce="0"
              name="voucherType"
              autocomplete="off"
              ref="voucherTypeRef"
              v-model="billing.voucherType"
              v-validate="'required'"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              :label="ucwords($t('billing.voucherType'))"
              :options="voucherTypes"
              :error-message="errorValidation('voucherType')"
              :error="errors.has('voucherType')"
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-select
              outlined
              v-model="coin"
              dense
              option-label="name"
              option-value="id"
              :label="ucwords($t('billing.coin'))"
              :options="coins"
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-input
              v-model="billing.exchange"
              outlined
              dense
              disable
              label="Cambio del dia"
              type="text"
            >
            </q-input>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Tipo de cambio del día, extraído de SUNAT
            </q-tooltip>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-py-none q-mt-xs">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-select
              autocomplete="off"
              use-input
              hide-selected
              fill-input
              dense
              outlined
              clearable
              input-debounce="20"
              name="client"
              v-model="billing.client"
              option-label="full_name"
              option-value="id"
              v-validate="'required'" data-vv-as="field"
              @filter="filterClients"
              :error-message="errorValidation('client')"
              :error="errors.has('client')"
              :label="ucwords($t('billing.cliente'))"
              :options="clients"
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
          <div class="col-auto">
            <q-btn
              icon="add"
              color="primary"
              label="Agregar producto"
              style="height: 40px;"
              @click="modalProduct = true"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row justify-between q-col-gutter-sm">
        <div class="q-pa-xs col-9">
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
                  <q-btn size="xs" color="negative" icon="close" @click="deleteProduct(props.row)"/>
                </q-td>
                <q-td key="description" :props="props">
                  {{ props.row.description }}
                </q-td>
                <q-td key="amount" :props="props">
                  {{ props.row.amount }}
                  <q-popup-edit v-model.number="props.row.amount">
                    <q-input type="number" v-model.number="props.row.amount" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="unitValue" :props="props">
                  {{ props.row.unitValue }}
                </q-td>
                <q-td key="opIgv" :props="props">
                  {{ props.row.opIgv }}
                </q-td>
                <q-td key="unitPrice" :props="props">
                  {{ props.row.unitPrice }}
                  <q-popup-edit v-model.number="props.row.unitPrice">
                    <q-input type="number" v-model.number="props.row.unitPrice" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="discount" :props="props">
                  {{ props.row.discount }}
                  <q-popup-edit v-model.number="props.row.discount">
                    <q-input type="number" v-model.number="props.row.discount" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="subtotal" :props="props">
                  {{ props.row.subtotal }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col-3">
          <q-list separator dense>
            <q-item clickable v-ripple>
              <q-item-section>OP.GRAVADA:</q-item-section>
              <q-item-section side>S/ {{ totalUnitValue }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>IGV:</q-item-section>
              <q-item-section side>S/ {{ igvTotal }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple active>
              <q-item-section>TOTAL A PAGAR:</q-item-section>
              <q-item-section side>S/ {{ totalSale }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="q-mt-xs">
                <q-select
                  label="Condición de pagos"
                  outlined
                  :options="paymentsCondition"
                  v-model="paymentCondition"
                  dense
                  @input="modalPaid = true"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="modalProduct"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Producto o Servicio</div>
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
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
              label="Productos"
              :options="products"
              @input="selectProuct"
              @filter="filterProducts"
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
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="igv"
              ref="igvRef"
              v-model="igv"
              v-validate="'required'"
              data-vv-as="field"
              label="Afectación igv"
              :options="igvs"
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
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Cantidad"
              type="number"
              dense
              outlined
              v-model="amount"
              @input="totalCalculateProduct"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Precio Unitario"
              type="number"
              dense
              outlined
              v-model="stock.sale_price"
              @input="totalCalculateProduct"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Total"
              type="number"
              dense
              disable
              outlined
              :value="totalProduct"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Agregar" color="primary" @click="setTable" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="modalPaid"
      persistent
    >
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section class="q-pb-sm">
          <div class="text-h6">Agregar pagos</div>
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-sm">
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
              name="paymentMethod"
              ref="paymentMethodRef"
              v-model="paymentMethod"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Método de pago"
              :options="paymentMethods"
              @filter="filterPaymentMethods"
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
              name="paymentDestination"
              ref="paymentDestinationRef"
              v-model="paymentDestination"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              label="Destino"
              :options="paymentDestinations"
              @filter="filterPaymentDestinations"
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
          <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <q-input label="Referencia" outlined dense/>
          </div>
          <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <q-input label="Monto" outlined dense/>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Generar Factura" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <b-confirm-alert
      color="negative"
      icon="close"
      :show="alertArching"
      :message="$t('arching.notFound')"
      @confirm="cancel"
      @cancel="cancel"
    /> -->
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
// import DynamicForm from '../components/DynamicForm'
// import BConfirmAlert from '../components/BConfirmAlert'
// import DataTable from '../components/DataTable'
import { billingConfig } from '../config-file/billing/billingConfig'
export default {
  name: 'Billing',
  mixins: [mixins.containerMixin],
  components: {
    // DynamicForm
    // BConfirmAlert,
    // DataTable
  },
  data () {
    return {
      igvs: [{
        label: 'Gravado - Operación Onerosa',
        value: 12
      }],
      igv: {
        label: 'Gravado - Operación Onerosa',
        value: 12
      },
      paymentsCondition: ['Crédito', 'Contado'],
      paymentCondition: null,
      modalProduct: false,
      loadingCLose: false,
      product: null,
      modalPaid: false,
      paymentMethod: null,
      paymentMethods: [],
      paymentDestination: null,
      paymentDestinations: [],
      /**
       * Status table billing
       * @type {Boolean} status table billing
       */
      visibleTableBilling: false,
      /**
       * Set billing data table
       * @type {Boolean} billing data table
       */
      dataTableBilling: [],
      /**
       * Config archive
       * @type {Array} Billing array
       */
      billingConfig,
      /**
       * Status dialog billing
       * @type {Boolean} status dialog
       */
      dialogBillingVisible: false,
      /**
       * Set status maximzed dialog
       * @type {Boolean} status maximzed dialog
       */
      maximizedToggle: true,
      /**
       * Get alert arching active
       * @type {Boolean} alert arching active
       */
      alertArching: false,
      /**
       * Get search billing
       * @type {Boolean} search billing
       */
      commonSearch: {
        rowsPerPage: 20,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      /**
       * Loading add cut box
       * @type {Boolean} status form
       */
      loadingAdd: false,
      /**
       * User Session
       * @type {Number} id user session
       */
      session_id: this.$store.state.login.id,
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
       * Width init splitter
       * @type {Number} % width init
       */
      splitterModel: 70, // start at 50%
      /**
       * Model paid sale
       * @type {Object} model paid sale
       */
      paidSale: {
        debito: null,
        credito: null,
        efectivo: null,
        porcentaje: null,
        montoPorcentaje: null
      },
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
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'unitValue',
          label: 'Valor Unitario',
          field: 'unitValue',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'opIgv',
          label: 'Igv',
          field: 'opIgv',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'unitPrice',
          label: 'Precio Unitario',
          field: 'unitPrice',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'discount',
          label: 'Descuento',
          field: 'discount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'subtotal',
          label: 'Subtotal',
          field: 'subtotal',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * Billing Model
       * @type {Object} billing model
       */
      billing: {
        client: null,
        dateBilling: null,
        voucherType: null,
        operationType: null,
        exchange: null,
        expiration_date: new Date(),
        created_at: new Date()
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      clients: [],
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
       * Price product
       * @type {Number} price product
       */
      priceOfSale: null,
      /**
       * Data product billing
       * @type {Array} data billing
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
      coin: null,
      /**
       * Inventories product selected
       * @type {Object} stock product selected
       */
      stock: {},
      totalProduct: 0,
      /**
       * Model details sales
       * @type {Array} model details sale
       */
      modelDetailsSale: [
        'amount',
        'discount',
        'detallable_type',
        'detallable_id',
        'price'
      ]
    }
  },
  created () {
    this.loadCreate()
  },
  methods: {
    totalCalculateProduct () {
      this.totalProduct = this.stock.sale_price * this.amount
    },
    /**
     * Selected product
     * @param {Object} value product selected
    */
    selectProuct (value) {
      if (value.stock.length > 0) {
        this.stock = value.stock[0]
        this.totalProduct = this.stock.sale_price * this.amount
      } else {
        this.stock = {}
        this.amount = 1
        this.totalProduct = 0
      }
    },
    getExchange () {
      this.$services.getData(['exchange-rate'], {
        start_date: date.formatDate(date.subtractFromDate(new Date(), { month: 1 }), 'DD/MM/YYYY'),
        final_date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        coin: 'PEN'
      })
        .then(({ res }) => {
          this.billing.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
        })
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getOpeationTypes()
      this.getVoucherTypes()
      this.getCoins()
      this.getClients()
      this.getExchange()
      this.getProducts()
      this.getPaymentMethods()
      this.getPaymentDestinations()
      // this.getCorteCaja(this.arching.id)
      // this.getCLients()
      // this.getProducts()
      // this.setRelationalData(this.boxCutServices, [], this)
    },
    /**
     * Cancel box cut
     * @param {Object} data form box cut
     */
    cancel (data) {
      this.$router.push({ name: 'products' })
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
      this.totalCalculate()
    },
    /**
     * Set data in table product
     * @param {Array} array list porduct
     */
    pushArray (array) {
      const percentage = this.getPercentage(this.stock.purchase_price, this.igv.value)
      const unitValue = this.stock.sale_price - percentage
      array.push({
        id: this.product.id,
        description: this.product.full_name,
        amount: this.amount,
        unitValue: isNaN(unitValue) ? 0 : unitValue,
        opIgv: isNaN(percentage) ? 0 : percentage,
        unitPrice: this.stock.sale_price,
        discount: this.discount,
        subtotal: this.totalProduct
      })
    },
    /**
     * Reset inputs billing
     */
    emptyInputBilling () {
      this.dataProduct = []
      this.billing.client = null
      this.billing.dateBilling = null
      this.billing.operationType = {
        label: 'Venta',
        value: 'venta'
      }
      this.stock = null
      this.amount = 1
      this.priceOfSale = null
      this.totalSale = 0
      this.paidSale = {
        debito: null,
        credito: null,
        efectivo: null
      }
      this.$refs.codigo.focus()
      setTimeout(() => {
        this.$validator.reset()
      }, 100)
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
      const validDate = data.filter((product) => product.id === index.id)
      return (validDate.length === 0) ? null : true
    },
    /**
     * Add product price in table
     * @param {Array} product table
     * @param {Object} index product table index
     */
    addAmountProduct (product, index) {
      product.map(product => {
        if (product.id === index.id) {
          product.amount = Number(product.amount) + Number(this.amount) ?? Number(product.amount)
          this.recalculate(product)
          return product
        }
      })
    },
    /**
     * Filter clients
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterClients (value, update) {
      update(() => {
        this.getClients(value)
      })
    },
    /**
     * All CLient
     */
    getClients (value) {
      this.$services.getData(['clients'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.clients = res.data.data
        })
    },
    /**
     * Filter Products
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterProducts (value, update) {
      update(() => {
        this.getProducts(value)
      })
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getProducts (value) {
      this.$services.getData(['products'], {
        dataSearch: {
          name: value,
          code: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.products = res.data
        })
    },
    /**
     * Filter psyment method
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterPaymentMethods (value, update) {
      update(() => {
        this.getPaymentMethods(value)
      })
    },
    /**
     * Get payment method
     * @param {String} value data filter
     */
    getPaymentMethods (value) {
      this.$services.getData(['payment-methods'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.paymentMethods = res.data.data
        })
    },
    /**
     * Filter payment destination
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterPaymentDestinations (value, update) {
      update(() => {
        this.getPaymentDestinations(value)
      })
    },
    /**
     * Get payment destination
     * @param {String} value data filter
     */
    getPaymentDestinations (value) {
      this.$services.getData(['payment-destinations'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.paymentDestinations = res.data.data
        })
    },
    /**
     * Get operation types
     */
    getOpeationTypes () {
      this.$services.getData(['operation-types'])
        .then(({ res }) => {
          this.operationTypes = res.data
          this.billing.operationType = res.data[0]
        })
    },
    /**
     * Get coins
     */
    getCoins () {
      this.$services.getData(['coins'], {
        sortField: 'id',
        sortOrder: 'desc'
      })
        .then(({ res }) => {
          this.coins = res.data
          this.coin = res.data[0]
        })
    },
    /**
     * Get voucher types
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'])
        .then(({ res }) => {
          this.voucherTypes = res.data
          this.billing.voucherType = res.data[0]
        })
    },
    /**
     * Delete product
     * @param {Object} data data product
     */
    deleteProduct (data) {
      this.dataProduct.map((product, index) => {
        if (product.id === data.id) {
          this.dataProduct.splice(index, 1)
        }
      })
      this.totalCalculate()
    },
    /**
     * Recalcute table subtotal
     */
    recalculate (data) {
      this.dataProduct.map(product => {
        if (product.id === data.id) {
          product.subtotal = (data.amount * data.unitPrice) - data.discount
          return product
        }
      })
      this.totalCalculate()
    },
    /**
     * Calculate billing total
     */
    totalCalculate () {
      let total = 0
      let igvTotal = 0
      let unitValue = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.subtotal)
        igvTotal = (Number(igvTotal) + (Number(element.opIgv) * Number(element.amount)))
        unitValue = (Number(unitValue) + (Number(element.unitValue) * Number(element.amount)))
      })
      this.igvTotal = igvTotal.toFixed(2)
      this.totalSale = total
      this.totalUnitValue = unitValue.toFixed(2)
    },
    /**
     * Get percentage
     * @param {Number} price price products
     * @param {Number} percentage percentage calculate
     * @returns {Number} percentage calculated
     */
    getPercentage (price, percentage) {
      return ((percentage / 100) * price).toFixed(2)
    }
  }
}
</script>
