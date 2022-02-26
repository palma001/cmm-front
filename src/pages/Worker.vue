<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('worker.add')"
          @click="addDialog = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('worker.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="worker"
          searchable
          action
          :column="worker"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          @view-details="viewDetails"
          @search-data="searchData"
          @on-load-data="loadData"
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
        module="worker"
        :propsPanelEdition="propsPanelEdition"
        :config="worker"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialog"
    >
      <dynamic-form
        module="worker"
        :config="worker"
        :loading="loadingForm"
        @cancel="addDialog = false"
        @save="save"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { worker, buttonsActions, propsPanelEdition, workerServices } from '../config-file/worker/workerConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    DynamicFormEdition
  },
  data () {
    return {
      residenceCondition: null,
      status: null,
      documentNumber: null,
      lastName: null,
      name: null,
      businessName: null,
      documentType: null,
      documentTypes: [],
      workerServices,
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
          name: '',
          last_name: '',
          document_number: '',
          email: '',
          phone: ''
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
      worker,
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
      data: []
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getDocumentTypes()
    this.setRelationalData(this.workerServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
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
        message: '¿Desea eliminar el trabajador?',
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
        await this.$services.deleteData(['workers', data.id])
        this.notify(this, 'worker.deleteSuccessful', 'positive', 'mood')
        this.getPartners()
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
      this.getPartners(this.params)
    },
    /**
     * Search worker
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getPartners()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['workers', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getPartners(this.params)
          this.notify(this, 'worker.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.branch_office_id = this.branchOffice.id
      this.loadingForm = true
      this.$services.postData(['workers'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getPartners(this.params)
          this.notify(this, 'worker.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all worker
     */
    getPartners (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['workers'], this.params)
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
    },
    getDataApi () {
      const r = this.documentType.number === '1' ? 'dni' : this.documentType.number === '6' ? 'ruc' : null
      if (r) {
        this.$services.getData(['ruc', this.documentNumber], {
          documentType: r
        })
          .then(({ res }) => {
            if (!res.data.error) {
              if (this.documentType.number === '6') {
                this.businessName = res.data.nombre
                this.status = res.data.estado
                this.residenceCondition = res.data.condicion
              } else {
                const nameDivider = res.data.nombre.split(' ')
                this.lastName = `${nameDivider[0]} ${nameDivider[1]}`
                this.name = `${nameDivider[2]} ${nameDivider[3]}`
              }
            } else {
              this.notify(this, res.data.error, 'negative', 'warning')
              this.lastName = null
              this.name = null
              this.businessName = null
            }
          })
      }
    },
    /**
     * Get all worker
     */
    getDocumentTypes () {
      this.loadingTable = true
      this.$services.getData(['document-types'])
        .then(({ res }) => {
          this.documentTypes = res.data
          this.documentType = res.data[0]
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
