<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="q-pb-sm row q-col-gutter-sm">
        <div class="col-9">
          <div class="row justify-between">
            <div class="col-auto">
              <p class="text-h5">
                {{ ucwords($t('creditNote.newCreditNote')) }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-3">
          <q-input type="date" dense outlined label="Fec. Emisión" v-model="creditNote.created_at"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row q-py-sm q-col-gutter-sm">
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
            name="voucherTypeNotes"
            v-model="creditNote.voucherTypeNote"
            option-label="name"
            option-value="id"
            v-validate="'required'"
            data-vv-as="field"
            @filter="getVoucherTypeNotes"
            :error-message="errorValidation('voucherTypeNotes')"
            :error="errors.has('voucherTypeNotes')"
            :label="ucwords($t('creditNote.voucherTypeNotes'))"
            :options="voucherTypeNotes"
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
          <q-select
            autocomplete="off"
            use-input
            hide-selected
            fill-input
            dense
            outlined
            clearable
            input-debounce="20"
            name="typeOfCreditNotes"
            v-model="creditNote.typeOfCreditNote"
            option-label="name"
            option-value="id"
            v-validate="'required'"
            data-vv-as="field"
            @filter="getTypeOfCreditNotes"
            :error-message="errorValidation('typeOfCreditNotes')"
            :error="errors.has('typeOfCreditNotes')"
            :label="ucwords($t('creditNote.typeOfCreditNotes'))"
            :options="typeOfCreditNotes"
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
          <q-select
            use-input
            hide-selected
            fill-input
            outlined
            clearable
            dense
            autocomplete="off"
            input-debounce="0"
            name="seller"
            ref="sellerRef"
            v-model="seller"
            data-vv-as="field"
            option-value="id"
            option-label="full_name"
            label="Vendedor"
            :options="sellers"
            @filter="getSellers"
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
      <q-separator/>
      <q-card-section class="row q-col-gutter-sm">
        <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-input
            v-model="creditNote.exchange"
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
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-input
            type="textarea"
            outlined
            label="Descrición"
            v-model="creditNote.observation"
            rows="1"
            dense
          />
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-btn
            icon="add"
            color="primary"
            label="producto"
            style="height: 40px;"
            @click="modalProduct = true"
          />
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
                <q-td key="purchase_price" :props="props">
                  {{ props.row.purchase_price }}
                </q-td>
                <q-td key="igv" :props="props">
                  {{ props.row.igv }}
                </q-td>
                <q-td key="price" :props="props">
                  {{ props.row.price }}
                  <q-popup-edit v-model.number="props.row.price">
                    <q-input type="number" v-model.number="props.row.price" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="subtotal" :props="props">
                  {{ props.row.subtotal }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
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
          </q-list>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn color="negative" label="Cancelar nota de credito" @click="cancelCreditNote"/>
        <q-btn color="primary" label="Generar nota de credito" @click="modelCreditNote" :disable="dataProduct.length <= 0"/>
      </q-card-actions>
    </q-card>
    <q-dialog
      v-model="modalProduct"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Producto o Servicio</div>
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-x-sm">
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
              :label="value ? 'C-P-D' : 'Productos'"
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
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'creditNote',
  mixins: [mixins.containerMixin],
  components: {
    // DynamicForm
    // DataTable
  },
  data () {
    return {
      modalProduct: false,
      sellers: [],
      seller: null,
      value: false,
      description: null,
      purchase_order: null,
      observation: null,
      igvs: [{ label: 'Gravado - Operación Onerosa', value: 12 }],
      igv: { label: 'Gravado - Operación Onerosa', value: 12 },
      loadingCLose: false,
      product: null,
      modalPaid: false,
      paymentMethod: null,
      paymentMethods: [],
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
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'purchase_price',
          label: 'Valor Unitario',
          field: 'purchase_price',
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
          name: 'price',
          label: 'Precio Unitario',
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
        }
      ],
      /**
       * creditNote Model
       * @type {Object} creditNote model
       */
      creditNote: {
        voucherTypeNote: null,
        typeOfCreditNote: null,
        exchange: 0,
        expiration_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD'),
        delivery_date: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      voucherTypeNotes: [],
      typeOfCreditNotes: [],
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
       * Data product order
       * @type {Array} data order
       */
      dataProduct: [],
      /**
       * discount product
       * @type {Number} discount product
       */
      discount: 0,
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
    this.getOneBill()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
    this.getExchange()
  },
  methods: {
    /**
     * Get data billing
     */
    getOneBill () {
      this.$services.getOneData(['bill-electronic', this.$route.params.id, 'note'])
        .then(({ res }) => {
          this.seller = res.data.seller
          if (res.data.credit_note) {
            this.creditNote.voucherTypeNote = res.data.credit_note.voucher_type_note
            this.creditNote.typeOfCreditNote = res.data.credit_note.type_of_credit_note
            this.creditNote.observation = res.data.credit_note.description
            this.creditNote.created_at = date.formatDate(res.data.credit_note.created_at, 'YYYY-MM-DD')
            this.dataProduct = this.modelProduct(res.data.credit_note.credit_note_details)
          } else {
            this.dataProduct = this.modelProduct(res.data.bill_electronic_details)
          }
          this.totalCalculate()
        })
    },
    /**
     * Model product
     * @param {Array} data product billing
     */
    modelProduct (data) {
      return data.map(details => {
        return {
          id: details.product.id,
          product_id: details.product.id,
          description: details.product.description,
          amount: details.amount,
          price: details.price,
          discount: details.discount,
          igv: details.igv,
          purchase_price: details.purchase_price,
          subtotal: (details.amount * details.price) - (details.discount ?? 0),
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Get Seller
     */
    getSellers (value, update) {
      this.$services.getData(['sellers'], {
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
            this.sellers = res.data.data
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
     * Model order
     */
    modelCreditNote () {
      const creditNoteModel = {
        voucher_type_note_id: this.creditNote.voucherTypeNote.id,
        type_of_credit_note_id: this.creditNote.typeOfCreditNote.id,
        seller_id: this.seller.id,
        exchange_rate: this.creditNote.exchange,
        description: this.creditNote.observation,
        credit_note_details: this.dataProduct,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.creditNote.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveCreditNote(creditNoteModel)
    },
    /**
     * Save order
     * @param {Object} data data order
     */
    saveCreditNote (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['bill-electronic', this.$route.params.id, 'note'], data)
        .then(res => {
          this.notify(this, 'creditNote.saveSuccess', 'positive', 'mood')
          this.cancelCreditNote()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'creditNote.error', 'negative', 'warning')
          this.visible = false
        })
    },
    /**
     * Clean order data
     */
    cancelCreditNote () {
      this.getOneBill()
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        if (this.paymentAmount) {
          ref.resetValidation()
        }
      }, 100)
    },
    /**
     * Calculate subtotal products
     */
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
    /**
     * Get Data in exchange
     */
    getExchange () {
      this.visible = true
      this.$services.getData(['exchange-rate'], {
        start_date: this.creditNote.created_at
      })
        .then(({ res }) => {
          this.creditNote.exchange = res.data.venta
          this.visible = false
        })
        .catch(() => {
          this.visible = false
        })
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
        product_id: this.product.id,
        description: this.product.full_name,
        amount: this.amount,
        purchase_price: isNaN(unitValue) ? 0 : unitValue,
        igv: isNaN(percentage) ? 0 : percentage,
        price: this.stock.sale_price,
        subtotal: this.totalProduct,
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
          this.recalculate(product)
          return product
        }
      })
    },
    /**
     * All CLient
     */
    getVoucherTypeNotes (value, update) {
      this.$services.getData(['voucher-type-notes'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.voucherTypeNotes = res.data.data
          })
        })
    },
    getTypeOfCreditNotes (value, update) {
      this.$services.getData(['type-of-credit-notes'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.typeOfCreditNotes = res.data.data
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
     * Get payment method
     * @param {String} value data filter
     */
    getPaymentMethods (value, update) {
      this.$services.getData(['payment-methods'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.paymentMethods = res.data.data
          })
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
        if (product.product_id === data.product_id) {
          product.subtotal = data.amount * data.price
          return product
        }
      })
      this.totalCalculate()
    },
    /**
     * Calculate order total
     */
    totalCalculate () {
      let total = 0
      let igvTotal = 0
      let unitValue = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.subtotal)
        igvTotal = (Number(igvTotal) + (Number(element.igv) * Number(element.amount)))
        unitValue = (Number(unitValue) + (Number(element.purchase_price) * Number(element.amount)))
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
