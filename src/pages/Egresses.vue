<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-3 col-md-3 col-xl-3">
        <q-input type="date" v-model="from" dense outlined hint="Desde"/>
      </div>
      <div class="col-lg-3 col-md-3 col-xl-3">
        <q-input type="date" v-model="to" dense outlined hint="Hasta"/>
      </div>
      <div class="col-lg-1 col-md-1 col-xl-1">
        <q-btn color="primary" icon="search" @click="filterBetween"/>
      </div>
      <div class="col-lg-1 col-md-1 col-xl-1">
        <excel-report :data="dataExport" title="Recibos de Egresos">
          <template v-slot:table>
            <thead>
              <tr>
                <td>Trabajador</td>
                <td>Concepto</td>
                <td>Fecha</td>
                <td>Monto</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in dataExport" :key="d.id">
                <td>{{ d.worker.full_name }}</td>
                <td>{{ d.concept }}</td>
                <td>{{ formatDate(d.created_at) }}</td>
                <td>{{ d.amount }}</td>
              </tr>
            </tbody>
          </template>
        </excel-report>
      </div>
      <div class="col-lg-4 col-md-4 col-xl-4 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('egress.add')"
          @click="$router.push({ name: 'NewEgress' })"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('egress.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="egress"
          searchable
          :column="egress"
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
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import { egress } from '../config-file/egress/egressConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import ExcelReport from '../components/ExcelReport.vue'
import { date } from 'quasar'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    ExcelReport
  },
  data () {
    return {
      to: null,
      from: null,
      dataExport: [],
      conceptFilter: '',
      egressSelected: null,
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
      egress,
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
    this.getEgresses()
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
    formatDate (datee, format) {
      return date.formatDate(datee, format)
    },
    filterBetween () {
      this.params.dateFilter = { from: this.from, to: this.to, field: 'created_at' }
      this.getEntries(this.params)
    },
    viewConcepts (data) {
      this.egressSelected = data
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
        await this.$services.deleteData(['egresss', data.id])
        this.notify(this, 'egress.deleteSuccessful', 'positive', 'mood')
        this.getEgresses()
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
      this.getEgresses(this.params)
    },
    /**
     * Search egress
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getEgresses()
    },
    async getFullEgresses () {
      const { res } = await this.$services.getData(['egresses'], {
        dateFilter: {
          to: this.to,
          from: this.from,
          field: 'created_at'
        }
      })
      this.dataExport = res.data
    },
    /**
     * Get all egress
     */
    getEgresses (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['egresses'], this.params)
        .then(({ res }) => {
          this.data = res.data.data
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
          this.getFullEgresses()
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
