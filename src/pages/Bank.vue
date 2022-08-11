<template>
  <q-page padding>
    <div class="row q-col-gutter-y-sm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-gutter-x-sm text-center" style="margin-top: 2px;">
        <PlaidLink
          clientName="Qbits DBA"
          env="development"
          ref="authBank"
          :link_token="linkPlaid.link_token"
          :public_key="linkPlaid.request_id"
          :products="['auth','transactions']"
          :onLoad='onLoad'
          :onEvent='onEvent'
          :onSuccess='onSuccess'
          :onExit='onExit'
        >
          <q-btn
            color="primary"
            icon="add_circle"
            :label="$q.screen.lt.sm ? '' : 'Agregar Banco'"
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              v-if="$q.screen.lt.sm"
            >
              Agregar Banco
            </q-tooltip>
          </q-btn>
        </PlaidLink>
        <q-btn
          :color="drawerLeft ? 'negative' : 'secondary'"
          :icon="drawerLeft ? 'filter_alt_off' : 'filter_alt'"
          :label="$q.screen.lt.sm ? '' : 'Filtros'"
          @click="drawerLeft = !drawerLeft"
        >
          <q-tooltip>
            {{ ucwords($t('organization.filter')) }}
          </q-tooltip>
        </q-btn>
        <q-btn
          color="teal"
          icon="change_circle"
          :label="$q.screen.lt.sm ? '' : 'Cambiar de banco'"
          @click="bankDialog = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            Cambiar de banco
          </q-tooltip>
        </q-btn>
      </div>
      <div class="col-12">
        <hooper
          style="height: 100%"
          :itemsToShow="response"
          @slide="updateCarousel">
          <slide v-for="(account, index) in accounts" :key="account.name">
            <q-card :class="index === dataSlide.currentSlide ? 'bg-teal' : 'bg-secondary'" style="max-width: 270px">
              <q-card-section class="text-white">
                <div class="text-bold">
                  {{ account.name }}
                </div>
                <div class="text-caption">
                  Disponible:
                  <span class="text-bold">
                    {{ account.balances.available }}
                    {{ account.balances.iso_currency_code }}
                  </span>
                  <br>
                  Actual:
                  <span class="text-bold">
                    {{ account.balances.current }}
                    {{ account.balances.iso_currency_code }}
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </slide>
          <hooper-pagination slot="hooper-addons"></hooper-pagination>
        </hooper>
      </div>
      <div class="col-12 text-h6 text-center">
        Movimientos
        <span class="text-secondary text-bold q-ml-sm" v-if="bank">
          {{ bank.name }}
        </span>
      </div>
      <div class="col-12">
        <q-scroll-area
          style="height: 64vh; width: 100%;"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          @scroll="getScroll"
        >
          <q-table
            row-key="id"
            :data="transactions"
            :columns="columns"
            :grid="$q.screen.lt.sm"
            :visible-columns="visibleColumns"
            :pagination="pagination"
            @row-click="viewDetails"
          >
            <template v-slot:top>
              <q-select
                v-if="!$q.screen.lt.sm"
                v-model="visibleColumns"
                multiple
                outlined
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columns"
                option-value="name"
                class="text-center"
                options-cover
                style="min-width: 180px"
              />
            </template>
            <template v-slot:item="props">
              <q-list class="full-width">
                <q-item clickable v-ripple @click="viewDetails(null, props.row)">
                  <q-item-section thumbnail>
                    <q-icon :name="props.row.amount > 0 ? 'chevron_right' : 'chevron_left'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">
                      {{ props.row.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label :class="props.row.amount > 0 ? 'text-teal' : 'text-negative'" :lines="1">
                      {{ props.row.amount }}
                    </q-item-label>
                    <q-item-label class="text-caption" :lines="2">
                      {{ props.row.date }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-table>
        </q-scroll-area>
      </div>
    </div>
    <q-dialog v-model="details" :maximized="$q.screen.lt.sm">
      <q-layout view="Lhh lpR fff" container>
        <q-card>
          <q-header class="bg-primary">
            <q-toolbar>
              <q-toolbar-title>Detalles de la Transacción</q-toolbar-title>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>
          <q-page-container>
            <q-page padding>
              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="info">
                  <q-list dense>
                    <q-item clickable v-ripple>
                      <q-item-section class="text-center text-h6">
                        {{ categorySelected.join(', ') }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section class="text-center q-mb-xs">
                        <span>
                          <q-icon name="pending_actions" color="secondary" size="30px" v-if="dataView.pending"/>
                          <q-icon name="check_circle" color="teal" size="30px" v-else/>
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple :class="dataView.pending ? 'text-center bg-secondary text-white rounded-borders' : 'text-center bg-teal text-white rounded-borders'">
                      <q-item-section>
                        <span class="text-bold">
                          {{ dataView.amount }} {{ dataView.iso_currency_code }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Fecha:
                      </q-item-section>
                      <q-item-section side class="text-bold" style="max-width: 210px;">
                        {{ dataView.date }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Tipo de Transacción:
                      </q-item-section>
                      <q-item-section side class="text-bold" style="max-width: 210px;">
                        {{ dataView.transaction_type }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Estatus
                      </q-item-section>
                      <q-item-section side class="text-bold" style="max-width: 210px;">
                        <q-badge v-if="dataView.pending" color="secondary">
                          Pendiente
                        </q-badge>
                        <q-badge color="teal" v-else>
                          Procesada
                        </q-badge>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Cód. de Transacción:
                      </q-item-section>
                      <q-item-section side class="text-bold" style="max-width: 210px;">
                        {{ dataView.transaction_code ?? '-' }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Proveedor:
                      </q-item-section>
                      <q-item-section side class="text-bold" style="max-width: 210px;">
                        {{ dataView.merchant_name ?? '-' }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple class="q-mt-xs">
                      <q-item-section class="relative-position">
                        <span class="absolute-top-left">
                          Descripción:
                        </span>
                      </q-item-section>
                      <q-item-section side class="text-bold text-right" style="max-width: 210px;">
                        {{ dataView.name }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
                <q-tab-panel name="location">
                  <GmapMap
                    :center="{
                        lat: location.lat,
                        lng: location.lon
                    }"
                    :zoom="7"
                    map-type-id="terrain"
                    style="width: 100%; height: 77vh"
                  >
                    <GmapMarker
                      :position="{
                        lat: location.lat,
                        lng: location.lon
                      }"
                      clickable
                      draggable
                      @click="openedInfoWindow = !openedInfoWindow"
                    >
                      <GmapInfoWindow :opened="openedInfoWindow">
                        <q-list>
                          <q-item clickable v-ripple>
                            <q-item-section>
                              Dirección
                              <span class="text-bold">{{ location.addess }}</span>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple active>
                            <q-item-section>
                              Ciudad
                              <span class="text-bold">
                                {{ location.city }}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple active>
                            <q-item-section>
                              Region
                              <span class="text-bold">
                                {{ location.region }}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple active>
                            <q-item-section>
                              Código Postal
                              <span class="text-bold">
                                {{ location.postal_code }}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple active>
                            <q-item-section>
                              País
                              <span class="text-bold">
                                {{ location.country }}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple active>
                            <q-item-section>
                              Número de Tienda
                              <span class="text-bold">
                                {{ location.store_number }}
                              </span>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </GmapInfoWindow>
                    </GmapMarker>
                  </GmapMap>
                </q-tab-panel>
                <q-tab-panel name="payment_meta">
                  <q-list>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Número de referencia
                        <span class="text-bold">{{ paymentMeta.reference_number }}</span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Destino
                        <span class="text-bold">
                          {{ paymentMeta.payee }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Por orden de
                        <span class="text-bold">
                          {{ paymentMeta.by_order_of }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Origen
                        <span class="text-bold">
                          {{ paymentMeta.payer }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Tipo de transferencia
                        <span class="text-bold">
                          {{ paymentMeta.payment_method }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Nombre del procesador de pago
                        <span class="text-bold">
                          {{ paymentMeta.payment_processor }}
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section>
                        Descripción proporcionada por el pagador de la transferencia.
                        <span class="text-bold">
                          {{ paymentMeta.reason }}
                        </span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </q-page>
          </q-page-container>
          <q-footer>
            <q-toolbar>
              <q-tabs
                v-model="tab"
                dense
                align="center"
                style="width: 100%"
              >
                <q-tab name="info" label="Transacción" />
                <q-tab name="location" label="Ubicación" />
                <q-tab name="payment_meta" label="Trans. Interbancarias" />
              </q-tabs>
            </q-toolbar>
          </q-footer>
        </q-card>
      </q-layout>
    </q-dialog>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
    <q-dialog
      v-model="drawerLeft"
      seamless
      position="right"
    >
      <q-card class="column full-height">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6">
            Filtrar
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="drawerLeft = false"/>
        </q-card-section>
        <q-card-section class="col scroll">
          <div class="row q-gutter-y-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <q-select
                outlined
                dense
                use-input
                v-model="category"
                input-debounce="0"
                clearable
                @filter="filterCategory"
                @input="filterDate"
                :options="categoryFilter" label="Categorias"
              />
            </div>
            <div class="q-mt-md col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <q-input type="date" dense v-model="from" hint="Desde" outlined @input="filterDate"/>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <q-input type="date" dense v-model="to" hint="Hasta" outlined @input="filterDate"/>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn icon="highlight_off" color="negative" @click="drawerLeft = false"></q-btn>
          <q-btn icon="filter_alt_off" color="primary" @click="restore"></q-btn>
        </q-card-actions>
        <q-inner-loading :showing="loadingFilter">
          <q-spinner-gears size="100px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>
    <!-- <q-page-sticky position="bottom-left" :offset="[18, 18]" v-if="scY > 300">
      <q-btn fab flat icon="expand_less" color="primary" @click="toTop"/>
    </q-page-sticky> -->
    <q-dialog v-model="bankDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Seleccionar Banco</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            :options="banks"
            dense
            outlined
            v-model="bank"
            autofocus
            option-label="name"
            option-value="id"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Aceptar" @click="selectedBank" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import PlaidLink from '../components/PlaidLink.vue'
import { date, Notify, SessionStorage } from 'quasar'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
import { Hooper, Slide, Pagination as HooperPagination } from 'hooper'
import 'hooper/dist/hooper.css'

export default {
  name: 'App',
  components: {
    Hooper,
    Slide,
    HooperPagination,
    PlaidLink
  },
  mixins: [mixins.containerMixin],
  data () {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#ff9e00',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#ff9e00',
        width: '9px',
        opacity: 0.2
      },
      loadingFilter: false,
      bankDialog: false,
      drawerLeft: false,
      openedInfoWindow: true,
      accounts: [],
      loading: false,
      tab: 'info',
      details: false,
      linkPlaid: {},
      location: {},
      dataView: {},
      paymentMeta: {},
      banks: [],
      bank: null,
      pagination: { rowsPerPage: 100 },
      categorySelected: [],
      visibleColumns: ['name', 'date', 'amount', 'category'],
      transactions: [],
      from: date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD'),
      to: date.formatDate(Date(), 'YYYY-MM-DD'),
      scTimer: 0,
      scY: 0,
      dataSlide: null,
      scrollPosition: 0,
      categories: [],
      category: null,
      categoryFilter: [],
      columns: [
        {
          name: 'date',
          label: 'Fecha de transacción',
          align: 'left',
          field: 'date',
          sortable: true
        },
        {
          name: 'name',
          label: 'Nombre',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'transaction_type',
          label: 'Tipo de transacción',
          align: 'left',
          field: 'transaction_type',
          sortable: true
        },
        {
          name: 'iso_currency_code',
          label: 'Moneda',
          align: 'left',
          field: 'iso_currency_code',
          sortable: true
        },
        {
          name: 'authorized_date',
          label: 'Fecha de autirización',
          align: 'left',
          field: 'authorized_date',
          sortable: true
        },
        {
          name: 'amount',
          label: 'Monto',
          align: 'left',
          field: 'amount',
          sortable: true
        },
        {
          name: 'category_id',
          label: 'Categoria id',
          align: 'left',
          field: 'category_id',
          sortable: true
        },
        {
          name: 'category',
          label: 'Categoria',
          align: 'left',
          field: row => row.category.join(' > '),
          sortable: true
        },
        {
          name: 'check_number',
          label: 'Verifique el número',
          align: 'left',
          field: 'check_number',
          sortable: true
        },
        {
          name: 'merchant_name',
          label: 'Nombre del comerciante',
          align: 'left',
          field: 'merchant_name',
          sortable: true
        },
        {
          name: 'payment_channel',
          label: 'Canal de pago',
          align: 'left',
          field: 'payment_channel',
          sortable: true
        },
        {
          name: 'pending',
          label: 'Pendiente',
          align: 'left',
          field: row => row.pending ? 'Pendiente' : 'Procesado',
          sortable: true
        },
        {
          name: 'pending_transaction_id',
          label: 'id transacción pendiente',
          align: 'left',
          field: 'pending_transaction_id',
          sortable: true
        },
        {
          name: 'personal_finance_categorySelected',
          label: 'Categoría finanzas personales',
          align: 'left',
          field: 'personal_finance_categorySelected',
          sortable: true
        },
        {
          name: 'transaction_code',
          label: 'Código de transacción',
          align: 'left',
          field: 'transaction_code',
          sortable: true
        },
        {
          name: 'transaction_id',
          label: 'id transacción',
          align: 'left',
          field: 'transaction_id',
          sortable: true
        },
        {
          name: 'unofficial_currency_code',
          label: 'Código de moneda no oficial',
          align: 'left',
          field: 'unofficial_currency_code',
          sortable: true
        }
      ]
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE]),
    /**
     * Response
     */
    response () {
      console.log(this.$q.screen.lt.sm)
      return this.$q.screen.lt.sm ? 1.25 : this.$q.screen.lt.md ? 2 : 3
    }
  },
  created () {
    this.getLink()
    this.getBanks()
    this.getCategories()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  mounted () {
    // window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    filterCategory (val, update) {
      if (val === '') {
        update(() => {
          this.categoryFilter = this.categories
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.categoryFilter = this.categories.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    async getCategories () {
      const { res } = await this.$services.getData(['plaid', 'categories'])
      this.categories = res.data.categories.map(category => {
        category.label = category.hierarchy.join('-')
        category.id = category.category_id
        return category
      })
    },
    getScroll (data) {
      this.scrollPosition = data.verticalPosition
    },
    /**
     * Restore filter
     */
    restore () {
      this.loadingFilter = true
      setTimeout(() => {
        this.from = date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD')
        this.to = date.formatDate(Date(), 'YYYY-MM-DD')
        this.category = null
        this.filterDate()
        this.loadingFilter = false
      }, 2000)
    },
    /**
     * Filter carousel
     * @param {Object} data data event
     */
    updateCarousel (data) {
      this.dataSlide = data
      this.filterDate()
    },
    /**
     * Handle scroll
     */
    // handleScroll () {
    //   if (this.scTimer) return
    //   this.scTimer = setTimeout(() => {
    //     this.scY = window.scrollY
    //     clearTimeout(this.scTimer)
    //     this.scTimer = 0
    //   }, 100)
    // },
    /**
     * Up cursor
     */
    // toTop () {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: 'smooth'
    //   })
    // },
    /**
     * Details transaction
     * @param {Object} row data transaction
     */
    viewDetails (event, row) {
      this.details = true
      this.dataView = row
      this.location = row.location
      this.paymentMeta = row.payment_meta
      this.categorySelected = row.category
    },
    /**
     * Select banck
     */
    selectedBank () {
      try {
        SessionStorage.set('bankSession', JSON.stringify(this.bank))
        this.getTransactions(this.bank)
      } catch (error) {
        Notify.create({
          message: error.message,
          icon: 'warning',
          color: 'negative'
        })
      }
    },
    /**
     * Valid session bank
     */
    validSessionBank () {
      this.bank = JSON.parse(SessionStorage.getItem('bankSession'))
      if (!this.bank) {
        this.bankDialog = true
      }
    },
    /**
     * Get data link
     */
    async getLink () {
      this.loading = true
      const { res } = await this.$services.postData(['plaid', 'create-token'])
      this.linkPlaid = res.data
      this.loading = false
      this.validSessionBank()
    },
    /**
     * Get bank all
     */
    async getBanks () {
      const { res } = await this.$services.getData(['banks'])
      this.banks = res.data
    },
    /**
     * Filter between date
     */
    filterDate () {
      const bankSession = JSON.parse(SessionStorage.getItem('bankSession'))
      this.getTransactions(bankSession)
    },
    /**
     * Object event
     * @param {Object} data
     */
    onLoad (data) {
      console.log(data, 'onLoad')
    },
    /**
     * Name event
     * @param {String} data
     */
    onEvent (data) {
      console.log(data, 'onEvent')
    },
    /**
     * Update and filter transactions
     * @param {Array} transactions transactions all
     * @param {Array} accounts acconts all
     */
    updatedModel (transactions, accounts) {
      let mapTransactions = []
      accounts.forEach((account, index) => {
        mapTransactions = transactions.map(transaction => {
          if (transaction.account_id === account.account_id) {
            transaction.index = index
          }
          return transaction
        })
      })
      return mapTransactions.filter(transaction => {
        return transaction.index === this.dataSlide.currentSlide
      })
        .filter(transaction => {
          if (this.category) {
            return transaction.category_id === this.category.category_id
          }
          return true
        })
    },
    /**
     * Get Transaction bank
     * @param {Object} data access token
     */
    async getTransactions (data) {
      try {
        if (data) {
          this.loading = true
          const { res } = await this.$services.getData(['plaid', 'transactions'], {
            access_token: data.access_token,
            start_date: this.from,
            end_date: this.to
          })
          this.transactions = this.updatedModel(res.data.transactions, res.data.accounts)
          this.accounts = res.data.accounts
          this.loading = false
          this.bankDialog = false
        }
      } catch (err) {
        Notify.create({
          message: err.message,
          icon: 'warning',
          color: 'negative'
        })
        this.loading = false
        this.getAccessToken(this.bank.public_token)
      }
    },
    /**
     * Get Access token
     * @param {String} publickToken Public Token
     */
    async getAccessToken (publicToken) {
      try {
        const { res } = await this.$services.postData(['plaid', 'exchange-token'], {
          public_token: publicToken
        })
        this.getTransactions(res.data)
        const data = { ...this.bank, ...res.data }
        this.saveBank(data)
      } catch (err) {
        Notify.create({ message: err.message, icon: 'warning', color: 'negative' })
        this.$refs.authBank.autoClick()
        this.loading = false
      }
    },
    /**
     * Set model bank
     * @param {Object} data model bank
     */
    modelBank (data) {
      return {
        institution_id: data.institution ? data.institution.institution_id : data.institution_id,
        name: data.institution ? data.institution.name : data.name,
        link_session_id: data.link_session_id,
        public_token: data.public_token,
        status: data.status,
        access_token: data.access_token,
        transfer_status: data.transfer_status,
        user_created_id: this.userSession.id
      }
    },
    /**
     * Success auth
     */
    async onSuccess (publicToken, metadata) {
      this.bank = metadata
      this.getAccessToken(publicToken)
    },
    /**
     * Save bankc
     * @param {Object} data data bank
     */
    async saveBank (data) {
      try {
        const { res } = await this.$services.postData(['banks'], this.modelBank(data))
        Notify.create({
          message: '¡Banco guardado exitosamente!',
          icon: 'warning',
          color: 'teal'
        })
        this.bank = res.data
        SessionStorage.set('bankSession', JSON.stringify(res.data))
        this.getBanks()
      } catch (error) {
        Notify.create({
          message: error.message,
          icon: 'warning',
          color: 'negative'
        })
      }
    },
    /**
     * Exit dialog plaid
     * @param {Object} err error information
     * @param {Object} metadata data information
     */
    onExit (err, metadata) {
      Notify.create({
        message: 'Operacion Cancelada',
        icon: 'thumb_up_alt',
        color: 'positive'
      })
      console.log(err, metadata)
    }
  }
}
</script>
