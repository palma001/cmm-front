<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="orderModel">
      <q-card class="my-card">
        <q-card-section class="text-h5 row q-gutter-sm">
          <span class="col-10">{{ ucwords($t('order.newOrder')) }}</span>
          <q-btn
            icon="receipt"
            class="col-auto"
            color="orange"
            v-if="order.beneficiary"
            @click="$router.push({ name: 'CurrentAccount', query: { beneficiary: order.beneficiary.id } })"
          >
            <q-tooltip>
             Cuenta Corriente de {{ order.beneficiary.name }} {{ order.beneficiary.last_name }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="menu" class="col-auto" color="primary" @click="$router.push({ name: 'Entries' })">
            <q-tooltip>
             Lista de recibos de cobro
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-pb-xs">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="organization"
                v-model="order.organization"
                option-label="name"
                option-value="id"
                :label="ucwords('Organización')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="organizations"
                @filter="getOrganizations"
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
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="beneficiary"
                v-model="order.beneficiary"
                option-label="full_name"
                option-value="id"
                :label="ucwords('Beneficiario')"
                :disable="!$route.query.beneficiary ? false : true"
                v-validate="'required'" data-vv-as="field"
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
            <div class="col-4">
              <q-input
                type="date"
                dense
                outlined
                label="Fec. Emisión"
                v-model="order.created_at"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                clearable
                input-debounce="20"
                name="responsable"
                v-model="order.responsable"
                option-label="full_name"
                option-value="id"
                :label="ucwords('responsable')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="responsables"
                @filter="getResponsables"
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
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                clearable
                input-debounce="20"
                name="field"
                v-model="order.field"
                option-label="full_name"
                option-value="id"
                :label="ucwords('Campo')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="fields"
                @filter="getFields"
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
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
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
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogConcept = true"/>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input label="Contrato" v-model="order.contract" dense outlined/>
            </div>
            <div class="col-8">
              <q-input label="Observación" v-model="order.observation" dense outlined/>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-py-sm">
          <div class="text-h6">
            Datos del pago
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-pb-xs">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                clearable
                input-debounce="20"
                name="operation_type"
                v-model="order.operation_type"
                option-label="name"
                option-value="id"
                :label="ucwords('tipo de operaciones')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="operationTypes"
                @filter="getOperationTypes"
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
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                clearable
                input-debounce="20"
                name="entity"
                v-model="order.entity"
                option-label="name"
                option-value="id"
                :label="ucwords('entidades')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="entities"
                @filter="getEntities"
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
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                clearable
                input-debounce="20"
                name="coin"
                v-model="order.coin"
                option-label="name"
                option-value="id"
                :label="ucwords('moneda')"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="coins"
                @filter="getCoins"
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
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input label="Monto" v-model="order.amount" dense outlined/>
            </div>
            <div class="col-4">
              <q-input label="Referencia" v-model="order.reference" dense outlined/>
            </div>
            <div class="col-4">
              <q-btn label="Agregar" color="primary" />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="q-pa-xs col-xs-12 col-md-12 col-sm-12 col-lg-12">
            <q-table
              row-key="name"
              wrap-cells
              virtual-scroll
              :data="dataConcept"
              :columns="columns"
              :rows-per-page-options="[50]"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-btn size="xs" color="negative" icon="close" @click="deleteConcept(props.row)"/>
                  </q-td>
                  <q-td key="item" :props="props">
                    {{ props.row.item }}
                  </q-td>
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="period" :props="props">
                    {{ props.row.period }}
                    <q-popup-edit v-model="props.row.period" auto-save>
                      <q-input
                        type="month"
                        v-model="props.row.period"
                        dense
                        autofocus
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                    <q-popup-edit v-model.number="props.row.amount" auto-save>
                      <q-input
                        type="number"
                        v-model.number="props.row.amount"
                        dense autofocus
                        @input="totalCalculate"
                      />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <q-list separator dense>
              <q-item clickable v-ripple active>
                <q-item-section>TOTAL </q-item-section>
                <q-item-section side>S/ {{ totalSale }}</q-item-section>
              </q-item>
            </q-list>
          </div> -->
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar recibo" @click="cancelBill"/>
          <q-btn color="primary" label="Generar recibo" type="submit" :disable="dataConcept.length <= 0"/>
        </q-card-actions>
      </q-card>
    </q-form>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
    <q-inner-loading :showing="visibleCollectionReceipt">
      <q-circular-progress
        show-value
        class="text-white q-ma-md"
        :value="valueLoading"
        size="150px"
        :thickness="0.2"
        color="orange"
        center-color="primary"
        track-color="transparent"
      >
        <q-icon name="receipt" />
      </q-circular-progress>
    </q-inner-loading>
    <!-- <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1000"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      ref="html2Pdf"
      @progress="onProgress($event)"
    >
      <section slot="pdf-content" class="text-uppercase">
        <pdf-print v-if="modelPdf" :numberReceipt="modelPdf.serie_number" title="recibo de ingreso" :dateNow="modelPdf.created_at">
          <template v-slot:content>
            <table class="table text-center" border="1">
              <tr class="bg-blue-2 text-primary text-bold">
                <td>Nombre</td>
                <td>Apellido</td>
                <td>Puesto</td>
              </tr>
              <tr class="text-dark">
                <td class="q-pa-xs">
                  {{ modelPdf.beneficiary.name }}
                </td>
                <td class="q-pa-xs">
                  {{ modelPdf.beneficiary.last_name }}
                </td>
                <td class="q-pa-xs"></td>
              </tr>
            </table>
            <table class="table text-center" border="1">
              <thead class="bg-blue-2">
                <tr class="text-primary text-bold">
                  <td>Concepto</td>
                  <td>Periodo</td>
                  <td>Importe</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="orderDetail in modelPdf.collection_receipt_details" :key="orderDetail.id" class="text-dark">
                  <td class="q-pa-sm">{{ orderDetail.concept.name }}</td>
                  <td class="q-pa-sm">{{ modelPdf.period }}</td>
                  <td class="q-pa-sm">{{ orderDetail.amount }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="text-dark">
                  <td class="text-right q-pa-sm" colspan="2">
                    Total S/
                  </td>
                  <td class="q-pa-sm">
                    {{  modelPdf.total }}
                  </td>
                </tr>
              </tfoot>
            </table>
            <div
              class="row text-center q-mt-md q-pt-xl q-px-md justify-between text-dark"
              style="border: 1px solid"
            >
              <div class="col-3">
                <hr>
                vb presidente
              </div>
              <div class="col-3">
                <hr>
                fiscal
              </div>
              <div class="col-3">
                <hr>
                secretario de economia
              </div>
            </div>
          </template>
        </pdf-print>
      </section>
    </vue-html2pdf> -->
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialogConcept"
    >
      <dynamic-form
        module="concept"
        :config="conceptConfig"
        :loading="loadingForm"
        @cancel="addDialogConcept = false"
        @save="saveConcept"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { beneficiary, propsPanelEdition } from '../config-file/beneficiary/beneficiaryConfig.js'
// import DynamicForm from '../components/DynamicForm.vue'
// import PdfPrint from '../components/PdfPrint.vue'
// import VueHtml2pdf from 'vue-html2pdf'
import { conceptConfig, conceptServices } from '../config-file/concept/conceptConfig.js'
// import ExcelReport from '../components/ExcelReport.vue'
import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'order',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm
    // VueHtml2pdf,
    // PdfPrint
    // ExcelReport
    // DataTable
  },
  data () {
    return {
      operationTypes: [],
      loadingApi: false,
      beneficiarySave: {},
      conceptConfig,
      selected: [],
      organizations: [],
      responsables: [],
      entities: [],
      coins: [],
      fields: [],
      teal: false,
      addDialogConcept: false,
      addDialogBeneficiary: false,
      conceptServices,
      modelPdf: null,
      loadingForm: false,
      beneficiary,
      propsPanelEdition,
      loadingCLose: false,
      concept: null,
      totalSale: 0,
      price: 0,
      /**
       * Visible loading page
       * @type {Boolean} status loading page
       */
      visible: false,
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
        {
          name: 'Opciones',
          headerClasses: 'bg-primary text-white',
          align: 'left',
          label: 'Opciones',
          field: 'opciones'
        },
        {
          name: 'item',
          label: 'N. Item',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'name',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Nombre',
          field: 'name',
          sortable: true
        },
        {
          name: 'period',
          align: 'left',
          label: 'Periodo',
          field: 'period',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'amount',
          label: 'Importe',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * order Model
       * @type {Object} order model
       */
      order: {
        beneficiary: [],
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      beneficiaries: [],
      /**
       * Concept List
       * @type {Array} Concept List
       */
      concepts: [],
      /**
       * Amount concept
       * @type {Number} amuntconcept
       */
      amount: 1,
      /**
       * Data concept order
       * @type {Array} data order
       */
      dataConcept: [],
      visibleCollectionReceipt: false
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE]),

    valueLoading () {
      return this.timeLoading
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.conceptServices, [], this)
    // this.setPartner()
  },
  methods: {
    // setPartner () {
    //   if (this.$route.query.beneficiary) {
    //     this.visible = true
    //     this.$services.getOneData(['beneficiaries', this.$route.query.beneficiary])
    //       .then(({ res }) => {
    //         this.order.beneficiary = res.data
    //         this.visible = false
    //       })
    //   }
    // },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleCollectionReceipt = false
        this.timeLoading = 0
      }
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save () {
      this.loadingForm = true
      this.beneficiarySave.branch_office_id = this.branchOfficeSession.id
      this.beneficiarySave.user_created_id = this.userSession.id
      this.$services.postData(['beneficiaries'], this.beneficiarySave)
        .then(({ res }) => {
          this.order.beneficiary = res.data
          this.addDialogBeneficiary = false
          this.loadingForm = false
          this.beneficiarySave = {}
          this.notify(this, 'beneficiary.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    saveConcept (data) {
      this.loadingForm = true
      data.user_created_id = this.userSession.id
      this.$services.postData(['concepts'], data)
        .then(({ res }) => {
          this.concept = res.data
          this.addDialogConcept = false
          this.loadingForm = false
          this.notify(this, 'concept.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Model bill
     */
    orderModel () {
      const orderModel = {
        beneficiary_id: this.order.beneficiary,
        period: this.order.period,
        orderDetails: this.dataConcept,
        user_created_id: this.userSession.id,
        created_at: date.formatDate(this.order.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveCollectionReceipt(orderModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveCollectionReceipt (data) {
      this.modalPaid = false
      this.visibleCollectionReceipt = true
      this.$services.postData(['collection-receipts'], data)
        .then(({ res }) => {
          this.notify(this, 'order.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.setPartner()
          this.visibleCollectionReceipt = false
        })
        .catch(() => {
          this.notify(this, 'order.error', 'negative', 'warning')
          this.visibleCollectionReceipt = false
        })
    },
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataConcept = []
      this.teal = false
      this.order.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.order.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
      this.amount = 1
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
     * Set Data in table
     * @param {Object} val value concept
     */
    setTable () {
      if (this.validateArray(this.dataConcept, this.concept)) {
        this.addAmountConcept(this.dataConcept, this.concept)
      } else {
        this.pushArray(this.dataConcept, this.concept)
      }
      this.totalCalculate()
    },
    /**
     * Set data in table concept
     * @param {Array} array list porduct
     */
    pushArray (array) {
      array.push({
        item: this.dataConcept.length + 1,
        concept_id: this.concept.id,
        name: this.concept.name,
        period: this.order.period,
        amount: Number(this.price),
        user_created_id: this.userSession.id
      })
    },
    /**
     * Format number less than ten
     * @param {Number} number number format
     * @return {Number} number formated
     */
    formatOnCero (number) {
      if (number < 10) {
        return `0${number}`
      }
      return number
    },
    /**
     * Validate array in concept table
     * @param {Array} data the concept table
     * @param {Object} index concept table index
     */
    validateArray (data, index) {
      return data.find((concept) => concept.concept_id === index.id)
    },
    /**
     * Add concept price in table
     * @param {Array} concept table
     * @param {Object} index concept table index
     */
    addAmountConcept (concept, index) {
      concept.map(concept => {
        if (concept.concept_id === index.id) {
          concept.amount = Number(concept.amount) + Number(this.price)
          return concept
        }
      })
    },
    /**
     * All CLient
     */
    getBeneficiaries (value, update) {
      this.$services.getData(['beneficiaries'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
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
     * All CLient
     */
    getOrganizations (value, update) {
      this.$services.getData(['organizations'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.organizations = res.data
          })
        })
    },
    /**
     * All CLient
     */
    getCoins (value, update) {
      this.$services.getData(['coins'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.coins = res.data
          })
        })
    },
    /**
     * All CLient
     */
    getResponsables (value, update) {
      this.$services.getData(['responsables'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
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
     * All CLient
     */
    getFields (value, update) {
      this.$services.getData(['fields'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.fields = res.data
          })
        })
    },
    /**
     * All CLient
     */
    getEntities (value, update) {
      this.$services.getData(['entities'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.entities = res.data
          })
        })
    },
    /**
     * All CLient
     */
    getOperationTypes (value, update) {
      this.$services.getData(['operation-types'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.operationTypes = res.data
          })
        })
    },
    /**
     * Get concepts
     * @param {String} value data filter
     */
    getConcepts (value, update) {
      this.$services.getData(['concepts'], {
        ...value,
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.concepts = res.data.data
          })
        })
    },
    async downloadPDF (data) {
      const { res } = await this.$services.getOneData(['collection-receipts', data.id])
      this.modelPdf = res.data
      this.$refs.html2Pdf.generatePdf()
    },
    /**
     * Delete concept
     * @param {Object} data data concept
     */
    deleteConcept (data) {
      this.dataConcept.map((concept, index) => {
        if (concept.id === data.id) {
          this.dataConcept.splice(index, 1)
        }
      })
      this.totalCalculate()
    },
    /**
     * Calculate order total
     */
    totalCalculate () {
      let total = 0
      this.dataConcept.forEach(element => {
        total = Number(total) + Number(element.amount)
      })
      this.totalSale = total
    },
    /**
     * Get percentage
     * @param {Number} price price concepts
     * @param {Number} percentage percentage calculate
     * @returns {Number} percentage calculated
     */
    getPercentage (price, percentage) {
      return ((percentage / 100) * price).toFixed(2)
    }
  }
}
</script>
