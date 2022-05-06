<template>
  <q-page padding>
    <div class="row">
      <div class="col-6 text-h5">Nota de entrega</div>
      <div class="col-6 text-right">
        <q-btn color="primary" icon="qr_code_scanner" dense @click="openQr = true"/>
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
            <q-input outlined v-model="guide.GUIA" label="Guía" disable dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-lg-4 col-xs-12">
            <q-input outlined v-model="guide.date" label="Fecha" disable dense/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">
            <q-input outlined v-model="guide.material_supplier_name" label="Empresa" disable dense/>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">
            <q-input outlined v-model="guide.document_number" label="RIF" disable dense />
          </div>
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12">
            <q-input outlined v-model="guide.ORIGEN" label="Dirección de Origen" type="textarea" disable dense/>
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
              <q-input outlined :value="guide.client_document_number" label="RIF" disable dense />
            </div>
            <div class="col-sm-12 col-md-12 col-xs-12">
              <q-input outlined v-model="guide.DESTINO" label="Dirección de Destino" type="textarea" dense disable/>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input outlined v-model="guide.MATERIAL" label="Material" type="textarea" disable dense/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.material_supplier_name" label="Empresa de Transporte" disable dense />
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.document_number" label="RIF" disable dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.CONDUCTOR" label="Conductor" disable dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.C_I" label="CI" disable dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.VEHICULO" label="Marca del Vehículo" disable dense />
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
            <q-input outlined v-model="guide.CHUTO" label="Placa del Chuto" disable dense/>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-12">
            <q-input outlined v-model="guide.BATEA" label="Placa de la Batea" disable dense/>
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
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1000"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      ref="html2Pdf"
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
              <td class="column0 style65 s style73" colspan="21" rowspan="6">ENTREGA DE MATERIAL FERROSO Y/O NO FERROSO</td>
              <td class="column16 style74 s style76" colspan="3">NOTA DE ENTREGA</td>
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
              <td class="column16 style77 n style79" colspan="3">{{ formatDate(modelPdf.created_at, 'DD/MM/YYYY') }}</td>
            </tr>
            <tr class="row13">
              <td class="column0 style43 s style43" colspan="24" >ORIGEN DEL MATERIAL</td>
            </tr>
            <tr class="row15">
              <td class="column0 style21 s" colspan="3">NOMBRE:</td>
              <td class="column3 style44 s style44" colspan="18">{{ modelPdf.material_supplier.name }}</td>
              <td class="column16 style28 s style28" colspan="3" rowspan="2">ORDEN DE ENTREGA PROCEDENCIA DE MATERIAL</td>
            </tr>
            <tr class="row16">
              <td class="column0 style45 s style45" colspan="3">DIRECCION:</td>
              <td class="column3 style46 s style46" colspan="18">{{ modelPdf.material_supplier.address }}</td>
              <td class="column0 style45 s style45" colspan="3"></td>
            </tr>
            <tr class="row18">
              <td class="column0 style45 s style45" colspan="3">RIF:</td>
              <td class="column3 style54 s style56" colspan="18">{{ modelPdf.material_supplier.document_number }}</td>
              <td class="column16 style53 s style53" colspan="3">{{ modelPdf.material_supplier.name }}</td>
            </tr>
            <tr class="row13">
              <td class="column0 style43 s style43" colspan="24" >DESTINO DEL MATERIAL</td>
            </tr>
            <tr class="row21">
              <td class="column0 style21 s" colspan="3">NOMBRE:</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.client.name }}</td>
            </tr>
            <tr class="row22">
              <td class="column0 style21 s" colspan="3">DIRECCION</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.destination_address }}</td>
            <tr class="row26">
              <td class="column0 style45 s style45" colspan="3">RIF:</td>
              <td class="column3 style44 s style44" colspan="21">{{ modelPdf.client.document_number }}</td>
            </tr>
            <tr class="row28">
              <td class="column0 style47 s style47" colspan="24">MATERIAL</td>
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
              <td class="column0 style43 s style43" colspan="24" >TRANSPORTE</td>
            </tr>
            <tr class="row32">
              <td class="column0 style34 s style36" colspan="8">NOMBRE DE LA EMPRESA DE TRANSPORTE:</td>
              <td class="column10 style37 s style37" colspan="16">{{ modelPdf.material_supplier.name }}</td>
            </tr>
            <tr class="row33">
              <td class="column0 style38 s style38" colspan="2">RIF:</td>
              <td class="column4 style40 s style40" colspan="22">{{ modelPdf.material_supplier.document_number }}</td>
            </tr>
            <tr class="row34">
              <td class="column0 style38 s style38" colspan="2">CONDUCTOR:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.driver_name }}</td>
              <td class="column14 style38 s style38" colspan="4">C.I.:</td>
              <td class="column18 style39 n style39" colspan="6">{{ modelPdf.driver_document_number }}</td>
            </tr>
            <tr class="row35">
              <td class="column0 style41 s style41" colspan="2">MARCA DE VEHÍCULO:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.vehicle_brand }}</td>
              <td class="column14 style41 s style41" colspan="4">MODELO:</td>
              <td class="column18 style42 n style42" colspan="6">{{ modelPdf.vehicle_model }}</td>
            </tr>
            <tr class="row36">
              <td class="column0 style22 s" colspan="2">PLACA DEL CHUTO:</td>
              <td class="column4 style39 s style39" colspan="12">{{ modelPdf.vehicle_plate }}</td>
              <td class="column14 style38 s style38" colspan="4">PLACA DE BATEA:</td>
              <td class="column18 style39 s style39" colspan="6">{{ modelPdf.trailer_plate }}</td>
            </tr>
            <tr class="row38">
              <td class="column0 style23 s style23" colspan="8">PROVEEDOR </td>
              <td class="column8 style23 s style23" colspan="8">TRANSPORTISTA</td>
              <td class="column16 style23 s style23" colspan="8">RECIBIDO EN </td>
            </tr>
            <tr class="row39">
              <td class="column0 style27 s style27" colspan="8">DESPACHADO POR:</td>
              <td class="column8 style27 s style27" colspan="8">ENTREGADO POR:</td>
              <td class="column16 style28 s style28" colspan="8">RECIPLAST DE VENEZUELA, C.A. POR:</td>
            </tr>
            <tr class="row45">
              <td class="column0 style24 s style25 q-gutter-md" colspan="8">
                <img class="seal" :src="`img/${modelPdf.material_supplier.seal}`" />
                <img class="signature" :src="`img/${modelPdf.material_supplier.signature}`" />
              </td>
              <td class="column8 style25 s style25" colspan="8"></td>
              <td class="column16 style25 s style26" colspan="8"></td>
            </tr>
            <tr class="row45">
              <td class="column0 style24 s style25" colspan="8">FIRMA, SELLO Y HUELLA</td>
              <td class="column8 style25 s style25" colspan="8">FIRMA, SELLO Y HUELLA</td>
              <td class="column16 style25 s style26" colspan="8">FIRMA, SELLO Y HUELLA</td>
            </tr>
            <tr class="row13">
              <td class="column0 style43 s style43" colspan="24" >OBSERVACIONES Y/O COMENTARIOS:</td>
            </tr>
            <tr class="row28">
              <td class="column3 style44 s style44" colspan="24"></td>
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
  </q-page>
</template>

<script>
import { date } from 'quasar'
import VueHtml2pdf from 'vue-html2pdf'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    VueHtml2pdf
  },
  data () {
    return {
      tab: 'qr',
      visibleLoading: false,
      materialSuppliers: [],
      guide: {},
      states: [],
      state: null,
      client: {},
      clients: [],
      /**
       * Open dialog qr
       * @type {Boolean}
       */
      openQr: false,
      modelPdf: null,
      userSession: null,
      branchOffice: null
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
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.guide.date = date.formatDate(Date(), 'YYYY/MM/DD')
    // this.downloadPDF({ id: 2 })
  },
  methods: {
    formatDate (data, format) {
      return date.formatDate(data, format)
    },
    async downloadPDF (data) {
      const { res } = await this.$services.getOneData(['delivery-notes', data.id])
      this.modelPdf = res.data
      this.$refs.html2Pdf.generatePdf()
    },
    onProgress (data) {
      this.timeLoading = data
      if (data === 100) {
        this.visibleLoading = false
        this.timeLoading = 0
      }
    },
    /**
     * All Material Suppliers
     */
    getMaterialSuppliers (value, update) {
      this.$services.getData(['material-suppliers'], {
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
     * All CLient
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
     * All CLient
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
    selectedProvider (data) {
      this.guide.material_supplier_id = data.id
      this.guide.document_number = data.document_number
      this.guide.material_supplier_name = data.name
      this.guide.serie_number = data.serie_number
    },
    selectedClient (data) {
      this.guide.client_id = data.id
      this.guide.client_document_number = data.document_number
    },
    onDone (data) {
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
      Object.assign(this.guide, objectData)
      this.openQr = false
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
    clear () {
      this.guide = {}
      this.resetValidations(this.$refs.deliveryNote)
    },
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
<style type="text/css">
  .signature, .seal {
    width: 130px;
    height: 85px;
  }
  .logo {
    width: 95px;
    height: 95px;
  }
  html { font-family:Calibri, Arial, Helvetica, sans-serif; font-size:11pt; background-color:white }
  a.comment-indicator:hover + div.comment { background:#ffd; position:absolute; display:block; border:1px solid black; padding:0.5em }
  a.comment-indicator { background:red; display:inline-block; border:1px solid black; width:0.5em; height:0.5em }
  div.comment { display:none }
  table { border-collapse:collapse; page-break-after:always }
  .gridlines td { border:1px dotted black }
  .gridlines th { border:1px dotted black }
  .b { text-align:center }
  .e { text-align:center }
  .f { text-align:right }
  .inlineStr { text-align:left }
  .n { text-align:right }
  .s { text-align:left }
  td.style0 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style0 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style1 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style1 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style2 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style2 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style3 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style3 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style4 { vertical-align:middle; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style4 { vertical-align:middle; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style5 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style5 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style6 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style6 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style7 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style7 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style8 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style8 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style9 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style9 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style10 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style10 { vertical-align:bottom; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style11 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style11 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style12 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style12 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style13 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style13 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style14 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style14 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style15 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style15 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style16 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style16 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style17 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style17 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style18 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style18 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style19 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style19 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style20 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style20 { vertical-align:bottom; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style21 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style21 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style22 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style22 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style23 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#D9E2F3 }
  th.style23 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#D9E2F3 }
  td.style24 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  th.style24 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  td.style25 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  th.style25 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  td.style26 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  th.style26 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:8pt; background-color:#FFFFFF }
  td.style27 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style27 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style28 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style28 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style29 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style29 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style30 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style30 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style31 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style31 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style32 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style32 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style33 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style33 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style34 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style34 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style35 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style35 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style36 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style36 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style37 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style37 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style38 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style38 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style39 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style39 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style40 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style40 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style41 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style41 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style42 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style42 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style43 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style43 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style44 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style44 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style45 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style45 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style46 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style46 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style47 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style47 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style48 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style48 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style49 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style49 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style50 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style50 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style51 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style51 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style52 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style52 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style53 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style53 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style54 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style54 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style55 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style55 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style56 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style56 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style57 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style57 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style58 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style58 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style59 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style59 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style60 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style60 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style61 { vertical-align:top; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style61 { vertical-align:top; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style62 { vertical-align:top; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style62 { vertical-align:top; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style63 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style63 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style64 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style64 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style65 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style65 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style66 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style66 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style67 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style67 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style68 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style68 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style69 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style69 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style70 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style70 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style71 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style71 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style72 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style72 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style73 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style73 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#2B67AF; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style74 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style74 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style75 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style75 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style76 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  th.style76 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#D9E2F3 }
  td.style77 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style77 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style78 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style78 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style79 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style79 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style80 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10.5pt; background-color:#FFFFFF }
  th.style80 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10.5pt; background-color:#FFFFFF }
  td.style81 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style81 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style82 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#E2EEDA }
  th.style82 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#E2EEDA }
  td.style83 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style83 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style84 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#E2EEDA }
  th.style84 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#E2EEDA }
  td.style85 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style85 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style86 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style86 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style87 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style87 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style88 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style88 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style89 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style89 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style90 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style90 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style91 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style91 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style92 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style92 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style93 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style93 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style94 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style94 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style95 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style95 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style96 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style96 { vertical-align:middle; text-align:center; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style97 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style97 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style98 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style98 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style99 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style99 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style100 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri (Cuerpo)_x0000_'; font-size:11pt; background-color:#FFFFFF }
  th.style100 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri (Cuerpo)_x0000_'; font-size:11pt; background-color:#FFFFFF }
  td.style101 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#FF0000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style101 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#FF0000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style102 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#FF0000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style102 { vertical-align:middle; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#FF0000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style103 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style103 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style104 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  th.style104 { vertical-align:bottom; text-align:center; border-bottom:none #000000; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#70AD47; font-family:'Calibri'; font-size:16pt; background-color:#FFFFFF }
  td.style105 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style105 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style106 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  th.style106 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:none #000000; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#FFFFFF }
  td.style107 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style107 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style108 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style108 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style109 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style109 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style110 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  th.style110 { vertical-align:bottom; border-bottom:none #000000; border-top:none #000000; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#FFFFFF }
  td.style111 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style111 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style112 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style112 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style113 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style113 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style114 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style114 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style115 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style115 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style116 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style116 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style117 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style117 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style118 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style118 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style119 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style119 { vertical-align:top; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style120 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style120 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style121 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style121 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style122 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  th.style122 { vertical-align:top; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:#FFFFFF }
  td.style123 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  th.style123 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:11pt; background-color:white }
  td.style124 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style124 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style125 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style125 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style126 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style126 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style127 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style127 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style128 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style128 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style129 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style129 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style130 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style130 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style131 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style131 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style132 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style132 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style133 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style133 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style134 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style134 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style135 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style135 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style136 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  th.style136 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  td.style137 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  th.style137 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  td.style138 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  th.style138 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:12pt; background-color:#E2EEDA }
  td.style139 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style139 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style140 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style140 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style141 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style141 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style142 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style142 { vertical-align:bottom; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style143 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style143 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style144 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style144 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style145 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style145 { vertical-align:middle; text-align:left; padding-left:0px; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style146 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style146 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:1px solid #7F7F7F !important; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style147 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style147 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:none #000000; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  td.style148 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  th.style148 { vertical-align:bottom; text-align:center; border-bottom:1px solid #7F7F7F !important; border-top:1px solid #7F7F7F !important; border-left:none #000000; border-right:1px solid #7F7F7F !important; font-weight:bold; color:#000000; font-family:'Calibri'; font-size:10pt; background-color:#E2EEDA }
  table.sheet0 col.col0 { width:16.26666648pt }
  table.sheet0 col.col1 { width:16.26666648pt }
  table.sheet0 col.col2 { width:21.01111087pt }
  table.sheet0 col.col3 { width:28.46666634pt }
  table.sheet0 col.col4 { width:16.26666648pt }
  table.sheet0 col.col5 { width:25.75555526pt }
  table.sheet0 col.col6 { width:16.26666648pt }
  table.sheet0 col.col7 { width:9.48888878pt }
  table.sheet0 col.col8 { width:16.26666648pt }
  table.sheet0 col.col9 { width:16.26666648pt }
  table.sheet0 col.col10 { width:16.26666648pt }
  table.sheet0 col.col11 { width:16.26666648pt }
  table.sheet0 col.col12 { width:16.26666648pt }
  table.sheet0 col.col13 { width:23.72222195pt }
  table.sheet0 col.col14 { width:38.63333289pt }
  table.sheet0 col.col15 { width:6.7777777pt }
  table.sheet0 col.col16 { width:16.26666648pt }
  table.sheet0 col.col17 { width:27.1111108pt }
  table.sheet0 col.col18 { width:16.26666648pt }
  table.sheet0 col.col19 { width:16.26666648pt }
  table.sheet0 col.col20 { width:16.26666648pt }
  table.sheet0 col.col21 { width:16.26666648pt }
  table.sheet0 col.col22 { width:26.43333303pt }
  table.sheet0 col.col23 { width:16.26666648pt }
  table.sheet0 tr { height:15pt }
  table.sheet0 tr.row0 { height:21pt }
  table.sheet0 tr.row2 { height:15pt }
  table.sheet0 tr.row4 { height:10.5pt }
  table.sheet0 tr.row6 { height:6.75pt }
  table.sheet0 tr.row7 { height:15.75pt }
  table.sheet0 tr.row8 { height:15pt }
  table.sheet0 tr.row9 { height:6pt }
  table.sheet0 tr.row10 { height:15.75pt }
  table.sheet0 tr.row11 { height:16.5pt }
  table.sheet0 tr.row12 { height:6pt }
  table.sheet0 tr.row13 { height:14.25pt }
  table.sheet0 tr.row14 { height:5.25pt }
  table.sheet0 tr.row15 { height:19.5pt }
  table.sheet0 tr.row16 { height:18.75pt }
  table.sheet0 tr.row17 { height:15pt }
  table.sheet0 tr.row18 { height:18pt }
  table.sheet0 tr.row19 { height:5.25pt }
  table.sheet0 tr.row20 { height:16.5pt }
  table.sheet0 tr.row21 { height:18.75pt }
  table.sheet0 tr.row22 { height:15pt }
  table.sheet0 tr.row23 { height:15pt }
  table.sheet0 tr.row24 { height:9pt }
  table.sheet0 tr.row25 { height:8.25pt }
  table.sheet0 tr.row26 { height:18pt }
  table.sheet0 tr.row29 { height:24pt }
  table.sheet0 tr.row30 { height:5.25pt }
  table.sheet0 tr.row31 { height:16.5pt }
  table.sheet0 tr.row33 { height:17.25pt }
  table.sheet0 tr.row34 { height:20.25pt }
  table.sheet0 tr.row35 { height:32.25pt }
  table.sheet0 tr.row36 { height:18pt }
  table.sheet0 tr.row42 { height:14.25pt }
  table.sheet0 tr.row45 { height:12pt }
  table.sheet0 tr.row46 { height:7.5pt }
</style>
