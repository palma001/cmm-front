<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('guide.add')"
          @click="addDialog = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('guide.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="guide"
          searchable
          action
          activeVisibleColumn
          :column="guideConfig"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          @swornDeclaration="swornDeclaration"
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
        module="guide"
        :propsPanelEdition="propsPanelEdition"
        :config="guideConfig"
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
        module="guide"
        :config="guideConfig"
        :loading="loadingForm"
        @depends="depends"
        @cancel="addDialog = false"
        @save="save"
      />
    </q-dialog>
    <q-dialog
      v-model="uploadImage"
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="q-pb-xs">
          <div class="text-h6">Declaración Jurada</div>
        </q-card-section>
        <q-card-section>
          <q-uploader
            :factory="uploadFiles"
            label="Cargar Archivos Maximo 5 Archivos"
            ref="uploader"
            multiple
            bordered
            batch
            style="width: 100%"
            max-files="5"
            @rejected="onRejected"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <sworn-declaration v-if="g" :data="guideSelected" id="print"/>
      <vue-html2pdf
        ref="html2Pdf"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1000"
        filename="nameFile"
        :pdf-quality="2"
        :manual-pagination="true"
      >
        <section slot="pdf-content" class="text-uppercase text-dark q-pa-md">
        </section>
      </vue-html2pdf>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import VueHtml2pdf from 'vue-html2pdf'
import { guideConfig, buttonsActions, propsPanelEdition, guideServices } from '../config-file/guide/guideConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import SwornDeclaration from '../components/SwornDeclaration'
import { jsPDF } from 'jspdf'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    VueHtml2pdf,
    DynamicForm,
    DynamicFormEdition,
    SwornDeclaration
  },
  data () {
    return {
      uploadImage: false,
      guideServices,
      g: false,
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
          name: ''
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
      guideConfig,
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
      guideSelected: null
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.guideServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Open sworn declaration
     * @param {Object} data guide selected
     */
    swornDeclaration (data) {
      this.guideSelected = data
      if (this.guideSelected && this.guideSelected.sworn_declarations.length <= 0) {
        this.uploadImage = true
      } else {
        const source = document.getElementById('print')
        const doc = new jsPDF()
        doc.html(source)
        console.log(doc.path)
        doc.save()
        // this.$refs.html2Pdf.generatePdf()
      }
    },
    /**
     * Depends Select
     * @param {data} data selected
     * @param {String} propTag name select
     */
    depends (data, propTags) {
      this.$nextTick(() => {
        this.guideServices.relationalData.map(service => {
          propTags.forEach(propTag => {
            if (service.targetPropTag === propTag) {
              service.petitionParams = {
                dataEqualFilter: {
                  ownerable_type: 'App\\Models\\MaterialSupplier',
                  ownerable_id: data.id
                },
                paginate: false
              }
            }
          })
          return service
        })
        this.setRelationalData(this.guideServices, [], this)
      })
    },
    /**
     * Validation input type file
     * @param {Array} rejectedEntries files errors
     */
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    /**
     * Upload image
     * @type {Array} files images
     * @return {Promise} promise
     */
    uploadFiles (files, updateProgress) {
      console.log('files')
      const data = new FormData()
      for (let i = 0; i < files.length; i++) {
        data.append(`files[${i}]`, files[i])
      }
      data.append('guide_id', this.guideSelected.id)
      data.append('user_created_id', this.userSession.id)
      return new Promise((resolve, reject) => {
        this.$services.postUpload(['sworn-declarations'], data)
          .then(({ res }) => {
            this.notify(this, 'guide.uploadSuccess', 'positive', 'mood')
            resolve(null)
          })
          .catch(err => reject(err))
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
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la tipo estado?',
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
        await this.$services.deleteData(['guides', data.id])
        this.notify(this, 'guide.deleteSuccessful', 'positive', 'mood')
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
      this.$services.putData(['guides', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getOrganizations(this.params)
          this.notify(this, 'guide.editSuccessful', 'positive', 'mood')
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
      this.$services.postData(['guides'], data)
        .then(({ res }) => {
          this.addDialog = false
          this.loadingForm = false
          this.getOrganizations(this.params)
          this.notify(this, 'guide.addSuccessful', 'positive', 'mood')
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
      this.$services.getData(['guides'], params)
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
