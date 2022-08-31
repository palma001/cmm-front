<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Nuevo Orden de Pago</div>
        <q-space />
        <q-btn icon="list"  color="primary" @click="dialogListPaymentOrder = true"/>
      </q-card-section>
      <q-form @submit="savePaymentOrder" @reset="clean" ref="paymentOrder">
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="entity"
                v-model="entity"
                option-label="name"
                option-value="id"
                label="Entidad"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="entities"
                @filter="getEntities"
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
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="operationType"
                v-model="operationType"
                option-label="name"
                option-value="id"
                label="Tipo de operación"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="operationTypes"
                @filter="getOperationTypes"
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
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="coin"
                v-model="coin"
                option-label="name"
                option-value="id"
                label="Moneda"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="coins"
                @filter="getCoins"
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="category"
                v-model="category"
                option-label="name"
                option-value="id"
                label="Categoria"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="categories"
                @filter="getCategories"
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="conceptType"
                v-model="conceptType"
                option-label="name"
                option-value="id"
                label="Tipos de conceptos"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="conceptTypes"
                @filter="getConceptTypes"
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="concept"
                v-model="concept"
                option-label="name"
                option-value="id"
                label="Concepto"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="concepts"
                @filter="getConcepts"
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-select outlined v-model="paymentType" :options="paymentTypes" label="Tipo de beneficiario" dense/>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4" v-if="paymentType">
              <q-select
                autocomplete="off"
                use-input
                dense
                outlined
                clearable
                behavior="menu"
                input-debounce="20"
                name="paymentTypeDynamic"
                v-model="paymentTypeDynamic"
                hint="Beneficiario"
                :option-label="paymentType.fieldLabel"
                :option-value="paymentType.fieldValue"
                :label="paymentType.fieldName"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="paymentTypeDynamics"
                @filter="getPaymentTypeDynamics"
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
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-input
                outlined
                v-model="amount"
                label="Monto"
                dense
                type="number"
                :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-input
                outlined
                v-model="paymentDate"
                hint="Fecha de orden"
                dense
                type="date"
                :rules="[val => val && val !== null || 'Este campo es requerido']"/>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-input
                type="textarea"
                outlined
                v-model="description"
                label="Descripción"
                dense
                autogrow
                :rules="[val => val && val !== null || 'Este campo es requerido']"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn icon="clear" color="negative" label="Limpiar" type="reset"/>
          <q-btn icon="save" color="primary" label="Guardar" type="submit" :loading="loadingForm"/>
        </q-card-actions>
      </q-form>
    </q-card>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="addDialogBeneficiary"
    >
      <dynamic-form
        module="coin"
        :config="coin"
        :loading="loadingForm"
        @cancel="addDialogBeneficiary = false"
        @save="save"
      />
    </q-dialog>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="paymentOrder"
        :propsPanelEdition="propsPanelEdition"
        :config="paymentOrderConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
        @depends="depends"
      />
    </q-dialog>
    <q-dialog
      v-model="dialogListPaymentOrder"
      maximized
    >
      <q-card>
        <q-bar class="bg-primary">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <data-table
            title="list"
            module="paymentOrder"
            searchable
            action
            activeVisibleColumn
            :column="paymentOrderConfig"
            :data="data"
            :loading="loadingTable"
            :buttonsActions="buttonsActions"
            :optionPagination="optionPagination"
            @view-details="viewDetails"
            @search-data="searchData"
            @on-load-data="loadData"
            @delete="deleteData"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import DynamicForm from '../components/DynamicForm.vue'
import DataTable from '../components/DataTable.vue'
import { GETTERS } from '../store/module-login/name.js'
import { paymentOrderConfig, buttonsActions, propsPanelEdition, paymentOrderServices } from '../config-file/paymentOrder/paymentOrderConfig.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'

export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm,
    DataTable,
    DynamicFormEdition
  },
  data () {
    return {
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
      editDialog: false,
      paymentOrderServices,
      paymentOrderConfig,
      buttonsActions,
      propsPanelEdition,
      loadingForm: false,
      paymentTypeDynamics: [],
      paymentTypeDynamic: null,
      categories: [],
      category: null,
      conceptTypes: [],
      conceptType: null,
      concepts: [],
      concept: null,
      paymentDate: null,
      dialogListPaymentOrder: false,
      paymentTypes: [
        {
          label: 'Contrato',
          value: 'App\\Models\\Field',
          fieldName: 'Contrato',
          fieldValue: 'id',
          fieldLabel: 'denomination',
          endPoint: 'fields'
        },
        {
          label: 'Proveedor',
          value: 'App\\Models\\Provider',
          fieldName: 'Proveedores',
          fieldValue: 'id',
          fieldLabel: 'name',
          endPoint: 'providers'
        },
        {
          label: 'Personal',
          value: 'App\\Models\\Personal',
          fieldName: 'Personal',
          fieldValue: 'id',
          fieldLabel: 'name',
          endPoint: 'personals'
        },
        {
          label: 'Cliente',
          value: 'App\\Models\\Client',
          fieldName: 'Cliente',
          fieldValue: 'id',
          fieldLabel: 'name',
          endPoint: 'clients'
        },
        {
          label: 'Oficina',
          value: 'App\\Models\\BranchOffice',
          fieldName: 'Oficina',
          fieldValue: 'id',
          fieldLabel: 'name',
          endPoint: 'branch-offices'
        }
      ],
      paymentType: null,
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
          description: '',
          amount: '',
          'concept.name': '',
          'entity.name': ''
        }
      },
      amount: 0,
      /**
       * Operation type selected cash flow
       * @type {Object}
       */
      operationType: null,
      /**
       * Description cash flow
       * @type {String}
       */
      description: null,
      /**
       * Concept selected cash flow
       * @type {Object}
       */
      entity: null,
      /**
       * Entities cash flow
       * @type {Array}
       */
      entities: [],
      /**
       * Beneficiary selected cash flow
       * @type {Object}
       */
      coin: null,
      /**
       * Coins cash flow
       * @type {Array}
       */
      coins: [],
      /**
       * OperationTypes cash flow
       * @type {Array}
       */
      operationTypes: [],
      /**
       * User session
       * @type {Object}
       */
      userSession: null,
      addDialogBeneficiary: false,
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
      listStatus: {
        approved: 'Aprobado',
        pending_approval: 'Pendiente por aprobado',
        canceled: 'Cancelado'
      }
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.setRelationalData(this.paymentOrderServices, [], this)
  },
  watch: {
    paymentType () {
      this.paymentTypeDynamic = null
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    update (data) {
      console.log(data)
    },
    /**
     * Selected dependency
     * @param {Object} data data selected
     * @param {String} propTag tag selected
    */
    depends (data, propTags) {
      this.paymentOrderServices.relationalData.map(service => {
        propTags.forEach(propTag => {
          if (service.targetPropTag === propTag) {
            service.services = [data.api]
            console.log(data, propTags)
          }
        })
        return service
      }).filter(service => {
        propTags.forEach(propTag => {
          return service.targetPropTag === propTag
        })
      })
      this.setRelationalData(this.paymentOrderServices, [], this)
    },
    /**
     * All concept types
     */
    getConceptTypes (value, update) {
      this.$services.getData(['concept-types'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        dataEqualFilter: {
          category_id: this.category.id
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.conceptTypes = res.data
          })
        })
    },
    /**
     * All Categories
     */
    getCategories (value, update) {
      this.$services.getData(['categories'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.categories = res.data.data
          })
        })
    },
    /**
     * All Concepts
     */
    getConcepts (value, update) {
      this.$services.getData(['concepts'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        dataEqualFilter: {
          concept_type_id: this.conceptType.id
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.concepts = res.data
          })
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
     * Search EgressType
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      console.log(data)
      this.params.page = 1
      this.getPaymentOrders(this.params)
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
      this.getPaymentOrders(this.params)
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la orden de pago?',
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
        await this.$services.deleteData(['payment-orders', data.id])
        this.notify(this, 'paymentOrder.deleteSuccessful', 'positive', 'mood')
        this.getPaymentOrders(this.params)
      })
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        ref.resetValidation()
      }, 100)
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.branch_office_id = this.branchOffice.id
      this.loadingForm = true
      this.$services.postData(['beneficiaries'], data)
        .then(({ res }) => {
          this.addDialogBeneficiary = false
          this.loadingForm = false
          this.beneficiary = res.data
          this.notify(this, 'beneficiary.addSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Clean formulary
     */
    clean () {
      this.entity = null
      this.coins = null
      this.amount = 0
      this.description = null
      this.operationType = null
      this.paymentType = null
      this.paymentTypeDynamic = null
      this.paymentDate = null
      this.images = []
      this.resetValidations(this.$refs.paymentOrder)
    },
    /**
     * Model payment
     * @return {Object} model payment
     */
    modelPaymentOrder () {
      return {
        description: this.description,
        status: 'pending_approval',
        amount: this.amount,
        operation_type_id: this.operationType.id,
        ownerable_id: this.paymentTypeDynamic.id,
        ownerable_type: this.paymentType.value,
        entity_id: this.entity.id,
        coin_id: this.coin.id,
        payment_date: this.paymentDate,
        concept_id: this.concept.id,
        user_created_id: this.userSession.id
      }
    },
    /**
     * Save Beneficiary
     * @param  {Object}
     */
    savePaymentOrder () {
      this.loadingForm = true
      this.$services.postData(['payment-orders'], this.modelPaymentOrder())
        .then(({ res }) => {
          this.loadingForm = false
          this.notify(this, 'paymentOrder.addSuccessful', 'positive', 'mood')
          this.clean()
        })
        .catch((err) => {
          this.loadingForm = false
          this.notify(this, `message.${err.message}`, 'negative', 'warning')
        })
    },
    /**
     * All OperationTypes
     */
    getOperationTypes (value, update) {
      this.$services.getData(['operation-types'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.operationTypes = res.data
          })
        })
    },
    /**
     * All Payment type value
     */
    getPaymentTypeDynamics  (value, update) {
      this.$services.getData([this.paymentType.endPoint], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.paymentTypeDynamics = res.data.data ?? res.data
          })
        })
    },
    /**
     * All Entities
     */
    getEntities (value, update) {
      this.$services.getData(['entities'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.entities = res.data
          })
        })
    },
    /**
     * All Coins
     */
    getCoins (value, update) {
      this.$services.getData(['coins'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.coins = res.data
          })
        })
    },
    /**
     * All Coins
     */
    getPaymentOrders (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['payment-orders'], params)
        .then(({ res }) => {
          this.data = res.data.data.map(paymentOrder => {
            const ownerableType = this.paymentTypes.find(paymentType => paymentType.value === paymentOrder.ownerable_type)
            paymentOrder.ownerable_type = ownerableType ? ownerableType.label : ownerableType
            paymentOrder.status = this.listStatus[paymentOrder.status]
            return paymentOrder
          })
          this.optionPagination.rowsNumber = res.data.meta.total
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
