<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
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
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { entry } from '../config-file/entry/entryConfig.js'
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
        },
        {
          name: 'period',
          label: 'Periodo',
          field: 'period',
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
      data: []
    }
  },
  created () {
    this.getEntries()
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
    /**
     * Search entry
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getEntries()
    },
    /**
     * Get all entry
     */
    getEntries (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['entries'], this.params)
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
