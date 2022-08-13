<template>
  <q-page padding>
    <q-expansion-item
      v-model="expanded"
      v-if="balance"
      class="shadow-1 overflow-hidden"
      style="border-radius: 10px"
      icon="monetization_on"
      :label="`Balance ${balance.balance}`"
      header-class="bg-primary text-white"
      expand-icon-class="text-white"
    >
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
      style="height: 66vh; width: 100%;"
      class="q-mt-xs"
    >
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="egress">
          <q-form @submit="saveCashFlow" @reset="clean" ref="cashFlow">
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
                  :rules="[val => val && val !== null || 'Este campo es requerido']"/>
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
      filterBalance: '',
      expanded: true,
      columns: [
        { name: 'description', align: 'left', label: 'Descripción' },
        { name: 'debe', align: 'right', label: 'Debe' },
        { name: 'haber', align: 'right', label: 'Haber' },
        { name: 'balance', align: 'right', label: 'Saldo' }
      ],
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
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
      balance: null
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.update()
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Update data
     */
    update () {
      this.getFieldCashFlow()
      this.getTransactions()
      this.getBalance()
    },
    /**
     * All Transactions
     */
    getBalance () {
      this.$services.getData(['balance'])
        .then(({ res }) => {
          this.balance = res.data
          console.log(this.balance)
        })
    },
    /**
     * All Transactions
     */
    getTransactions () {
      this.$services.getData(['field-cash-flows'], {
        sortBy: 'updated_at',
        sortOrder: 'desc',
        dataEqualFilter: {
          status: 'approved'
        },
        paginate: false
      })
        .then(({ res }) => {
          this.transactions = res.data.data
        })
    },
    /**
     * Change status cash
     * @param {Object} data cash flow
     */
    chageStatus (data) {
      data.status = 'approved'
      this.loadingForm = true
      this.$services.putData(['field-cash-flows', data.id], data)
        .then(res => {
          this.notify(this, 'fieldCashFlow.approvedSuccess', 'positive', 'mood')
          this.update()
          this.loadingForm = false
        })
        .catch(err => {
          this.notify(this, `fieldCashFlow.${err.message}`, 'negative', 'warning')
          this.update()
          this.loadingForm = false
        })
    },
    /**
     * All field cash flow
     */
    getFieldCashFlow () {
      this.$services.getData(['field-cash-flows'], {
        sortBy: 'status',
        sortOrder: 'asc',
        egress: false,
        paginate: false
      })
        .then(({ res }) => {
          this.fieldCashFlows = res.data.data
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
    clean () {
      this.concept = null
      this.beneficiarySelected = null
      this.amount = 0
      this.description = null
      this.category = null
      this.images = []
      this.resetValidations(this.$refs.cashFlow)
    },
    srcToFile (dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    modelCashFlow () {
      const model = new FormData()
      this.images.forEach((imge, index) => {
        model.append(`files[${index}]`, this.srcToFile(imge.img), `file-${index}.jpg`)
      })
      model.append('concept_id', this.concept.id)
      model.append('beneficiary_id', this.beneficiarySelected.id)
      model.append('amount', this.amount)
      model.append('description', this.description)
      model.append('user_created_id', this.userSession.id)
      model.append('field_id', 1)
      return model
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    saveCashFlow () {
      if (this.images.length >= 3) {
        this.loadingForm = true
        this.$services.postUpload(['field-cash-flows'], this.modelCashFlow())
          .then(({ res }) => {
            this.addDialogBeneficiary = false
            this.loadingForm = false
            this.beneficiarySelected = res.data
            this.notify(this, 'fieldCashFlow.addSuccessful', 'positive', 'mood')
            this.update()
            this.clean()
          })
          .catch(() => {
            this.loadingForm = false
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
    getCategories (value, update) {
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
          })
        })
    },
    /**
     * All Concepts
     */
    getConcepts (value, update) {
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
          })
        })
    },
    /**
     * All Beneficiaries
     */
    getBeneficiaries (value, update) {
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
          })
        })
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
