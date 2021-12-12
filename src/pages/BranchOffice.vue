<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('branchOffice.add')"
          @click="addDialig = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('branchOfficeConfig.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="branchOffice"
          selection="multiple"
          searchable
          action
          :column="branchOfficeConfig"
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
        module="branchOffice"
        :propsPanelEdition="propsPanelEdition"
        :config="branchOfficeConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      >
        <template>
          <div class="text-h6">
            Series
          </div>
          <div class="row q-col-gutter-sm q-gutter-y-sm" v-for="serie in series" :key="serie.id">
            <div class="col-6">
              <q-select
                use-input
                hide-selected
                fill-input
                outlined
                clearable
                dense
                input-debounce="0"
                name="voucherType"
                autocomplete="off"
                ref="voucherTypeRef"
                v-model="serie.voucher_type"
                option-label="name"
                :label="ucwords($t('billing.voucher_type'))"
                :options="voucherTypes"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-input
                v-model="serie.name"
                outlined
                dense
                label="Nombre de la serie"
                type="text"
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12 text-right">
              <q-btn
                dense
                round
                icon="add"
                color="primary"
                @click="addSerie"
              />
            </div>
          </div>
        </template>
      </dynamic-form-edition>
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialig"
    >
      <dynamic-form
        module="branchOffice"
        :config="branchOfficeConfig"
        :loading="loadingForm"
        @cancel="addDialig = false"
        @save="save"
      >
        <template>
          <div class="text-h6">
            Series
          </div>
          <div class="row q-col-gutter-sm q-gutter-y-sm" v-for="serie in series" :key="serie.id">
            <div class="col-6">
              <q-select
                use-input
                hide-selected
                fill-input
                outlined
                clearable
                dense
                input-debounce="0"
                name="voucherType"
                autocomplete="off"
                ref="voucherTypeRef"
                v-model="serie.voucherType"
                option-label="name"
                :label="ucwords($t('billing.voucher_type'))"
                :options="voucherTypes"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-input
                v-model="serie.name"
                outlined
                dense
                label="Nombre de la serie"
                type="text"
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12 text-right">
              <q-btn
                dense
                round
                icon="add"
                color="primary"
                @click="addSerie"
              />
            </div>
          </div>
        </template>
      </dynamic-form>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import DynamicForm from '../components/DynamicForm.vue'
import { branchOfficeConfig, propsPanelEdition } from '../config-file/branchOffice/branchOfficeConfig.js'
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
      series: [{ addible: true }],
      voucherTypes: [],
      branchOfficeSession: null,
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
      branchOfficeConfig,
      /**
       * RelationalData description
       * @type {Object}
       */
      // branchOfficeServices,
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
    this.setRelationalData(this.branchOfficeServices, [], this)
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getVoucherTypes()
  },
  methods: {
    addSerie () {
      this.series.push({
        addible: true
      })
    },
    /**
     * Get voucher types
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'], {
        forAccountingPlan: true
      })
        .then(({ res }) => {
          this.voucherTypes = res.data
          this.voucherType = res.data[0]
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
      this.getBranchOffices(this.params)
    },
    /**
     * Search branch offices
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.getBranchOffices()
    },
    /**
     * Model series
     * @type {Array} series branch office
     */
    modelSerie (series) {
      return series.filter(serie => {
        return serie.addible && serie.voucher_type && serie.name
      }).map(serie => {
        return {
          voucher_type_id: serie.voucher_type.id,
          name: serie.name,
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.series = this.modelSerie(this.series)
      this.loadingForm = true
      this.$services.postData(['branch-offices'], data)
        .then(({ res }) => {
          // this.addDialig = false
          this.loadingForm = false
          this.getBranchOffices(this.params)
          this.series = [{
            addible: true
          }]
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
      data.user_updated_id = this.userSession.id
      data.series = this.modelSerie(this.series)
      this.loadingForm = true
      this.$services.putData(['branch-offices', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getBranchOffices(this.params)
          this.series = [{
            addible: true
          }]
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
      this.series = data.series.map(serie => {
        serie.addible = false
        return serie
      })
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
    getBranchOffices (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['branch-offices'], this.params)
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
