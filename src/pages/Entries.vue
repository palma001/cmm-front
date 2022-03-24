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
        <excel-report :data="dataExport" title="Registros de Ventas por Producto" format="A3" orientation="landscape">
          <template v-slot:table>
            <thead>
              <tr class="text-bold">
                <td>Fecha</td>
                <td>Documento</td>
                <td>Razon Social</td>
                <td>Periodo</td>
                <td>M</td>
                <td v-for="concept in concepts" :key="concept.id">
                  {{ concept.name }}
                </td>
                <td class="text-right text-bold">
                  Total
                </td>
                <td class="text-right text-bold">
                  Por Cobrar
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in dataExport" :key="d.id">
                <td>{{ formatDate(d.created_at, 'DD-MM-YYYY') }}</td>
                <td>{{ d.document }}</td>
                <td>{{ d.partner.name }} {{ d.partner.last_name }}</td>
                <td>{{ d.period }}</td>
                <td>S/</td>
                <td v-for="concept in concepts" :key="concept.id">
                  <span v-for="entryDetail in d.entry_details" :key="entryDetail.id">
                    <span v-if="entryDetail.concept_id === concept.id">
                      {{ entryDetail.amount }}
                    </span>
                  </span>
                </td>
                <td class="text-right">
                  {{ d.total }}
                </td>
                <td class="text-right">
                  {{ d.pending }}
                </td>
              </tr>
            </tbody>
          </template>
        </excel-report>
      </div>
      <div class="col-lg-2 col-md-2 col-xl-2 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('entry.add')"
          @click="$router.push({ name: 'NewEntry' })"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('entry.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="entry"
          searchable
          :column="entry"
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
    <q-dialog v-model="viewConceptModal">
      <q-card v-if="entrySelected" style="width: 700px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Recibo Nro <span class="text-red">{{ entrySelected.id }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            row-key="name"
            wrap-cells
            virtual-scroll
            :data="entrySelected.entry_details"
            :columns="columns"
            :filter="conceptFilter"
          >
            <template v-slot:top>
              <span class="text-h6">Lista de conceptos</span>
              <q-space />
              <q-input dense debounce="300" color="primary" v-model="conceptFilter">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cerrar" size="md" @click="viewConceptModal = false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
                <tr v-for="entryDetail in modelPdf.entry_details" :key="entryDetail.id" class="text-dark">
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
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { entry } from '../config-file/entry/entryConfig.js'
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
    ExcelReport,
    VueHtml2pdf,
    PdfPrint
  },
  data () {
    return {
      addDialogEntry: false,
      modelPdf: null,
      timeLoading: 0,
      visibleEntry: false,
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: row => row.concept.name,
          sortable: true
        },
        {
          name: 'amount',
          label: 'Importe S/',
          field: 'amount',
          sortable: true
        }
      ],
      conceptFilter: '',
      entrySelected: null,
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
      to: null,
      from: null,
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
       * File config module
       * @type {Object}
       */
      entry,
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
      dataExport: [],
      concepts: []
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getConcepts()
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
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleEntry = false
        this.timeLoading = 0
      }
    },
    downloadPDF (data) {
      this.visibleEntry = true
      this.modelPdf = data
      this.$refs.html2Pdf.generatePdf()
    },
    formatDate (datee, format) {
      return date.formatDate(datee, format)
    },
    viewConcepts (data) {
      this.entrySelected = data
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
        await this.$services.deleteData(['entrys', data.id])
        this.notify(this, 'entry.deleteSuccessful', 'positive', 'mood')
        this.getEntries()
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
      this.getEntries(this.params)
    },
    filterBetween () {
      this.params.dateFilter = { from: this.from, to: this.to, field: 'created_at' }
      this.getEntries(this.params)
    },
    /**
     * Search entry
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getEntries(this.params)
    },
    async getFullEntries () {
      const { res } = await this.$services.getData(['entries'], {
        dateFilter: {
          to: this.to,
          from: this.from,
          field: 'created_at'
        }
      })
      this.dataExport = res.data
    },
    async getConcepts () {
      const { res } = await this.$services.getData(['concepts'])
      this.concepts = res.data
    },
    /**
     * Get all entry
     */
    getEntries (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['entries'], params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
          this.getFullEntries(params)
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
