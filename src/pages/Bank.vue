<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-gutter-x-sm text-center" style="margin-top: 2px;">
        <PlaidLink
          clientName="Qbits DBA"
          env="sandbox"
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
        <hooper style="height: 100%" :itemsToShow="1.25" @slide="updateCarousel">
          <slide v-for="account in accounts" :key="account.name">
            <q-card class="bg-primary" style="max-width: 270px">
              <q-card-section class="q-py-xs text-white">
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
      <div class="col-12 q-mt-sm">
        <q-scroll-area
          style="height: 70vh; width: 100%;"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :visible="false"
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
              <div class="text-subtitle1">
                Movimientos
              </div>
              <q-space />
              <div class="text-subtitle1 text-secondary" v-if="bank">
                {{ bank.name }}
              </div>
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
                options-cover
                style="min-width: 180px"
              />
            </template>
            <template v-slot:item="props">
              <q-list class="full-width">
                <q-item clickable v-ripple @click="viewDetails(props.row)">
                  <q-item-section thumbnail no-wrap>
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
    <q-dialog v-model="details" maximized>
      <q-layout view="Lhh lpR fff" container>
        <q-card>
          <q-header class="bg-primary">
            <q-toolbar>
              <q-toolbar-title>Detalles de la transacción</q-toolbar-title>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>
          <q-page-container>
            <q-page padding>
              <q-tab-panels v-model="tab" animated>
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
                <q-tab-panel name="info">
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
    <q-drawer
      v-model="drawerLeft"
      :width="350"
      :breakpoint="700"
      side="right"
      class="bg-primary text-white"
    >
      <q-card class="column full-height">
        <q-card-section class="row items-center bg-primary">
          <div class="text-h6">
            Filtrar
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="drawerLeft = false"/>
        </q-card-section>
        <q-card-section class="col scroll">
          <div class="row q-gutter-y-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <q-input type="date" dense v-model="from" hint="Desde" outlined @input="filterDate"/>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <q-input type="date" dense v-model="to" hint="Hasta" outlined @input="filterDate"/>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right">
              <!-- <q-select outlined v-model="model" :options="options" label="Outlined" /> -->
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn icon="highlight_off" color="negative"></q-btn>
          <q-btn icon="restore" color="primary"></q-btn>
        </q-card-actions>
      </q-card>
    </q-drawer>
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
      bankDialog: false,
      drawerLeft: false,
      openedInfoWindow: true,
      accounts: [],
      loading: false,
      tab: 'info',
      details: false,
      linkPlaid: {},
      location: {},
      paymentMeta: {},
      banks: [],
      bank: null,
      pagination: { rowsPerPage: 100 },
      category: [],
      visibleColumns: ['name', 'date', 'amount'],
      transactions: [],
      from: date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD'),
      to: date.formatDate(Date(), 'YYYY-MM-DD'),
      scTimer: 0,
      scY: 0,
      dataSlide: null,
      columns: [
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
          name: 'date',
          label: 'Fecha de transacción',
          align: 'left',
          field: 'date',
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
          field: row => row.category.join(', '),
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
          field: 'pending',
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
          name: 'personal_finance_category',
          label: 'Categoría finanzas personales',
          align: 'left',
          field: 'personal_finance_category',
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
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.getLink()
    this.getBanks()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  // mounted () {
  //   window.addEventListener('scroll', this.handleScroll)
  // },
  methods: {
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
    viewDetails (row) {
      this.details = true
      this.location = row.location
      this.paymentMeta = row.payment_meta
      this.category = row.category
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
          color: 'thumb_up_alt'
        })
      }
    },
    /**
     * Exit dialog plaid
     * @param {Object} err error information
     * @param {Object} metadata data information
     */
    onExit (err, metadata) {
      console.log(err, metadata)
    }
  }
}
</script>
