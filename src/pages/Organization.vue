<template>
  <div>
    <q-page padding>
      <div class="row q-gutter-y-sm">
        <div class="col-12 q-gutter-x-sm text-center">
          <q-btn
            :color="drawerLeft ? 'negative' : 'secondary'"
            :icon="drawerLeft ? 'filter_alt_off' : 'filter_alt'"
            @click="drawerLeft = !drawerLeft"
          >
            <q-tooltip>
              {{ ucwords($t('organization.filter')) }}
            </q-tooltip>
          </q-btn>
          <q-btn
            color="primary"
            icon="add_circle"
            @click="addDialog = true"
          >
            <q-tooltip>
              {{ ucwords($t('organization.add')) }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-12">
          <data-table
            title="list"
            module="organization"
            searchable
            action
            :column="organizationConfig"
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
          module="organization"
          :propsPanelEdition="propsPanelEdition"
          :config="organizationConfig"
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
          module="organization"
          :config="organizationConfig"
          :loading="loadingForm"
          @cancel="addDialog = false"
          @save="save"
        />
      </q-dialog>
    </q-page>
    <q-drawer
      v-model="drawerLeft"
      :width="350"
      :breakpoint="700"
      side="right"
      class="bg-primary text-white"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <dynamic-filter
            module="organization"
            :config="organizationConfig"
            :loading="loadingForm"
            @cancel="drawerLeft = false"
            @save="save"
            @filter="filter"
          />
        </div>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicFilter from '../components/DynamicFilter.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { organizationConfig, buttonsActions, propsPanelEdition } from '../config-file/organization/organizationConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    DynamicFormEdition,
    DynamicFilter
  },
  data () {
    return {
      drawerLeft: false,
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
      organizationConfig,
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
    filter (data) {
      this.params.dataFilter = data
      this.getOrganizations(this.params)
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
        await this.$services.deleteData(['organizations', data.id])
        this.notify(this, 'organization.deleteSuccessful', 'positive', 'mood')
        this.getOrganizations()
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
      this.getOrganizations(this.params)
    },
    /**
     * Model product
     * @param {Object} data product
     */
    modelFormData (data, put = false) {
      const formData = new FormData()
      data.user_created_id = this.userSession.id
      if (put) {
        formData.append('_method', 'put')
      }
      formData.append('logo', data.logo[0])
      formData.append('signature', data.signature[0])
      formData.append('seal', data.seal[0])
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key]
          console.log(element, typeof element)
          if (typeof element !== 'object') {
            formData.append(key, element)
          }
        }
      }
      return formData
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
      this.getOrganizations()
    },
    /**
     * Update Coin
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      console.log(data)
      this.$services.postUpload(['organizations', this.selectedData.id], this.modelFormData(data, true))
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getOrganizations(this.params)
          this.notify(this, 'organization.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
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
      this.$services.postData(['organizations'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getOrganizations(this.params)
          this.notify(this, 'organization.addSuccessful', 'positive', 'mood')
        })
        .catch((error) => {
          console.log(error)
          this.loadingForm = false
        })
    },
    /**
     * Get all EgressType
     */
    getOrganizations (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['organizations'], params)
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
