<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="modelBill" ref="egress">
      <q-card class="my-card">
        <q-card-section class="text-h4 row">
          <span class="col-11">{{ ucwords($t('egress.newEgress')) }}</span>
          <q-btn icon="menu" class="col-auto" color="primary" @click="$router.push({ name: 'Egresses' })"/>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="worker"
                v-model="egress.worker"
                option-label="full_name"
                option-value="id"
                :label="ucwords('Trabajador')"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="workers"
                @filter="getWorkers"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogWorker = true"/>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="voucherType"
                v-model="egress.voucherType"
                option-label="name"
                option-value="id"
                :label="ucwords('tipo de documento')"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="voucherTypes"
                @filter="getVoucherTypes"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogWorker = true"/>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <q-input
                dense
                outlined
                label="Numbero o Codigo"
                v-model="egress.number"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input
                type="date"
                dense
                outlined
                label="Fec. Emisión"
                v-model="egress.created_at"
                :rules="[val => val && val !== null && val !== '' || 'Este campo es requerido']"
              />
            </div>
            <div class="col-4">
              <q-input
                type="month"
                dense
                outlined
                hint="Periodo"
                v-model="egress.period"
                :rules="[val => val && val !== null && val !== '' || 'Este campo es requerido']"
              />
            </div>
            <div class="col-4">
              <q-input
                type="text"
                dense
                outlined
                label="Monto S/"
                v-model="egress.amount"
                :rules="[val => val && val !== null && val !== '' || 'Este campo es requerido']"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-sm">
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                type="textarea"
                dense
                outlined
                label="La suma de"
                disable
                :value="numberLetter"
              />
            </div>
            <div class="col-6">
              <q-input
                type="textarea"
                dense
                outlined
                label="Concepto"
                v-model="egress.concept"
                :rules="[val => val && val !== null && val !== '' || 'Este campo es requerido']"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar recibo" @click="cancelBill"/>
          <q-btn color="primary" label="Generar recibo" type="submit"/>
        </q-card-actions>
      </q-card>
    </q-form>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialogWorker"
    >
      <q-card style="width: 400px">
        <q-form @submit="save" class="column full-height">
          <q-card-section class="bg-primary text-white row items-center q-pb-sm">
            <div class="text-h6">Agregar Trabajador</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="col q-pt-md">
            <q-input outlined @blur="getDataApi" :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.document_number" label="Numbero de documento" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.name" label="Nombre" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.last_name" label="Apellido" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.phone" label="Telefono" dense/>
          </q-card-section>
          <q-separator dark />
          <q-card-actions align="right">
            <q-btn color="negative" v-close-popup>Cancelar</q-btn>
            <q-btn color="primary" type="submit">Agregar</q-btn>
          </q-card-actions>
        </q-form>
        <q-inner-loading :showing="loadingApi">
          <q-spinner-gears size="100px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
    <q-inner-loading :showing="visibleEgress">
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
    <vue-html2pdf
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
      <section slot="pdf-content">
        <pdf-print v-if="modelPdf" :numberReceipt="modelPdf.serie_number" title="recibo de egreso" :dateNow="modelPdf.created_at">
          <template v-slot:content>
            <div style="border: solid 1px;" class="q-pa-md text-dark">
              <span style="border: solid 1px;" class="q-pa-sm float-right">S/ {{ modelPdf.amount }}</span><br>
              <span class="text-primary">La Suma de:</span> {{ $numberLetter.NumerosALetras(modelPdf.amount) }}<br>
              <span class="text-primary">Por Concepto de:</span> {{ modelPdf.concept }}<br>
              <span class="text-primary">En el Periodo:</span> {{ modelPdf.period }}
            </div>
            <div style="border: solid 1px;" class="row text-dark q-mb-sm q-mt-sm">
              <div class="col-6">
                <table class="table text-center" border="1">
                  <tr>
                    <td colspan="2" class="text-center bg-blue-4 text-white">AUTORIZADO</td>
                  </tr>
                  <tr>
                    <td class="q-pt-xl">PRESIDENTE</td>
                    <td class="q-pt-xl">SECRETARIO DE ECONOMIA</td>
                  </tr>
                </table>
                <table class="table text-center" border="1">
                  <tr>
                    <td colspan="2" class="bg-blue-4 q-pa-md full-width"></td>
                  </tr>
                  <tr>
                    <td class="q-pt-xl">FISCAL</td>
                    <td class="q-pt-xl">FECHA</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 q-pl-xs q-pt-md">
                Firma: <hr>
                Nombre y Apellido: {{ modelPdf.worker.name }} {{ modelPdf.worker.last_name }} <br>
                Doc. de Identidad: {{ modelPdf.worker.document_number }}
              </div>
            </div>
          </template>
        </pdf-print>
      </section>
    </vue-html2pdf>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { worker, propsPanelEdition, workerServices } from '../config-file/worker/workerConfig.js'
import PdfPrint from '../components/PdfPrint.vue'
import VueHtml2pdf from 'vue-html2pdf'
// import ExcelReport from '../components/ExcelReport.vue'
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'Entry',
  mixins: [mixins.containerMixin],
  components: {
    VueHtml2pdf,
    PdfPrint
    // ExcelReport
    // DataTable
  },
  data () {
    return {
      loadingApi: false,
      workerSave: {},
      addDialogWorker: false,
      modelPdf: null,
      loadingForm: false,
      worker,
      propsPanelEdition,
      workerServices,
      loadingCLose: false,
      period: null,
      /**
       * Visible loading page
       * @type {Boolean} status loading page
       */
      visible: false,
      /**
       * Entry Model
       * @type {Object} egress model
       */
      egress: {
        worker: null,
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      workers: [],
      voucherTypes: [],
      /**
       * Amount concept
       * @type {Number} amuntconcept
       */
      amount: 1,
      /**
       * Data concept egress
       * @type {Array} data egress
       */
      visibleEgress: false
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE]),

    numberLetter (value) {
      return this.$numberLetter.NumerosALetras(this.egress.amount)
    },
    valueLoading () {
      return this.timeLoading
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
    getDataApi () {
      const r = this.workerSave.document_number && this.workerSave.document_number.length <= 8 ? 'dni' : 'ruc'
      if (r && this.workerSave.document_number) {
        this.loadingApi = true
        this.$services.getData(['ruc', this.workerSave.document_number], {
          documentType: r
        })
          .then(({ res }) => {
            if (!res.data.error) {
              if (r === 'ruc') {
                this.workerSave.name = res.data.nombre
              } else {
                this.workerSave.name = res.data.nombres
                this.workerSave.last_name = `${res.data.apellidoPaterno} ${res.data.apellidoMaterno}`
                this.loadingApi = false
              }
              this.$forceUpdate()
            } else {
              this.notify(this, res.data.error, 'negative', 'warning')
              this.workerSave = {}
              this.loadingApi = false
            }
          })
          .catch(() => {
            this.partnerSave = {}
            this.loadingApi = false
          })
      }
    },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleEgress = false
        this.timeLoading = 0
      }
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save () {
      this.loadingForm = true
      this.workerSave.branch_office_id = this.branchOfficeSession.id
      this.workerSave.user_created_id = this.userSession.id
      this.$services.postData(['workers'], this.workerSave)
        .then(({ res }) => {
          this.egress.worker = res.data
          this.addDialogWorker = false
          this.loadingForm = false
          this.notify(this, 'worker.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Model bill
     */
    modelBill () {
      const billModel = {
        worker_id: this.egress.worker.id,
        voucher_type_id: this.egress.voucherType.id,
        amount: this.egress.amount,
        number: this.egress.number,
        concept: this.egress.concept,
        period: this.egress.period,
        user_created_id: this.userSession.id,
        created_at: date.formatDate(this.egress.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveEgress(billModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveEgress (data) {
      this.modalPaid = false
      this.visibleEgress = true
      this.$services.postData(['egresses'], data)
        .then(({ res }) => {
          this.notify(this, 'egress.saveSuccess', 'positive', 'mood')
          this.downloadPDF(res.data)
          this.cancelBill()
        })
        .catch(() => {
          this.notify(this, 'egress.error', 'negative', 'warning')
          this.visibleEgress = false
        })
    },
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataConcept = []
      this.egress = {}
      this.egress.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.egress.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
      this.amount = 1
      this.resetValidations(this.$refs.egress)
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
        period: this.period,
        amount: Number(this.price),
        user_created_id: this.userSession.id
      })
    },
    /**
     * Print concept error
     * @param {Number} code concept code
     */
    errorSearch (code) {
      this.$q.notify({
        message: `(${code}) - ${this.ucwords(this.$t('template.errorSearchConcept'))}`,
        color: 'negative',
        position: 'top',
        icon: 'warning'
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
     * Validations the errors
     * @param  {String} propTag data fromulary
     * @return {String} errors
     */
    errorValidation (propTag) {
      if (this.errors.has(propTag)) {
        return this.errors.first(propTag)
      }
    },
    /**
     * Verify formulary error
     * * @return {String} errors
     */
    validateBeforeSubmit () {
      return this.$validator.validateAll()
        .then((result) => {
          return result
        })
        .catch((err) => {
          console.log(err)
        })
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
    getWorkers (value, update) {
      this.$services.getData(['workers'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.workers = res.data.data
          })
        })
    },
    /**
     * All CLient
     */
    getVoucherTypes (value, update) {
      this.$services.getData(['voucher-types'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.voucherTypes = res.data.data
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
      const { res } = await this.$services.getOneData(['egresses', data.id])
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
     * Calculate egress total
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
