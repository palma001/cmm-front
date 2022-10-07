<template>
  <q-page padding>
    <q-card>
      <q-form @submit="saveTransaction" @reset="clean" ref="transaction">
        <q-card-section class="q-py-sm">
          <div class="text-h6">Nueva Transacción</div>
        </q-card-section>
        <q-card-section class="row q-py-xs q-col-gutter-sm">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-select
              autocomplete="off"
              use-input
              dense
              outlined
              clearable
              behavior="menu"
              input-debounce="20"
              name="paymentOrder"
              v-model="paymentOrder"
              option-label="description"
              option-value="id"
              label="Ordenes de pagos"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="paymentOrders"
              @input="orderSelected"
              @filter="getPaymentOrders"
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
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              type="date"
              outlined
              v-model="date"
              hint="Fecha de pago"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              type="number"
              outlined
              v-model="amount"
              label="Monto"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-py-xs q-col-gutter-sm">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-select
              autocomplete="off"
              use-input
              dense
              outlined
              clearable
              behavior="menu"
              input-debounce="20"
              name="beneficiary"
              v-model="responsable"
              option-label="full_name"
              option-value="id"
              label="Responsable"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="responsables"
              @filter="getresponsables"
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
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              type="textarea"
              outlined
              v-model="description"
              label="Descripción"
              dense
              autogrow
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              outlined
              v-model="reference"
              label="Referencia"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn icon="clear" color="negative" label="Limpiar" type="reset"/>
          <q-btn icon="save" color="primary" label="Guardar" type="submit" :loading="loadingForm"/>
        </q-card-actions>
      </q-form>
    </q-card>
    <div class="q-mt-xs">
      <data-table
        title="list"
        module="transaction"
        searchable
        action
        activeVisibleColumn
        :column="transactionConfig"
        :data="data"
        :loading="loadingTable"
        :buttonsActions="buttonsActions"
        :optionPagination="optionPagination"
        @search-data="searchData"
        @on-load-data="loadData"
      />
    </div>
  </q-page>
</template>

<script>
import { GETTERS } from '../store/module-login/name.js'
import DataTable from '../components/DataTable.vue'
import { beneficiary } from '../config-file/beneficiary/beneficiaryConfig.js'
import { transactionConfig, buttonsActions } from '../config-file/transaction/transactionConfig.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 10,
        rowsNumber: 10,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      beneficiary,
      transactionConfig,
      loadingForm: false,
      buttonsActions,
      responsables: [],
      responsable: null,
      paymentOrders: [],
      paymentOrder: null,
      date: null,
      description: null,
      addDialogBeneficiary: false,
      reference: null,
      amount: null,
      userSession: null,
      data: [],
      loadingTable: false,
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
          description: '',
          amount: ''
        }
      }
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Search EgressType
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      console.log(data)
      this.params.page = 1
      this.getTransactions(this.params)
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
      this.getTransactions(this.params)
    },
    orderSelected () {
      this.amount = this.paymentOrder ? this.paymentOrder.pending : 0
    },
    /**
     * All Payment order
     */
    getPaymentOrders (value, update) {
      this.$services.getData(['payment-orders'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataEqualFilter: {
          status: 'approved'
        },
        dataSearch: {
          description: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.paymentOrders = res.data.data.filter(paymentOrder => paymentOrder.pending > 0)
          })
        })
    },
    /**
     * Model payment
     * @return {Object} model payment
     */
    modelTransaction () {
      return {
        amount: this.amount,
        description: this.description,
        date: this.date,
        reference: this.reference,
        payment_order_id: this.paymentOrder.id,
        responsable_id: this.responsable.id,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id
      }
    },
    saveTransaction () {
      this.loadingForm = true
      this.$services.postData(['transactions'], this.modelTransaction())
        .then(({ res }) => {
          this.loadingForm = false
          this.notify(this, 'transaction.addSuccessful', 'positive', 'mood')
          this.clean()
          this.getTransactions(this.params)
        })
        .catch((err) => {
          this.loadingForm = false
          this.notify(this, `message.${err.message}`, 'negative', 'warning')
        })
    },
    /**
     * Clean formulary
     */
    clean () {
      this.paymentOrder = null
      this.date = null
      this.amount = 0
      this.category = null
      this.concept = null
      this.responsable = null
      this.reference = null
      this.description = null
      this.resetValidations(this.$refs.transaction)
    },
    /**
     * All responsables
     */
    getresponsables (value, update) {
      this.$services.getData(['responsables'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value,
          last_name: value,
          document_number: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.responsables = res.data
          })
        })
    },
    /**
     * All Transactions
     */
    getTransactions (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['transactions'], params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.meta.total
          this.loadingTable = false
        })
        .catch(err => {
          console.log(err)
          this.data = []
          this.loadingTable = false
          this.optionPagination.rowsNumber = 0
        })
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        ref.resetValidation()
      }, 100)
    }
  }
}
</script>
