<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('client.add')"
          @click="addDialig = true"
        >
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
          v-if="$q.screen.lt.sm"
        >
          {{
            ucwords($t('client.add'))
          }}
        </q-tooltip>
      </q-btn>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="client"
          searchable
          action
          :column="client"
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
      full-height
      persistent
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="client"
        :propsPanelEdition="propsPanelEdition"
        :config="client"
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
        module="client"
        :config="client"
        :loading="loadingForm"
        :apiKey="['document_number']"
        @cancel="addDialig = false"
        @save="save"
      >
        <template v-slot:top>
          <q-select
            label="Tipo de documento"
            v-validate="'required'"
            data-vv-as="document_type"
            name="document_type"
            dense
            outlined
            option-label="name"
            option-value="id"
            v-model="documentType"
            :options="documentTypes"
            :error="errors.has('document_type')"
            :error-message="errors.first('document_type')"
          />
          <q-input
            label="Número de documento"
            v-validate="'required'"
            data-vv-as="document_number"
            name="document_number"
            dense
            outlined
            v-model="documentNumber"
            :error="errors.has('document_number')"
            :error-message="errors.first('document_number')"
            @blur="getDataApi"
          />
          <q-input
            label="Nombre"
            v-validate="'required'"
            data-vv-as="name"
            name="name"
            dense
            outlined
            v-model="name"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
            v-if="documentType.name === 'DNI'"
          />
          <q-input
            label="Apellido"
            v-validate="'required'"
            data-vv-as="last_name"
            name="last_name"
            dense
            outlined
            v-model="lastName"
            :error="errors.has('last_name')"
            :error-message="errors.first('last_name')"
            v-if="documentType.name === 'DNI'"
          />
          <q-input
            label="Nombre o razon social"
            v-validate="'required'"
            data-vv-as="businessName"
            name="businessName"
            dense
            outlined
            v-model="businessName"
            :error="errors.has('businessName')"
            :error-message="errors.first('businessName')"
            v-if="documentType.name === 'RUC'"
          />
        </template>
      </dynamic-form>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { client, buttonsActions, propsPanelEdition, clientServices } from '../config-file/client/clientConfig.js'
import { mixins } from '../mixins'
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
      documentNumber: null,
      lastName: null,
      name: null,
      businessName: null,
      documentType: null,
      documentTypes: [],
      clientServices,
      buttonsActions,
      propsPanelEdition,
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
      addDialig: false,
      /**
       * File config module
       * @type {Object}
       */
      client,
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
    this.getDocumentTypes()
    this.setRelationalData(this.clientServices, [], this)
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
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
        message: '¿Desea eliminar el cliente?',
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
        await this.$services.deleteData(['clients', data.id])
        this.notify(this, 'client.deleteSuccessfull', 'positive', 'mood')
        this.getClients()
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
      this.getClients(this.params)
    },
    /**
     * Search client
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getClients()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['clients', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getClients(this.params)
          this.notify(this, 'client.editSuccessfull', 'positive', 'mood')
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
      data.user_id = this.userSession.id
      data.name = this.name ?? this.businessName
      data.last_name = this.lastName
      data.document_number = this.documentNumber
      data.document_type_id = this.documentType.id
      this.loadingForm = true
      this.$services.postData(['clients'], data)
        .then(({ res }) => {
          this.addDialig = false
          this.loadingForm = false
          this.getClients(this.params)
          this.notify(this, 'client.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all client
     */
    getClients (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['clients'], this.params)
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
    },
    getDataApi () {
      this.$services.getData(['ruc', this.documentNumber], {
        documentType: this.documentType.name.toLowerCase()
      })
        .then(({ res }) => {
          if (!res.data.error) {
            if (res.data.nombre_o_razon_social) {
              this.businessName = res.data.nombre_o_razon_social
            } else {
              const nameDivider = res.data.nombre_completo.split(' ')
              this.lastName = `${nameDivider[0]} ${nameDivider[1]}`
              this.name = `${nameDivider[2]} ${nameDivider[3]}`
            }
          } else {
            this.notify(this, res.data.error, 'negative', 'warning')
            this.lastName = null
            this.name = null
            this.businessName = null
          }
        })
    },
    /**
     * Get all client
     */
    getDocumentTypes () {
      this.loadingTable = true
      this.$services.getData(['document-types'])
        .then(({ res }) => {
          this.documentTypes = res.data
          this.documentType = res.data[0]
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
