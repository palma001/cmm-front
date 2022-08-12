<template>
  <q-page padding>
    <q-card>
      <q-form @submit="savePaymentOrder" @reset="clean" ref="paymentOrder">
        <q-card-section>
          <div class="text-h6">Nuevo Orden de Pago</div>
        </q-card-section>
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
            <div class="col-xs-12 col-sm-4 col-md-6 col-lg-4 col-xl-4">
              <q-select outlined v-model="paymentType" :options="paymentTypes" label="Tipo de Pago" dense/>
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
  </q-page>
</template>

<script>
import DynamicForm from '../components/DynamicForm.vue'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm
  },
  data () {
    return {
      loadingForm: false,
      paymentTypeDynamics: [],
      paymentTypeDynamic: null,
      paymentDate: null,
      paymentTypes: [
        {
          label: 'Anticipo a contrato',
          value: 'App\\Models\\Field',
          fieldName: 'Contrato',
          fieldValue: 'id',
          fieldLabel: 'denomination',
          endPoint: 'fields'
        }
      ],
      paymentType: null,
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
      addDialogBeneficiary: false
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
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
            this.paymentTypeDynamics = res.data
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
    }
  }
}
</script>
