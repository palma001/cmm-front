<template>
  <q-page padding>
    <q-table
      :data="rows"
      :columns="tableColumns"
      :row-key="row => row.id"
      :pagination="true"
      :rows-per-page-options="[10, 20, 30]"
      :filter="search"
      :loading="loading"
      :expand-template="expand"
    >
      <template v-slot:body-cell-expand="{ row, isOpen }">
        <q-btn
          dense
          round
          icon="arrow_drop_down"
          :rotate="isOpen ? 180 : 0"
          @click.native="toggleExpand(row)"
        />
      </template>
      <template v-slot:body-cell-description="{ row }">
        <span>{{ row.description }}</span>
      </template>
    </q-table>
  </q-page>
</template>
<script>
// import DataTable from '../components/DataTable.vue'
// import DynamicForm from '../components/DynamicForm.vue'
// import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { conceptConfig, buttonsActions, propsPanelEdition, conceptServices } from '../config-file/concept/conceptConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    // DataTable,
    // DynamicForm,
    // DynamicFormEdition
  },
  data () {
    return {
      rows: [], // Datos de las cuentas contables
      tableColumns: [
        {
          name: 'code',
          required: true,
          label: 'Código',
          align: 'left',
          field: 'code',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Descripción',
          align: 'left',
          field: 'name',
          sortable: true
        }
      ],
      search: '',
      loading: false,
      conceptServices,
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
      conceptConfig,
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
    this.setRelationalData(this.conceptServices, [], this)
    this.getConcepts()
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    toggleExpand (row) {
      this.$refs.table.toggleRow(row)
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
        message: '¿Desea eliminar la tipo de operación?',
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
        await this.$services.deleteData(['chart-of-accounts', data.id])
        this.notify(this, 'concept.deleteSuccessful', 'positive', 'mood')
        this.getConcepts()
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
      this.getConcepts(this.params)
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
      this.getConcepts()
    },
    /**
     * Update Coin
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['chart-of-accounts', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getConcepts(this.params)
          this.notify(this, 'concept.editSuccessful', 'positive', 'mood')
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
      this.$services.postData(['chart-of-accounts'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getConcepts(this.params)
          this.notify(this, 'concept.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    flattenTreeData (data) {
      const result = []
      const flatten = (account, level) => {
        const row = { ...account }
        row.level = level
        result.push(row)
        if (account.children) {
          for (const child of account.children) {
            flatten(child, level + 1)
          }
        }
      }
      for (const account of data) {
        flatten(account, 0)
      }
      return result
    },
    /**
     * Get all EgressType
     */
    getConcepts (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['chart-of-accounts'])
        .then(({ res }) => {
          this.rows = this.flattenTreeData(res.data)
          console.log(this.rows)
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
