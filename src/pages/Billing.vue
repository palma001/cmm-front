<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="q-pb-sm row q-col-gutter-sm">
        <div class="col-8">
          <div class="row justify-between">
            <div class="col-auto">
              <p class="text-h5">
                {{ ucwords($t('billing.newBilling')) }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-2">
          <q-input type="date" dense outlined label="Fec. Emisión" v-model="billing.created_at"/>
        </div>
        <div class="col-2">
          <q-input type="date" dense outlined label="Fec. Vencimiento" v-model="billing.expiration_date"/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-pb-none">
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              autocomplete="off"
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
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
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-input
              v-model="billing.exchange"
              outlined
              dense
              disable
              label="Cambio del dia"
              type="text"
            >
            </q-input>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Tipo de cambio del día, extraído de SUNAT
            </q-tooltip>
          </div>
        </div>
      </q-card-section>
      <q-card-section :class="$q.screen.lt.md ? 'q-py-none q-mt-md' : 'q-py-none'">
        <div class="row q-col-gutter-md">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
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
              v-model="billing.client"
              option-label="full_name"
              option-value="id"
              v-validate="'required'" data-vv-as="field"
              @filter="filterClients"
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
          <div class="col-auto q-gutter-sm">
            <q-btn
              icon="add"
              color="primary"
              label="producto"
              style="height: 40px;"
              @click="modalProduct = true"
            />
            <q-btn
              icon="add"
              color="orange"
              label="guias"
              style="height: 40px;"
              @click="openOptionDialog('guides')"
            />
            <q-btn
              icon="money"
              color="positive"
              label="pagos"
              style="height: 40px;"
              v-if="payments.length"
              @click="openOptionDialog('payments')"
            >
              <q-badge color="negative" floating>
                S/ {{ totalPaid }}
              </q-badge>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="row justify-between q-col-gutter-sm">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-lg-9">
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
        <div class="col-xs-12 col-sm-12 col-lg-3">
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
            <q-item>
              <q-item-section class="q-mt-sm">
                <q-select
                  label="Condición de pagos"
                  outlined
                  :options="paymentsCondition"
                  v-model="paymentCondition"
                  dense
                  @input="openOptionDialog('payments')"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn color="negative" label="Cancelar facturación" @click="cancelBill"/>
        <q-btn color="primary" label="Generar factura" @click="modelBill"/>
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
        <q-card-section class="row justify-between q-col-gutter-sm">
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
              label="Productos"
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
          <q-tab name="payments" label="Pagos" />
          <q-tab name="guides" label="Guias" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="payments">
            <q-card-section class="q-py-none row">
              <div class="text-h6 col-5">Agregar Pagos</div>
            </q-card-section>
            <q-card-section class="row justify-between q-col-gutter-x-sm q-py-xs q-mt-sm" v-for="(payment, index) in payments" :key="payment.id">
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
                  @filter="filterPaymentMethods"
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
                  @filter="filterPaymentDestinations"
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
            <q-card-section>
              <q-form @submit="addPayment" class="row justify-between q-col-gutter-sm" ref="addPayment">
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
                    @filter="filterPaymentMethods"
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
                    @filter="filterPaymentDestinations"
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
                  <q-btn icon="add" dense round color="primary" type="submit"/>
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
          <q-tab-panel name="guides">
            <q-card-section class="q-py-none row">
              <div class="text-h6 col-5">Agregar Guias</div>
            </q-card-section>
             <q-card-section class="row justify-between q-col-gutter-x-sm q-py-xs q-mt-sm" v-for="(selectedGuide, index) in selectedGuides" :key="selectedGuide.id">
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
                  name="guide"
                  ref="guideRef"
                  v-model="selectedGuide.guide"
                  data-vv-as="field"
                  option-value="id"
                  option-label="name"
                  label="Guia"
                  :options="guides"
                  @filter="filterGuides"
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
                <q-input label="Descripción" outlined dense v-model="selectedGuide.description"/>
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <q-input label="Observación" outlined dense v-model="selectedGuide.observation" @input="totalPayemnts"/>
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <q-input label="Orden de compra" outlined dense v-model="selectedGuide.pucharse_order" @input="totalPayemnts"/>
              </div>
              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 text-center">
                <q-btn icon="close" dense round color="negative"  @click="deleteSelectedGuide(index)"/>
              </div>
            </q-card-section>
            <q-card-section class="row justify-between q-col-gutter-sm">
              <q-form class="row justify-between q-col-gutter-sm">
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
                    name="guide"
                    ref="guideRef"
                    v-model="guide"
                    data-vv-as="field"
                    option-value="id"
                    option-label="name"
                    label="Guia"
                    :options="guides"
                    @filter="filterGuides"
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
                  <q-input label="Descripción" outlined dense v-model="description"/>
                </div>
                <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <q-input label="Observación" outlined dense v-model="observation" @input="totalPayemnts"/>
                </div>
                <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <q-input label="Orden de compra" outlined dense v-model="purchase_order" @input="totalPayemnts"/>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right q-mt-xs">
                  <q-btn icon="add" dense round color="primary"/>
                </div>
              </q-form>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Generar Factura" color="primary" @click="modelBill"/>
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
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'Billing',
  mixins: [mixins.containerMixin],
  components: {
    // DynamicForm
    // DataTable
  },
  data () {
    return {
      guide: null,
      description: null,
      purchase_order: null,
      observation: null,
      selectedGuides: [],
      guides: [],
      tab: 'payments',
      igvs: [{
        label: 'Gravado - Operación Onerosa',
        value: 12
      }],
      igv: {
        label: 'Gravado - Operación Onerosa',
        value: 12
      },
      paymentsCondition: ['Crédito', 'Contado'],
      paymentCondition: null,
      modalProduct: false,
      loadingCLose: false,
      product: null,
      modalPaid: false,
      paymentMethod: null,
      paymentMethods: [],
      paymentDestination: null,
      paymentDestinations: [],
      payments: [],
      paymentAmount: 0,
      paymentReference: null,
      totalPaid: 0,
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
       * Billing Model
       * @type {Object} billing model
       */
      billing: {
        client: null,
        dateBilling: null,
        voucherType: null,
        operationType: null,
        exchange: 300,
        expiration_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
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
       * Data product billing
       * @type {Array} data billing
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
    /**
     * Model bill
     */
    modelBill () {
      const billModel = {
        serie_id: 1,
        client_id: this.billing.client.id,
        voucher_type_id: this.billing.voucherType.id,
        branch_office_id: this.branchOfficeSession.id,
        operation_type_id: this.billing.operationType.id,
        seller_id: this.userSession.id,
        coin_id: this.coin.id,
        exchange: this.billing.exchange,
        igv: 12,
        expiration_date: date.formatDate(this.billing.expiration_date, 'YYYY-MM-DD'),
        bill_electronic_details: this.dataProduct,
        bill_electronic_payments: this.modelPayments(this.payments),
        bill_electronic_guides: [],
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.billing.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.saveBill(billModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    saveBill (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['bill-electronics'], data)
        .then(res => {
          this.notify(this, 'billing.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'billing.error', 'negative', 'warning')
          this.visible = false
        })
    },
    cancelBill () {
      this.dataProduct = []
      this.payments = []
      this.billing.client = null
      this.billing.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.billing.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
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
          exchange: this.billing.exchange,
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Open dialog operation
     * @param {String} data name tab
     */
    openOptionDialog (data) {
      this.tab = data
      this.modalPaid = true
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
     * Add payment to bill electronic
     */
    addPayment () {
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
      setTimeout(() => {
        this.$refs.addPayment.resetValidation()
      }, 100)
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
          if (res.data.length) {
            this.billing.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
          }
        })
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getOpeationTypes()
      this.getVoucherTypes()
      this.getCoins()
      this.getClients()
      this.getExchange()
      this.getProducts()
      this.getPaymentMethods()
      this.getPaymentDestinations()
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
     * Filter clients
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterClients (value, update) {
      update(() => {
        this.getClients(value)
      })
    },
    /**
     * All CLient
     */
    getClients (value) {
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
          this.clients = res.data.data
        })
    },
    /**
     * Filter Products
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterProducts (value, update) {
      update(() => {
        this.getProducts(value)
      })
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getProducts (value) {
      this.$services.getData(['products'], {
        dataSearch: {
          name: value,
          code: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.products = res.data
        })
    },
    /**
     * Filter Products
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterGuides (value, update) {
      update(() => {
        this.getGuides(value)
      })
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getGuides (value) {
      this.$services.getData(['guides'], {
        dataSearch: {
          name: value,
          code: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.products = res.data
        })
    },
    /**
     * Filter psyment method
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterPaymentMethods (value, update) {
      update(() => {
        this.getPaymentMethods(value)
      })
    },
    /**
     * Get payment method
     * @param {String} value data filter
     */
    getPaymentMethods (value) {
      this.$services.getData(['payment-methods'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.paymentMethods = res.data.data
        })
    },
    /**
     * Filter payment destination
     * @param {String} value data filter
     * @param {Callback} update update select data
     */
    filterPaymentDestinations (value, update) {
      update(() => {
        this.getPaymentDestinations(value)
      })
    },
    /**
     * Get payment destination
     * @param {String} value data filter
     */
    getPaymentDestinations (value) {
      this.$services.getData(['payment-destinations'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          this.paymentDestinations = res.data.data
        })
    },
    /**
     * Get operation types
     */
    getOpeationTypes () {
      this.$services.getData(['operation-types'])
        .then(({ res }) => {
          this.operationTypes = res.data
          this.billing.operationType = res.data[0]
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
     * Get voucher types
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'])
        .then(({ res }) => {
          this.voucherTypes = res.data
          this.billing.voucherType = res.data[0]
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
     * Calculate billing total
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
     * Calculate billing total
     */
    totalPayemnts () {
      if (this.payments.length > 0) {
        let total = 0
        this.payments.forEach(element => {
          total = Number(total) + Number(element.paymentAmount)
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
