<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-3 col-md-3 col-xl-3">
        <q-input type="date" v-model="from" dense outlined hint="Desde"/>
      </div>
      <div class="col-lg-3 col-md-3 col-xl-3">
        <q-input type="date" v-model="to" dense outlined hint="Hasta"/>
      </div>
      <div class="col-lg-1 col-md-1 col-xl-1">
        <q-btn color="primary" icon="search" @click="filterBetween"/>
      </div>
      <div class="col-lg-3 col-md-3 col-xl-3 text-right">
        <excel-report :data="dataExport" title="Registros de Compras con Glosa">
          <template v-slot:table>
            <thead class="text-bold">
              <tr>
                <td>F. Emision</td>
                <td>Documento</td>
                <td>Ruc</td>
                <td>Razon Social</td>
                <td>Concepto</td>
                <td>Mon</td>
                <td class="text-right">Total</td>
              </tr>
            </thead>
            <tbody v-for="voucherType in voucherTypes" :key="voucherType.id">
              <tr v-for="d in filterData(dataExport, voucherType.acronym)" :key="d.id">
                <td>{{ formatDate(d.created_at, 'DD-MM-YYYY') }}</td>
                <td>{{ d.serie_number }}</td>
                <td>{{ d.worker.document_number }}</td>
                <td>{{ d.worker.name }} {{ d.worker.last_name }}</td>
                <td>{{ d.concept }}</td>
                <td>S/.</td>
                <td class="text-right">{{ d.amount }}</td>
              </tr>
              <tr class="text-right text-bold">
                <td colspan="5">
                  {{ voucherType.name }}
                </td>
                <td>
                  Total
                </td>
                <td>
                  {{ totalArray(filterData(dataExport, voucherType.acronym)) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="text-right text-bold text-h6">
                <td colspan="6">
                  Total S/.
                </td>
                <td>
                  {{ totalArray(dataExport) }}
                </td>
              </tr>
            </tfoot>
          </template>
        </excel-report>
      </div>
      <div class="col-lg-2 col-md-2 col-xl-2 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('egress.add')"
          @click="$router.push({ name: 'NewEgress' })"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('egress.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="egress"
          searchable
          :column="egress"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @view-details="viewDetails"
          @viewConcepts="viewConcepts"
          @search-data="searchData"
          @on-load-data="loadData"
          @downloadPDF="downloadPDF"
          @delete="deleteData"
        />
      </div>
    </div>
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
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { egress } from '../config-file/egress/egressConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import ExcelReport from '../components/ExcelReport.vue'
import VueHtml2pdf from 'vue-html2pdf'
import PdfPrint from '../components/PdfPrint.vue'
import { date } from 'quasar'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    VueHtml2pdf,
    PdfPrint,
    ExcelReport
  },
  data () {
    return {
      modelPdf: null,
      visibleEgress: false,
      timeLoading: 0,
      to: null,
      from: null,
      dataExport: [],
      conceptFilter: '',
      egressSelected: null,
      viewConceptModal: false,
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
          'worker.name': '',
          'worker.document_number': '',
          'worker.last_name': ''
        }
      },
      /**
       * File config module
       * @type {Object}
       */
      egress,
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
      voucherTypes: []
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getVoucherTypes()
  },
  computed: {
    valueLoading () {
      return this.timeLoading
    },
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * All CLient
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'])
        .then(({ res }) => {
          this.voucherTypes = res.data.filter(element => {
            return this.filterData(this.dataExport, element.acronym).length > 0
          })
        })
    },
    filterData (dataExport, acronym) {
      return dataExport.filter(element => {
        return element.voucher_type.acronym === acronym
      })
    },
    totalArray (dataExport) {
      let total = 0
      dataExport.forEach(element => {
        total += element.amount
      })
      return total
    },
    downloadPDF (data) {
      this.visibleEgress = true
      this.modelPdf = data
      this.$refs.html2Pdf.generatePdf()
    },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleEgress = false
        this.timeLoading = 0
      }
    },
    formatDate (data, format) {
      return date.formatDate(data, format)
    },
    filterBetween () {
      this.params.dateFilter = { from: this.from, to: this.to, field: 'created_at' }
      this.getEgresses(this.params)
    },
    viewConcepts (data) {
      this.egressSelected = data
      this.viewConceptModal = true
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.editDialog = true
      this.propsPanelEdition.data = data
      this.selectedData = data
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la ingreso?',
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
        await this.$services.deleteData(['egresss', data.id])
        this.notify(this, 'egress.deleteSuccessful', 'positive', 'mood')
        this.getEgresses()
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
      this.getEgresses(this.params)
    },
    /**
     * Search egress
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getEgresses()
    },
    async getFullEgresses () {
      const { res } = await this.$services.getData(['egresses'], {
        sortBy: 'voucher_type_id',
        sortOrder: 'asc',
        dateFilter: {
          to: this.to,
          from: this.from,
          field: 'created_at'
        }
      })
      this.dataExport = res.data
      this.getVoucherTypes()
    },
    /**
     * Get all egress
     */
    getEgresses (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['egresses'], params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
          this.getFullEgresses()
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
