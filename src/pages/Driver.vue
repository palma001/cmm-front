<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('driver.add')"
          @click="addDialog = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('driver.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="driver"
          searchable
          action
          :column="driverConfig"
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
        module="driver"
        :propsPanelEdition="propsPanelEdition"
        :config="driverConfig"
        :loading="loadingForm"
        @depends="depends"
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
        module="driver"
        :config="driverConfig"
        :loading="loadingForm"
        @depends="depends"
        @cancel="addDialog = false"
        @save="save"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { driverConfig, buttonsActions, propsPanelEdition, driverServices } from '../config-file/driver/driverConfig.js'
import { mixins } from '../mixins'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
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
      driverServices,
      /**
       * Config file panel edition
       * @type {Obejct}
       */
      propsPanelEdition,
      /**
       * Loading form
       * @type {Boolean}
       */
      loadingForm: false,
      /**
       * Config file buttons table
       * @type {Array}
       */
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
      driverConfig,
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
    this.setRelationalData(this.driverServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Selected dependency
     * @param {Object} data data selected
     * @param {String} propTag tag selected
    */
    depends (data, propTags) {
      this.driverServices.relationalData.map(service => {
        propTags.forEach(propTag => {
          if (service.targetPropTag === propTag) {
            service.services = [data.api]
          }
        })
        return service
      })
      this.setRelationalData(this.driverServices, [], this)
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.editDialog = true
      this.selectedData = data
      this.propsPanelEdition.data = data
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar el conductor?',
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
        await this.$services.deleteData(['drivers', data.id])
        this.notify(this, 'driver.deleteSuccessful', 'positive', 'mood')
        this.getDrivers()
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
      this.getDrivers(this.params)
    },
    /**
     * Search driver
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getDrivers()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      data.ownerable_type = data.ownerable_type.id
      data.ownerable_id = data.ownerable.id
      this.loadingForm = true
      this.$services.putData(['drivers', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getDrivers(this.params)
          this.notify(this, 'driver.editSuccessful', 'positive', 'mood')
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
      data.ownerable_type = data.ownerable_type.id
      data.ownerable_id = data.ownerable.id
      this.loadingForm = true
      this.$services.postData(['drivers'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getDrivers(this.params)
          this.notify(this, 'driver.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all drivers
     */
    getDrivers (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['drivers'], this.params)
        .then(({ res }) => {
          this.data = res.data.data.map(data => {
            data.ownerable_type = {
              id: data.ownerable_type,
              name: this.$t(`driver.${data.ownerable_type}`)
            }
            return data
          })
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
