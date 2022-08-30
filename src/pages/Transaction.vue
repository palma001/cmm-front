<template>
  <q-page padding>
    <q-card>
      <q-form @submit="saveTransaction" @reset="clean" ref="transaction">
        <q-card-section>
          <div class="text-h6">Nuevo Transacción</div>
        </q-card-section>
        <q-card-section class="row q-py-xs q-col-gutter-sm">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-select
              autocomplete="off"
              use-input
              dense
              outlined
              clearable
              behavior="menu"
              input-debounce="20"
              name="paymentOrder"
              v-model="paymentOrder"
              option-label="description"
              option-value="id"
              label="Ordenes de pagos"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="paymentOrders"
              @input="orderSelected"
              @filter="getPaymentOrders"
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
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              type="date"
              outlined
              v-model="date"
              hint="Fecha de pago"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              type="number"
              outlined
              v-model="amount"
              label="Monto"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
        </q-card-section>
        <q-card-section class="row q-py-xs q-col-gutter-sm">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-select
              autocomplete="off"
              use-input
              dense
              outlined
              clearable
              behavior="menu"
              input-debounce="20"
              name="beneficiary"
              v-model="beneficiarySelected"
              option-label="name"
              option-value="id"
              label="Beneficiario"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="beneficiaries"
              @filter="getBeneficiaries"
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
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
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
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              outlined
              v-model="reference"
              label="Referencia"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn icon="clear" color="negative" label="Limpiar" type="reset"/>
          <q-btn icon="save" color="primary" label="Guardar" type="submit" :loading="loadingForm"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { GETTERS } from '../store/module-login/name.js'
import { beneficiary, buttonsActions, propsPanelEdition } from '../config-file/beneficiary/beneficiaryConfig.js'
import { mapGetters } from 'vuex'
import { mixins } from '../mixins'
export default {
  // name: 'PageName',
  mixins: [mixins.containerMixin],
  data () {
    return {
      beneficiary,
      loadingForm: false,
      buttonsActions,
      beneficiaries: [],
      beneficiarySelected: null,
      propsPanelEdition,
      paymentOrders: [],
      paymentOrder: null,
      date: null,
      description: null,
      addDialogBeneficiary: false,
      reference: null,
      amount: null,
      userSession: null
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
    orderSelected () {
      this.amount = this.paymentOrder ? this.paymentOrder.pending : 0
    },
    /**
     * All Payment order
     */
    getPaymentOrders (value, update) {
      this.$services.getData(['payment-orders'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataEqualFilter: {
          status: 'approved'
        },
        dataSearch: {
          description: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.paymentOrders = res.data.data
          })
        })
    },
    /**
     * Model payment
     * @return {Object} model payment
     */
    modelTransaction () {
      return {
        amount: this.amount,
        description: this.description,
        date: this.date,
        reference: this.reference,
        payment_order_id: this.paymentOrder.id,
        beneficiary_id: this.beneficiarySelected.id,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id
      }
    },
    saveTransaction () {
      this.loadingForm = true
      this.$services.postData(['transactions'], this.modelTransaction())
        .then(({ res }) => {
          this.loadingForm = false
          this.notify(this, 'transaction.addSuccessful', 'positive', 'mood')
          this.clean()
        })
        .catch((err) => {
          this.loadingForm = false
          this.notify(this, `message.${err.message}`, 'negative', 'warning')
        })
    },
    /**
     * Clean formulary
     */
    clean () {
      this.paymentOrder = null
      this.date = null
      this.amount = 0
      this.category = null
      this.concept = null
      this.beneficiarySelected = null
      this.reference = null
      this.description = null
      this.resetValidations(this.$refs.transaction)
    },
    /**
     * All Beneficiaries
     */
    getBeneficiaries (value, update) {
      this.$services.getData(['beneficiaries'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value,
          last_name: value,
          document_number: value
        },
        paginate: false
      })
        .then(({ res }) => {
          update(() => {
            this.beneficiaries = res.data
          })
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
    }
  }
}
</script>
