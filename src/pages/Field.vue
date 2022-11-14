<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('field.add')"
          @click="addDialog = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('field.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="field"
          searchable
          action
          :column="fieldConfig"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          @view-details="viewDetails"
          @edit="edit"
          @search-data="searchData"
          @on-load-data="loadData"
          @delete="deleteData"
        />
      </div>
    </div>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="field"
        :propsPanelEdition="propsPanelEdition"
        :config="fieldConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialog"
    >
      <dynamic-form
        module="field"
        :config="fieldConfig"
        :loading="loadingForm"
        @cancel="addDialog = false"
        @save="save"
      />
    </q-dialog>
    <q-dialog
      maximized
      full-height
      v-model="dialogFieldDetails"
    >
      <q-layout view="hHh Lpr lff" :class="this.$q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-header elevated class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>
              <div class="text-subtitle2"> Campo: {{ field.denomination }} </div>
            </q-toolbar-title>
            <q-btn flat @click="dialogFieldDetails = false" round dense icon="close" />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-card square>
            <q-card-section class="q-pa-sm">
              <q-expansion-item
                v-if="balance"
                v-model="expanded"
                expand-icon-toggle
                expand-separator
                class="shadow-1 overflow-hidden"
                style="border-radius: 10px"
                header-class="bg-blue-10 text-white"
                expand-icon-class="text-white"
                dense
              >
                <template v-slot:header>
                  <q-item-section avatar class="text-white" @click="expanded = !expanded">
                    <q-icon name="attach_money" size="30px"/>
                  </q-item-section>
                  <q-item-section @click="expanded = !expanded">
                    <span class="text-bold">
                      Balance:
                      {{ balanceTotal }}
                    </span>
                  </q-item-section>
                  <q-item-section side>
                    <div class="row items-center">
                      <q-btn
                        flat
                        round
                        color="white"
                        :icon="drawerLeft ? 'filter_alt_off' : 'filter_alt'"
                        @click="drawerLeft = !drawerLeft"
                      />
                      <q-btn flat icon="update" color="white" size="12px" round @click="viewDetails(field)"/>
                    </div>
                  </q-item-section>
                </template>
                <div class="row q-pa-sm q-col-gutter-sm">
                  <div v-for="bal in balance.accounts" :key="bal.name" class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                    <q-card
                      v-if="bal.amount"
                      :class="bal.status === 'pending_approval' ? 'bg-secondary' : bal.transaction_id ? 'bg-teal' : 'bg-negative'"
                      style="max-width: 200px"
                    >
                      <q-card-section class="text-white row q-pa-sm">
                        <div class="text-bold col-6">
                          <span v-if="bal.transaction_id">
                            Ingreso
                          </span>
                          <span v-else>
                            Egreso
                          </span>
                          <span style="font-size: 11px;">
                            {{ $t(`fieldCashFlow.${bal.status}`) }}
                          </span>
                        </div>
                        <div class="text-bold col-6 text-right">
                          <span class="text-bold">
                            {{ bal.amount }}
                          </span>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-expansion-item>
            </q-card-section>
            <q-card-section>
              <q-scroll-area
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
                style="height: 77vh; width: 100%;"
                class="q-mt-xs"
              >
                <q-table
                  :data="transactions"
                  :columns="cashFlowColumns"
                  :pagination.sync="pagination"
                  class="q-px-md"
                  row-key="name"
                  grid-header
                  :filter="filterBalance"
                >
                  <template v-slot:top>
                    <div class="text-h6" style="width: 30%">
                      Balance
                    </div>
                    <q-space/>
                    <q-input outlined dense debounce="300" v-model="filterBalance" placeholder="Buscar" style="width: 40%">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                  <template v-slot:item="props">
                    <q-card class="full-width q-mt-sm" style="font-size: 12px;">
                      <q-card-section class="row q-pa-sm">
                        <div class="col-12">
                          <span class="text-grey text-right" style="font-size: 11px;">
                            {{ props.row.created_at }}
                          </span>
                        </div>
                        <div class="col-5 text-left">
                          <span class="text-right text-bold">
                            {{ props.row.concept.name }}
                          </span>
                        </div>
                        <div class="col-2 text-bold text-right">
                          <div v-if="!props.row.transaction_id" class="text-negative q-ml-sm">
                            -{{ props.row.amount }}
                          </div>
                        </div>
                        <div class="col-3 text-bold text-right">
                          <div v-if="props.row.transaction_id" class="text-teal">
                            {{ props.row.amount }}
                          </div>
                        </div>
                        <div class="col-2 text-right text-bold">
                          <div class="bg-blue-10">
                            {{ props.row.balance }}
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </template>
                </q-table>
              </q-scroll-area>
            </q-card-section>
            <q-inner-loading :showing="visibleSync">
              <q-spinner-oval size="100px" color="primary"/>
            </q-inner-loading>
          </q-card>
        </q-page-container>
        <q-drawer
          v-model="drawerLeft"
          :width="350"
          :breakpoint="700"
          side="right"
          elevated
          show-if-above
        >
          <q-scroll-area class="fit">
            <div class="q-pa-sm">
              <q-card>
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Filtros</div>
                  <q-space />
                  <q-btn icon="close" flat round dense @click="drawerLeft = false" />
                </q-card-section>
                <q-card-section class="q-gutter-sm">
                  <q-select
                    autocomplete="off"
                    use-input
                    hide-selected
                    fill-input
                    dense
                    outlined
                    behavior="menu"
                    input-debounce="0"
                    v-model="field"
                    option-label="denomination"
                    option-value="id"
                    label="Campo"
                    autofocus
                    :options="listFields"
                    @filter="filterFields"
                    @input="viewDetails(field)"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-input class="q-mt-md" type="date" outlined v-model="from" hint="Desde" dense clearable @input="viewDetails(field)"/>
                  <q-input type="date" outlined v-model="to" hint="Hasta" dense clearable @input="viewDetails(field)"/>
                </q-card-section>
              </q-card>
            </div>
          </q-scroll-area>
        </q-drawer>
      </q-layout>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { fieldConfig, buttonsActions, propsPanelEdition, fieldServices } from '../config-file/field/fieldConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { date } from 'quasar'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    DynamicFormEdition
  },
  data () {
    return {
      drawerLeft: true,
      balance: null,
      expanded: true,
      visibleSync: false,
      listFields: [],
      field: {},
      from: date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD'),
      to: date.formatDate(Date(), 'YYYY-MM-DD'),
      pagination: { rowsPerPage: 10 },
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#4A235A',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#4A235A',
        width: '9px',
        opacity: 0.2
      },
      cashFlowColumns: [
        { name: 'created_at', align: 'left', label: 'Fecha', field: 'created_at' },
        { name: 'beneficiary', align: 'left', label: 'Beneficiario', field: row => row.beneficiary ? `${row.beneficiary.name} ${row.beneficiary.last_name}` : '-' },
        { name: 'concept', align: 'left', label: 'Concepto', field: row => row.concept.name },
        { name: 'debe', align: 'right', label: 'Debe', classes: 'text-negative', field: row => !row.transaction_id ? row.amount : '-', format: (val, row) => `-${val}` },
        { name: 'haber', align: 'right', label: 'Haber', classes: 'text-teal', field: row => row.transaction_id ? row.amount : '-' },
        { name: 'balance', align: 'right', label: 'Saldo', field: 'balance', classes: 'text-blue text-bold' }
      ],
      filterBalance: '',
      dialogFieldDetails: false,
      fieldServices,
      /**
       * Table Buttons
       * @type {Array}
       */
      buttonsActions,
      /**
       * Panel Edition Config
       * @type {Object}
       */
      propsPanelEdition,
      /**
       * Status loading form
       * @type {Boolean}
       */
      loadingForm: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginate: true,
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
          denomination: '',
          contract_number: '',
          address: '',
          'organization.name': '',
          acronym: ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialog: false,
      /**
       * File config module
       * @type {Object}
       */
      fieldConfig,
      /**
       * Open edit dialog
       * @type {Boolean}
       */
      editDialog: false,
      /**
       * Status loading table
       * @type {Boolean}
       */
      loadingTable: false,
      /**
       * Data of table
       * @type {Array}
       */
      data: [],
      transactions: [],
      balanceTotal: 0
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.fieldServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * All field cash flow
     */
    getFieldCashFlow (data) {
      this.$services.getData(['field-cash-flows'], {
        sortBy: 'date',
        sortOrder: 'desc',
        dateFilter: {
          field: 'created_at',
          to: this.to,
          from: this.from
        },
        dataEqualFilter: {
          status: 'approved',
          field_id: data.id
        },
        paginate: false
      })
        .then(({ res }) => {
          this.transactions = res.data.data
          this.visibleSync = false
        })
        .catch((err) => {
          console.log(err)
          this.visibleSync = false
        })
    },
    /**
     * All Transactions
     */
    async getBalance (data) {
      this.$services.getData(['balance'], {
        field_id: data.id
      })
        .then(({ res }) => {
          this.balance = res.data
          this.balanceTotal = res.data.balance
        })
        .catch((err) => {
          console.log(err)
          this.visibleSync = false
        })
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.dialogFieldDetails = true
      this.visibleSync = true
      this.field = data
      this.getFieldCashFlow(data)
      this.getBalance(data)
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    edit (data) {
      this.editDialog = true
      this.propsPanelEdition.data = data
      this.field = data
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la tipo campo?',
        cancel: {
          label: 'Cancelar',
          color: 'negative'
        },
        persistent: true,
        ok: {
          label: 'Aceptar',
          color: 'primary'
        }
      }).onOk(async () => {
        await this.$services.deleteData(['fields', data.id])
        this.notify(this, 'field.deleteSuccessful', 'positive', 'mood')
        this.getFields()
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
      this.getFields(this.params)
    },
    /**
     * Search EgressType
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getFields(this.params)
    },
    /**
     * Update Coin
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['fields', this.field.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getFields(this.params)
          this.notify(this, 'field.editSuccessful', 'positive', 'mood')
        })
        .catch(({ response }) => {
          this.catchError(this, response.data.errors)
          this.loadingForm = false
        })
    },
    /**
     * Save Coin
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      this.loadingForm = true
      this.$services.postData(['fields'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getFields(this.params)
          this.notify(this, 'field.addSuccessful', 'positive', 'mood')
        })
        .catch(({ response }) => {
          this.catchError(this, response.data.errors)
          this.loadingForm = false
        })
    },
    /**
     * Selecte data
     */
    filterFields (value, update) {
      this.$services.getData(['fields'], {
        dataSearch: {
          denomination: value,
          contract_number: value,
          address: value,
          'organization.name': value,
          acronym: value
        }
      })
        .then(({ res }) => {
          update(() => {
            this.listFields = res.data
          })
        })
    },
    /**
     * Get all Fields
     */
    getFields (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['fields'], params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
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
