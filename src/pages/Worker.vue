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
      v-model="addDialog"
    >
      <q-card style="width: 400px">
        <q-form @submit="save" class="column full-height">
          <q-card-section class="bg-primary text-white row items-center q-pb-sm">
            <div class="text-h6">{{ titleForm }}</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="cancel" />
          </q-card-section>
          <q-card-section class="col q-pt-md">
            <q-input outlined @blur="getDataApi" :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.document_number" label="Numbero de documento" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.name" label="Nombre" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.last_name" label="Apellido" dense/>
            <q-input outlined :rules="[val => val && val !== null || 'Este campo es requerido']" v-model="workerSave.phone" label="Telefono" dense/>
          </q-card-section>
          <q-separator dark />
          <q-card-actions align="right">
            <q-btn color="negative" @click="cancel">Cancelar</q-btn>
            <q-btn color="primary" type="submit" v-if="titleForm === 'Agregar Trabajo'">Agregar</q-btn>
            <q-btn color="primary" @click="update" v-else>Modificar</q-btn>
          </q-card-actions>
        </q-form>
        <q-inner-loading :showing="loadingApi">
          <q-spinner-gears size="100px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { worker, buttonsActions } from '../config-file/worker/workerConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      buttonsActions,
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
      data: [],
      workerSave: {},
      loadingApi: false,
      titleForm: 'Agregar Trabajador'
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
    cancel () {
      this.titleForm = 'Agregar Trabajador'
      this.addDialog = false
    },
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
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.addDialog = true
      this.titleForm = 'Modificar Trabajador'
      this.workerSave = data
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
        this.getWorkers()
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
      this.getWorkers(this.params)
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
      this.getWorkers()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update () {
      this.workerSave.user_updated_id = this.userSession.id
      this.loadingApi = true
      this.$services.putData(['workers', this.selectedData.id], this.workerSave)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingApi = false
          this.getWorkers(this.params)
          this.notify(this, 'worker.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingApi = false
        })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save () {
      this.workerSave.user_created_id = this.userSession.id
      this.workerSave.branch_office_id = this.branchOffice.id
      this.loadingApi = true
      this.$services.postData(['workers'], this.workerSave)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingApi = false
          this.getWorkers(this.params)
          this.notify(this, 'worker.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingApi = false
        })
    },
    /**
     * Get all worker
     */
    getWorkers (params = this.params) {
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
