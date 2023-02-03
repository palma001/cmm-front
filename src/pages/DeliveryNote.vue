<template>
  <q-page padding>
    <div class="row">
      <div class="col-6 text-h5">
        Nota de entrega
      </div>
      <div class="col-6 text-right q-gutter-sm">
        <q-btn color="primary" icon="list" dense @click="dialogDeliveryNote = true"/>
        <q-btn
          :color="edit ? 'secondary' : 'negative'"
          :icon="edit ? 'edit' : 'close'"
          dense
          @click="edit = !edit"
        />
        <q-btn color="teal" icon="qr_code_scanner" dense @click="openQr = true"/>
      </div>
    </div>
    <q-dialog v-model="openQr">
      <q-card style="width: 300px">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="qr" label="Qr" />
          <q-tab name="image" label="Subir Imagen" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="qr" class="q-pa-none">
            <qrcode-stream @decode="onDone"/>
          </q-tab-panel>

          <q-tab-panel name="image">
            <qrcode-capture @decode="onDone"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
    <q-form @submit="saveDeliveryNote" class="q-gutter-sm" ref="deliveryNote" @reset="clear">
      <q-card class="my-card">
        <q-card-section class="row justify-center q-col-gutter-sm">
          <div class="col-sm-4 col-md-4 col-lg-4 col-xs-12">
            <q-select
              autocomplete="off"
              use-input
              fill-input
              hide-selected
              dense
              outlined
              clearable
              input-debounce="20"
              name="providerSupplier"
              v-model="guide.providerSupplier"
              option-label="name"
              option-value="id"
              label="Proveedor"
              v-validate="'required'" data-vv-as="field"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="materialSuppliers"
              @input="selectedProvider"
              @filter="getMaterialSuppliers"
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
          <div class="col-sm-4 col-md-4 col-lg-4 col-xs-12">
            <q-input outlined v-model="guide.GUIA" label="Guía" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-lg-4 col-xs-12">
            <q-input outlined type="date" v-model="guide.start_date" hint="Fecha de inicio" :disable="edit" dense :rules="[val => val && val !== null || 'Este campo es requerido']"/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">
            <q-input outlined v-model="guide.material_supplier_name" label="Empresa" :disable="edit" dense/>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">
            <q-input outlined v-model="guide.document_number" label="RIF" :disable="edit" dense />
          </div>
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12">
            <q-input outlined v-model="guide.ORIGEN" label="Dirección de Origen" type="textarea" :disable="edit" dense/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-select
              autocomplete="off"
              use-input
              fill-input
              hide-selected
              dense
              outlined
              clearable
              input-debounce="20"
              name="state"
              v-model="guide.state"
              option-label="name"
              option-value="id"
              label="Estado"
              v-validate="'required'" data-vv-as="field"
              :rules="[val => val && val !== null || 'Este campo es requerido']"
              :options="states"
              @filter="getStates"
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
            <div class="col-sm-4 col-md-4 col-xs-12">
              <q-select
                autocomplete="off"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                :disable="guide.state ? false : true"
                clearable
                input-debounce="20"
                name="state"
                v-model="guide.client"
                option-label="name"
                option-value="id"
                label="Cliente"
                v-validate="'required'" data-vv-as="field"
                :rules="[val => val && val !== null || 'Este campo es requerido']"
                :options="clients"
                @input="selectedClient"
                @filter="getClients"
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
            <div class="col-sm-4 col-md-4 col-xs-12">
              <q-input outlined :value="guide.client_document_number" label="RIF" :disable="edit" dense />
            </div>
            <div class="col-sm-12 col-md-12 col-xs-12">
              <q-input outlined v-model="guide.DESTINO" label="Dirección de Destino" type="textarea" dense :disable="edit"/>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input outlined v-model="guide.MATERIAL" label="Material" type="textarea" :disable="edit" dense/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.material_supplier_name" label="Empresa de Transporte" :disable="edit" dense />
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.document_number" label="RIF" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.CONDUCTOR" label="Conductor" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.C_I" label="CI" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.VEHICULO" label="Marca del Vehículo" :disable="edit" dense />
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input
              outlined
              v-model="guide.vehicle_model"
              label="Modelo del Vehículo"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.CHUTO" label="Placa del Chuto" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.BATEA" label="Placa de la Batea" :disable="edit" dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input
              outlined
              v-model="guide.trailer_model"
              label="Modelo de la Batea"
              dense
              :rules="[val => val && val !== null || 'Este campo es requerido']"
            />
          </div>
        </q-card-section>
      </q-card>
      <div class="q-gutter-sm text-right">
        <q-btn unelevated color="secondary" label="Limpiar" type="reset"/>
        <q-btn unelevated color="primary" label="Generar Nota de Entrega" type="submit"/>
      </div>
    </q-form>
    <vue-html2pdf
      ref="html2Pdf"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1000"
      :filename="nameFile"
      :pdf-quality="2"
      :manual-pagination="true"
      v-if="modelPdf"
      @progress="onProgress($event)"
    >
      <section slot="pdf-content" class="text-uppercase text-dark q-pa-md">
        <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="sheet0 gridlines" v-if="modelPdf">
          <tbody>
            <tr class="row0">
              <td class="column9 style57 s style58 q-pa-sm" colspan="1" rowspan="4"><img class="logo" :src="`img/${modelPdf.material_supplier.logo}`" /></td>
              <td class="column9 style57 s style58" colspan="23">{{ modelPdf.material_supplier.name }}</td>
            </tr>
            <tr class="row1">
              <td class="column9 style59 s style60" colspan="23">{{ modelPdf.material_supplier.document_number }}</td>
            </tr>
            <tr class="row2">
              <td class="column9 style61 s style62" colspan="23">{{ modelPdf.material_supplier.address }}</td>
            </tr>
            <tr class="row3">
              <td class="column9 style63 s style64" colspan="23">email: {{ modelPdf.material_supplier.email }} Telf: {{ modelPdf.material_supplier.phone_number }}</td>
            </tr>
            <tr class="row4">
              <td class="style65 style73" colspan="17" rowspan="6">ENTREGA DE MATERIAL FERROSO Y/O NO FERROSO</td>
              <td class="column16 style74 style76" colspan="4">NOTA DE ENTREGA</td>
              <td class="column16 style77 style79 q-pt-sm" colspan="2" rowspan="6">
                <img id="canvas" width="140" height="140"/>
              </td>
            </tr>
            <tr class="row8">
              <td class="column16 style77 n style79" colspan="3">{{ modelPdf.serie_number }}</td>
            </tr>
            <tr class="row10">
              <td class="column16 style74 s style76" colspan="3">NUMERO DE GUIA</td>
            </tr>
            <tr class="row11">
              <td class="column16 style77 n style79" colspan="3">{{ modelPdf.guide_number }}</td>
            </tr>
            <tr class="row10">
              <td class="column16 style74 s style76" colspan="3">FECHA</td>
            </tr>
            <tr class="row11">
              <td class="column16 style77 n style79" colspan="3">{{ formatDate(modelPdf.start_date, 'DD/MM/YYYY') }}</td>
            </tr>
            <tr class="row13">
              <td class="style43 s style43" colspan="24" >ORIGEN DEL MATERIAL</td>
            </tr>
            <tr class="row15">
              <td class="style21 s" colspan="3">NOMBRE:</td>
              <td class="column3 style44 s style44" colspan="18">{{ modelPdf.material_supplier.name }}</td>
              <td class="column16 style28 s style28" colspan="3" rowspan="2">ORDEN DE ENTREGA PROCEDENCIA DE MATERIAL</td>
            </tr>
            <tr class="row16">
              <td class="style45 s style45" colspan="3">DIRECCION:</td>
              <td class="column3 style46 s style46" colspan="18">{{ modelPdf.material_supplier.address }}</td>
              <td class="style45 s style45" colspan="3"></td>
            </tr>
            <tr class="row18">
              <td class="style45 s style45" colspan="3">RIF:</td>
              <td class="column3 style54 s style56" colspan="18">{{ modelPdf.material_supplier.document_number }}</td>
              <td class="column16 style53 s style53" colspan="3">{{ modelPdf.material_supplier.name }}</td>
            </tr>
            <tr class="row13">
              <td class="style43 s style43" colspan="24" >DESTINO DEL MATERIAL</td>
            </tr>
            <tr class="row21">
              <td class="style21 s" colspan="3">NOMBRE:</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.client.name }}</td>
            </tr>
            <tr class="row22">
              <td class="style21 s" colspan="3">DIRECCION</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.destination_address }}</td>
            <tr class="row26">
              <td class="style45 s style45" colspan="3">RIF:</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.client.document_number }}</td>
            </tr>
            <tr class="row28">
              <td class="style47 s style47" colspan="24">MATERIAL</td>
            </tr>
            <tr class="row28">
              <td class="column3 style44 s style44" colspan="24">{{ modelPdf.material }}</td>
            </tr>
            <tr class="row29">
              <td class="column11 style47 s style47" colspan="8">PESO TARA</td>
              <td class="column15 style47 s style47" colspan="8">PESO BRUTO</td>
              <td class="column19 style47 s style47" colspan="8">PESO NETO</td>
            </tr>
            <tr class="row29">
              <td class="column3 style44 s style44" colspan="8"></td>
              <td class="column3 style44 s style44" colspan="8"></td>
              <td class="column3 style44 s style44" colspan="8"></td>
            </tr>
            <tr class="row13">
              <td class="style43 s style43" colspan="24" >TRANSPORTE</td>
            </tr>
            <tr class="row32">
              <td class="style34 s style36" colspan="8">NOMBRE DE LA EMPRESA DE TRANSPORTE:</td>
              <td class="column10 style37 s style37" colspan="16">{{ modelPdf.material_supplier.name }}</td>
            </tr>
            <tr class="row33">
              <td class="style38 s style38" colspan="2">RIF:</td>
              <td class="column4 style40 s style40" colspan="22">{{ modelPdf.material_supplier.document_number }}</td>
            </tr>
            <tr class="row34">
              <td class="style38 s style38" colspan="2">CONDUCTOR:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.driver_name }}</td>
              <td class="column14 style38 s style38" colspan="4">C.I.:</td>
              <td class="column18 style39 n style39" colspan="6">{{ modelPdf.driver_document_number }}</td>
            </tr>
            <tr class="row35">
              <td class="style41 s style41" colspan="2">MARCA DE VEHÍCULO:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.vehicle_brand }}</td>
              <td class="column14 style41 s style41" colspan="4">MODELO:</td>
              <td class="column18 style42 n style42" colspan="6">{{ modelPdf.vehicle_model }}</td>
            </tr>
            <tr class="row36">
              <td class="style22 s" colspan="2">PLACA DEL CHUTO:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.vehicle_plate }}</td>
              <td class="column14 style38 s style38" colspan="4">PLACA DE BATEA:</td>
              <td class="column18 style39 s style39" colspan="6">{{ modelPdf.trailer_plate }}</td>
            </tr>
            <tr class="row38">
              <td class="style23 s style23" colspan="8">PROVEEDOR </td>
              <td class="column8 style23 s style23" colspan="8">TRANSPORTISTA</td>
              <td class="column16 style23 s style23" colspan="8">RECIBIDO EN </td>
            </tr>
            <tr class="row39">
              <td class="style27 s style27" colspan="8">DESPACHADO POR:</td>
              <td class="column8 style27 s style27" colspan="8">ENTREGADO POR:</td>
              <td class="column16 style28 s style28" colspan="8">RECIPLAST DE VENEZUELA, C.A. POR:</td>
            </tr>
            <tr class="row45">
              <td class="style24 s style25 q-gutter-md" colspan="12">
                <img class="signature" :src="`img/${modelPdf.material_supplier.signature}`" />
                <img class="seal" :src="`img/${modelPdf.material_supplier.seal}`" />
              </td>
              <td class="column8 style25 s style25" colspan="8"></td>
              <td class="column16 style25 s style26" colspan="8"></td>
            </tr>
            <tr class="row45">
              <td class="style24 s style25" colspan="8">FIRMA, SELLO Y HUELLA</td>
              <td class="column8 style25 s style25" colspan="8">FIRMA, SELLO Y HUELLA</td>
              <td class="column16 style25 s style26" colspan="8">FIRMA, SELLO Y HUELLA</td>
            </tr>
            <tr class="row13">
              <td class="style43 s style43" colspan="24" >OBSERVACIONES Y/O COMENTARIOS:</td>
            </tr>
            <tr class="row28">
              <td class="column3 style44 s style44" colspan="24">
                <div style="height: 100px"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </vue-html2pdf>
    <q-inner-loading :showing="visibleLoading">
      <q-circular-progress
        show-value
        class="text-white q-ma-md"
        :value="valueLoading"
        size="150px"
        :thickness="0.2"
        color="orange"
        center-color="primary"
        track-color="transparent"
      >
        <q-icon name="receipt" />
      </q-circular-progress>
    </q-inner-loading>
    <q-dialog
      v-model="dialogDeliveryNote"
      persistent
      full-width
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <data-table
            title="list"
            module="deliveryNote"
            searchable
            action
            activeVisibleColumn
            :column="deliveryNoteConfig"
            :data="data"
            :loading="loadingTable"
            :buttonsActions="buttonsActions"
            :optionPagination="optionPagination"
            @view-details="viewDetails"
            @edit="editDeliveryNote"
            @search-data="searchData"
            @on-load-data="loadData"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      position="right"
      persistent
      full-height
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="deliveryNote"
        :propsPanelEdition="propsPanelEdition"
        :config="deliveryNoteConfig"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import DataTable from '../components/DataTable.vue'
import { deliveryNoteConfig, buttonsActions, propsPanelEdition, deliveryServices } from '../config-file/deliveryNote/deliveryNoteConfig.js'
import { date } from 'quasar'
import VueHtml2pdf from 'vue-html2pdf'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { mapGetters } from 'vuex'
import { io } from 'socket.io-client'
import CryptoJS from 'crypto-js'
import config from '../config'
import QRCode from 'qrcode'
const socket = io(config.ipSocket)
export default {
  mixins: [mixins.containerMixin],
  components: {
    VueHtml2pdf,
    DataTable,
    DynamicFormEdition
  },
  data () {
    return {
      /**
       * Guide scanner data
       * @type {Object}
       */
      guideSocket: null,
      /**
       * Select panel edition
       * @type {Array}
       */
      deliveryServices,
      /**
       * Dialog status
       * @type {Boolean}
       */
      editDialog: false,
      /**
       * Loading dialog status
       * @type {Boolean}
       */
      loadingForm: false,
      /**
       * Table delivery note data
       * @type {Array}
       */
      data: [],
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
       * Loading table status
       * @type {Boolean}
       */
      loadingTable: false,
      /**
       * Config file table delivery note
       * @type {Array}
       */
      deliveryNoteConfig,
      /**
       * Config file buttons delivery note
       * @type {Array}
       */
      buttonsActions,
      /**
       * Config file panel edition delivery note
       * @type {Array}
       */
      propsPanelEdition,
      /**
       * Model list delivery note
       * @type {Boolean}
       */
      dialogDeliveryNote: false,
      /**
       * Maximized model delivery note
       * @type {Boolean}
       */
      maximizedToggle: true,
      /**
       * Tab model qr
       * @type {String}
       */
      tab: 'qr',
      /**
       * Status dialig the panel edition
       */
      edit: true,
      /**
       * Visibility loading
       * @type {Boolean}
       */
      visibleLoading: false,
      /**
       * Dropdown list of material suppliers
       * @type {Array}
       */
      materialSuppliers: [],
      /**
       * Guide data
       * @type {Object}
       */
      guide: {},
      /**
       * Dropdown list of states
       * @type {Array}
       */
      states: [],
      /**
       * Selected state
       * @type {Object}
       */
      state: null,
      /**
       * Selected client
       * @type {Object}
       */
      client: {},
      /**
       * Dropdown list of clients
       * @type {Array}
       */
      clients: [],
      /**
       * Open dialog qr
       * @type {Boolean}
       */
      openQr: false,
      /**
       * Selected guide to show in pdf
       * @type {Object}
       */
      modelPdf: null,
      /**
       * Name pdf
       * @type {String}
       */
      nameFile: '',
      /**
       * User session
       * @type {Object}
       */
      userSession: null,
      /**
       * Branch office session
       * @type {Object}
       */
      branchOffice: null,
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
          guide_number: '',
          destination_address: '',
          material: '',
          driver_name: '',
          driver_document_number: '',
          vehicle_brand: '',
          vehicle_model: '',
          vehicle_plate: '',
          trailer_plate: '',
          trailer_model: '',
          origin_address: '',
          'client.document_number': '',
          'client.name': '',
          'materialSupplier.name': '',
          'materialSupplier.document_number': '',
          created_at: '',
          serie_number: ''
        }
      }
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE]),
    valueLoading () {
      return this.timeLoading
    }
  },
  watch: {
    guideSocket (data) {
      this.guide = data
    }
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.setRelationalData(this.deliveryServices, [], this)
    this.eventSocket()
  },
  methods: {
    /**
     * Init events socket
     */
    eventSocket () {
      socket.on(`set-scanner-delivery-note-${this.userSession.id}`, (arg) => {
        this.guideSocket = { ...this.guide, ...arg }
        this.openQr = false
      })
    },
    /**
     * Open edition dialog
     * @param {Object} data Delivery note selected
     */
    editDeliveryNote (data) {
      this.editDialog = true
      this.propsPanelEdition.data = data
    },
    /**
     * Get all Delivery Notes
     * @param {params} params params to request
     */
    getDeliveryNotes (params = this.params) {
      this.loadingTable = true
      params.dataEqualFilter = {
        user_created_id: this.userSession.id
      }
      this.$services.getData(['delivery-notes'], params)
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
    /**
     * Update Delivery note
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['delivery-notes', data.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getConcepts(this.params)
          this.notify(this, 'deliveryNotes.editSuccessful', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
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
      this.getDeliveryNotes(this.params)
    },
    /**
     * Model json qr
     * @param {Obeject} data delivery note qr
     * @returns {Object} model formated
     */
    modelJson (data) {
      return {
        TI: 'CORPOEZ GUÍA DE MOVILIZACÍON',
        GUi: data.guide_number,
        EM: data.material_supplier.name,
        NDP: data.material_supplier.document_number,
        CTO: data.driver_name,
        CI: data.driver_document_number,
        VEI: data.vehicle_brand,
        PV: `${data.vehicle_plate}`,
        MV: `${data.vehicle_model}`,
        PT: `${data.trailer_plate}`,
        MT: `${data.trailer_model}`,
        OR: data.origin_address,
        DE: data.destination_address,
        FI: data.start_date,
        FF: data.deadline
      }
    },
    /**
     * Search Delivery Notes
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getDeliveryNotes()
    },
    /**
     * Format date
     * @param {String} data date to convert
     * @param {String} format format date
     * @returns {String} date formated
     */
    formatDate (data, format) {
      return date.formatDate(data, format)
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.downloadPDF(data)
    },
    /**
     * Downlaod Pdf
     * @param {data} data delivery note
     */
    async downloadPDF (data) {
      const { res } = await this.$services.getOneData(['delivery-notes', data.id])
      this.modelPdf = res.data
      this.nameFile = `${res.data.material_supplier.name}-${res.data.guide_number}`
      const ciphertext = this.encrypt(JSON.stringify(this.modelJson(this.modelPdf)))
      if (this.modelPdf) {
        this.$nextTick(() => {
          this.generateQr(ciphertext)
          this.$refs.html2Pdf.generatePdf()
        })
      }
    },
    /**
     * Encrypt data
     * @param {String} data json data
     * @returns {String} json encrypted
     */
    encrypt (data) {
      data = data.replaceAll('"', '')
      data = data.replaceAll('{', '')
      data = data.replaceAll('}', '')
      data = data.replaceAll(',', '\n')
      var iv = CryptoJS.enc.Base64.parse('')
      data = data.slice()
      return CryptoJS.AES.encrypt(data, process.env.SECRET_KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
    },
    /**
     * Decrypt data
     * @param {String} data encrypt data
     * @returns {String} string decrypt
     */
    decryptData (data) {
      var iv = CryptoJS.enc.Base64.parse('')
      return CryptoJS.AES.decrypt(data, process.env.SECRET_KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8)
    },
    /**
     * Generate qr code
     * @param {code} data json delivery note
     */
    generateQr (code) {
      const opts = {
        type: 'image/jpeg',
        margin: 2
      }
      QRCode.toDataURL(code, opts, function (error, url) {
        if (error) throw error
        var img = document.getElementById('canvas')
        img.src = url
      })
    },
    /**
     * Pdf progress
     * @param {Int} data value dialog
     */
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleLoading = false
        this.timeLoading = 0
      }
    },
    /**
     * All Material Suppliers
     * @param {String} value value filter
     * @param {Callback} update
     */
    getMaterialSuppliers (value, update) {
      this.$services.getData(['providers'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          document_number: value,
          name: value
        },
        perPage: 100,
        paginate: true
      })
        .then(({ res }) => {
          update(() => {
            this.materialSuppliers = res.data.data
          })
        })
    },
    /**
     * All states
     * @param {String} value value filter
     * @param {Callback} update
     */
    getStates (value, update) {
      this.$services.getData(['states'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value
        },
        perPage: 100,
        paginate: true
      })
        .then(({ res }) => {
          update(() => {
            this.states = res.data.data
          })
        })
    },
    /**
     * All Client
     * @param {String} value value filter
     * @param {Callback} update
     */
    getClients (value, update) {
      this.$services.getData(['clients'], {
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: value,
          'states.state_id': this.guide.state.id
        },
        perPage: 100,
        paginate: true
      })
        .then(({ res }) => {
          update(() => {
            this.clients = res.data.data
          })
        })
    },
    /**
     * Set material suppiler selected to guide
     * @param {Object} data Material suppiler selected
     */
    selectedProvider (data) {
      this.guide.material_supplier_id = data.id
      this.guide.document_number = data.document_number
      this.guide.material_supplier_name = data.name
      this.guide.serie_number = data.serie_number
    },
    /**
     * Set client selected to guide
     * @param {Object} data client selected
     */
    selectedClient (data) {
      this.guide.client_id = data.id
      this.guide.client_document_number = data.document_number
    },
    /**
     * Converter String to Qr
     * @param {String} data data qr guide
     */
    onDone (data) {
      try {
        const dataEnter = data.split('\n')
        const objectData = {}
        dataEnter.map(data => {
          const data2 = data.split(':')
          if (data2.length === 2) {
            const stringFormated = data2[0].replace(/"/g, '-').replaceAll('.', '_').replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            objectData[stringFormated] = data2[1]
          }
        })
        const placas = objectData.PLACAS.split('/')
        objectData.CHUTO = placas[0]
        objectData.BATEA = placas[1]
        const dateValid = objectData.VALIDEZ.split('A')
        objectData.start_date = dateValid[0]
        objectData.deadline = dateValid[1]
        objectData.userSession = this.userSession.id
        socket.emit('scanner-delivery-note', objectData)
      } catch (error) {
        console.log(error)
        alert(this.decryptData(data))
      }
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
     * Clear form delivery note
     */
    clear () {
      this.guide = {}
      this.guide.date = date.formatDate(Date(), 'YYYY/MM/DD')
      this.resetValidations(this.$refs.deliveryNote)
    },
    /**
     * Save delivery note
     */
    saveDeliveryNote () {
      this.guide.destination_address = this.guide.DESTINO
      this.guide.material = this.guide.MATERIAL
      this.guide.driver_name = this.guide.CONDUCTOR
      this.guide.driver_document_number = this.guide.C_I
      this.guide.vehicle_brand = this.guide.VEHICULO
      this.guide.vehicle_plate = this.guide.CHUTO
      this.guide.trailer_plate = this.guide.BATEA
      this.guide.guide_number = this.guide.GUIA
      this.guide.origin_address = this.guide.ORIGEN
      this.guide.origin_address = this.guide.ORIGEN
      this.guide.user_created_id = this.userSession.id
      this.visibleLoading = true
      this.$services.postData(['delivery-notes'], this.guide)
        .then(({ res }) => {
          this.downloadPDF(res.data)
          this.clear()
        })
        .catch(({ response }) => {
          this.catchError(this, response.data.errors)
          this.visibleLoading = false
        })
    },
    error (error) {
      alert(error)
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  margin-top: 20px
</style>
