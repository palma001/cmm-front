<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('settingAccountingSeat.add')"
          @click="addDialog = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('settingAccountingSeatConfig.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="settingAccountingSeat"
          selection="multiple"
          searchable
          action
          :buttonsActions="buttonsActions"
          :column="settingAccountingSeatConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination.sync="optionPagination"
          @search-data="searchData"
          @view-details="viewDetails"
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
        module="settingAccountingSeat"
        :propsPanelEdition="propsPanelEdition"
        :config="settingAccountingSeatConfig"
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
        module="settingAccountingSeat"
        :config="settingAccountingSeatConfig"
        :loading="loadingForm"
        @cancel="addDialog = false"
        @save="save"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import DynamicForm from '../components/DynamicForm.vue'
import { settingAccountingSeatConfig, propsPanelEdition, settingAccountingSeatServices, buttonsActions } from '../config-file/settingAccountingSeat/settingAccountingSeatConfig.js'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicFormEdition,
    DynamicForm
  },
  data () {
    return {
      buttonsActions,
      settingAccountingSeatServices,
      settingAccountingSeat: null,
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
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc',
        rowsNumber: 20
      },
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          code: '',
          element: '',
          description: '',
          account_type: ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialog: false,
      /**
       * Config edition panel
       * @type {Object}
       */
      propsPanelEdition,
      /**
       * File config module
       * @type {Object}
       */
      settingAccountingSeatConfig,
      /**
       * RelationalData description
       * @type {Object}
       */
      // settingAccountingSeatServices,
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
      userSession: null,
      branchOfficeSession: null
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.settingAccountingSeatServices, [], this)
  },
  methods: {
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la configuración?',
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
        await this.$services.deleteData(['setting-accounting-seats', data.id])
        this.notify(this, 'settingAccountingSeat.deleteSuccessFul', 'positive', 'mood')
        this.getSettingAccountingSeats(this.params)
      })
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getSettingAccountingSeats(this.params)
    },
    /**
     * Search branch offices
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.getSettingAccountingSeats(this.params)
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.name_field = data.name_field.value
      data.account_type = data.account_type.value
      this.loadingForm = true
      this.$services.postData(['setting-accounting-seats'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getSettingAccountingSeats(this.params)
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      this.loadingForm = true
      data.name_field = data.name_field.value
      data.account_type = data.account_type.value
      this.$services.putData(['setting-accounting-seats', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getSettingAccountingSeats(this.params)
        })
        .catch(() => {
          this.loadingForm = false
        })
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
     * Open formulary
     * @param  {String}
     */
    changeTitleForm (title) {
      this.titleForm = title
    },
    /**
     * Get all branch offices
     */
    getSettingAccountingSeats (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['setting-accounting-seats'], params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
        })
        .catch(err => {
          console.log(err)
          this.data = []
          this.optionPagination.rowsNumber = 0
          this.loadingTable = false
        })
    }
  }
}
</script>
