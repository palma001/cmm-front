<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="q-pb-sm row q-col-gutter-sm">
        <div class="col-9">
          <div class="row justify-between">
            <div class="col-auto">
              <p class="text-h5">
                {{ ucwords($t('quotation.newQuotation')) }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-3">
          <q-input type="date" dense outlined label="Fec. Emisión" v-model="quotation.created_at"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row q-col-gutter-sm q-pb-none">
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <q-select
            autocomplete="off"
            use-input
            hide-selected
            fill-input
            dense
            outlined
            clearable
            input-debounce="20"
            name="client"
            v-model="quotation.client"
            option-label="full_name"
            option-value="id"
            v-validate="'required'" data-vv-as="field"
            @filter="getClients"
            :error-message="errorValidation('client')"
            :error="errors.has('client')"
            :label="ucwords($t('quotation.client'))"
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
        <div class="col-3">
          <q-input
            type="text"
            dense
            outlined
            label="Tiempo de entrega"
            v-model="quotation.delivery_time"
          />
        </div>
        <div class="col-3">
          <q-input
            type="text"
            dense
            outlined
            label="Tiempo de validación"
            v-model="quotation.validity_time"
          />
        </div>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <q-select
            use-input
            hide-selected
            fill-input
            outlined
            clearable
            dense
            autocomplete="off"
            input-debounce="0"
            name="paymentMethodQ"
            ref="paymentMethodQRef"
            v-model="paymentMethodQ"
            data-vv-as="field"
            option-value="id"
            option-label="name"
            label="Método de pago"
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
      </q-card-section>
      <q-card-section class="row q-col-gutter-sm q-pt-none">
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <q-select
            outlined
            v-model="coin"
            dense
            option-label="name"
            option-value="id"
            :label="ucwords($t('quotation.coin'))"
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
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <q-input
            v-model="quotation.exchange"
            outlined
            dense
            readonly
            label="Cambio del dia"
            type="text"
          >
          </q-input>
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            Tipo de cambio del día, extraído de SUNAT
          </q-tooltip>
        </div>
        <div class="col-5 q-gutter-sm">
          <q-btn
            icon="add"
            color="primary"
            label="producto"
            style="height: 40px;"
            @click="modalProduct = true"
          />
          <q-btn
            icon="money"
            color="positive"
            label="pagos"
            style="height: 40px;"
            :disable="dataProduct.length <= 0"
            @click="openOptionDialog"
          >
            <q-badge color="negative" floating>
              S/ {{ totalPaid }}
            </q-badge>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row q-col-gutter-sm">
        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-select
            use-input
            hide-selected
            fill-input
            outlined
            clearable
            dense
            autocomplete="off"
            input-debounce="0"
            name="seller"
            ref="sellerRef"
            v-model="seller"
            data-vv-as="field"
            option-value="id"
            option-label="full_name"
            label="Vendedor"
            :options="sellers"
            @filter="getSellers"
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
        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <q-input
            type="textarea"
            outlined
            label="Dirección de envio"
            v-model="quotation.shipping_address"
            rows="1"
            dense
          />
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row justify-between q-col-gutter-sm">
        <div class="q-pa-xs col-xs-12 col-md-9 col-sm-12 col-lg-9">
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
                <q-td key="description" :props="props">
                  {{ props.row.description }}
                </q-td>
                <q-td key="amount" :props="props">
                  {{ props.row.amount }}
                  <q-popup-edit v-model.number="props.row.amount">
                    <q-input type="number" v-model.number="props.row.amount" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="purchase_price" :props="props">
                  {{ props.row.purchase_price }}
                </q-td>
                <q-td key="igv" :props="props">
                  {{ props.row.igv }}
                </q-td>
                <q-td key="price" :props="props">
                  {{ props.row.price }}
                  <q-popup-edit v-model.number="props.row.price">
                    <q-input type="number" v-model.number="props.row.price" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="discount" :props="props">
                  {{ props.row.discount }}
                  <q-popup-edit v-model.number="props.row.discount">
                    <q-input type="number" v-model.number="props.row.discount" dense autofocus @input="recalculate(props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="subtotal" :props="props">
                  {{ props.row.subtotal }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <q-list separator dense>
            <q-item clickable v-ripple>
              <q-item-section>OP.GRAVADA:</q-item-section>
              <q-item-section side>S/ {{ totalUnitValue }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>IGV:</q-item-section>
              <q-item-section side>S/ {{ igvTotal }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple active>
              <q-item-section>TOTAL A PAGAR:</q-item-section>
              <q-item-section side>S/ {{ totalSale }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn color="negative" label="Cancelar cotización" @click="cancelQuotation"/>
        <q-btn color="primary" label="Generar cotización" @click="modelQuotation" :disable="dataProduct.length <= 0"/>
      </q-card-actions>
    </q-card>
    <q-dialog
      v-model="modalProduct"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Agregar Producto o Servicio</div>
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-x-sm">
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="product"
              ref="productRef"
              v-model="product"
              data-vv-as="field"
              option-value="id"
              option-label="full_name"
              :label="value ? 'C-P-D' : 'Productos'"
              :options="products"
              @input="selectProuct"
              @filter="filterProducts"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:append>
                <q-toggle
                  v-model="value"
                  color="primary"
                  dense
                >
                  <q-tooltip>
                    Activar filtro por CPD
                  </q-tooltip>
                </q-toggle>
              </template>
            </q-select>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
              input-debounce="0"
              name="igv"
              ref="igvRef"
              v-model="igv"
              v-validate="'required'"
              data-vv-as="field"
              label="Afectación igv"
              :options="igvs"
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
        </q-card-section>
        <q-card-section class="row justify-between q-col-gutter-sm">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Cantidad"
              type="number"
              dense
              outlined
              v-model="amount"
              @input="totalCalculateProduct"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Precio Unitario"
              type="number"
              dense
              outlined
              v-model="stock.sale_price"
              @input="totalCalculateProduct"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <q-input
              label="Total"
              type="number"
              dense
              disable
              outlined
              :value="totalProduct"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Agregar" color="primary" @click="setTable" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="modalPaid"
      persistent
    >
      <q-card style="width: 900px; max-width: 80vw;">
        <q-tabs
          v-model="tab"
          dense
          class="bg-primary text-white shadow-2"
          align="left"
          narrow-indicator
        >
          <q-tab name="payments" label="Pagos"/>
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="payments">
            <q-card-section class="q-py-none row">
              <div class="text-h6 col-5">
                Agregar Pagos
              </div>
            </q-card-section>
            <q-card-section
              class="row justify-between q-col-gutter-x-sm q-py-xs q-mt-sm"
              v-for="(payment, index) in payments"
              :key="payment.id"
            >
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <q-select
                  use-input
                  hide-selected
                  fill-input
                  outlined
                  clearable
                  dense
                  autocomplete="off"
                  input-debounce="0"
                  name="paymentMethod"
                  ref="paymentMethodRef"
                  v-model="payment.paymentMethod"
                  data-vv-as="field"
                  option-value="id"
                  option-label="name"
                  label="Método de pago"
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
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                <q-select
                  use-input
                  hide-selected
                  fill-input
                  outlined
                  clearable
                  dense
                  autocomplete="off"
                  input-debounce="0"
                  name="paymentDestination"
                  ref="paymentDestinationRef"
                  v-model="payment.paymentDestination"
                  data-vv-as="field"
                  option-value="id"
                  option-label="name"
                  label="Destino"
                  :options="paymentDestinations"
                  @filter="getPaymentDestinations"
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
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <q-input label="Referencia" outlined dense v-model="payment.paymentReference"/>
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <q-input label="Monto" outlined dense v-model="payment.paymentAmount" @input="totalPayemnts"/>
              </div>
              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 text-center">
                <q-btn icon="close" dense round color="negative"  @click="deletePayment(index)"/>
              </div>
            </q-card-section>
            <q-card-section v-if="(totalSale - totalPaid) > 0">
              <q-form
                @submit="addPayment"
                class="row justify-between q-col-gutter-sm"
                ref="addPayment"
              >
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <q-select
                    use-input
                    hide-selected
                    fill-input
                    outlined
                    clearable
                    dense
                    autocomplete="off"
                    input-debounce="0"
                    name="paymentMethod"
                    ref="paymentMethodRef"
                    v-model="paymentMethod"
                    data-vv-as="field"
                    option-value="id"
                    option-label="name"
                    label="Método de pago"
                    :rules="[val => val || 'El campo metodo de pago es requerido']"
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
                <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <q-select
                    use-input
                    hide-selected
                    fill-input
                    outlined
                    clearable
                    dense
                    autocomplete="off"
                    input-debounce="0"
                    name="paymentDestination"
                    ref="paymentDestinationRef"
                    v-model="paymentDestination"
                    data-vv-as="field"
                    option-value="id"
                    option-label="name"
                    label="Destino"
                    :rules="[val => val || 'El campo destino es requerido']"
                    :options="paymentDestinations"
                    @filter="getPaymentDestinations"
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
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                  <q-input
                    label="Referencia"
                    outlined
                    dense
                    v-model="paymentReference"
                  />
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                  <q-input
                    label="Monto"
                    outlined
                    dense
                    :rules="[
                      val => val !== null && val !== '' && val !== 0 || 'El campo monto de pago es requerido',
                      val => val <= (totalSale - totalPaid) || 'El monto no puede superar el total a pagar'
                    ]"
                    v-model="paymentAmount"
                    @input="totalPayemnts"
                  />
                </div>
                <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 text-center">
                  <q-btn
                    icon="add"
                    dense
                    round
                    color="primary"
                    type="submit"
                  />
                </div>
              </q-form>
            </q-card-section>
            <q-card-section>
              <q-list separator dense>
                <q-item clickable v-ripple active>
                  <q-item-section>TOTAL A PAGAR:</q-item-section>
                  <q-item-section side>S/ {{ totalSale }}</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>TOTAL PAGADO</q-item-section>
                  <q-item-section side>S/ {{ totalPaid }}</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>PENDIENTE</q-item-section>
                  <q-item-section side>S/ {{ totalSale - totalPaid }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Generar cotización" color="primary" @click="modelQuotation"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  name: 'quotation',
  mixins: [mixins.containerMixin],
  data () {
    return {
      sellers: [],
      seller: null,
      value: false,
      guide: null,
      description: null,
      purchase_order: null,
      observation: null,
      selectedGuides: [],
      guides: [],
      tab: 'payments',
      igvs: [{ label: 'Gravado - Operación Onerosa', value: 12 }],
      igv: { label: 'Gravado - Operación Onerosa', value: 12 },
      paymentsCondition: ['Crédito', 'Contado'],
      paymentCondition: null,
      modalProduct: false,
      loadingCLose: false,
      product: null,
      modalPaid: false,
      paymentMethod: null,
      paymentMethodQ: null,
      paymentMethods: [],
      paymentDestination: null,
      paymentDestinations: [],
      payments: [],
      paymentAmount: 0,
      paymentReference: null,
      totalPaid: 0,
      fees: [],
      dateFees: date.formatDate(new Date(), 'YYYY-MM-DD'),
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
      igvTotal: 0,
      totalUnitValue: 0,
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
          name: 'description',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Descripción',
          field: 'description',
          sortable: true
        },
        {
          name: 'amount',
          label: 'Cantidad',
          field: 'amount',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'purchase_price',
          label: 'Valor Unitario',
          field: 'purchase_price',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'igv',
          label: 'Igv',
          field: 'igv',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'price',
          label: 'Precio Unitario',
          field: 'price',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'discount',
          label: 'Descuento',
          field: 'discount',
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
       * quotation Model
       * @type {Object} quotation model
       */
      quotation: {
        client: null,
        datequotation: null,
        voucherType: null,
        operationType: null,
        exchange: 0,
        delivery_time: null,
        validity_time: null,
        shipping_address: null,
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
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
       * Amount product
       * @type {Number} amuntproduct
       */
      amount: 1,
      /**
       * Data product quotation
       * @type {Array} data quotation
       */
      dataProduct: [],
      /**
       * discount product
       * @type {Number} discount product
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
      /**
       * Coin change
       * @type {Object} coin value
       */
      coin: null,
      /**
       * Inventories product selected
       * @type {Object} stock product selected
       */
      stock: {},
      totalProduct: 0,
      userSession: null,
      branchOfficeSession: null
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.loadCreate()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
    getSellers (value, update) {
      this.$services.getData(['sellers'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.sellers = res.data.data
          })
        })
    },
    /**
     * Filter primary
     */
    filterPrimary (value, update) {
      const valeArray = value.split('-')
      const param = {
        filterProduct: {
          code: valeArray[1],
          'brand.name': valeArray[0],
          supsec: valeArray[2]
        }
      }
      this.getProducts(param, update)
    },
    /**
     * Model bill
     */
    modelQuotation () {
      const quotationModel = {
        client_id: this.quotation.client.id,
        payment_method_id: this.paymentMethodQ.id,
        seller_id: this.seller.id,
        coin_id: this.coin.id,
        exchange_rate: this.quotation.exchange,
        validity_time: this.quotation.validity_time,
        delivery_time: this.quotation.delivery_time,
        quotation_details: this.dataProduct,
        quotation_payments: this.modelPayments(this.payments),
        shipping_address: this.quotation.shipping_address,
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.quotation.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveQuotationModel(quotationModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveQuotationModel (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['quotations'], data)
        .then(res => {
          this.notify(this, 'quotation.saveSuccess', 'positive', 'mood')
          this.cancelQuotation()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'quotation.error', 'negative', 'warning')
          this.visible = false
        })
    },
    /**
     * Clean bill data
     */
    cancelQuotation () {
      this.dataProduct = []
      this.payments = []
      this.quotation.client = null
      this.quotation = {}
      this.quotation.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
      this.totalPaid = 0
      this.totalUnitValue = 0
      this.totalProduct = 0
      this.igvTotal = 0
      this.product = null
      this.amount = 1
      this.stock = {}
      this.modalProduct = false
      this.modalPaid = false
      this.paymentCondition = null
    },
    /**
     * Model paymnets
     * @param {Array} data data model
     * @return {Array} model
     */
    modelPayments (data) {
      return data.map(payment => {
        return {
          payment_method_id: payment.paymentMethod.id,
          payment_destination_id: payment.paymentDestination.id,
          reference: payment.paymentReference,
          amount: payment.paymentAmount,
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Open dialog operation
     * @param {String} data name tab
     */
    openOptionDialog () {
      this.modalPaid = true
      this.paymentAmount = this.totalSale - this.totalPaid
    },
    /**
     * Delete payment
     * @param {Number} index indiex payment
     */
    deleteSelectedGuide (index) {
      this.guides.splice(index, 1)
    },
    /**
     * Delete payment
     * @param {Number} index indiex payment
     */
    deletePayment (index) {
      this.payments.splice(index, 1)
      this.totalPayemnts()
      this.paymentAmount = this.totalSale - this.totalPaid
    },
    /**
     * Reset validation
     * @param {Object} ref ref DOM
     */
    resetValidations (ref) {
      setTimeout(() => {
        if (this.paymentAmount) {
          ref.resetValidation()
        }
      }, 100)
    },
    /**
     * Add payment to bill electronic
     */
    addPayment () {
      this.fees = []
      this.payments.push({
        paymentAmount: this.paymentAmount,
        paymentReference: this.paymentReference,
        paymentDestination: this.paymentDestination,
        paymentMethod: this.paymentMethod
      })
      this.totalPayemnts()
      this.paymentAmount = this.totalSale - this.totalPaid
      this.paymentReference = null
      this.paymentDestination = null
      this.paymentMethod = null
      this.resetValidations(this.$refs.addPayment)
    },
    /**
     * Calculate subtotal products
     */
    totalCalculateProduct () {
      this.totalProduct = this.stock.sale_price * this.amount
    },
    /**
     * Selected product
     * @param {Object} value product selected
    */
    selectProuct (value) {
      if (value.stock.length > 0) {
        this.stock = value.stock[0]
        this.totalProduct = this.stock.sale_price * this.amount
      } else {
        this.stock = {}
        this.amount = 1
        this.totalProduct = 0
      }
    },
    /**
     * Get Data in exchange
     */
    getExchange () {
      this.$services.getData(['exchange-rate'], {
        start_date: date.formatDate(date.subtractFromDate(new Date(), { month: 1 }), 'DD/MM/YYYY'),
        final_date: date.formatDate(new Date(), 'DD/MM/YYYY'),
        coin: 'PEN'
      })
        .then(({ res }) => {
          if (res.data.exchange_rates && res.data.exchange_rates.length > 0) {
            this.quotation.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
          }
        })
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getCoins()
      this.getExchange()
    },
    /**
     * Set Data in table
     * @param {Object} val value product
     */
    setTable () {
      if (this.validateArray(this.dataProduct, this.product)) {
        this.addAmountProduct(this.dataProduct, this.product)
      } else {
        this.pushArray(this.dataProduct, this.product)
      }
      this.totalCalculate()
    },
    /**
     * Set data in table product
     * @param {Array} array list porduct
     */
    pushArray (array) {
      const percentage = this.getPercentage(this.stock.purchase_price, this.igv.value)
      const unitValue = this.stock.sale_price - percentage
      array.push({
        product_id: this.product.id,
        description: this.product.full_name,
        amount: this.amount,
        purchase_price: isNaN(unitValue) ? 0 : unitValue,
        igv: isNaN(percentage) ? 0 : percentage,
        price: this.stock.sale_price,
        discount: this.discount,
        subtotal: this.totalProduct,
        user_created_id: this.userSession.id
      })
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
      return data.find((product) => product.product_id === index.id)
    },
    /**
     * Add product price in table
     * @param {Array} product table
     * @param {Object} index product table index
     */
    addAmountProduct (product, index) {
      product.map(product => {
        if (product.product_id === index.id) {
          product.amount = Number(product.amount) + Number(this.amount) ?? Number(product.amount)
          this.recalculate(product)
          return product
        }
      })
    },
    /**
     * All CLient
     */
    getClients (value, update) {
      this.$services.getData(['clients'], {
        dataSearch: {
          document_number: value,
          name: value,
          last_name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.clients = res.data.data
          })
        })
    },
    /**
     * Filter Products
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterProducts (value, update) {
      if (this.value) {
        this.filterPrimary(value, update)
      } else {
        const param = {
          dataSearch: {
            description: value,
            code: value
          }
        }
        this.getProducts(param, update)
      }
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getProducts (value, update) {
      this.$services.getData(['products'], {
        ...value,
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.products = res.data.data
          })
        })
    },
    /**
     * Get payment method
     * @param {String} value data filter
     */
    getPaymentMethods (value, update) {
      this.$services.getData(['payment-methods'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.paymentMethods = res.data.data
          })
        })
    },
    /**
     * Get payment destination
     * @param {String} value data filter
     */
    getPaymentDestinations (value, update) {
      this.$services.getData(['payment-destinations'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.paymentDestinations = res.data.data
          })
        })
    },
    /**
     * Get coins
     */
    getCoins () {
      this.$services.getData(['coins'], {
        sortField: 'id',
        sortOrder: 'desc'
      })
        .then(({ res }) => {
          this.coins = res.data
          this.coin = res.data[0]
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
      this.totalCalculate()
    },
    /**
     * Recalcute table subtotal
     */
    recalculate (data) {
      this.dataProduct.map(product => {
        if (product.product_id === data.product_id) {
          product.subtotal = (data.amount * data.price) - data.discount
          return product
        }
      })
      this.totalCalculate()
    },
    /**
     * Calculate quotation total
     */
    totalCalculate () {
      let total = 0
      let igvTotal = 0
      let unitValue = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.subtotal)
        igvTotal = (Number(igvTotal) + (Number(element.igv) * Number(element.amount)))
        unitValue = (Number(unitValue) + (Number(element.purchase_price) * Number(element.amount)))
      })
      this.igvTotal = igvTotal.toFixed(2)
      this.totalSale = total
      this.totalUnitValue = unitValue.toFixed(2)
    },
    /**
     * Calculate quotation total
     */
    totalPayemnts () {
      const data = this.paymentCondition === 'Contado' ? this.payments : this.fees
      if (data.length > 0) {
        let total = 0
        data.forEach(element => {
          const amount = this.paymentCondition === 'Contado' ? element.paymentAmount : element.amount
          total = Number(total) + Number(amount)
        })
        this.totalPaid = total
      } else {
        this.totalPaid = 0
      }
    },
    /**
     * Get percentage
     * @param {Number} price price products
     * @param {Number} percentage percentage calculate
     * @returns {Number} percentage calculated
     */
    getPercentage (price, percentage) {
      return ((percentage / 100) * price).toFixed(2)
    }
  }
}
</script>
