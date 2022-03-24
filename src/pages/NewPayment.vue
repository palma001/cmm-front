<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="entryModel">
      <q-card class="my-card">
        <q-card-section class="text-h5 row q-gutter-sm">
          <span class="col-10">Nuevo Ingreso</span>
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
             Lista de recibos de cobro
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
                readonly
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
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-input
                type="month"
                dense
                outlined
                hint="Periodo"
                v-model="entry.period"
                readonly
                disabled
              />
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
            <div class="col-4">
              <q-select
                fill-input
                dense
                outlined
                name="paymentMethod"
                v-model="paymentMethod"
                option-label="name"
                option-value="id"
                label="Metodo de pago"
                :options="paymentMethods"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
            <div class="col-4">
              <q-input
                type="text"
                dense
                outlined
                label="Description"
                v-model="description"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator/>
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
                  <q-td key="period" :props="props">
                    {{ entry.period }}
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                  </q-td>
                  <q-td key="amountPayment" :props="props">
                    {{ props.row.amountPayment }}
                    <q-popup-edit v-model.number="props.row.amountPayment" auto-save>
                      <q-input
                        type="number"
                        v-model.number="props.row.amountPayment"
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
                <q-item-section side>S/ {{ total }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple active>
                <q-item-section>TOTAL PAGADO </q-item-section>
                <q-item-section side>S/ {{ totalPayment }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple active>
                <q-item-section>TOTAL POR PAGAR</q-item-section>
                <q-item-section side>S/ {{ total - totalPayment }}</q-item-section>
              </q-item>
            </q-list>
          </div>
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
        <pdf-print v-if="modelPdf" :numberReceipt="modelPdf.id" title="recibo de ingreso" :dateNow="modelPdf.created_at">
          <template v-slot:content>
            <table class="table text-center" border="1">
              <tr class="bg-blue-2 text-primary text-bold">
                <td>Nombre</td>
                <td>Apellido</td>
                <td>Puesto</td>
              </tr>
              <tr class="text-dark">
                <td class="q-pa-xs">
                  {{ modelPdf.partner.name }}
                </td>
                <td class="q-pa-xs">
                  {{ modelPdf.partner.last_name }}
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
                <tr v-for="entryDetail in modelPdf.entry_payments" :key="entryDetail.id" class="text-dark">
                  <td class="q-pa-sm">{{ entryDetail.concept.name }}</td>
                  <td class="q-pa-sm">{{ modelPdf.period }}</td>
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
      modelPdf: null,
      /**
       * Visible loading page
       * @type {Boolean} status loading page
       */
      visible: false,
      paymentMethod: null,
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
        },
        {
          name: 'amountPayment',
          label: 'Total a pagar',
          field: 'amountPayment',
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
       * Data concept entry
       * @type {Array} data entry
       */
      dataConcept: [],
      visibleEntry: false,
      totalPayment: 0,
      total: 0,
      paymentMethods: [],
      description: ''
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
    this.setReceipt()
    this.getPaymemtMethods()
  },
  watch: {
    concept (data) {
      this.price = data.price
    }
  },
  methods: {
    setReceipt () {
      this.visible = true
      this.$services.getOneData(['entries', this.$route.params.id])
        .then(({ res }) => {
          this.entry = res.data
          this.dataConcept = res.data.entry_details.map(element => {
            res.data.entry_payments.forEach(pay => {
              if (element.concept_id === pay.concept_id) {
                element.amountPayment = pay.amount
              }
            })
            return element
          })
          this.totalCalculate()
          this.visible = false
        })
    },
    getPaymemtMethods () {
      this.visible = true
      this.$services.getOneData(['payment-methods'])
        .then(({ res }) => {
          this.paymentMethods = res.data
        })
    },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleEntry = false
        this.timeLoading = 0
      }
    },
    /**
     * Model bill
     */
    entryModel () {
      const entryModel = {
        partner_id: this.entry.partner.id,
        period: this.entry.period,
        entryPayments: this.dataConcept.map(element => {
          element.payment_method_id = this.paymentMethod.id
          element.description = this.description
          return element
        }),
        user_updated_id: this.userSession.id,
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
      this.$services.putData(['entries', this.$route.params.id], data)
        .then(({ res }) => {
          this.notify(this, 'entry.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.setReceipt()
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
    cancelBill () {
      this.dataConcept = []
      this.entry.partner = null
      this.entry.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.entry.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
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
    async downloadPDF (data) {
      const { res } = await this.$services.getOneData(['entries', data.id])
      this.modelPdf = res.data
      this.$refs.html2Pdf.generatePdf()
    },
    /**
     * Calculate entry total
     */
    totalCalculate () {
      let total = 0
      let totalPayment = 0
      this.dataConcept.forEach(element => {
        total = Number(total) + Number(element.amount)
        totalPayment = Number(totalPayment) + Number(element.amountPayment)
      })
      this.total = total
      this.totalPayment = totalPayment
    }
  }
}
</script>
