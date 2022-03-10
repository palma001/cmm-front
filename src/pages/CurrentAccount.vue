<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12">
        <data-table
          title="list"
          module="currentAccount"
          searchable
          :column="currentAccount"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          @accountStatus="accountStatus"
          @search-data="searchData"
          @on-load-data="loadData"
          @delete="deleteData"
        />
      </div>
    </div>
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row">
          <div class="col-6">
            <span class="text-h5">
              {{ partnerSelected.document_number}} - {{ partnerSelected.name}} {{ partnerSelected.last_name }}
            </span>
          </div>
          <div class="col-6 text-right q-gutter-sm">
            <q-btn
              label="Pagar Recibo"
              color="orange"
              @click="addDialogEntryPayment = true"
            />
            <q-btn
              label="Agregar Ingreso"
              @click="$router.push({ name: 'NewEntry', query: { partner: partnerSelected.id } })"
              color="primary"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
            <q-input
              type="date"
              dense
              outlined
              hint="Desde"
              v-model="from"
            />
          </div>
          <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
            <q-input
              type="date"
              dense
              outlined
              hint="Hasta"
              v-model="to"
            />
          </div>
          <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
            <q-select
              outlined
              dense
              v-model="accountable_type"
              :options="accountable_types"
              label="Tipo de transacción"
            />
          </div>
          <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6 q-gutter-x-sm">
            <q-btn color="primary" icon="search" @click="filterBetween"/>
            <q-btn color="negative" icon="clear" @click="clearFilter"/>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-table
            title="Estado de Cuenta"
            :data="currentAccountData"
            :columns="columns"
            :loading="loadingCurrentAccount"
            :pagination="initialPagination"
            row-key="name"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialogEntryPayment"
    >
      <dynamic-form
        module="entryPayment"
        :config="entryPayment"
        :loading="loadingFormPayment"
        @cancel="addDialogEntryPayment = false"
        @save="savePayment"
      >
        <template v-slot:top>
          <q-select
            autocomplete="off"
            use-input
            hide-selected
            fill-input
            dense
            outlined
            clearable
            input-debounce="20"
            name="entry"
            v-model="entry"
            option-label="full_name"
            option-value="id"
            label="Recibos"
            :options="entries"
            @filter="getEntries"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:append>
              <q-btn color="primary" dense rounded icon="add" size="sm" @click="$router.push({ name: 'NewEntry', query: { partner: partnerSelected.id } })"/>
            </template>
          </q-select>
        </template>
      </dynamic-form>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { currentAccount, buttonsActions, propsPanelEdition } from '../config-file/currentAccount/currentAccountConfig.js'
import { entryPayment, entryPaymentServices } from '../config-file/entryPayment/entryPaymentConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import DynamicForm from '../components/DynamicForm.vue'
import { date } from 'quasar'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm
  },
  data () {
    return {
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 20
        // rowsNumber: xx if getting data from a server
      },
      loadingCurrentAccount: false,
      visible: false,
      entries: [],
      entry: null,
      entryPaymentServices,
      addDialogEntryPayment: false,
      entryPayment,
      currentAccountData: [],
      columns: [
        {
          name: 'created_at',
          required: true,
          label: 'Fecha',
          align: 'left',
          field: row => this.formatDate(row.created_at),
          sortable: true
        },
        {
          name: 'description',
          align: 'center',
          label: 'Descripción',
          field: row => `${this.translate(row.accountable_type)} Nro ${row.accountable.id}`,
          sortable: true
        },
        {
          name: 'debe',
          label: 'Debe (S)',
          field: row => row.accountable_type === 'App\\Models\\Entry' ? row.amount : '-',
          sortable: true
        },
        {
          name: 'haber',
          label: 'Haber (S)',
          field: row => row.accountable_type === 'App\\Models\\EntryPayment' ? row.amount : '-'
        },
        {
          name: 'balance',
          label: 'Saldo (S)',
          field: 'balance'
        }
      ],
      dialog: false,
      maximizedToggle: true,
      buttonsActions,
      propsPanelEdition,
      loadingFormPayment: false,
      /**
       * Selected data
       * @type {Object}
       */
      selectedData: null,
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
          name: '',
          description: ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialig: false,
      /**
       * File config module
       * @type {Object}
       */
      currentAccount,
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
      partnerSelected: {},
      from: null,
      to: null,
      accountStatusParams: {},
      accountable_type: null,
      accountable_types: [
        {
          label: 'Ingreso',
          value: 'App\\Models\\Entry'
        },
        {
          label: 'Pagos',
          value: 'App\\Models\\EntryPayment'
        }
      ]
    }
  },
  created () {
    this.getCurrentAccounts()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.setPartner()
    this.setRelationalData(this.entryPaymentServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    filterBetween () {
      this.accountStatusParams.dateFilter = {
        from: this.from,
        to: this.to,
        field: 'created_at'
      }
      this.accountStatusParams.relation = this.accountable_type ? this.accountable_type.value : null
      this.accountStatus(this.partnerSelected)
    },
    clearFilter () {
      this.from = null
      this.to = null
      this.accountable_type = null
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    savePayment (data) {
      data.user_created_id = this.userSession.id
      data.partner_id = this.partnerSelected.id
      data.entry_id = this.entry.id
      this.loadingFormPayment = true
      this.$services.postData(['entry-payments'], data)
        .then(({ res }) => {
          this.accountStatus(this.partnerSelected)
          this.entry = null
          this.loadingFormPayment = false
          this.notify(this, 'entryPayment.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingFormPayment = false
        })
    },
    /**
     * All Entries
     */
    getEntries (value, update) {
      this.$services.getData(['entries'], {
        dataSearch: {
          id: value
        },
        dataFilter: {
          partner_id: this.partnerSelected.id
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.entries = res.data.data.map(entry => {
              entry.full_name = `Recibo Nro ${entry.id} Por pagar: ${entry.pending}`
              return entry
            }).filter(entry => {
              return entry.pending > 0
            })
          })
        })
    },
    setPartner () {
      if (this.$route.query.partner) {
        this.visible = true
        this.$services.getOneData(['partners', this.$route.query.partner])
          .then(({ res }) => {
            this.accountStatus(res.data)
          })
      }
    },
    formatDate (data) {
      return date.formatDate(data, 'DD/MM/YYYY')
    },
    translate (data) {
      switch (data) {
        case 'App\\Models\\Entry':
          return 'Ingreso'
        default:
          return 'Pago'
      }
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    async accountStatus (data) {
      this.partnerSelected = data
      this.visible = true
      this.loadingCurrentAccount = true
      const { res } = await this.$services.getOneData(['current-accounts', data.id], this.accountStatusParams)
      this.currentAccountData = res.data
      this.visible = false
      this.loadingCurrentAccount = false
      this.dialog = true
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la marca?',
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
        await this.$services.deleteData(['current-accounts', data.id])
        this.notify(this, 'currentAccount.deleteSuccessfull', 'positive', 'mood')
        this.getCurrentAccounts()
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
      this.getCurrentAccounts(this.params)
    },
    /**
     * Search currentAccount
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getCurrentAccounts()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['current-accounts', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getCurrentAccounts(this.params)
          this.notify(this, 'currentAccount.editSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.user_id = this.userSession.id
      this.loadingForm = true
      this.$services.postData(['current-accounts'], data)
        .then(({ res }) => {
          this.addDialig = false
          this.loadingForm = false
          this.getCurrentAccounts(this.params)
          this.notify(this, 'currentAccount.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all currentAccount
     */
    getCurrentAccounts (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['current-accounts'], this.params)
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
