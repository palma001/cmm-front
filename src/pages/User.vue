<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('user.add')"
          @click="addDialig = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('userConfig.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="user"
          selection="multiple"
          searchable
          action
          :column="userConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination.sync="optionPagination"
          @search-data="searchData"
          @view-details="viewDetails"
          @on-load-data="loadData"
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
        module="user"
        :propsPanelEdition="propsPanelEdition"
        :config="userConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialig"
    >
      <dynamic-form
        module="user"
        :config="userConfig"
        :loading="loadingForm"
        @cancel="addDialig = false"
        @save="save"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import DynamicForm from '../components/DynamicForm.vue'
import { userConfig, propsPanelEdition, userServices } from '../config-file/user/userConfig.js'
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
      userSession: null,
      branchOffice: null,
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
          name: '',
          phone_number: '',
          document_number: ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialig: false,
      /**
       * Config edition panel
       * @type {Object}
       */
      propsPanelEdition,
      /**
       * File config module
       * @type {Object}
       */
      userConfig,
      /**
       * RelationalData description
       * @type {Object}
       */
      userServices,
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
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.setRelationalData(this.userServices, [], this)
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
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
      this.getUsers(this.params)
    },
    /**
     * Search branch offices
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.getUsers()
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.roles = this.modelRole(data)
      this.loadingForm = true
      this.$services.postData(['users'], data)
        .then(({ res }) => {
          // this.addDialig = false
          this.loadingForm = false
          this.getUsers(this.params)
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    modelRole (data) {
      return [
        {
          branch_office_id: 1,
          role_id: 1
        }
      ]
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      data.roles = this.modelRole(data)
      console.log(data)
      this.loadingForm = true
      this.$services.putData(['users', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getUsers(this.params)
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
    getUsers (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['users'], this.params)
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
