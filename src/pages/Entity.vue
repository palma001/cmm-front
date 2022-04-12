<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('entity.add')"
          @click="addDialog = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('entity.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="entity"
          searchable
          action
          :column="entityConfig"
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
      persistent
      full-height
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="entity"
        :propsPanelEdition="propsPanelEdition"
        :config="entityConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialog"
    >
      <dynamic-form
        module="entity"
        :config="entityConfig"
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
import { entityConfig, buttonsActions, propsPanelEdition } from '../config-file/entity/entityConfig.js'
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
      /**
       * Table Buttons
       * @type {Array}
       */
      buttonsActions,
      /**
       * Panel Edition Config
       * @type {Object}
       */
      propsPanelEdition,
      /**
       * Status loading form
       * @type {Boolean}
       */
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
          description: ''
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
      entityConfig,
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
        message: '¿Desea eliminar la tipo organización?',
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
        await this.$services.deleteData(['entities', data.id])
        this.notify(this, 'entity.deleteSuccessful', 'positive', 'mood')
        this.getEntities()
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
      this.getEntities(this.params)
    },
    /**
     * Search EgressType
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getEntities()
    },
    /**
     * Update Coin
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['entities', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getEntities(this.params)
          this.notify(this, 'entity.editSuccessful', 'positive', 'mood')
        })
        .catch(({ response }) => {
          this.catchError(this, response.data.errors)
          this.loadingForm = false
        })
    },
    /**
     * Save Coin
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      this.loadingForm = true
      this.$services.postData(['entities'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getEntities(this.params)
          this.notify(this, 'entity.addSuccessful', 'positive', 'mood')
        })
        .catch(({ response }) => {
          this.catchError(this, response.data.errors)
          this.loadingForm = false
        })
    },
    /**
     * Get all EgressType
     */
    getEntities (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['entities'], params)
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
