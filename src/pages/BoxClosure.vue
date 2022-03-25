<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('boxClosure.add')"
          @click="addDialog = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('boxClosure.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="boxClosure"
          searchable
          action
          :column="boxClosure"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          @view-details="viewDetails"
          @search-data="searchData"
          @on-load-data="loadData"
          @print="print"
          @delete="deleteData"
        />
      </div>
    </div>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="boxClosure"
        :propsPanelEdition="propsPanelEdition"
        :config="boxClosure"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="getClosure"
      />
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialog"
    >
      <dynamic-form
        module="boxClosure"
        :config="boxClosure"
        :loading="loadingForm"
        @cancel="addDialog = false"
        @save="getClosure"
      />
    </q-dialog>
    <q-dialog
      v-model="dialogBoxClosure"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-uppercase">Cierre de Caja</div>
        </q-card-section>
        <q-card-section horizontal>
          <q-card-section style="width: 60%">
            <span>
              {{ dateFormat(`${boxClosureData.from_date} 00:00:00`) }} AL {{ dateFormat(`${boxClosureData.to_date} 00:00:00`) }} <br>
              Responsable: {{ this.userSession.full_name }}<br>
              Fecha de cierre: {{ dateFormat(Date()) }}
            </span>
            <q-separator class="q-mt-sm"/>
            <p class="text-h6 q-mt-sm" style="width: 100%">
              <span>Importe de cierre:</span>
              <span class="float-right">
                S/. {{ boxClosureDataRequest.entries - boxClosureDataRequest.egresses }}
              </span>
            </p>
            <q-separator/>
            <p class="text-h6 q-mt-sm" style="width: 100%">
              INGRESOS:
            </p>
            <q-list>
              <q-item>
                <q-item-section class="q-pa-none">INGRESOS</q-item-section>
                <q-item-section side>S/. {{ boxClosureDataRequest.entries }}</q-item-section>
              </q-item>
            </q-list>
            <q-separator/>
            <p class="text-h6 q-mt-sm" style="width: 100%">
              EGRESOS:
            </p>
            <q-list>
              <q-item>
                <q-item-section class="q-pa-none">EGRESOS</q-item-section>
                <q-item-section side>S/. {{ boxClosureDataRequest.egresses }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-separator vertical />
          <q-card-section style="width: 40%">
            <p style="height: 40%">Responsable:</p>
            <q-separator/>
            <p class="q-mt-sm">Revisado por:</p>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="negative" @click="dialogBoxClosure = false">Cancelar</q-btn>
          <q-btn color="primary" @click="save" v-if="addDialog">Confirmar</q-btn>
          <q-btn color="orange" @click="update" v-else>Confirmar</q-btn>
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
        <pdf-print v-if="printData" :numberReceipt="printData.id" title="Cierre de caja" :dateNow="printData.created_at">
          <template v-slot:content>
            <q-card bordered>
              <q-card-section horizontal>
                <q-card-section style="width: 60%">
                  <span>
                    {{ dateFormat(`${printData.from_date} 00:00:00`) }} AL {{ dateFormat(`${printData.to_date} 00:00:00`) }} <br>
                    Responsable: {{ printData.user.full_name }}<br>
                    Fecha de cierre: {{ dateFormat(printData.created_at) }}
                  </span>
                  <q-separator class="q-mt-sm"/>
                  <p class="text-h6 q-mt-sm" style="width: 100%">
                    <span>Importe de cierre:</span>
                    <span class="float-right">
                      S/. {{ boxClosureDataRequest.entries - boxClosureDataRequest.egresses }}
                    </span>
                  </p>
                  <q-separator/>
                  <p class="text-h6 q-mt-sm" style="width: 100%">
                    INGRESOS:
                  </p>
                  <q-list>
                    <q-item>
                      <q-item-section class="q-pa-none">INGRESOS</q-item-section>
                      <q-item-section side>S/. {{ boxClosureDataRequest.entries }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator/>
                  <p class="text-h6 q-mt-sm" style="width: 100%">
                    EGRESOS:
                  </p>
                  <q-list>
                    <q-item>
                      <q-item-section class="q-pa-none">EGRESOS</q-item-section>
                      <q-item-section side>S/. {{ boxClosureDataRequest.egresses }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-separator vertical />
                <q-card-section style="width: 40%">
                  <p style="height: 40%">Responsable:</p>
                  <q-separator/>
                  <p class="q-mt-sm">Revisado por:</p>
                </q-card-section>
              </q-card-section>
              <q-separator />
            </q-card>
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
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { boxClosure, buttonsActions, propsPanelEdition } from '../config-file/boxClosure/boxClosureConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { date } from 'quasar'
import PdfPrint from '../components/PdfPrint.vue'
import VueHtml2pdf from 'vue-html2pdf'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    PdfPrint,
    VueHtml2pdf,
    DynamicFormEdition
  },
  data () {
    return {
      timeLoading: 0,
      dialogBoxClosure: false,
      buttonsActions,
      propsPanelEdition,
      loadingForm: false,
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
          to_date: '',
          from_date: '',
          'user.name': '',
          'user.last_name': '',
          'user.document_number': ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialog: false,
      /**
       * File config module
       * @type {Object}
       */
      boxClosure,
      /**
       * Open edit dialog
       * @type {Boolean}
       */
      editDialog: false,
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
      visibleEntry: false,
      boxClosureData: {},
      boxClosureDataRequest: {},
      printData: null
    }
  },
  created () {
    this.getBoxClosure()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
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
    dateFormat (data) {
      return date.formatDate(data, 'DD-MM-YYYY')
    },
    async print (data) {
      this.printData = data
      this.visibleEntry = true
      const { res } = await this.$services.getData(['get-box-closures'], data)
      this.boxClosureDataRequest = res.data
      this.$refs.html2Pdf.generatePdf()
      this.this.visibleEntry = false
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
        message: '¿Desea eliminar el cierre?',
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
        await this.$services.deleteData(['box-closures', data.id])
        this.notify(this, 'boxClosure.deleteSuccessful', 'positive', 'mood')
        this.getBoxClosure()
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
      this.getBoxClosure(this.params)
    },
    /**
     * Search boxClosure
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getBoxClosure()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update () {
      this.boxClosureData.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['box-closures', this.selectedData.id], this.boxClosureData)
        .then(({ res }) => {
          this.editDialog = false
          this.dialogBoxClosure = false
          this.loadingForm = false
          this.getBoxClosure(this.params)
          this.notify(this, 'boxClosure.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    async getClosure (data) {
      this.boxClosureData = data
      const { res } = await this.$services.getData(['get-box-closures'], data)
      this.boxClosureDataRequest = res.data
      this.dialogBoxClosure = true
    },
    async getOneClosure (data) {
      this.boxClosureData = data
      const { res } = await this.$services.getData(['box-closures', data.id])
      this.print(res.data)
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save () {
      this.boxClosureData.user_created_id = this.userSession.id
      this.loadingForm = true
      this.$services.postData(['box-closures'], this.boxClosureData)
        .then(({ res }) => {
          this.addDialog = false
          this.dialogBoxClosure = false
          this.loadingForm = false
          this.getBoxClosure(this.params)
          this.getOneClosure(res.data)
          this.notify(this, 'boxClosure.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all boxClosure
     */
    getBoxClosure (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['box-closures'], this.params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
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
