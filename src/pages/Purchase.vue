<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="agregar compra"
          @click="$router.push({ name: 'NewPurchase' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="purchase"
          searchable
          :column="purchaseConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @downloadXML="downloadXML"
          @downloadPDF="downloadPDF"
          @downloadCDR="downloadCDR"
          @viewPayment="viewPayment"
          @search-data="searchData"
          @viewNote="viewNote"
          @viewGuide="viewGuide"
          @viewProduct="viewProduct"
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
    <!-- Ventana Modal para el botón OPCIONES por cada registro de Comprobante-->
    <q-dialog v-model="option">
      <q-card style="width: 600px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Comprobante: F0001-34</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>La factura F001-34, ha sido aceptada</div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-3">
              <q-btn
                icon="print"
                class="full-width"
                label="Imprimir A4"
                stack
                glossy
                color="primary"
                no-caps
                dense
              />
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir Ticket 80 mm" stack glossy color="primary" no-caps dense/>
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir Ticket 50 mm" stack glossy color="primary" no-caps dense />
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir A5" stack glossy color="primary" no-caps dense />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-8">
              <q-input outlined v-model="text" label="email" dense/>
            </div>
           <div class="col-4">
              <q-btn color="primary" icon-right="mail" label="Enviar" no-caps/>
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-2">
              <q-input outlined v-model="text" label="Cód." dense/>
            </div>
            <div class="col-6">
              <q-input outlined v-model="text" label="teléfono" dense/>
            </div>
            <div class="col-4">
              <q-btn color="primary" icon="smartphone" label="Enviar" no-caps/>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Ventana Modal para el botón PAGOS por cada registro de Comprobante-->
    <q-dialog v-model="pay">
      <q-card style="width: 800px; max-width: 80vw;" v-if="purchaseSelected">
        <q-form @submit="savePayment">
          <q-card-section class="row items-center q-pb-none" v-if="purchaseSelected">
            <div class="text-h6">Pagos de factura: {{ purchaseSelected.serie }}-{{ purchaseSelected.number }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section v-if="purchaseSelected">
            <div class="row justify-end q-gutter-sm">
              <div class="col-12">
                <q-list bordered separator dense>
                  <q-item clickable v-ripple>
                    <q-item-section>TOTAL A PAGAR</q-item-section>
                    <q-item-section side> {{ purchaseSelected.total.toFixed(2) }}</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>TOTAL PAGADO</q-item-section>
                    <q-item-section side>{{ totalPaid }}</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple :active="active" active-class="text-negative">
                    <q-item-section>PENDIENTE DE PAGO</q-item-section>
                    <q-item-section side>
                      {{  (purchaseSelected.total - totalPaid).toFixed(2) }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-12 text-right">
                <q-btn
                  color="primary"
                  icon="control_point"
                  label="Nuevo"
                  no-caps
                  glossy
                  v-if="purchaseSelected.total - totalPaid"
                  @click="addNewPayment"
                />
              </div>
              <div class="col-12">
                <q-table
                  :data="payments"
                  :columns="columsPay"
                  :rows-per-page-options="[0]"
                  row-key="name"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="payment_destination" :props="props">
                        <span v-if="props.row.payment_destination">
                          {{ props.row.payment_destination.name }}
                        </span>
                        <span v-else>
                          -
                        </span>
                        <q-popup-edit
                          v-model="props.row.payment_destination"
                          auto-save
                        >
                          <q-select
                            use-input
                            hide-selected
                            fill-input
                            outlined
                            clearable
                            dense
                            autofocus
                            autocomplete="off"
                            input-debounce="0"
                            name="paymentDestination"
                            ref="paymentDestinationRef"
                            v-model="props.row.payment_destination"
                            data-vv-as="field"
                            option-value="id"
                            option-label="name"
                            label="Destino"
                            :rules="[val => val || 'El campo metodo de pago es requerido']"
                            :options="paymentDestinations"
                            @filter="getPaymentDestinations"
                          />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="payment_method" :props="props">
                        <span v-if="props.row.payment_method">
                          {{ props.row.payment_method.name }}
                        </span>
                        <span v-else>
                          -
                        </span>
                        <q-popup-edit
                          v-model="props.row.payment_method"
                          auto-save
                        >
                          <q-select
                            autofocus
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
                            v-model="props.row.payment_method"
                            data-vv-as="field"
                            option-value="id"
                            option-label="name"
                            label="Destino"
                            :rules="[val => val || 'El campo metodo de pago es requerido']"
                            :options="paymentMethods"
                            @filter="getPaymentMethods"
                          />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="reference" :props="props">
                        {{ props.row.reference }}
                        <q-popup-edit v-model="props.row.reference" auto-save>
                          <q-input autofocus label="Referencia" v-model="props.row.reference" outlined dense/>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="amount" :props="props">
                        {{ props.row.amount }}
                        <q-popup-edit v-model="props.row.amount" :validate="validationAmount" @before-hide="totalPayements" auto-save>
                          <q-input
                            label="Monto"
                            v-model="props.row.amount"
                            outlined
                            dense
                            autofocus
                            :rules="[
                              val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
                              val => 0 <= (Number(purchaseSelected.total) - Number(totalPaid)) || 'El monto no puede superar el total a pagar'
                            ]"
                            @input="totalPayements"
                          />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="actions" :props="props" class="q-pa-md q-gutter-sm">
                        <q-btn
                          round
                          color="negative"
                          glossy
                          text-color="white"
                          icon="delete"
                          size="xs"
                          class="q-mb-sm"
                          @click="deletePayment(props)"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              color="negative"
              label="cancelar"
              @click="pay = false"
            />
            <q-btn
              color="positive"
              label="guardad pagos"
              type="submit"
              :loading="loadingPayment"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="viewProductModal">
      <q-card v-if="purchaseSelected" style="width: 600px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Productos / {{ purchaseSelected.serie }}-{{ purchaseSelected.number }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
              row-key="name"
              wrap-cells
              virtual-scroll
              :data="purchaseSelected.purchase_details"
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
import { date } from 'quasar'
import { purchaseConfig } from '../config-file/purchase/purchaseConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
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
          name: 'cpd',
          align: 'left',
          label: 'C-P-D',
          field: row => `${row.product.brand.name}-${row.product.code}-${row.product.supsec}`,
          sortable: true
        },
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
        },
        {
          name: 'purchase_price',
          label: 'Precio de compra',
          field: 'purchase_price',
          sortable: true
        }
      ],
      viewProductModal: false,
      active: true,
      loadingPayment: false,
      loadingTable: false,
      purchaseSelected: null,
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
          'provider.name': '',
          'provider.document_number': '',
          'coin.name': '',
          'voucherType.name': '',
          'provider.last_name': '',
          igv: '',
          created_at: '',
          expiration_date: ''
        }
      },
      payments: [],
      text: '',
      purchaseConfig,
      visibleColumns: ['id', 'soap', 'dateEmission', 'dateExp', 'client', 'number', 'noteCd', 'state', 'user', 'coin', 'tGravado', 'tExportacion', 'tGratuita', 'tInafecta', 'tExonerado', 'tGravado', 'tIgv', 'total', 'saldo', 'ordenCompra', 'paid', 'downloads', 'actions'],
      data: [],
      dialog: false,
      option: false,
      pay: false,
      voucherTypes: [],
      paymentMethods: [],
      paymentDestinations: [],
      exchange: 0,
      userSession: null,
      branchOfficeSession: null,
      totalPaid: 0,
      columsPay: [
        // { name: 'created_at', align: 'left', label: 'Fecha de Pago', field: 'created_at', sortable: true },
        { name: 'payment_destination', align: 'left', label: 'Destino', field: 'payment_destination', sortable: false },
        { name: 'payment_method', align: 'left', label: 'Método de Pago', field: 'payment_method', sortable: false },
        { name: 'reference', align: 'center', label: 'Referencia', field: 'reference', sortable: true },
        // { name: 'archive', align: 'center', label: 'Archivo', field: 'archive' },
        { name: 'amount', align: 'center', label: 'Monto', field: 'amount', sortable: true },
        { name: 'actions', align: 'center', label: 'Acciones', field: 'action' }
      ],
      products: []
    }
  },
  created () {
    this.getPurchases()
    this.getExchange()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    viewProduct (data) {
      this.viewProductModal = true
      this.purchaseSelected = data
    },
    validationAmount (value) {
      return value !== '' && (Number(this.purchaseSelected.total) - Number(this.totalPaid)) >= 0
    },
    /**
     * Calculate purchase total
     */
    totalPayements () {
      let total = 0
      if (this.payments.length > 0) {
        this.payments.forEach(element => {
          total = Number(total) + Number(element.amount)
        })
        this.totalPaid = total
      } else {
        this.totalPaid = 0
      }
    },
    /**
     * Model paymnets
     * @param {Array} data data model
     * @return {Array} model
     */
    modelPayments (data) {
      return data.map(payment => {
        if (payment.payment_method && payment.payment_destination) {
          return {
            payment_method_id: payment.payment_method.id,
            payment_destination_id: payment.payment_destination.id,
            reference: payment.reference,
            amount: Number(payment.amount),
            exchange: this.exchange,
            user_created_id: this.userSession.id,
            created_at: payment.created_at
          }
        } else {
          this.notify(this, 'purchase.saveErrorPayment', 'negative', 'warning')
        }
      })
    },
    /**
     * Get Data in exchange
     */
    getExchange () {
      this.$services.getData(['exchange-rate'], {
        start_date: date.formatDate(date.subtractFromDate(new Date(), { month: 1 }), 'DD/MM/YYYY'),
        final_date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        coin: 'PEN'
      })
        .then(({ res }) => {
          if (res.data.exchange_rates && res.data.exchange_rates.length > 0) {
            this.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
          }
        })
    },
    /**
     * Add paument
     */
    addNewPayment () {
      this.payments.push({
        amount: (this.purchaseSelected.total - this.totalPaid).toFixed(2),
        reference: '-'
      })
      this.totalPayements()
    },
    /**
     * Delete payment
     * @param {Number} index indiex payment
     */
    deletePayment (index) {
      this.payments.splice(index.rowIndex, 1)
      this.totalPayements()
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
     * Get payment destination
     * @param {String} value data filter
     */
    getPaymentDestinations (value, update) {
      this.$services.getData(['payment-destinations'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.paymentDestinations = res.data.data
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
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getPurchases(this.params)
    },
    downloadXML (data) {
      console.log(data)
    },
    downloadPDF (data) {
      console.log(data)
    },
    downloadCDR (data) {
      console.log(data)
    },
    /**
     * Open payment dialog
     * @param {Boolean} data status dialog
     */
    viewPayment (data) {
      this.pay = true
      this.purchaseSelected = data
      this.payments = data.purchase_payments
      this.totalPayements()
    },
    viewNote (data) {
      this.$router.push({ name: 'CreditNote', params: { id: data.id } })
    },
    viewGuide (data) {
      this.$router.push({ name: 'ReferralGuide', params: { id: data.id, module: 'bill-electronics' } })
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
      this.getPurchases()
    },
    /**
     * Get Bill electronis
     */
    getPurchases () {
      this.loadingTable = true
      this.$services.getData(['purchases'], this.params)
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
    },
    modeDetails (data) {
      return data.map(product => {
        delete product.purchase_id
        return product
      })
    },
    /**
     * Get Bill electronis
     */
    savePayment () {
      this.loadingPayment = true
      this.purchaseSelected.purchase_details = this.modeDetails(this.purchaseSelected.purchase_details)
      this.purchaseSelected.purchase_payments = this.modelPayments(this.payments)
      this.$services.putData(['purchases', this.purchaseSelected.id], this.purchaseSelected)
        .then(({ res }) => {
          this.notify(this, 'purchase.saveSuccessPayment', 'positive', 'mood')
          this.loadingPayment = false
          this.getPurchases()
          this.pay = false
        })
        .catch(err => {
          console.log(err)
          this.loadingPayment = false
        })
    }
  }
}
</script>
