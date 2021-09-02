<template>
  <!-- @keyup.113=saveSale -->
  <q-page padding>
    <q-form @submit="modelPurchase" ref="formPurchase">
      <q-card class="my-card">
        <q-card-section class="q-pb-sm row q-col-gutter-sm">
          <div class="col-8">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ ucwords($t('purchase.newPurchase')) }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-2">
            <q-input
              type="date"
              dense
              outlined
              label="Fec. Emisión"
              v-model="purchase.created_at"
              @input="getExchange"
            />
          </div>
          <div class="col-2">
            <q-input
              type="date"
              dense
              outlined
              label="Fec. Vencimiento"
              v-model="purchase.expiration_date"
            />
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
                input-debounce="0"
                name="voucherType"
                autocomplete="off"
                ref="voucherTypeRef"
                v-model="purchase.voucherType"
                v-validate="'required'"
                data-vv-as="field"
                option-value="id"
                option-label="name"
                :label="ucwords($t('purchase.voucher_type'))"
                :options="voucherTypes"
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
              <q-input
                v-model="purchase.serie"
                outlined
                dense
                label="Serie"
                type="text"
                :rules="[ val => val && val.length || 'Este campo es requerido']"
              />
            </div>
            <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
              <q-input
                v-model="purchase.number"
                outlined
                dense
                label="Numero"
                type="text"
                :rules="[ val => val && val.length || 'Este campo es requerido']"
              />
            </div>
            <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
              <q-select
                outlined
                v-model="coin"
                dense
                option-label="name"
                option-value="id"
                :label="ucwords($t('purchase.coin'))"
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
        <q-card-section :class="$q.screen.lt.md ? 'q-py-sm' : 'q-py-none'">
          <div class="row q-col-gutter-md">
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              <q-select
                autocomplete="off"
                use-input
                hide-selected
                fill-input
                dense
                outlined
                clearable
                input-debounce="20"
                name="provider"
                v-model="purchase.provider"
                option-label="full_name"
                option-value="id"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :label="ucwords($t('purchase.provider'))"
                :options="providers"
                @filter="getProviders"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" dense rounded icon="add" size="sm" @click="addDialig = true"/>
                </template>
              </q-select>
            </div>
            <div class="col-xs-6 col-sm-2 col-md-3 col-lg-3 col-xl-3">
              <q-input
                v-model="purchase.exchange"
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
                color="positive"
                label="pagos"
                style="height: 40px;"
                :disable="dataProduct <= 0"
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
          <div class="q-pa-xs col-xs-12 col-md-10 col-sm-12 col-lg-10">
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
                    <q-btn size="xs" color="negative" icon="close" @click="deleteProduct(props)"/>
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="warehouse_name" :props="props">
                    {{ props.row.warehouse_name }}
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
                    <q-popup-edit v-model.number="props.row.purchase_price" auto-save>
                      <q-input
                        type="number"
                        v-model.number="props.row.purchase_price"
                        dense
                        autofocus
                        @input="recalculate(props.row)"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="igv" :props="props">
                    {{ props.row.igv }}
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }}
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
                </q-tr>
              </template>
            </q-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
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
                :rules="[ val => val || 'Este campo es requerido' ]"
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
                name="warehouse"
                ref="warehouse"
                v-model="warehouse"
                v-validate="'required'"
                data-vv-as="field"
                label="Almacen"
                option-value="id"
                option-label="full_name"
                :rules="[ val => val || 'Este campo es requerido' ]"
                :options="warehouses"
                @filter="getWarehouse"
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
                name="igv"
                ref="igvRef"
                v-model="igv"
                v-validate="'required'"
                data-vv-as="field"
                label="Afectación igv"
                :rules="[ val => val || 'Este campo es requerido' ]"
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
            <q-btn label="Agregar" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="modalPaid"
      persistent
    >
      <q-card style="width: 900px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">
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
            class="row justify-between q-col-gutter-sm q-pa-none"
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
                  val => 0 <= (totalSale - totalPaid) || 'El monto no puede superar el total a pagar'
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
        <q-card-section class="q-py-none">
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
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Generar Factura" color="primary" @click="modelPurchase"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialig"
    >
      <dynamic-form
        module="provider"
        :config="provider"
        :loading="loadingForm"
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
          <q-input
            label="Estado"
            v-validate="'required'"
            data-vv-as="status"
            name="status"
            dense
            outlined
            v-model="status"
            :error="errors.has('status')"
            :error-message="errors.first('status')"
            v-if="documentType.name === 'RUC'"
          />
          <q-input
            label="Condición de residencia"
            v-validate="'required'"
            data-vv-as="residenceCondition"
            name="residenceCondition"
            dense
            outlined
            v-model="residenceCondition"
            :error="errors.has('residenceCondition')"
            :error-message="errors.first('residenceCondition')"
            v-if="documentType.name === 'RUC'"
          />
        </template>
      </dynamic-form>
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
import { provider, propsPanelEdition, providerServices } from '../config-file/provider/providerConfig.js'
import DynamicForm from '../components/DynamicForm.vue'
// import DynamicForm from '../components/DynamicForm'
// import DataTable from '../components/DataTable'
export default {
  name: 'purchase',
  mixins: [mixins.containerMixin],
  components: {
    DynamicForm
    // DataTable
  },
  data () {
    return {
      warehouse: null,
      loadingForm: false,
      provider,
      propsPanelEdition,
      providerServices,
      addDialig: false,
      documentNumber: null,
      lastName: null,
      name: null,
      businessName: null,
      documentType: null,
      documentTypes: [],
      value: false,
      description: null,
      tab: 'payments',
      igvs: [{ label: 'Gravado - Operación Onerosa', value: 12 }],
      igv: { label: 'Gravado - Operación Onerosa', value: 12 },
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
          name: 'warehouse_name',
          align: 'left',
          headerClasses: 'bg-primary text-white',
          label: 'Almacen',
          field: 'warehouse_name',
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
       * purchase Model
       * @type {Object} purchase model
       */
      purchase: {
        provider: null,
        voucherType: null,
        exchange: 0,
        expiration_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      /**
       * provider List
       * @type {Array} provider List
       */
      providers: [],
      warehouses: [],
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
       * Data product purchase
       * @type {Array} data purchase
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
      residenceCondition: null,
      status: null
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
    this.setRelationalData(this.providerServices, [], this)
    this.userSession = this[GETTERS.GET_USER]
    this.branchOfficeSession = this[GETTERS.GET_BRANCH_OFFICE]
  },
  methods: {
    /**
     * Get all provider
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
      this.$services.getData(['ruc', this.documentNumber], {
        documentType: this.documentType.name.toLowerCase()
      })
        .then(({ res }) => {
          if (!res.data.error) {
            if (res.data.nombre_o_razon_social) {
              this.businessName = res.data.nombre_o_razon_social
              this.residenceCondition = res.data.condicion_de_domicilio
              this.status = res.data.estado_del_contribuyente
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
      data.branch_office_id = this.branchOfficeSession.id
      this.loadingForm = true
      this.$services.postData(['providers'], data)
        .then(({ res }) => {
          this.purchase.provider = res.data
          this.addDialig = false
          this.loadingForm = false
          this.notify(this, 'provider.addSuccessfull', 'positive', 'mood')
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
    modelPurchase () {
      const billModel = {
        serie: this.purchase.serie,
        number: this.purchase.number,
        provider_id: this.purchase.provider.id,
        voucher_type_id: this.purchase.voucherType.id,
        coin_id: this.coin.id,
        exchange_rate: this.purchase.exchange,
        igv: 12,
        expiration_date: date.formatDate(this.purchase.expiration_date, 'YYYY-MM-DD'),
        purchase_details: this.dataProduct,
        purchase_payments: this.modelPayments(this.payments),
        user_created_id: this.userSession.id,
        user_updated_id: this.userSession.id,
        created_at: date.formatDate(this.purchase.created_at, 'YYYY-MM-DDTHH:mm:ss')
      }
      this.savePurchase(billModel)
    },
    /**
     * Save bill
     * @param {Object} data data bill
     */
    savePurchase (data) {
      this.modalPaid = false
      this.visible = true
      this.$services.postData(['purchases'], data)
        .then(res => {
          this.notify(this, 'purchase.saveSuccess', 'positive', 'mood')
          this.cancelBill()
          this.visible = false
        })
        .catch(() => {
          this.notify(this, 'purchase.error', 'negative', 'warning')
          this.visible = false
        })
    },
    /**
     * Clean bill data
     */
    cancelBill () {
      this.dataProduct = []
      this.payments = []
      this.purchase = {}
      this.purchase.created_at = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.purchase.expiration_date = date.formatDate(new Date(), 'YYYY-MM-DD')
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
      this.getVoucherTypes()
      this.getCoins()
      this.resetValidations(this.$refs.formPurchase)
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
          exchange: this.purchase.exchange,
          user_created_id: this.userSession.id
        }
      })
    },
    /**
     * Open dialog operation
     * @param {String} data name tab
     */
    openOptionDialog (data) {
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
        ref.resetValidation()
      }, 100)
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
      this.resetValidations(this.$refs.addPayment)
    },
    /**
     * Calculate subtotal products
     */
    totalCalculateProduct () {
      this.totalProduct = (Number(this.stock.sale_price) * Number(this.amount).toFixed(2))
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
      this.visible = true
      this.$services.getData(['exchange-rate'], {
        start_date: this.purchase.created_at,
        final_date: this.purchase.created_at,
        coin: 'PEN'
      })
        .then(({ res }) => {
          if (res.data.exchange_rates && res.data.exchange_rates.length > 0) {
            this.purchase.exchange = res.data.exchange_rates[res.data.exchange_rates.length - 1].venta
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
      this.getVoucherTypes()
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
      const percentage = this.getPercentage(this.totalProduct, this.igv.value)
      const unitValue = Number(this.stock.sale_price) + Number(percentage)
      array.push({
        product_id: this.product.id,
        description: this.product.full_name,
        amount: this.amount,
        purchase_price: this.stock.sale_price,
        igv: isNaN(percentage) ? 0 : percentage,
        price: unitValue,
        discount: this.discount,
        sale_price: Number(this.totalProduct) + Number(percentage),
        subtotal: Number(this.totalProduct) + Number(percentage),
        user_created_id: this.userSession.id,
        warehouse_name: this.warehouse.full_name,
        warehouse_id: this.warehouse.id
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
      return data.find((product) => product.product_id === index.id && product.warehouse_id === this.warehouse.id)
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
     * All provider
     */
    getProviders (value, update) {
      this.$services.getData(['providers'], {
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
            this.providers = res.data.data
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
     * Get payment destination
     * @param {String} value data filter
     */
    getWarehouse (value, update) {
      this.$services.getData(['warehouses'], {
        dataSearch: {
          name: value
        },
        paginate: true,
        perPage: 100
      })
        .then(({ res }) => {
          update(() => {
            this.warehouses = res.data.data
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
     * Get voucher types
     */
    getVoucherTypes () {
      this.$services.getData(['voucher-types'])
        .then(({ res }) => {
          this.voucherTypes = res.data
          this.purchase.voucherType = res.data[0]
        })
    },
    /**
     * Delete product
     * @param {Object} data data product
     */
    deleteProduct (data) {
      this.dataProduct.splice(data.rowIndex, 1)
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
     * Calculate purchase total
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
      this.totalSale = total
      this.totalUnitValue = unitValue.toFixed(2)
    },
    /**
     * Calculate purchase total
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
