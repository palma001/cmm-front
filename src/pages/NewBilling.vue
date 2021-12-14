<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="modelBill">
      <q-card class="my-card">
        <q-card-section class="q-pb-sm row q-col-gutter-sm">
          <div class="col-4">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ ucwords($t('billing.newBilling')) }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-3">
            <q-input
              type="date"
              dense
              outlined
              label="Fec. Emisión"
              v-model="billing.created_at"
              @input="getExchange"
            />
          </div>
          <div class="col-3">
            <q-input
              type="date"
              dense outlined
              label="Fec. Vencimiento"
              v-model="billing.expiration_date"
              :rules="[val => val >= this.billing.created_at || 'La fecha de expiración debe ser mayor o igual a la fecha de emisión']"
            />
          </div>
          <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <q-input
              v-model="billing.exchange"
              outlined
              dense
              readonly
              label="Cambio del dia"
              type="text"
            />
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Tipo de cambio del día, extraído de SUNAT
            </q-tooltip>
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
                :label="ucwords($t('billing.operation_type'))"
                :options="operationTypes"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
                :label="ucwords($t('billing.voucher_type'))"
                :options="voucherTypes"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                @filter="filterVoucherType"
                @input="getSeries"
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
                name="serie"
                autocomplete="off"
                ref="serieRef"
                v-model="billing.serie"
                v-validate="'required'"
                data-vv-as="field"
                option-value="id"
                option-label="name"
                :label="ucwords($t('billing.series'))"
                :options="series"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
                :rules="[val => val && val !== null || 'Este campo es requerido']"
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
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :label="ucwords($t('billing.client'))"
                :options="clients"
                @filter="getClients"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialog = true"/>
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
                :disable="dataProduct.length <= 0"
                @click="openOptionDialog('guides')"
              />
            </div>
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
                  <q-td key="item" :props="props">
                    {{ props.row.item }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                    <q-popup-edit auto-save v-model.number="props.row.amount">
                      <q-input
                        type="number"
                        autofocus
                        dense
                        v-model.number="props.row.amount"
                        @input="recalculate(props.row)"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="purchase_price" :props="props">
                    {{ props.row.purchase_price }}
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }}
                    <q-popup-edit v-model.number="props.row.price" auto-save>
                      <q-input
                        type="number"
                        v-model.number="props.row.price"
                        dense autofocus
                        @input="recalculate(props.row)"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="discount" :props="props">
                    {{ props.row.discount }}
                    <q-popup-edit v-model.number="props.row.discount" auto-save>
                      <q-input
                        type="number"
                        dense
                        autofocus
                        v-model.number="props.row.discount"
                        @input="recalculate(props.row)"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="subtotal" :props="props">
                    {{ props.row.subtotal }}
                  </q-td>
                  <q-td key="igv" :props="props">
                    {{ props.row.igv }}
                  </q-td>
                  <q-td key="total" :props="props">
                    {{ props.row.total }}
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
          <q-btn color="negative" label="Cancelar facturación" @click="cancelBill"/>
          <q-btn color="primary" label="Generar factura" type="submit" :disable="dataProduct.length <= 0"/>
        </q-card-actions>
      </q-card>
    </q-form>
    <q-dialog
      v-model="modalProduct"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-form @submit="setTable">
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
                <template v-slot:after>
                  <q-btn color="primary" dense icon="search" @click="openStock" v-if="product"/>
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
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
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
                type="text"
                dense
                outlined
                v-model="productSalePrice"
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
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <q-input
                label="Stock"
                type="number"
                dense
                disable
                outlined
                :value="stockProduct"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="negative" v-close-popup />
            <q-btn label="Agregar" color="primary" type="submit" :disable="!buttonAdd"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="modalPaid"
      persistent
    >
      <q-card style="width: 900px; max-width: 80vw;">
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
              @filter="getGuides"
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
            <q-input label="Observación" outlined dense v-model="selectedGuide.observation"/>
          </div>
          <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <q-input label="Orden de compra" outlined dense v-model="selectedGuide.pucharse_order"/>
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
                @filter="getGuides"
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
              <q-input label="Observación" outlined dense v-model="observation"/>
            </div>
            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <q-input label="Orden de compra" outlined dense v-model="purchase_order"/>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-right q-mt-xs">
              <q-btn icon="add" dense round color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialog"
    >
      <dynamic-form
        module="client"
        :config="client"
        :loading="loadingForm"
        @cancel="addDialog = false"
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
            v-if="documentType.name === 'DOCUMENTO NACIONAL DE IDENTIDAD (DNI)'"
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
            v-if="documentType.name === 'REGISTRO UNICO DE CONTRIBUYENTES'"
          />
        </template>
      </dynamic-form>
    </q-dialog>
    <q-dialog
      v-model="modalProductStock"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-table
            title="Stock del producto"
            :data="stockData"
            :columns="columnsStock"
            row-key="warehouse_name"
            selection="single"
            :selected.sync="selected"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cerrar" @click="modalProductStock = false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <excel-report/>
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
import { client, propsPanelEdition, clientServices } from '../config-file/client/clientConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
import ExcelReport from '../components/ExcelReport.vue'
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'Billing',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm,
    ExcelReport
    // DataTable
  },
  data () {
    return {
      modalPaid: false,
      modalProductStock: false,
      selected: [],
      stockData: [],
      stockProduct: 0,
      productSalePrice: null,
      columnsStock: [
        {
          name: 'warehouse_name',
          required: true,
          label: 'Almacén',
          align: 'left',
          field: row => row.warehouse_name,
          sortable: true
        },
        { name: 'purchase_price', align: 'right', label: 'Precio de compra', field: 'purchase_price', sortable: true },
        { name: 'stock_product', align: 'right', label: 'Stock', field: 'stock_product', sortable: true }
      ],
      loadingForm: false,
      client,
      propsPanelEdition,
      clientServices,
      addDialog: false,
      documentNumber: null,
      lastName: null,
      name: null,
      businessName: null,
      documentType: null,
      documentTypes: [],
      value: false,
      guide: null,
      description: null,
      purchase_order: null,
      observation: null,
      selectedGuides: [],
      guides: [],
      igvs: [{ label: 'Gravado - Operación Onerosa', value: 18 }],
      igv: { label: 'Gravado - Operación Onerosa', value: 18 },
      modalProduct: false,
      loadingCLose: false,
      product: null,
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
          name: 'item',
          label: 'N. Item',
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
        },
        {
          name: 'igv',
          label: 'Igv',
          field: 'igv',
          headerClasses: 'bg-primary text-white',
          sortable: true
        },
        {
          name: 'total',
          label: 'Total',
          field: 'total',
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
        exchange: 0,
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
      branchOfficeSession: null,
      series: [],
      buttonAdd: false
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
    this.getDocumentTypes()
    this.setRelationalData(this.clientServices, [], this)
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
    this.$root.$on('change_branch_office', this.setBranchOffice)
  },
  watch: {
    selected (value) {
      this.selectProductPrice(value)
    }
  },
  methods: {
    setBranchOffice (data) {
      this.branchOfficeSession = data
    },
    getSeries () {
      this.$services.getData(['series'], {
        dataFilter: {
          branch_office_id: this.branchOfficeSession.id,
          voucher_type_id: this.billing.voucherType.id
        }
      }).then(({ res }) => {
        this.series = res.data
        this.billing.serie = res.data[0]
      })
    },
    openStock () {
      this.modalProductStock = true
      this.stockData = this.product.stock
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
    },
    getDataApi () {
      const r = this.documentType.name === 'DOCUMENTO NACIONAL DE IDENTIDAD (DNI)' ? 'dni' : this.documentType.name === 'REGISTRO UNICO DE CONTRIBUYENTES' ? 'ruc' : null
      console.log(r)
      if (r) {
        this.$services.getData(['ruc', this.documentNumber], {
          documentType: r
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
      }
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
          this.billing.client = res.data
          this.addDialog = false
          this.loadingForm = false
          this.notify(this, 'client.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
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
    modelBill () {
      const billModel = {
        serie_id: this.billing.serie.id,
        client_id: this.billing.client.id,
        voucher_type_id: this.billing.voucherType.id,
        branch_office_id: this.branchOfficeSession.id,
        operation_type_id: this.billing.operationType.id,
        seller_id: this.userSession.id,
        coin_id: this.coin.id,
        exchange_rate: this.billing.exchange,
        igv: 18,
        expiration_date: this.billing.expiration_date,
        bill_electronic_details: this.dataProduct,
        bill_electronic_guides: [],
        bill_fees: this.fees,
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
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataProduct = []
      this.payments = []
      this.fees = []
      this.billing.client = null
      this.billing.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.billing.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.totalSale = 0
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
     * Open dialog operation
     * @param {String} data name tab
     */
    openOptionDialog (data) {
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
     * Calculate subtotal products
     */
    totalCalculateProduct () {
      this.totalProduct = this.productSalePrice * this.amount
      this.validStock()
    },
    validStock () {
      this.buttonAdd = this.stockProduct >= this.amount
    },
    /**
     * Selected product
     * @param {Object} value product selected
    */
    selectProductPrice (value) {
      this.stock = value[0]
      this.productSalePrice = this.stock.sale_price
      this.totalProduct = this.stock.sale_price
      this.stockProduct = this.stock.stock_product
      this.validStock()
    },
    selectProuct (value) {
      console.log(value)
      if (value.stock.length > 0) {
        this.selectProductPrice(value.stock)
        this.selected = [value.stock[0]]
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
      this.visible = true
      this.$services.getData(['exchange-rate'], {
        start_date: this.billing.created_at,
        final_date: this.billing.created_at,
        coin: 'PEN'
      })
        .then(({ res }) => {
          if (res.data.exchange_rates && res.data.exchange_rates.length > 0) {
            this.billing.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
          }
          this.visible = false
        })
        .catch(() => {
          this.visible = false
        })
    },
    /**
     * Load data
    */
    loadCreate () {
      this.getOpeationTypes()
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
      const percentage = this.getPercentage(this.productSalePrice, 18)
      this.totalProduct = this.totalProduct * this.amount
      array.push({
        item: this.dataProduct.length + 1,
        product_id: this.product.id,
        description: this.product.full_name,
        amount: this.amount,
        purchase_price: this.stock.purchase_price,
        igv: isNaN(percentage) ? 0 : percentage,
        price: this.productSalePrice,
        discount: this.discount,
        subtotal: this.totalProduct,
        total: (this.totalProduct + Number(percentage)).toFixed(2),
        user_created_id: this.userSession.id,
        warehouse_id: this.selected[0].warehouse_id
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
      this.$services.getData(['select-products'], {
        ...value,
        filterReports: true,
        paginate: true,
        perPage: 30
      })
        .then(({ res }) => {
          update(() => {
            this.products = res.data.data
          })
        })
    },
    /**
     * Get products
     * @param {String} value data filter
     */
    getGuides (value, update) {
      this.$services.getData(['guides'], {
        dataSearch: {
          name: value,
          code: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.products = res.data
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
        sortBy: 'id',
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
    filterVoucherType (value, update) {
      this.$services.getData(['voucher-types'], {
        forAccountingPlan: true,
        dataSearch: {
          name: value,
          number: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.voucherTypes = res.data.data
            this.billing.voucherType = res.data.data[0]
            this.getSeries()
          })
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
        unitValue = (Number(unitValue) + (Number(element.price) * Number(element.amount)))
      })
      this.igvTotal = igvTotal.toFixed(2)
      this.totalSale = (Number(total) + Number(this.igvTotal)).toFixed(2)
      this.totalUnitValue = unitValue.toFixed(2)
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
