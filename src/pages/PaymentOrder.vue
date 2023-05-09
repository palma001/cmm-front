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
                name="paymentMethod"
                v-model="paymentMethod"
                option-label="name"
                option-value="id"
                label="Metodo de pago"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="paymentMethods"
                @filter="getPaymentMethods"
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
                name="concept"
                v-model="concept"
                :option-label="row => `${row.code} ${row.name}`"
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
            @changeStatus="changeStatus"
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
      paymentMethod: null,
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
      paymentMethods: [],
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
      data: []
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
    notify (title, color, icon) {
      this.$q.notify({
        message: title,
        color,
        icon,
        actions: [
          { label: 'Cerrar', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },
    changeStatus (data) {
      data.status = data.status === 'approved' ? 'pending_approval' : 'approved'
      this.update(data)
    },
    /**
     * Update PaymnetOrder
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      data.ownerable_type = data.ownerable_type_label_id ?? data.ownerable_type
      this.loadingForm = true
      this.$services.putData(['payment-orders', data.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getPaymentOrders(this.params)
          this.notify('paymentOrder.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
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
            this.assignRelationalData(
              this.paymentOrderConfig,
              service.targetPropTag,
              service.propData,
              [],
              service,
              data
            )
          }
        })
        return service
      })
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
        .then(({ data }) => {
          update(() => {
            this.conceptTypes = data
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
     * All Concepts
     */
    getConcepts (value, update) {
      this.$services.getData(['chart-of-accounts'], {
        sortBy: 'code',
        sortOrder: 'asc',
        dataSearch: {
          name: value,
          code: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.concepts = this.flattenTreeData(res.data)
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
      console.log(data)
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
      this.paymentMethod = null
      this.paymentType = null
      this.paymentTypeDynamic = null
      this.concept = null
      this.conceptType = null
      this.category = null
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
        payment_method_id: this.paymentMethod.id,
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
    getPaymentMethods (value, update) {
      this.$services.getData(['payment-methods'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.paymentMethods = res.data
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
            paymentOrder.ownerable_type_label = ownerableType ? ownerableType.label : ownerableType
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
