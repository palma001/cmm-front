<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          label="Agregar devolución"
          @click="$router.push({ name: 'NewDevolution' })"
        />
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="devolution"
          searchable
          :column="devolutionConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @search-data="searchData"
          @viewProducts="viewProducts"
          @options="options"
        />
      </div>
    </div>
    <q-dialog v-model="viewProductModal">
      <q-card v-if="devolutionSelected" style="width: 400px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">
            Detalles de la devolución
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            row-key="name"
            wrap-cells
            virtual-scroll
            :data="devolutionSelected.devolution_details"
            :columns="columns"
            :rows-per-page-options="[]"
            hide-bottom
          />
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cerrar" size="md" @click="viewProductModal = false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { devolutionConfig } from '../config-file/devolution/devolutionConfig.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
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
          name: 'description',
          align: 'left',
          label: 'Descripción',
          field: row => row.product.description,
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          sortable: true
        }
      ],
      devolutionSelected: null,
      viewProductModal: null,
      loadingTable: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginated: true,
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
          'user.name': '',
          'user.last_name': '',
          'devolution_reason.name': '',
          observation: '',
          created_at: ''
        }
      },
      text: '',
      devolutionConfig,
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false
    }
  },
  created () {
    this.getBillElectronics()
  },
  methods: {
    /**
      * Get billing
      * @param {Object} data devolution selected
      */
    viewProducts (data) {
      this.viewProductModal = true
      this.devolutionSelected = data
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortdevolution = data.sortdevolution
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getBillElectronics(this.params)
    },
    options (data) {
      console.log(data, 'options')
    },
    open (position) {
      this.position = position
      this.dialog = true
    },
    /**
     * Search category
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getBillElectronics()
    },
    /**
     * Get Bill electronis
     */
    getBillElectronics () {
      this.loadingTable = true
      this.$services.getData(['devolutions'], this.params)
        .then(({ res }) => {
          this.data = res.data.data
          this.loadingTable = false
          this.optionPagination.rowsNumber = res.data.total
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
