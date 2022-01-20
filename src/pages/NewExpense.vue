<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="modelExpenseReason" ref="formexpense">
      <q-card class="my-card">
        <q-card-section class="q-pb-sm row q-col-gutter-sm">
          <div class="col-8">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ ucwords($t('expense.newExpense')) }}
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
              v-model="expense.created_at"
              @input="getExchange"
            />
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-pb-sm">
          <div class="row justify-between q-col-gutter-sm">
            <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
                v-model="voucherType"
                v-validate="'required'"
                data-vv-as="field"
                option-value="id"
                option-label="name"
                :label="ucwords($t('billing.voucher_type'))"
                :options="voucherTypes"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                @filter="filterVoucherType"
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
            <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-4">
              <q-select
                use-input
                hide-selected
                fill-input
                outlined
                clearable
                dense
                input-debounce="0"
                name="expenseReason"
                autocomplete="off"
                ref="expenseReasonRef"
                v-model="expense.expenseReason"
                v-validate="'required'"
                data-vv-as="field"
                option-value="id"
                option-label="name"
                :label="ucwords($t('expense.expenseReason'))"
                :options="expenseReasons"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
            <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
              <q-input
                v-model="expense.serie"
                outlined
                dense
                label="Serie"
                type="text"
                :rules="[ val => val && val.length || 'Este campo es requerido']"
              />
            </div>
            <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
              <q-input
                v-model="expense.number"
                outlined
                dense
                label="Numero"
                type="text"
                :rules="[ val => val && val.length || 'Este campo es requerido']"
              />
            </div>
            <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
              <q-select
                outlined
                v-model="coin"
                dense
                option-label="name"
                option-value="id"
                :label="ucwords($t('expense.coin'))"
                :options="coins"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
          </div>
        </q-card-section>
        <q-card-section :class="$q.screen.lt.md ? 'q-py-sm' : 'q-pt-none q-pb-sm'">
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
                name="provider"
                v-model="expense.provider"
                option-label="full_name"
                option-value="id"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :label="ucwords($t('expense.provider'))"
                :options="providers"
                @filter="getProviders"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialig = true"/>
                </template>
              </q-select>
            </div>
            <div class="col-xs-6 col-sm-2 col-md-3 col-lg-3 col-xl-3">
              <q-input
                v-model="expense.exchange"
                outlined
                dense
                readonly
                label="Cambio del dia"
                type="text"
              >
              </q-input>
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                Tipo de cambio del día, extraído de SUNAT
              </q-tooltip>
            </div>
            <div class="col-xs-6 col-sm-2 col-md-3 col-lg-3 col-xl-3">
              <q-select
                use-input
                hide-selected
                fill-input
                outlined
                clearable
                dense
                input-debounce="0"
                name="seatType"
                autocomplete="off"
                ref="seatTypeRef"
                v-model="seatType"
                v-validate="'required'"
                data-vv-as="field"
                option-value="id"
                option-label="description"
                :label="ucwords($t('expense.seatType'))"
                :options="seatTypes"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                @filter="getSeatTypes"
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
        <q-card-section :class="$q.screen.lt.md ? 'q-py-sm' : 'q-pt-none q-pb-sm'">
          <div class="row q-col-gutter-md">
            <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
              <q-input
                v-model="expense.comment"
                outlined
                dense
                label="Glosa"
                type="textarea"
                autogrow
                :rules="[ val => val && val.length || 'Este campo es requerido']"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="q-pa-xs col-xs-12 col-md-9 col-sm-12 col-lg-9">
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
                    <q-popup-edit v-model.number="props.row.description" auto-save>
                      <q-input
                        type="text"
                        dense
                        autofocus
                        v-model.number="props.row.description"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                    <q-popup-edit v-model.number="props.row.amount" auto-save>
                      <q-input
                        type="number"
                        dense
                        autofocus
                        v-model.number="props.row.amount"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }}
                    <q-popup-edit v-model.number="props.row.price" auto-save>
                      <q-input
                        type="number"
                        dense
                        autofocus
                        v-model.number="props.row.price"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="subtotal" :props="props">
                    {{ props.row.subtotal }}
                  </q-td>
                  <q-td key="igv" :props="props">
                    {{ props.row.igv }}
                  </q-td>
                  <q-td key="total" :props="props">
                    {{ props.row.total }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <q-list separator dense>
              <q-item clickable v-ripple active>
                <q-item-section>TOTAL A PAGAR:</q-item-section>
                <q-item-section side>S/ {{ totalSale }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar facturación" @click="cancelBill"/>
          <q-btn color="primary" label="Generar factura" type="submit" :disable="dataProduct.length <= 0"/>
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
            <div class="text-h6">Agregar Producto o Servicio</div>
          </q-card-section>
          <q-card-section class="row justify-between q-col-gutter-x-sm q-py-sm">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-input outlined type="text" v-model="product.description" dense label="Descripción"/>
            </div>
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <q-input outlined type="number" v-model="product.amount" dense label="Cantidad"/>
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-input outlined type="text" v-model="product.price" dense label="Precio"/>
            </div>
          </q-card-section>
          <q-card-section class="row justify-between q-col-gutter-x-sm q-py-sm">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-input outlined type="text" v-model="igv" dense label="% Igv"/>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="negative" v-close-popup />
            <q-btn label="Agregar" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialig"
    >
      <dynamic-form
        module="provider"
        :config="provider"
        :loading="loadingForm"
        @cancel="addDialig = false"
        @save="save"
      >
        <template v-slot:top>
          <q-select
            label="Tipo de documento"
            v-validate="'required'"
            data-vv-as="document_type"
            name="document_type"
            dense
            outlined
            option-label="name"
            option-value="id"
            v-model="documentType"
            :options="documentTypes"
            :error="errors.has('document_type')"
            :error-message="errors.first('document_type')"
          />
          <q-input
            label="Número de documento"
            v-validate="'required'"
            data-vv-as="document_number"
            name="document_number"
            dense
            outlined
            v-model="documentNumber"
            :error="errors.has('document_number')"
            :error-message="errors.first('document_number')"
            @blur="getDataApi"
          />
          <q-input
            label="Nombre"
            v-validate="'required'"
            data-vv-as="name"
            name="name"
            dense
            outlined
            v-model="name"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
            v-if="documentType.number === '1'"
          />
          <q-input
            label="Apellido"
            v-validate="'required'"
            data-vv-as="last_name"
            name="last_name"
            dense
            outlined
            v-model="lastName"
            :error="errors.has('last_name')"
            :error-message="errors.first('last_name')"
            v-if="documentType.number === '1'"
          />
          <q-input
            label="Nombre o razon social"
            v-validate="'required'"
            data-vv-as="businessName"
            name="businessName"
            dense
            outlined
            v-model="businessName"
            :error="errors.has('businessName')"
            :error-message="errors.first('businessName')"
            v-if="documentType.number === '6'"
          />
          <q-input
            label="Estado"
            v-validate="'required'"
            data-vv-as="status"
            name="status"
            dense
            outlined
            v-model="status"
            :error="errors.has('status')"
            :error-message="errors.first('status')"
            v-if="documentType.number === '6'"
          />
          <q-input
            label="Condición de residencia"
            v-validate="'required'"
            data-vv-as="residenceCondition"
            name="residenceCondition"
            dense
            outlined
            v-model="residenceCondition"
            :error="errors.has('residenceCondition')"
            :error-message="errors.first('residenceCondition')"
            v-if="documentType.number === '6'"
          />
        </template>
      </dynamic-form>
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
import { provider, propsPanelEdition, providerServices } from '../config-file/provider/providerConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'expense',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm
    // DataTable
  },
  data () {
    return {
      /**
       * Type of vouchers
       * @type {Array} type of vouchers
       */
      voucherTypes: [],
      voucherType: null,
      seatType: null,
      seatTypes: [],
      product: {},
      loadingForm: false,
      provider,
      propsPanelEdition,
      providerServices,
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
      modalProduct: false,
      loadingCLose: false,
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
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'price',
          label: 'Precio',
          field: 'price',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'subtotal',
          label: 'Subtotal',
          field: 'subtotal',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'igv',
          label: 'Igv',
          field: 'igv',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'total',
          label: 'Total',
          field: 'total',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * expense Model
       * @type {Object} expense model
       */
      expense: {
        provider: null,
        expenseReason: null,
        exchange: 0,
        expiration_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * provider List
       * @type {Array} provider List
       */
      providers: [],
      /**
       * Amount product
       * @type {Number} amuntproduct
       */
      amount: 1,
      /**
       * Data product expense
       * @type {Array} data expense
       */
      dataProduct: [],
      /**
       * discount product
       * @type {Number} discount product
       */
      discount: 0,
      /**
       * Type of vouchers
       * @type {Array} type of vouchers
       */
      expenseReasons: [],
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
      igv: 18,
      totalProduct: 0,
      userSession: null,
      branchOfficeSession: null
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.loadCreate()
    this.getDocumentTypes()
    this.setRelationalData(this.providerServices, [], this)
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
    /**
     * Get voucher types
     */
    filterVoucherType (value, update) {
      this.$services.getData(['voucher-types'], {
        forAccountingPlan: true,
        dataSearch: {
          name: value,
          number: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.voucherTypes = res.data.data
            this.voucherType = res.data.data[0]
          })
        })
    },
    /**
     * Get all provider
     */
    getDocumentTypes () {
      this.loadingTable = true
      this.$services.getData(['document-types'])
        .then(({ res }) => {
          this.documentTypes = res.data
          this.documentType = res.data[0]
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDataApi () {
      const r = this.documentType.number === '1' ? 'dni' : this.documentType.number === '6' ? 'ruc' : null
      if (r) {
        this.$services.getData(['ruc', this.documentNumber], {
          documentType: r
        })
          .then(({ res }) => {
            if (!res.data.error) {
              if (this.documentType.number === '6') {
                this.businessName = res.data.nombre
                this.status = res.data.estado
                this.residenceCondition = res.data.condicion
              } else {
                const nameDivider = res.data.nombre.split(' ')
                this.lastName = `${nameDivider[0]} ${nameDivider[1]}`
                this.name = `${nameDivider[2]} ${nameDivider[3]}`
              }
            } else {
              this.notify(this, res.data.error, 'negative', 'warning')
              this.lastName = null
              this.name = null
              this.businessName = null
            }
          })
      }
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.user_id = this.userSession.id
      data.name = this.name ?? this.businessName
      data.last_name = this.lastName
      data.document_number = this.documentNumber
      data.document_type_id = this.documentType.id
      data.branch_office_id = this.branchOfficeSession.id
      this.loadingForm = true
      this.$services.postData(['providers'], data)
        .then(({ res }) => {
          this.expense.provider = res.data
          this.addDialig = false
          this.loadingForm = false
          this.notify(this, 'provider.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Model bill
     */
    modelExpenseReason () {
      const modelExpenseReason = {
        number: this.expense.number,
        serie: this.expense.serie,
        provider_id: this.expense.provider.id,
        expense_reason_id: this.expense.expenseReason.id,
        coin_id: this.coin.id,
        exchange_rate: this.expense.exchange,
        expense_details: this.dataProduct,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        seat_type_id: this.seatType.id,
        branch_office_id: this.branchOfficeSession.id,
        voucher_type_id: this.voucherType.id,
        comment: this.expense.comment,
        created_at: date.formatDate(this.expense.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveExpense(modelExpenseReason)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveExpense (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['expenses'], data)
        .then(res => {
          this.notify(this, 'expense.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'expense.error', 'negative', 'warning')
          this.visible = false
        })
    },
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataProduct = []
      this.expense = {}
      this.expense.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
      this.totalUnitValue = 0
      this.totalProduct = 0
      this.product = {}
      this.amount = 1
      this.modalProduct = false
      this.getExpenseReasons()
      this.getCoins()
      this.resetValidations(this.$refs.formexpense)
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
    /**
     * Get Data in exchange
     */
    getExchange () {
      this.visible = true
      this.$services.getData(['exchange-rate'], {
        start_date: this.expense.created_at
      })
        .then(({ res }) => {
          this.expense.exchange = res.data.venta
          this.visible = false
        })
        .catch(() => {
          this.visible = false
        })
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getExpenseReasons()
      this.getCoins()
      this.getExchange()
    },
    /**
     * Set Data in table
     * @param {Object} val value product
     */
    setTable () {
      this.product.user_created_id = this.userSession.id
      this.product.subtotal = this.product.price * this.product.amount
      this.product.igv = this.getPercentage(this.product.subtotal, this.igv)
      this.product.total = Number(this.product.igv) + Number(this.product.subtotal)
      this.dataProduct.push(this.product)
      this.totalCalculate()
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
      return data.find((product) => product.product_id === index.id && product.warehouse_id === this.warehouse.id)
    },
    /**
     * All provider
     */
    getProviders (value, update) {
      this.$services.getData(['providers'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.providers = res.data.data
          })
        })
    },
    /**
     * Get coins
     */
    getCoins () {
      this.$services.getData(['coins'], {
        sortBy: 'id',
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
    getExpenseReasons () {
      this.$services.getData(['expense-reasons'])
        .then(({ res }) => {
          this.expenseReasons = res.data
          this.expense.expenseReason = res.data[0]
        })
    },
    /**
     * Get voucher types
     */
    getSeatTypes (value, update) {
      this.$services.getData(['seat-types'], {
        dataSearch: {
          code: value,
          element: value,
          description: value
        }
      })
        .then(({ res }) => {
          update(() => {
            this.seatTypes = res.data.map(element => {
              element.description = `${element.name} | ${element.number} | ${element.description}`
              return element
            })
          })
        })
    },
    /**
     * Delete product
     * @param {Object} data data product
     */
    deleteProduct (data) {
      this.dataProduct.splice(data.rowIndex, 1)
      this.totalCalculate()
    },
    /**
     * Calculate expense total
     */
    totalCalculate () {
      let total = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.price)
      })
      this.totalSale = total
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
