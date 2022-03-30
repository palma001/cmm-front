<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="entryModel" ref="saveEntry">
      <q-card class="my-card">
        <q-card-section class="text-h5 row q-gutter-sm">
          <span class="col-10">{{ ucwords($t('entry.newEntry')) }}</span>
          <q-btn
            icon="receipt"
            class="col-auto"
            color="orange"
            v-if="entry.partner"
            @click="$router.push({ name: 'CurrentAccount', query: { partner: entry.partner.id } })"
          >
            <q-tooltip>
             Cuenta Corriente de {{ entry.partner.name }} {{ entry.partner.last_name }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="menu" class="col-auto" color="primary" @click="$router.push({ name: 'Entries' })">
            <q-tooltip>
             Lista de ingresos
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-separator/>
        <q-card-section class="q-pb-sm">
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
                name="partner"
                v-model="entry.partner"
                option-label="full_name"
                option-value="id"
                :label="ucwords('Socio')"
                :disable="!$route.query.partner ? false : true"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="partners"
                @input="selectPartner"
                @filter="getPartners"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogPartner = true"/>
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
                name="collectionReceipt"
                v-model="collectionReceipt"
                option-label="serie_number"
                option-value="id"
                :label="ucwords('Recibos por cobrar')"
                :disable="entry.partner ? false : true"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="collectionReceipts"
                @filter="getCollectionReceipts"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogPartner = true"/>
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
                name="entryType"
                v-model="entryType"
                option-label="name"
                option-value="id"
                :label="ucwords('Tipo de ingreso')"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="entryTypes"
                @filter="getEntryTypes"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialogPartner = true"/>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <q-input
                type="date"
                dense
                outlined
                label="Fec. Emisión"
                v-model="entry.created_at"
              />
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4" v-if="collectionReceipt">
              <q-input
                type="month"
                dense
                outlined
                hint="Periodo"
                disable
                v-model="collectionReceipt.period"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="q-pa-xs col-xs-12 col-md-9 col-sm-12 col-lg-9">
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
                  <q-td key="name" :props="props">
                    {{ props.row.concept.name }}
                  </q-td>
                  <q-td key="amountCollectionReceipt" :props="props">
                    {{ props.row.amountCollectionReceipt }}
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
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <q-list separator dense>
              <q-item clickable v-ripple active>
                <q-item-section>TOTAL </q-item-section>
                <q-item-section side>S/ {{ totalSale }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar recibo" @click="cancelEntry"/>
          <q-btn color="primary" label="Generar recibo" type="submit" :disable="dataConcept.length <= 0"/>
        </q-card-actions>
      </q-card>
    </q-form>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialogPartner"
    >
      <q-card style="width: 400px">
        <q-form @submit="save" class="column full-height">
          <q-card-section class="bg-primary text-white row items-center q-pb-sm">
            <div class="text-h6">Agregar Socio</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="col q-pt-md">
            <q-input outlined @blur="getDataApi" :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="partnerSave.document_number" label="Numbero de documento" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="partnerSave.name" label="Nombre" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="partnerSave.last_name" label="Apellido" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="partnerSave.phone" label="Telefono" dense/>
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
    <q-inner-loading :showing="visibleEntry">
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
                  {{ modelPdf.collection_receipt.partner.name }}
                </td>
                <td class="q-pa-xs">
                  {{ modelPdf.collection_receipt.partner.last_name }}
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
                <tr v-for="entryDetail in modelPdf.entry_details" :key="entryDetail.id" class="text-dark">
                  <td class="q-pa-sm">{{ entryDetail.concept.name }}</td>
                  <td class="q-pa-sm">{{ modelPdf.collection_receipt.period }}</td>
                  <td class="q-pa-sm">{{ entryDetail.amount }}</td>
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
    </vue-html2pdf>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { partner, propsPanelEdition, partnerServices } from '../config-file/partner/partnerConfig.js'
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
      collectionReceipt: null,
      collectionReceipts: [],
      loadingApi: false,
      partnerSave: {},
      addDialogConcept: false,
      addDialogPartner: false,
      modelPdf: null,
      loadingForm: false,
      partner,
      propsPanelEdition,
      partnerServices,
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
          name: 'name',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Nombre',
          field: 'name',
          sortable: true
        },
        {
          name: 'amount',
          label: 'Importe por cobrar',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * Entry Model
       * @type {Object} entry model
       */
      entry: {
        partner: null,
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      partners: [],
      visibleEntry: false,
      entryTypes: [],
      entryType: null,
      dataConcept: []
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
    this.setPartner()
  },
  watch: {
    collectionReceipt (data) {
      if (data) {
        const entries = []
        data.entries.forEach(entry => {
          if (entry.entry_details) {
            entry.entry_details.forEach(entryDetail => {
              entries.push(entryDetail)
            })
          }
        })
        this.dataConcept = data.collection_receipt_details.map(collection => {
          this.deleteDataDuplicate(entries).forEach(entry => {
            if (collection.concept_id === entry.concept_id) {
              collection.amount = collection.amount - entry.amount
            }
          })
          return collection
        }).filter(collection => {
          return collection.amount > 0
        })
        this.totalCalculate()
      }
    }
  },
  methods: {
    selectPartner () {
      this.collectionReceipts = []
      this.collectionReceipt = null
    },
    deleteDataDuplicate (data) {
      return data.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento.concept_id === valorActual.concept_id)
        if (elementoYaExiste) {
          return acumulador.map((elemento) => {
            if (elemento.concept_id === valorActual.concept_id) {
              return {
                ...elemento,
                amount: elemento.amount + valorActual.amount
              }
            }
            return elemento
          })
        }
        return [...acumulador, valorActual]
      }, [])
    },
    setPartner () {
      if (this.$route.query.partner) {
        this.visible = true
        this.$services.getOneData(['partners', this.$route.query.partner])
          .then(({ res }) => {
            this.entry.partner = res.data
            this.visible = false
          })
      }
    },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleEntry = false
        this.timeLoading = 0
      }
    },
    getDataApi () {
      const r = this.partnerSave.document_number && this.partnerSave.document_number.length <= 8 ? 'dni' : 'ruc'
      if (r && this.partnerSave.document_number) {
        this.loadingApi = true
        this.$services.getData(['ruc', this.partnerSave.document_number], {
          documentType: r
        })
          .then(({ res }) => {
            if (!res.data.error) {
              if (r === 'ruc') {
                this.partnerSave.name = res.data.nombre
              } else {
                this.partnerSave.name = res.data.nombres
                this.partnerSave.last_name = `${res.data.apellidoPaterno} ${res.data.apellidoMaterno}`
                this.loadingApi = false
              }
              this.$forceUpdate()
            } else {
              this.notify(this, res.data.error, 'negative', 'warning')
              this.partnerSave = {}
              this.loadingApi = false
            }
          })
          .catch(() => {
            this.partnerSave = {}
            this.loadingApi = false
          })
      }
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save () {
      this.loadingForm = true
      this.partnerSave.branch_office_id = this.branchOfficeSession.id
      this.partnerSave.user_created_id = this.userSession.id
      this.$services.postData(['partners'], this.partnerSave)
        .then(({ res }) => {
          this.entry.partner = res.data
          this.addDialogPartner = false
          this.loadingForm = false
          this.partnerSave = {}
          this.notify(this, 'partner.addSuccessfull', 'positive', 'mood')
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
    entryModel () {
      const entryModel = {
        partner_id: this.entry.partner.id,
        collection_receipt_id: this.collectionReceipt.id,
        entry_type_id: this.entryType.id,
        entryDetails: this.dataConcept,
        user_created_id: this.userSession.id,
        created_at: date.formatDate(this.entry.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveEntry(entryModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveEntry (data) {
      this.modalPaid = false
      this.visibleEntry = true
      this.$services.postData(['entries'], data)
        .then(({ res }) => {
          this.notify(this, 'entry.saveSuccess', 'positive', 'mood')
          this.cancelEntry()
          this.setPartner()
          this.downloadPDF(res.data)
        })
        .catch(() => {
          this.notify(this, 'entry.error', 'negative', 'warning')
          this.visibleEntry = false
        })
    },
    /**
     * Clean bill data
     */
    cancelEntry () {
      this.dataConcept = []
      this.entry = {}
      this.collectionReceipts = []
      this.collectionReceipt = null
      this.entryType = null
      this.entry.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.entry.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
      this.amount = 1
      this.resetValidations(this.$refs.saveEntry)
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
        period: this.entry.period,
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
    getPartners (value, update) {
      this.$services.getData(['partners'], {
        sortBy: 'id',
        sortOrder: 'desc',
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
            this.partners = res.data.data
          })
        })
    },
    /**
     * All CLient
     */
    getEntryTypes (value, update) {
      this.$services.getData(['entry-types'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.entryTypes = res.data.data
          })
        })
    },
    /**
     * All CLient
     */
    getCollectionReceipts (value, update) {
      this.$services.getData(['collection-receipts'], {
        dataFilter: {
          number: value,
          serie: value,
          partner_id: this.entry.partner.id ?? null
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.collectionReceipts = res.data.data.filter(collection => {
              return collection.pending > 0
            })
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
      const { res } = await this.$services.getOneData(['entries', data.id])
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
     * Calculate entry total
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
