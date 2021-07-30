<template>
  <q-page padding @keyup.113="saveSale">
    <q-card class="my-card">
      <q-card-section class="q-pb-sm">
        <div class="row">
          <div class="col-12">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ ucwords($t('billing.newBilling')) }}
                </p>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-5 col-xs-6 q-pa-sm q-gutter-sm text-right">
                <q-btn
                  size="sm"
                  color="primary"
                  class="q-mt-sm"
                  icon="list"
                  @click="getBillings">
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ ucwords($t('billing.history')) }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  style="background: goldenrod; color: white"
                  class="q-mt-sm"
                  size="sm"
                  icon="attach_money"
                  @click="addEntryAndExitOfMoney = true"
                >
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ ucwords($t('billing.entryAndExitOfMoney')) }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  color="negative"
                  class="q-mt-sm"
                  size="sm"
                  icon="close"
                  @click="closeBoxCut = true">
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ ucwords($t('billing.closeBox')) }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row justify-between q-col-gutter-xs">
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <q-select
              autocomplete="off"
              use-input
              hide-selected
              fill-input
              dense
              outlined
              clearable
              input-debounce="0"
              name="client"
              v-model="billing.client"
              option-label="full_name"
              option-value="id"
              v-validate="'required'" data-vv-as="field"
              :error-message="errorValidation('client')"
              :error="errors.has('client')"
              :label="ucwords($t('billing.cliente'))"
              :options="clients"
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
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              input-debounce="0"
              name="operationType"
              ref="operationTypeRef"
              v-model="billing.operationType"
              v-validate="'required'"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              :label="ucwords($t('billing.typeOfSale'))"
              :options="operationTypes"
              :error-message="errorValidation('operationType')"
              :error="errors.has('operationType')"
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
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
              v-model="billing.voucherType"
              v-validate="'required'"
              data-vv-as="field"
              option-value="id"
              option-label="name"
              :label="ucwords($t('billing.voucherType'))"
              :options="voucherTypes"
              :error-message="errorValidation('voucherType')"
              :error="errors.has('voucherType')"
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
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-select
              outlined
              v-model="coin"
              dense
              option-label="name"
              option-value="id"
              :label="ucwords($t('billing.coin'))"
              :options="coins"
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
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-input
              v-model="billing.dateBilling"
              outlined
              dense
              type="date"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-md">
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <product-list
              label="articulo"
              value="id"
              autofocus
              ref="codigo"
              :data="products"
              @errorSearch="errorSearch"
              @selected="setTable"
              @showLists="getProducts"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-input
              v-model="amount"
              outlined
              dense
              type="number"
              :label="ucwords($t('billing.amount'))"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-input
              :label="ucwords($t('billing.stock'))"
              v-model="stock"
              outlined
              dense
              disable
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-input
              v-model="priceOfSale"
              outlined
              dense
              type="number"
              :label="ucwords($t('billing.priceOfSale'))"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-splitter
          v-model="splitterModel"
          separator-style="width: 0px"
          :horizontal="$q.screen.lt.sm"
        >
          <template v-slot:before>
            <div class="q-pa-xs">
              <q-table
                row-key="name"
                wrap-cells
                virtual-scroll
                :data="dataProduct"
                :columns="columns"
                :rows-per-page-options="[50]"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>
                      <q-btn size="xs" color="negative" icon="close" @click="deleteProduct(props.row)"/>
                    </q-td>
                    <q-td key="articulo" :props="props">
                      {{ props.row.articulo }}
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit v-model.number="props.row.cantidad">
                        <q-input type="number" v-model.number="props.row.cantidad" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="precio" :props="props">
                      {{ props.row.precio }}
                      <q-popup-edit v-model.number="props.row.precio">
                        <q-input type="number" v-model.number="props.row.precio" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="descuento" :props="props">
                      {{ props.row.descuento }}
                      <q-popup-edit v-model.number="props.row.descuento">
                        <q-input type="number" v-model.number="props.row.descuento" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="subtotal" :props="props">
                      {{ props.row.subtotal }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </template>
          <template v-slot:after>
            <!-- <div class="q-pa-xs">
              <q-card>
                <q-card-section style="background: goldenrod; color: white" class="q-pt-xs q-pb-xs">
                  <div class="text-h6 text-right">Total: {{ totalSale }} $</div>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-md">
                  <div class="row justify-between q-gutter-xs">
                    <div class="col-12">
                      <q-input
                        v-model="paidSale.debito"
                        outlined
                        dense
                        type="number"
                        label="Debito"
                        name="debito"
                        data-vv-as="debito"
                        v-validate="{
                          required: billing.operationType.value === 'venta' && !paidSale.credito && !paidSale.efectivo
                        }"
                        :error-message="errorValidation('debito')"
                        :error="errors.has('debito')"
                        @keyup.enter="saveSale"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="paidSale.credito"
                        outlined
                        dense
                        type="number"
                        name="credito"
                        data-vv-as="credito"
                        v-validate="{
                          required: billing.operationType.value === 'venta' && !paidSale.debito && !paidSale.efectivo
                        }"
                        :label="ucwords($t('billing.credit'))"
                        :error-message="errorValidation('credito')"
                        :error="errors.has('credito')"
                        @keyup.enter="saveSale"
                      />
                    </div>
                    <div class="col-5">
                      <q-input
                        v-model="paidSale.porcentaje"
                        outlined
                        dense
                        type="number"
                        :label="ucwords($t('billing.creditPercentage'))"
                        @input="percentage"
                        @keyup.enter="saveSale"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        v-model="paidSale.montoPorcentaje"
                        outlined
                        dense
                        disable
                        type="number"
                        :label="ucwords($t('billing.moneyPercentage'))"
                        @keyup.enter="saveSale"
                      />
                    </div>
                    <div class="col-12 q-mt-md">
                      <q-input
                        v-model="paidSale.efectivo"
                        outlined
                        dense
                        type="number"
                        name="efectivo"
                        data-vv-as="efectivo"
                        v-validate="{
                          required: billing.operationType.value === 'venta' && !paidSale.debito && !paidSale.credito
                        }"
                        :label="ucwords($t('billing.cash'))"
                        :error-message="errorValidation('efectivo')"
                        :error="errors.has('efectivo')"
                        @keyup.enter="saveSale"
                      />
                    </div>
                    <div class="col-5">
                      <q-btn class="full-width" color="negative" icon="close" @click="emptyInputBilling">
                        <q-tooltip
                          anchor="bottom middle"
                          transition-show="flip-right"
                          transition-hide="flip-left"
                          :offset="[10, 10]"
                          content-style="font-size: 13px"
                        >
                          {{ ucwords($t('billing.cancelBilling')) }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div class="col-5">
                      <q-btn
                        color="primary"
                        class="full-width"
                        icon="check"
                        @click="saveSale"
                      >
                        <q-tooltip
                          anchor="bottom middle"
                          transition-show="flip-right"
                          transition-hide="flip-left"
                          content-style="font-size: 13px"
                          :offset="[10, 10]"
                        >
                          {{ ucwords($t('billing.saveBilling')) }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div> -->
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="addBoxCut"
      full-height
      position="right"
      persistent
    >
      <DynamicForm
        module="boxCut"
        :loading="loadingAdd"
        :buttons="buttonsBoxCut"
        :config="boxCutConfig"
        @save="saveBoxCut"
        @cancel="cancel"
      />
    </q-dialog>

    <q-dialog
      v-model="addEntryAndExitOfMoney"
      full-height
      position="right"
      persistent
    >
      <DynamicForm
        module="entryAndExitOfMoney"
        :loading="loadingAddEntryAndExitOfMoney"
        :buttons="buttonsEntryAndExitOfMoney"
        :config="entryAndExitOfMoney"
        @save="saveEntryAndExitOfMoney"
        @cancel="cancelEntryAndExitOfMoney"
      />
    </q-dialog>
    <b-confirm-alert
      color="negative"
      icon="close"
      :show="closeBoxCut"
      :message="$t('billing.confirmCloseBox')"
      :loading="loadingCLose"
      @confirm="closeBox"
      @cancel="closeBoxCut = false"
    />

    <b-confirm-alert
      color="negative"
      icon="close"
      :show="alertArching"
      :message="$t('arching.notFound')"
      @confirm="cancel"
      @cancel="cancel"
    />

     <q-dialog
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialogBillingVisible"
      :maximized="maximizedToggle"
    >
      <q-card>
        <q-bar class="bg-primary text-white">
          {{ ucwords($t('billing.sales')) }}
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <data-table
            module="billing"
            title="listBilling"
            :loading="visibleTableBilling"
            :column="billingConfig"
            :data="dataTableBilling"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import { mixins } from '../mixins'
import ProductList from '../components/ProductList'
import DynamicForm from '../components/DynamicForm'
import BConfirmAlert from '../components/BConfirmAlert'
import DataTable from '../components/DataTable'
import { boxCutConfig, buttonsBoxCut, boxCutServices } from '../config-file/boxCut/boxCutConfig'
import { billingConfig } from '../config-file/billing/billingConfig'
import { entryAndExitOfMoney, buttonsEntryAndExitOfMoney } from '../config-file/entryAndExitOfMoney/entryAndExitOfMoney'
import { ALL_PRODUCT } from '../Graphql/Product/getAllProduct'
import { SAVE_BILLING } from '../Graphql/Billing/billingMutations'
import { GET_BILLINGS } from '../Graphql/Billing/billingQueries'
import { GET_CORTE_CAJA_ACTIVE } from '../Graphql/BoxCut/boxCutQueries'
import { OPEN_BOX_CUT, CLOSE_BOX_CUT } from '../Graphql/BoxCut/boxCutMutations'
import { ENTRY_AND_EXIT_OF_MONEY } from '../Graphql/EntryAndExitOfMoney/entryAndExitOfMoneyMutations'
export default {
  name: 'Billing',
  mixins: [mixins.containerMixin],
  components: {
    ProductList,
    DynamicForm,
    BConfirmAlert,
    DataTable
  },
  data () {
    return {
      loadingCLose: false,
      /**
       * Status table billing
       * @type {Boolean} status table billing
       */
      visibleTableBilling: false,
      /**
       * Set billing data table
       * @type {Boolean} billing data table
       */
      dataTableBilling: [],
      /**
       * Config archive
       * @type {Array} Billing array
       */
      billingConfig,
      /**
       * Status dialog billing
       * @type {Boolean} status dialog
       */
      dialogBillingVisible: false,
      /**
       * Set status maximzed dialog
       * @type {Boolean} status maximzed dialog
       */
      maximizedToggle: true,
      /**
       * Get alert arching active
       * @type {Boolean} alert arching active
       */
      alertArching: false,
      /**
       * Get search billing
       * @type {Boolean} search billing
       */
      commonSearch: {
        rowsPerPage: 20,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      /**
       * Status dialog add entry and exit of money
       * @type {Boolean} status dialog
       */
      addEntryAndExitOfMoney: false,
      /**
       * Status add entry and exit of money
       * @type {Boolean} status dialog
       */
      loadingAddEntryAndExitOfMoney: false,
      /**
       * Config entry and exitOfMoney
       * @type {Array} config add dymanic
       */
      entryAndExitOfMoney,
      /**
       * Config buttons entry and exitOfMoney
       * @type {Array} buttons add dymanic
       */
      buttonsEntryAndExitOfMoney,
      /**
       * Close box
       * @type {Boolean} status dialog
       */
      closeBoxCut: false,
      /**
       * Loading add cut box
       * @type {Boolean} status form
       */
      loadingAdd: false,
      /**
       * Box config file
       * @type {Array} box config
       */
      boxCutConfig,
      /**
       * Config buttons
       * @type {Array} buttons add dymanic
       */
      buttonsBoxCut,
      /**
       * Status dialog add cut box
       * @type {Boolean} status form
       */
      addBoxCut: false,
      /**
       * User Session
       * @type {Number} id user session
       */
      session_id: this.$store.state.login.id,
      /**
       *
       */
      arching: SessionStorage.getItem('arching'),
      /**
       *
       */
      sucursalSelected: SessionStorage.getItem('sucursalSelected'),
      /**
       * Visible loading page
       * @type {Boolean} status loading page
       */
      visible: false,
      /**
       * Total sale
       * @type {Number} total sale
       */
      totalSale: 0,
      /**
       * Width init splitter
       * @type {Number} % width init
       */
      splitterModel: 70, // start at 50%
      /**
       * Model paid sale
       * @type {Object} model paid sale
       */
      paidSale: {
        debito: null,
        credito: null,
        efectivo: null,
        porcentaje: null,
        montoPorcentaje: null
      },
      /**
       * Columns Table
       * @type {Array} column array
       */
      columns: [
        {
          name: 'Opciones',
          headerClasses: 'bg-primary text-white',
          classes: 'bg-grey-2 ellipsis',
          align: 'left',
          label: 'Opciones',
          field: 'opciones'
        },
        {
          name: 'articulo',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Artículos',
          field: 'articulo',
          sortable: true
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          field: 'cantidad',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'precio',
          label: 'Precio',
          field: 'precio',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'descuento',
          label: 'Descuento',
          field: 'descuento',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'subtotal',
          label: 'Subtotal',
          field: 'subtotal',
          headerClasses: 'bg-primary text-white',
          sortable: true
        }
      ],
      /**
       * Billing Model
       * @type {Object} billing model
       */
      billing: {
        client: null,
        dateBilling: null,
        voucherType: null,
        operationType: null,
        box: {
          label: null,
          value: null
        }
      },
      /**
       * Client List
       * @type {Array} Client List
       */
      clients: [],
      /**
       * Product List
       * @type {Array} Product List
       */
      products: [],
      /**
       * Inventories product selected
       * @type {Number} stock product selected
       */
      stock: 0,
      /**
       * Amount product
       * @type {Number} amuntproduct
       */
      amount: 1,
      /**
       * Price product
       * @type {Number} price product
       */
      priceOfSale: null,
      /**
       * Data product billing
       * @type {Array} data billing
       */
      dataProduct: [],
      /**
       * Descount product
       * @type {Number} descount product
       */
      discount: 0,
      /**
       * Operation Type
       * @type {Array} Operation type
       */
      operationTypes: [],
      /**
       * Type of vouchers
       * @type {Array} type of vouchers
       */
      voucherTypes: [],
      /**
       * Coin list
       * @type {Array} Coin list
       */
      coins: [],
      coin: null,
      /**
       * Model details sales
       * @type {Array} model details sale
       */
      modelDetailsSale: [
        'cantidad',
        'descuento',
        'detallable_type',
        'detallable_id',
        'precio'
      ],
      /**
       * RelationalData description
       * @type {Object}
       */
      boxCutServices
    }
  },
  created () {
    this.loadCreate()
  },
  methods: {
    /**
     * Calculate percentage
     * @param {Number} percentage percentage credit
     */
    percentage (percentage) {
      this.paidSale.montoPorcentaje = (percentage * this.paidSale.credito) / 100
    },
    /**
     * Get Billing
     */
    getBillings () {
      this.visibleTableBilling = true
      this.dialogBillingVisible = true
      this.$apollo.query(
        {
          query: GET_BILLINGS,
          variables: {
            billing: {
              commonSearch: this.commonSearch,
              dataFilter: {
                user_created_id: this.session_id
              }
            }
          },
          fetchPolicy: 'no-cache'
        }
      )
        .then(({ data }) => {
          this.visibleTableBilling = false
          this.dataTableBilling = data.facturas
        })
        .catch((err) => {
          this.visibleTableBilling = false
          this.dataTableBilling = []
          this.notify(this, err.message, 'negative', 'warning')
        })
    },
    /**
     * Save entry and exit of money
     * @param {Object} data form entry and exit of money
     */
    saveEntryAndExitOfMoney (data) {
      this.loadingAddEntryAndExitOfMoney = true
      this.$apollo.mutate({
        mutation: ENTRY_AND_EXIT_OF_MONEY,
        variables: {
          entryAndExitOfMoney: {
            monto: Number(data.monto),
            descripcion: data.descripcion,
            payable_id: this.billing.box.value,
            payable_type: 'SisNacho\\CorteCaja',
            user_created_id: this.session_id,
            tipo_operacion: data.tipo_operacion.value
          }
        }
      })
        .then(({ data }) => {
          this.notify(this, 'entryAndExitOfMoney.entryAndExitOfMoneySuccess', 'positive', 'mood')
          this.loadingAddEntryAndExitOfMoney = false
        })
        .catch(() => {
          this.notify(this, 'template.error', 'negative', 'warning')
          this.loadingAddEntryAndExitOfMoney = false
        })
    },
    /**
     * Close form entry and exit of money
     */
    cancelEntryAndExitOfMoney () {
      this.addEntryAndExitOfMoney = false
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getOpeationTypes()
      this.getVoucherTypes()
      this.getClients()
      this.getCoins()
      // this.getCorteCaja(this.arching.id)
      // this.getCLients()
      // this.getProducts()
      // this.setRelationalData(this.boxCutServices, [], this)
    },
    /**
     * Close box
     */
    closeBox () {
      this.loadingCLose = true
      this.$apollo.mutate({
        mutation: CLOSE_BOX_CUT,
        variables: {
          id: this.billing.box.value
        }
      })
        .then(({ data }) => {
          this.getArchingActive(this.sucursalSelected)
          this.closeBoxCut = false
          this.loadingCLose = false
          this.notify(this, 'boxCut.boxCloseSuccess', 'positive', 'mood')
        })
        .catch(err => {
          this.notify(this, err.message, 'negative', 'warning')
          this.closeBoxCut = false
        })
    },
    /**
     * Open Box cut
     * @param {Object} data form box cut
     */
    saveBoxCut (data) {
      this.loadingAdd = true
      this.$apollo.mutate({
        mutation: OPEN_BOX_CUT,
        variables: {
          boxCut: {
            caja_id: data.caja_id ? data.caja_id.value : null,
            vendedor_id: this.session_id,
            monto: Number(data.monto) ?? 0,
            descripcion: data.descripcion ?? '',
            arqueo_id: this.arching.id
          }
        }
      }).then(({ data }) => {
        this.billing.box.label = data.abrirCorte.caja.nombre_caja
        this.billing.box.value = data.abrirCorte.id
        SessionStorage.set('box_cut_id', data.abrirCorte.id)
        this.addBoxCut = false
        this.loadingAdd = false
        this.notify(this, 'boxCut.boxOpenSuccess', 'positive', 'mood')
      })
        .catch(err => {
          this.notify(this, this.$t(`boxCut.${this.errorRequest(err.message)}`), 'negative', 'mood')
          this.loadingAdd = false
        })
    },
    /**
     * Cancel box cut
     * @param {Object} data form box cut
     */
    cancel (data) {
      this.$router.push({ name: 'products' })
    },
    /**
     * Get Corte caja
     */
    getCorteCaja (archingId) {
      this.visible = true
      this.$apollo.query(
        {
          query: GET_CORTE_CAJA_ACTIVE,
          variables: {
            boxCutFilter: {
              vendedor_id: this.session_id,
              arqueo_id: archingId
            }
          },
          fetchPolicy: 'no-cache'
        }
      )
        .then(({ data }) => {
          this.billing.box.label = data.verificarCorte.caja.nombre_caja
          this.billing.box.value = data.verificarCorte.id
          this.visible = false
        })
        .catch(() => {
          this.addBoxCut = true
          this.billing.box.label = null
          this.billing.box.value = null
          this.visible = false
        })
    },
    /**
     * Set Data in table
     * @param {Object} val value product
     */
    setTable (val) {
      if (this.validateArray(this.dataProduct, val)) {
        this.addAmountProduct(this.dataProduct, val)
      } else {
        this.pushArray(this.dataProduct, val)
      }
      this.totalCalculate()
    },
    /**
     * Set data in table product
     * @param {Array} array list porduct
     * @param {Object} val product
     */
    pushArray (array, val) {
      this.stock = val.tipo === 1 ? val.stock : 5000000
      const id = val.tipo === 1 ? val.detalleIngreso[0].id : val.id
      array.push({
        id: id,
        articulo: val.label,
        cantidad: this.amount,
        precio: this.priceOfSale ?? this.setPriceSale(val),
        descuento: this.discount,
        subtotal: this.amount * (this.priceOfSale ?? this.setPriceSale(val)),
        detallable_type: (val.tipo === 1) ? 'DetalleIngreso' : 'Articulo',
        detallable_id: id
      })
    },
    /**
     * Set factura price
     * @param {Object} product product seleted
     */
    setPriceSale (product) {
      if (Number(product.tipo) === 2) {
        return product.precio_venta
      }

      if (Number(product.tipo) === 1 && product.detalleIngreso.length > 0) {
        return product.detalleIngreso[0].precio_venta
      }
    },
    /**
     * Save sale
     */
    saveSale () {
      this.validateBeforeSubmit()
        .then(res => {
          if (res) {
            if (this.validateSaveBilling()) {
              this.visible = true
              this.$apollo.mutate({
                mutation: SAVE_BILLING,
                variables: {
                  billing: {
                    corte_caja_id: this.billing.box.value,
                    cliente_id: this.billing.client.value,
                    user_created_id: this.session_id,
                    tipo_operacion: this.billing.operationType.value,
                    tipo_comprobante: this.billing.voucherType,
                    created_at: this.billing.dateBilling,
                    detalleFactura: this.setModelDetailsSale(this.dataProduct),
                    pagoFactura: {
                      debito: this.paidSale.debito,
                      credito: this.paidSale.credito,
                      efectivo: this.paidSale.efectivo
                    }
                  }
                }
              }).then(({ data }) => {
                this.emptyInputBilling()
                this.loadCreate()
                this.visible = false
                this.notify(this, 'billing.saveSuccess', 'positive', 'mood')
              })
                .catch(err => {
                  this.visible = false
                  this.notify(this, err.message, 'negative', 'mood')
                })
            }
          }
        })
    },
    /**
     * Validate details billing before save
     */
    validateSaveBilling () {
      const totalPaid = Number(this.paidSale.debito) + Number(this.paidSale.credito) + Number(this.paidSale.efectivo)

      if (this.dataProduct.length <= 0) {
        this.notify(this, 'billing.errorInDataProduct', 'negative', 'warning')
        return false
      }

      if (totalPaid < this.totalSale && this.billing.operationType.value === 'venta') {
        this.notify(this, 'billing.errorTotal', 'negative', 'warning')
        return false
      }

      return true
    },
    /**
     * Reset inputs billing
     */
    emptyInputBilling () {
      this.dataProduct = []
      this.billing.client = null
      this.billing.dateBilling = null
      this.billing.operationType = {
        label: 'Venta',
        value: 'venta'
      }
      this.stock = null
      this.amount = 1
      this.priceOfSale = null
      this.totalSale = 0
      this.paidSale = {
        debito: null,
        credito: null,
        efectivo: null
      }
      this.$refs.codigo.focus()
      setTimeout(() => {
        this.$validator.reset()
      }, 100)
    },
    /**
     * Print product error
     * @param {Number} code product code
     */
    errorSearch (code) {
      this.$q.notify({
        message: `(${code}) - ${this.ucwords(this.$t('template.errorSearchProduct'))}`,
        color: 'negative',
        position: 'top',
        icon: 'warning'
      })
    },
    /**
     * Set model detalis sale
     * @param {Array} dataDetailsSale sale details
     */
    setModelDetailsSale (dataDetailsSale) {
      return dataDetailsSale.map(data => {
        const newModel = {}
        this.modelDetailsSale.forEach(model => {
          if (data[model]) {
            newModel[model] = data[model]
          }
        })
        return newModel
      })
    },
    /**
     * Format number less than ten
     * @param {Number} number number format
     * @return {Number} number formated
     */
    formatOnCero (number) {
      if (number < 10) {
        return `0${number}`
      }
      return number
    },
    /**
     * Validations the errors
     * @param  {String} propTag data fromulary
     * @return {String} errors
     */
    errorValidation (propTag) {
      if (this.errors.has(propTag)) {
        return this.errors.first(propTag)
      }
    },
    /**
     * Verify formulary error
     * * @return {String} errors
     */
    validateBeforeSubmit () {
      return this.$validator.validateAll()
        .then((result) => {
          return result
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * Validate array in product table
     * @param {Array} data the product table
     * @param {Object} index product table index
     */
    validateArray (data, index) {
      const validDate = data.filter((product) => product.id === index.id)
      return (validDate.length === 0) ? null : true
    },
    /**
     * Add product price in table
     * @param {Array} product table
     * @param {Object} index product table index
     */
    addAmountProduct (product, index) {
      product.map(product => {
        if (product.id === index.id) {
          product.cantidad = Number(product.cantidad) + Number(this.amount) ?? Number(product.cantidad)
          this.recalculate(product)
          return product
        }
      })
    },
    /**
     * All CLient
     */
    getClients () {
      this.$services.getData(['clients'])
        .then(({ res }) => {
          this.clients = res.data
        })
    },
    /**
     * All Products
     */
    getProducts () {
      this.$apollo.query(
        {
          query: ALL_PRODUCT,
          variables: {
            empresa_id: 1
          },
          fetchPolicy: 'no-cache'
        }
      )
        .then(({ data }) => {
          this.products = data.articulos.map(product => {
            product.label = product.articulo
            product.value = product.id
            return product
          })
        })
    },
    /**
     * Get operation types
     */
    getOpeationTypes () {
      this.$services.getData(['operation-types'])
        .then(({ res }) => {
          this.operationTypes = res.data
        })
    },
    /**
     * Get coins
     */
    getCoins () {
      this.$services.getData(['coins'])
        .then(({ res }) => {
          this.coins = res.data
        })
    },
    /**
     * Get voucher types
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'])
        .then(({ res }) => {
          this.voucherTypes = res.data
        })
    },
    /**
     * Delete product
     * @param {Object} data data product
     */
    deleteProduct (data) {
      this.dataProduct.map((product, index) => {
        if (product.id === data.id) {
          this.dataProduct.splice(index, 1)
        }
      })
    },
    /**
     * Recalcute table subtotal
     */
    recalculate (data) {
      this.dataProduct.map(product => {
        if (product.id === data.id) {
          product.subtotal = (data.cantidad * data.precio) - data.descuento
          return product
        }
      })
      this.totalCalculate()
    },
    /**
     * Calculate billing total
     */
    totalCalculate () {
      let total = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.subtotal)
      })
      this.totalSale = total
    }
  }
}
</script>
