<template>
  <q-page padding>
    <div class="text-h4">Asiento de cuentas</div>
    <q-card>
      <q-card-section>
        <q-splitter
          v-model="splitterModel"
          style="height: 100%"
        >
          <template v-slot:before>
            <div>
              <q-card>
                <q-card-section class="row q-col-gutter-x-xs q-py-sm">
                  <div class="col-5">
                    <q-select
                      use-input
                      hide-selected
                      fill-input
                      outlined
                      clearable
                      dense
                      autocomplete="off"
                      v-model="originAccount"
                      option-value="id"
                      option-label="description"
                      label="Origen de cuenta"
                      :options="originAccounts"
                      @filter="filterOriginAccounts"
                      @input="getSeat"
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
                  <div class="col-3">
                    <q-input
                      outlined
                      v-model="seatData"
                      label="Asiento"
                      type="number"
                      min="1"
                      :max="seatAmount"
                      @input="goSeat"
                      dense
                    />
                  </div>
                  <div class="col-4">
                    <q-input
                      outlined
                      v-model="dateNow"
                      label="Fecha"
                      dense
                      type="date"
                      @input="getSeat"
                    />
                  </div>
                </q-card-section>
                <q-card-section class="row q-col-gutter-x-xs q-py-sm">
                  <div class="col-7">
                    <q-input
                      outlined
                      :value="seatSelected ? seatSelected.billable.coin.name : ''"
                      label="Moneda"
                      dense
                    />
                  </div>
                  <div class="col-5">
                    <q-input
                      outlined
                      :value="seatSelected ? seatSelected.billable.exchange_rate : ''"
                      label="T/C"
                      dense
                    />
                  </div>
                </q-card-section>
                <!-- <q-card-section class="row q-col-gutter-x-xs q-py-sm">
                  <div class="col-12">
                    <q-input
                      outlined
                      :value="`${seatSelected.register.code} ${seatSelected.register.description}`"
                      label="L/Registro"
                      dense
                    />
                  </div>
                </q-card-section> -->
              </q-card>
              <q-card>
                <q-card-section class="row q-col-gutter-xs q-py-sm">
                  <div class="col-6">
                    <q-input
                      outlined
                      v-model="text"
                      label="Cuenta"
                      dense
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      outlined
                      v-model="text"
                      label="Libro"
                      dense
                    />
                  </div>
                </q-card-section>
                <q-card-section class="row q-col-gutter-xs q-py-sm">
                  <div class="col-6">
                    <q-input
                      outlined
                      :value="seatSelected ? seatSelected.billable.voucher_type.name : ''"
                      label="Tipo de documento"
                      dense
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      outlined
                      :value="seatSelected ? seatSelected.serie : ''"
                      label="Número del documento"
                      dense
                    />
                  </div>
                </q-card-section>
                <q-card-section class="row q-col-gutter-xs q-py-sm">
                  <div class="col-6">
                    <q-input
                      outlined
                      type="date"
                      :value="seatSelected ? formatDate(seatSelected.billable.created_at) : null"
                      label="Fecha del documento"
                      dense
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      outlined
                      type="date"
                      label="Fecha del expiración"
                      :value="seatSelected ? formatDate(`${seatSelected.billable.expiration_date} 12:00:00`) : null"
                      dense
                    />
                  </div>
                </q-card-section>
                <q-card-section class="row q-col-gutter-xs q-py-sm">
                  <div class="col-12">
                    <q-input
                      outlined
                      :value="seatSelected ? seatSelected.user.full_name : ''"
                      label="Cliente/Proveedor"
                      dense
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
          <template v-slot:after>
            <div>
              <q-card>
                <q-card-section>
                  <q-table
                    dense
                    row-key="name"
                    :data="seatSelected ? seatSelected.accounting_book_details : []"
                    :columns="columns"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination"
                  />
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="loadingSeat">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>
<script>
// import DataTable from '../components/DataTable.vue'
// import DynamicForm from '../components/DynamicForm.vue'
// import DynamicFormEdition from '../components/DynamicFormEdition.vue'
// import { category, buttonsActions, propsPanelEdition } from '../config-file/category/categoryConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { date } from 'quasar'
export default {
  mixins: [mixins.containerMixin],
  components: {
    // DataTable,
    // DynamicForm,
    // DynamicFormEdition
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 0
      },
      dateNow: date.formatDate(new Date(), 'YYYY-MM-DD'),
      splitterModel: 50,
      text: '',
      originAccount: null,
      originAccounts: [],
      seatSelected: null,
      rows: [],
      seatData: 0,
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: false,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 1,
        dataSearch: {}
      },
      loadingSeat: false,
      columns: [
        {
          name: 'account',
          align: 'left',
          label: 'Cuenta',
          field: row => row.accounting_plan.code,
          sortable: true
        },
        {
          name: 'description',
          label: 'Descripción',
          align: 'left',
          field: row => row.accounting_plan.description,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'debe',
          label: 'Debe S/.',
          field: row => row.account_type === 'debe' ? row.amount : '-',
          sortable: true
        },
        {
          name: 'haber',
          label: 'Haber S/.',
          field: row => row.account_type === 'haber' ? row.amount : '-'
        }
      ],
      seatAll: [],
      seatAmount: 1
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  watch: {
    seatAll () {
      this.seatAmount = this.seatAll.length
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    formatDate (data) {
      if (data) {
        return date.formatDate(data, 'YYYY-MM-DD')
      }
    },
    getSeat () {
      this.params = {
        dataFilter: { origin_account_id: this.originAccount.id },
        sortBy: 'id',
        sortOrder: 'asc',
        year: date.formatDate(this.dateNow, 'YYYY'),
        month: date.formatDate(this.dateNow, 'MM')
      }
      this.getAccountingBook(this.params)
    },
    /**
     * Get voucher types
     */
    filterOriginAccounts (value, update) {
      this.$services.getData(['origin-accounts'], {
        dataSearch: {
          code: value,
          description: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.originAccounts = res.data.data.map(origin => {
              origin.description = `${origin.code} ${origin.description}`
              return origin
            })
          })
        })
    },
    goSeat (data) {
      this.seatSelected = this.seatAll[Number(data) - 1]
    },
    /**
     * Get all voucherType
     */
    getAccountingBook (params = this.params) {
      this.loadingSeat = true
      this.$services.getData(['accounting-books'], params)
        .then(({ res }) => {
          this.seatAll = res.data.map(re => {
            if (re.billable.coin.acronym === 'USD') {
              console.log(re)
              re.accounting_book_details.map(seat => {
                seat.amount = seat.amount * re.billable.exchange_rate
                return seat
              })
            }
            return re
          })
          this.seatData = this.seatAll.length
          this.seatSelected = this.seatAll[this.seatData - 1]
          this.loadingSeat = false
        })
        .catch(err => {
          console.log(err)
          this.loadingSeat = false
        })
    }
  }
}
</script>
