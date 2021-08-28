<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="agregar solicitud"
          @click="$router.push({ name: 'NewBudgetRequest' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="budgetRequest"
          searchable
          :column="budgetRequestConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @downloadXML="downloadXML"
          @downloadPDF="downloadPDF"
          @downloadCDR="downloadCDR"
          @search-data="searchData"
          @viewNote="viewNote"
          @viewProduct="viewProduct"
        />
      </div>
    </div>
    <q-dialog v-model="viewProductModal">
      <q-card v-if="budgetRequestSelected" style="width: 400px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Productos / {{ budgetRequestSelected.number }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            row-key="name"
            wrap-cells
            virtual-scroll
            :data="budgetRequestSelected.budgetRequest_details"
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
import { budgetRequestConfig } from '../config-file/budgetRequest/budgetRequestConfig.js'
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
          name: 'description',
          align: 'left',
          label: 'Descripción',
          field: 'description',
          sortable: true
        },
        {
          name: 'price',
          label: 'Precio',
          field: 'price',
          sortable: true
        }
      ],
      viewProductModal: false,
      loadingTable: false,
      budgetRequestSelected: null,
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
      budgetRequestConfig,
      data: [],
      dialog: false,
      option: false,
      userSession: null,
      branchOfficeSession: null,
      products: []
    }
  },
  created () {
    this.getbudgetRequests()
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
      this.budgetRequestSelected = data
    },
    validationAmount (value) {
      return value !== '' && (Number(this.budgetRequestSelected.total) - Number(this.totalPaid)) >= 0
    },
    /**
     * Calculate budgetRequest total
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
            amount: payment.amount,
            exchange: this.exchange,
            user_created_id: this.userSession.id,
            created_at: payment.created_at
          }
        } else {
          this.notify(this, 'budgetRequest.saveErrorPayment', 'negative', 'warning')
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
        amount: (this.budgetRequestSelected.total - this.totalPaid).toFixed(2),
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
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getbudgetRequests(this.params)
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
      this.getbudgetRequests()
    },
    /**
     * Get Bill electronis
     */
    getbudgetRequests () {
      this.loadingTable = true
      this.$services.getData(['budget-requests'], this.params)
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
        delete product.budgetRequest_id
        return product
      })
    },
    /**
     * Get Bill electronis
     */
    savePayment () {
      this.loadingPayment = true
      this.budgetRequestSelected.budgetRequest_details = this.modeDetails(this.budgetRequestSelected.budgetRequest_details)
      this.budgetRequestSelected.budgetRequest_payments = this.modelPayments(this.payments)
      this.$services.putData(['budgetRequests', this.budgetRequestSelected.id], this.budgetRequestSelected)
        .then(({ res }) => {
          this.notify(this, 'budgetRequest.saveSuccessPayment', 'positive', 'mood')
          this.loadingPayment = false
          this.getbudgetRequests()
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
