<template>
  <q-page padding>
    <q-expansion-item
      v-model="expanded"
      expand-icon-toggle
      expand-separator
      v-if="balance"
      class="shadow-1 overflow-hidden"
      style="border-radius: 10px"
      header-class="bg-primary text-white"
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
        <span style="font-size: 11px;" v-if="field">
          {{ field.denomination }}
        </span>
      </q-item-section>
      <q-item-section side>
        <div class="row items-center">
          <q-btn flat icon="sync_alt" color="white" size="12px" round>
            <q-popup-edit
              v-model="field"
              :validate="val => val !== null"
              @hide="val => val !== null"
              @save="update"
              auto-save
              v-slot="scope"
            >
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                behavior="menu"
                input-debounce="20"
                name="field"
                v-model.number="scope.value"
                option-label="denomination"
                option-value="id"
                ref="sessionFields"
                label="Campo"
                autofocus
                :options="sessionFields"
                @filter="filterFields"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-popup-edit>
          </q-btn>
          <q-btn flat icon="update" color="white" size="12px" round @click="update"/>
        </div>
      </q-item-section>
    </template>
    <q-card>
      <q-card-section class="q-pa-sm">
        <hooper
          style="height: 100%"
          :itemsToShow="2">
          <slide v-for="bal in balance.accounts" :key="bal.name">
            <q-card v-if="bal.amount" :class="bal.status === 'pending_approval' ? 'bg-secondary' : bal.transaction_id ? 'bg-teal' : 'bg-negative'" style="width: 150px">
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
          </slide>
          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
      </q-card-section>
    </q-card>
    </q-expansion-item>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 65vh; width: 100%;"
      class="q-mt-xs"
    >
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="egress">
          <q-form @submit="saveCashFlow()" @reset="clean" ref="cashFlow">
            <div class="row q-gutter-y-xs">
              <div class="col-6">
                <div class="text-subtitle1 text-bold">Nuevo Egreso</div>
              </div>
              <div class="col-6 text-right">
                <q-btn icon="add_a_photo"  color="teal" @click="takePicture"/>
              </div>
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="category"
                  v-model="category"
                  option-label="name"
                  option-value="id"
                  ref="categories"
                  label="Categoria"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="categories"
                  @filter="getCategories"
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
              <div class="col-12" v-if="category && category.name === 'Costo'">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="guide"
                  v-model="guide"
                  option-label="name"
                  option-value="id"
                  label="Guia"
                  ref="guides"
                  :options="guides"
                  @filter="getGuides"
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
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="concept"
                  v-model="concept"
                  option-label="name"
                  option-value="id"
                  label="Concepto"
                  ref="concepts"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="concepts"
                  @filter="getConcepts"
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
              <div class="col-12">
                <q-select
                  autocomplete="off"
                  use-input
                  dense
                  outlined
                  clearable
                  behavior="menu"
                  input-debounce="20"
                  name="beneficiary"
                  v-model="beneficiarySelected"
                  option-label="name"
                  ref="beneficiaries"
                  option-value="id"
                  label="Beneficiario"
                  :rules="[val => val && val !== null || 'Este campo es requerido']"
                  :options="beneficiaries"
                  @filter="getBeneficiaries"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogBeneficiary = true"/>
                  </template>
                </q-select>
              </div>
              <div class="col-12">
                <q-input
                  outlined
                  v-model="amount"
                  label="Monto"
                  dense
                  type="number"
                  @blur="blanceCalculate"
                  :rules="[
                    val => val && val !== null && val > 0 || 'Este campo es requerido',
                    val => val < balanceTotal || 'Saldo insuficiente'
                  ]"/>
              </div>
              <div class="col-12">
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
              <div class="col-6" v-for="(image, index) in images" :key="image.id">
                <q-img
                  :src="image.img"
                  style="width: 100%; height: 100px;"
                  native-context-menu
                >
                  <q-icon class="absolute all-pointer-events bg-dark" size="20px" name="cancel" color="white" style="top: 0px; right: 0px; border-radius: 100%;" @click="deleteImage(index)"/>
                </q-img>
              </div>
              <div class="col-12 q-gutter-x-sm text-right">
                <q-btn icon="clear" color="negative" label="Limpiar" type="reset"/>
                <q-btn icon="save" color="primary" label="Guardar" type="submit" :loading="loadingForm"/>
              </div>
            </div>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="entry">
          <q-table
            grid
            :data="fieldCashFlows"
            row-key="name"
            :filter="filter"
            hide-header
            :loading="loadingForm"
            :pagination.sync="pagination"
          >
            <template v-slot:top-left>
            </template>
            <template v-slot:top>
              <div class="text-h6" style="width: 30%">
                Ingresos
              </div>
              <q-space/>
              <q-input outlined dense debounce="300" v-model="filter" placeholder="Buscar" style="width: 70%">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:item="props">
              <q-card class="full-width q-mt-sm">
                <q-card-section class="row">
                  <div class="col-6">
                    <span class="text-subtitle2">{{ props.row.concept.name }}</span>
                    <br/>
                    <span class="text-grey">{{ props.row.description }}</span>
                  </div>
                  <div class="col-6 text-subtitle2 text-right">
                    <div>{{ props.row.amount }}</div>
                    <div>{{ $t(`fieldCashFlow.${props.row.status}`) }}</div>
                  </div>
                </q-card-section>
                <q-separator v-if="props.row.status === 'pending_approval'"/>
                <q-card-actions align="right" v-if="props.row.status === 'pending_approval'">
                  <q-btn color="teal" icon="check" dense @click="chageStatus(props.row)"/>
                </q-card-actions>
              </q-card>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="movements">
          <q-table
            :data="transactions"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="name"
            grid
            grid-header
            :filter="filterBalance"
          >
            <template v-slot:top>
              <div class="text-h6" style="width: 30%">
                Balance
              </div>
              <q-input outlined dense debounce="300" v-model="filterBalance" placeholder="Buscar" style="width: 70%">
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
                    <br/>
                    <span class="text-right" style="font-size: 11px;">
                      {{ props.row.description }}
                    </span>
                  </div>
                  <div class="col-2 text-bold">
                    <div v-if="!props.row.transaction_id" class="text-negative q-ml-sm">
                      -{{ props.row.amount }}
                    </div>
                  </div>
                  <div class="col-3 text-bold text-center">
                    <div v-if="props.row.transaction_id" class="text-teal">
                      {{ props.row.amount }}
                    </div>
                  </div>
                  <div class="col-2 text-right text-bold">
                    <div class="text-blue">
                      {{ props.row.balance }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-scroll-area>
    <q-footer reveal>
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
      >
        <q-tab name="entry" label="Ingreso" />
        <q-tab name="egress" label="Egreso" />
        <q-tab name="movements" label="Movimientos" />
      </q-tabs>
    </q-footer>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialogBeneficiary"
    >
      <dynamic-form
        module="beneficiary"
        :config="beneficiary"
        :loading="loadingForm"
        @cancel="addDialogBeneficiary = false"
        @save="save"
      />
    </q-dialog>
    <q-inner-loading :showing="visibleSync">
      <q-spinner-oval size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
import { beneficiary, buttonsActions, propsPanelEdition } from '../config-file/beneficiary/beneficiaryConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper'
import 'hooper/dist/hooper.css'
import { Preferences } from '@capacitor/preferences'
import { Network } from '@capacitor/network'
import { date } from 'quasar'
export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    DynamicForm
  },
  data () {
    return {
      guide: null,
      guides: [],
      filterBalance: '',
      expanded: true,
      visibleSync: false,
      columns: [
        { name: 'description', align: 'left', label: 'Descripción' },
        { name: 'debe', align: 'right', label: 'Debe' },
        { name: 'haber', align: 'right', label: 'Haber' },
        { name: 'balance', align: 'right', label: 'Saldo' }
      ],
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
      pagination: { rowsPerPage: 100 },
      loadingForm: false,
      beneficiary,
      buttonsActions,
      filter: '',
      propsPanelEdition,
      addDialogBeneficiary: false,
      images: [],
      /**
       * Name submenu
       * @type {String}
       */
      tab: 'entry',
      /**
       * Amount cash flow
       * @type {Number}
       */
      amount: 0,
      /**
       * Category selected cash flow
       * @type {Object}
       */
      category: null,
      /**
       * Description cash flow
       * @type {String}
       */
      description: null,
      /**
       * Concept selected cash flow
       * @type {Object}
       */
      concept: null,
      /**
       * Concepts cash flow
       * @type {Array}
       */
      concepts: [],
      /**
       * Beneficiary selected cash flow
       * @type {Object}
       */
      beneficiarySelected: null,
      /**
       * Beneficiaries cash flow
       * @type {Array}
       */
      beneficiaries: [],
      /**
       * Categories cash flow
       * @type {Array}
       */
      categories: [],
      fieldCashFlows: [],
      transactions: [],
      balanceTotal: 0,
      balance: null,
      sessionFields: [],
      field: {}
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getFields()
    this.update()
  },
  mounted () {
    Network.addListener('networkStatusChange', status => {
      this.sync(status)
    })
  },
  watch: {
    async amount () {
      const balance = await this.getBalanceTotal()
      this.balanceTotal = (this.balance.balance + balance.entry) - balance.egress
    },
    field () {
      this.update()
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    getFields () {
      this.getOffline('field', () => {
        this.$services.getData(['fields'], {
          dataEqualFilter: {
            field_supervisor_id: this.userSession.id
          }
        })
          .then(({ res }) => {
            this.field = res.data[0]
            this.saveListStorage(this.field, 'field')
            this.update()
          })
      })
    },
    filterFields (value, update) {
      this.getOffline('fields', () => {
        this.$services.getData(['fields'], {
          dataSearch: {
            denomination: value
          },
          dataEqualFilter: {
            field_supervisor_id: this.userSession.id
          }
        })
          .then(({ res }) => {
            update(() => {
              this.sessionFields = res.data
              this.saveListStorage(res.data, 'sessionFields')
            })
          })
      }, update, value)
    },
    /**
     * Calculate balnce storage
     */
    async getBalanceTotal () {
      const transactionFieldCashFlows = await this.parseJson('transactionFieldCashFlows')
      const egress = this.totalCalculate(transactionFieldCashFlows, 'amount', 'egress')
      const entry = this.totalCalculate(transactionFieldCashFlows, 'amount', 'entry')
      return {
        egress,
        entry
      }
    },
    /**
     * Calculate balnce storage
     */
    async blanceCalculate () {
      if (this.balance) {
        const balance = await this.getBalanceTotal()
        this.balanceTotal = (this.balance.balance + balance.entry) - (balance.egress + Number(this.amount))
      }
    },
    /**
     * Calculate entry total
     */
    totalCalculate (data, field, type) {
      let total = 0
      if (data.length > 0) {
        data.forEach(element => {
          if (type === 'egress' && !element.transaction_id) {
            total = Number(total) + Number(element[field])
          }
          if (type === 'entry' && element.transaction_id) {
            total = Number(total) + Number(element[field])
          }
        })
      }
      return total
    },
    /**
     * Sync connection
     * @param {Obeject} status status connection
     */
    sync (status) {
      if (status.connected) {
        this.syncChangeStatus()
        this.notify(this, 'template.connection', 'positive', 'wifi')
      } else {
        this.notify(this, 'template.withoutConnection', 'negative', 'wifi_off')
      }
    },
    /**
     * Format data
     * @param {String} name local storage
     */
    async parseJson (name) {
      const data = await Preferences.get({ key: name })
      return JSON.parse(data.value) ?? []
    },
    /**
     * Model cash flow
     */
    modelCashFlow () {
      return {
        images: this.images,
        concept_id: this.concept.id,
        beneficiary_id: this.beneficiarySelected.id,
        amount: this.amount,
        description: this.description,
        user_created_id: this.userSession.id,
        date: date.formatDate(Date(), 'YYYY-MM-DD HH:mm:ss'),
        field_id: this.field.id
      }
    },
    /**
     * Sync entry
     */
    async syncChangeStatus () {
      this.visibleSync = true
      const fieldCashFlows = await this.parseJson('transactionFieldCashFlows')
      this.$services.postUpload(['change-status'], {
        data: fieldCashFlows
      })
        .then(async () => {
          await Preferences.remove({ key: 'transactionFieldCashFlows' })
          this.update()
          this.visibleSync = false
        })
        .catch((err) => {
          console.log(err)
          this.visibleSync = false
        })
    },
    /**
     * Update data
     */
    async update () {
      this.getFieldCashFlow()
      this.getTransactions()
      this.getBalance()
    },
    /**
     * Get data offline or online
     * @param {String} entity entity name
     * @param {Function} callback callback
     * @param {Function} update callback
     */
    async getOffline (entity, callback, update = null, valueFilter = null) {
      const status = await Network.getStatus()
      if (status.connected) {
        callback()
      } else {
        this.getListStorage(entity, update, valueFilter)
      }
    },
    /**
     * Validate cash flow
     */
    async validateStateCashFlow () {
      const valueStorage = await this.parseJson('transactionFieldCashFlows')
      valueStorage.forEach(storage => {
        this.fieldCashFlows = this.fieldCashFlows.map(fieldCashFlow => {
          if (fieldCashFlow.id === storage.id) {
            fieldCashFlow.status = 'approved'
          }
          return fieldCashFlow
        })
      })
    },
    /**
     * Save offline or online
     * @param {String} entity entity save
     * @param {Object} dataSave data save
     * @param {Function} callback callback
     */
    async postOffline (entity, dataSave, callback) {
      const status = await Network.getStatus()
      if (status.connected) {
        callback()
      } else {
        this.visibleSync = true
        setTimeout(async () => {
          const valueStorage = await this.parseJson(entity)
          valueStorage.push(dataSave)
          this.saveListStorage(valueStorage, entity)
          this.validateStateCashFlow()
          this.clean()
          this.notify(this, 'fieldCashFlow.addSuccessful', 'positive', 'mood')
          this.visibleSync = false
        }, 1000)
      }
    },
    /**
     * All Transactions
     */
    async getBalance () {
      this.visibleSync = true
      this.getOffline('balance', () => {
        this.$services.getData(['balance'], {
          field_id: this.field.id
        })
          .then(({ res }) => {
            this.balance = res.data
            this.balanceTotal = res.data.balance
            this.saveListStorage(res.data, 'balance')
            this.blanceCalculate()
            this.visibleSync = false
          })
      })
    },
    /**
     * All Transactions
     */
    async getTransactions () {
      this.getOffline('transactions', () => {
        this.$services.getData(['field-cash-flows'], {
          sortBy: 'date',
          sortOrder: 'desc',
          dataEqualFilter: {
            status: 'approved',
            field_id: this.field.id
          },
          paginate: false
        })
          .then(({ res }) => {
            this.transactions = res.data.data
            this.saveListStorage(res.data.data, 'transactions')
          })
      })
    },
    /**
     * Change status cash
     * @param {Object} data cash flow
     */
    chageStatus (data) {
      data.date = data.date ?? date.formatDate(Date(), 'YYYY-MM-DD HH:mm:ss')
      this.postOffline('transactionFieldCashFlows', data, () => {
        this.loadingForm = true
        this.$services.putData(['field-cash-flows', data.id], {
          ...data,
          status: 'approved'
        })
          .then(res => {
            this.notify(this, 'fieldCashFlow.approvedSuccess', 'positive', 'mood')
            this.update()
            this.clean()
            this.loadingForm = false
          })
          .catch(err => {
            this.notify(this, `fieldCashFlow.${err.message}`, 'negative', 'warning')
            this.update()
            this.loadingForm = false
          })
      })
    },
    /**
     * All field cash flow
     */
    getFieldCashFlow () {
      this.getOffline('fieldCashFlows', () => {
        this.$services.getData(['field-cash-flows'], {
          sortBy: 'status',
          sortOrder: 'asc',
          egress: false,
          dataEqualFilter: {
            field_id: this.field.id
          },
          paginate: false
        })
          .then(({ res }) => {
            this.fieldCashFlows = res.data.data
            this.saveListStorage(res.data.data, 'fieldCashFlows')
          })
      })
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      if (ref) {
        setTimeout(() => {
          ref.resetValidation()
        }, 100)
      }
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.branch_office_id = this.branchOffice.id
      this.loadingForm = true
      this.$services.postData(['beneficiaries'], data)
        .then(({ res }) => {
          this.addDialogBeneficiary = false
          this.loadingForm = false
          this.beneficiarySelected = res.data
          this.notify(this, 'beneficiary.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Clean formulary
     */
    clean () {
      this.concept = null
      this.beneficiarySelected = null
      this.amount = 0
      this.description = null
      this.category = null
      this.images = []
      this.resetValidations(this.$refs.cashFlow)
    },
    /**
     * Change format
     * @param {String} dataurl image
     */
    srcToFile (dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    saveCashFlow (data = this.modelCashFlow()) {
      if (data.images.length >= 3) {
        this.postOffline('transactionFieldCashFlows', data, () => {
          this.loadingForm = true
          this.$services.postUpload(['field-cash-flows'], data)
            .then(({ res }) => {
              this.loadingForm = false
              this.beneficiarySelected = res.data
              this.notify(this, 'fieldCashFlow.addSuccessful', 'positive', 'mood')
              this.update()
              this.clean()
            })
            .catch(() => {
              this.loadingForm = false
            })
        })
      } else {
        this.notify(this, 'fieldCashFlow.errorAmountImage', 'negative', 'warning')
      }
    },
    /**
     * Delete image
     * @param {Numer} index index image
     */
    deleteImage (index) {
      this.images.splice(index, 1)
    },
    /**
     * All Categories
     */
    async getCategories (value, update) {
      this.getOffline('categories', () => {
        this.$services.getData(['categories'], {
          sortBy: 'id',
          sortOrder: 'desc',
          dataSearch: {
            name: value
          },
          paginate: false
        })
          .then(({ res }) => {
            update(() => {
              this.categories = res.data.data
              this.saveListStorage(res.data.data, 'categories')
            })
          })
          .catch(err => {
            console.log(err)
          })
      }, update, value)
    },
    /**
     * Save list data in local storage
     * @param {Array} data save
     * @param {String} entity name variable
     */
    async saveListStorage (data, entity) {
      await Preferences.set({
        key: entity,
        value: JSON.stringify(data)
      })
    },
    /**
     * Get value in entity
     * @param {String} entity name entity
     */
    async getListStorage (entity, update = null, value) {
      const data = await Preferences.get({ key: entity })
      if (update) {
        const selectData = JSON.parse(data.value)
        if (value && value === '') {
          update(() => {
            this[entity] = selectData
          })
          return
        }
        update(() => {
          const needle = value.toLowerCase()
          this[entity] = selectData.filter(v => v[this.$refs[entity].optionLabel].toLowerCase().indexOf(needle) > -1)
        })
      } else {
        this[entity] = JSON.parse(data.value)
      }
    },
    /**
     * All Guides
     */
    getGuides (value, update) {
      this.getOffline('guides', () => {
        this.$services.getData(['guides'], {
          sortBy: 'id',
          sortOrder: 'desc',
          dataSearch: {
            serie_number: value,
            start_date: value,
            deadline: value,
            origin_address: value,
            destination_address: value,
            material: value,
            code_runpa: value
          },
          paginate: false
        })
          .then(({ res }) => {
            update(() => {
              this.guides = res.data
              this.saveListStorage(res.data, 'guides')
            })
          })
          .catch(err => {
            console.log(err)
          })
      }, update, value)
    },
    /**
     * All Concepts
     */
    getConcepts (value, update) {
      this.getOffline('concepts', () => {
        this.$services.getData(['concepts'], {
          sortBy: 'id',
          sortOrder: 'desc',
          dataSearch: {
            name: value
          },
          paginate: false
        })
          .then(({ res }) => {
            update(() => {
              this.concepts = res.data
              this.saveListStorage(res.data, 'concepts')
            })
          })
          .catch(err => {
            console.log(err)
          })
      }, update, value)
    },
    /**
     * All Beneficiaries
     */
    getBeneficiaries (value, update) {
      this.getOffline('beneficiaries', () => {
        this.$services.getData(['beneficiaries'], {
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
              this.beneficiaries = res.data
              this.saveListStorage(res.data, 'beneficiaries')
            })
          })
      }, update, value)
    },
    /**
     * Set Image
     */
    async takePicture () {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        webUseInput: true,
        promptLabelHeader: 'Seleccionar imagen',
        promptLabelPhoto: 'Abrir galería',
        promptLabelPicture: 'Abrir cámara',
        resultType: CameraResultType.DataUrl
      })
      this.images.push({
        img: image.dataUrl
      })
    }
  }
}
</script>
