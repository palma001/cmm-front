<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-right">
        <q-btn
          color="primary"
          icon="control_point"
          label="Nuevo"
          no-caps
          glossy
          @click="$router.push({ name: 'billing' })"
        />
        <!-- <q-btn-dropdown
          splits
          color="primary"
          push
          glossy
          no-caps
          icon="monetization_on"
          label="Reporte de Pagos"
          class="q-ml-md"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="insert_drive_file" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Generar reporte</q-item-label>
                <q-item-label caption>Agosto 01, 2021</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="file_download" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Descargar hoja de cálculo</q-item-label>
                <q-item-label caption>Agosto 01, 2021</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="billing"
          searchable
          :column="billingConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
          @downloadXML="downloadXML"
          @downloadPDF="downloadPDF"
          @downloadCDR="downloadCDR"
          @viewPayment="viewPayment"
          @search-data="searchData"
          @viewNote="viewNote"
        />
      </div>
    </div>
    <div class="q-pa-md">
      <!-- <q-btn label="Filtro de Búsquedas" icon="keyboard_arrow_right" color="primary" @click="open('right')" />
      <q-dialog v-model="dialog" :position="position" seamless>
        <q-card class="column full-height" style="width: 450px">
          <q-toolbar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar>

            <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section class="col scroll">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select outlined v-model="voucherType" :options="voucherTypes" label="Tipo de comprobante" dense />
                </div>
                <div class="col-6">
                  <q-select outlined v-model="serie" :options="series" label="Serie" dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-input outlined v-model="text" label="Número" dense/>
                </div>
                <div class="col-6">
                  <q-select outlined v-model="client" :options="clients" label="Clientes" dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha inicio" dense/>
                </div>
                <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha término" dense/>
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-select outlined v-model="product" :options="products" label="Productos" dense />
              </div>
              <div class="col-6">
                  <q-select outlined v-model="category" :options="categories" label="Categoria" dense />
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-input v-model="date" filled type="date" hint="Fecha de emisión" dense />
                </div>
                <div class="col-6">
                  <q-select rounded v-model="state" :options="states" label="Estado"  dense />
                </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                  <q-input outlined v-model="text" label="Orden de compra" dense/>
              </div>
              <div class="col-6">
                <q-toggle v-model="dense" label="Pendiente de pago" />
              </div>
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-actions align="center">
            <q-btn color="primary" icon="search" label="Buscar" no-caps glossy/>
            <q-btn color="primary" icon="highlight_off" label="Limpiar" no-caps glossy/>
          </q-card-actions>
        </q-card>
      </q-dialog> -->
    </div>
    <!-- Ventana Modal para el botón OPCIONES por cada registro de Comprobante-->
    <q-dialog v-model="option">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Comprobante: F0001-34</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>La factura F001-34, ha sido aceptada</div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir A4" stack glossy color="primary" no-caps dense/>
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir Ticket 80 mm" stack glossy color="primary" no-caps dense/>
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir Ticket 50 mm" stack glossy color="primary" no-caps dense />
            </div>
            <div class="col-3">
              <q-btn icon="print" class="full-width" label="Imprimir A5" stack glossy color="primary" no-caps dense />
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-8">
              <q-input outlined v-model="text" label="email" dense/>
            </div>
           <div class="col-4">
              <q-btn color="primary" icon-right="mail" label="Enviar" no-caps/>
            </div>
          </div>
          <br>
          <div class="row q-col-gutter-sm">
            <div class="col-2">
              <q-input outlined v-model="text" label="Cód." dense/>
            </div>
            <div class="col-6">
              <q-input outlined v-model="text" label="teléfono" dense/>
            </div>
            <div class="col-4">
              <q-btn color="primary" icon="smartphone" label="Enviar" no-caps/>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Ventana Modal para el botón PAGOS por cada registro de Comprobante-->
    <q-dialog v-model="pay">
      <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Pagos del comprobante: F001-34</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
        <q-space />
        <div class="row">
          <div class="col-8">
          </div>
          <div class="col-2">
            TOTAL A PAGAR
          </div>
          <div class="col-2">
            50.000,00
          </div>
        </div>
        <q-separator/>
        <q-space/>
        <div class="row">
          <div class="col-8">
          </div>
          <div class="col-2">
            TOTAL PAGADO
          </div>
          <div class="col-2">
            30.000,00
          </div>
        </div>
        <q-separator/>
        <div class="row">
          <div class="col-8">
          </div>
          <div class="col-2">
            PENDIENTE DE PAGO
          </div>
          <div class="col-2">
            20.000,00
          </div>
        </div>
        <q-separator/>
        <br>
         <q-btn
          color="primary"
          icon="control_point"
          label="Nuevo"
          no-caps
          glossy
        />
        <q-table
            :data="dataPay"
            :columns="columsPay"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="desc" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="paymentDate" :props="props">
                  <q-input v-model="date" filled type="date" dense/>
                </q-td>
                <q-td key="paymentMethod" :props="props">
                  <q-select outlined v-model="model" :options="paymentMethods" label="Seleccionar" dense/>
                </q-td>
                <q-td key="destiny" :props="props">
                  <q-select outlined v-model="model" :options="destinations" label="Seleccionar" dense/>
                </q-td>
                <q-td key="reference" :props="props">
                  <q-input outlined v-model="text" label="Referencia" dense />
                </q-td>
                <q-td key="archive" :props="props">
                  <q-file
                    :value="files"
                    @input="updateFiles"
                    label="Seleccionar archivo"
                    outlined
                    multiple
                    :clearable="!isUploading"
                    style="max-width: 400px"
                    dense
                  >
                    <template v-slot:file="{ index, file }">
                      <q-chip
                        class="full-width q-my-xs"
                        :removable="isUploading && uploadProgress[index].percent < 1"
                        square
                        @remove="cancelFile(index)"
                      >
                        <q-linear-progress
                          class="absolute-full full-height"
                          :value="uploadProgress[index].percent"
                          :color="uploadProgress[index].color"
                          track-color="grey-2"
                        />

                        <q-avatar>
                          <q-icon :name="uploadProgress[index].icon" />
                        </q-avatar>

                        <div class="ellipsis relative-position">
                          {{ file.name }}
                        </div>

                        <q-tooltip>
                          {{ file.name }}
                        </q-tooltip>
                      </q-chip>
                    </template>

                    <template v-slot:after v-if="canUpload">
                      <q-btn
                        color="primary"
                        dense
                        icon="cloud_upload"
                        round
                        @click="upload"
                        :disable="!canUpload"
                        :loading="isUploading"
                      />
                    </template>
                  </q-file>
                </q-td>
                <q-td key="mount" :props="props">
                  <q-input outlined v-model="text" label="Monto" dense />
                </q-td>
                <q-td key="actions" :props="props" class="q-pa-md q-gutter-sm">
                  <q-btn round color="primary" glossy text-color="white" icon="add" size="xs" />
                  <q-btn round color="negative" glossy text-color="white" icon="delete" size="xs" />
                </q-td>
              </q-tr>
            </template>

          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { billingConfig } from '../config-file/billing/billingConfig.js'
import { mixins } from '../mixins'
import DataTable from '../components/DataTable.vue'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      loadingTable: false,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
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
          'client.name': '',
          'client.document_number': '',
          'coin.name': '',
          'voucherType.name': '',
          'operationType.name': '',
          'seller.name': '',
          'client.last_name': '',
          'seller.last_name': '',
          igv: '',
          created_at: '',
          expiration_date: ''
        }
      },
      archives: null,
      files: null,
      uploadProgress: [],
      uploading: null,
      text: '',
      billingConfig,
      visibleColumns: ['id', 'soap', 'dateEmission', 'dateExp', 'client', 'number', 'noteCd', 'state', 'user', 'coin', 'tGravado', 'tExportacion', 'tGratuita', 'tInafecta', 'tExonerado', 'tGravado', 'tIgv', 'total', 'saldo', 'ordenCompra', 'paid', 'downloads', 'actions'],
      data: [],
      dialog: false,
      position: 'top',
      model: null,
      date: '',
      dense: false,
      voucherType: '',
      serie: '',
      client: '',
      product: '',
      category: '',
      state: '',
      filter: '',
      option: true, // Variable que controla que se muestre la ventana de dialogo para Opciones
      pay: true, // Variable que controla que se muestre la ventana de dialogo para Pagos
      voucherTypes: [
        'Factura electrónica', 'Boleta de venta electrónica', 'Nota de credito', 'Nota de débito'
      ],
      series: [
        'Serie 1', 'Serie 2', 'Serie 3', 'Serie 4'
      ],
      clients: [
        '26.545.123 - Luis Salazar', '12.548.125 - Carlos Gonzaléz', '4.521.983 - Samantha Rodríguez', '12.256.123 - Carlos Alcala'
      ],
      products: [
        '0001 - Harina de trigo', '0002  - Arroz', '0003 - Harina de maíz', '0005 - Leche'
      ],
      categories: [
        'Alimentos', 'Cerraduras', 'HP', 'Pinturas'
      ],
      states: [
        'Registrado', 'Enviado', 'Aceptado', 'Observado', 'Rechazado', 'Anulado', 'Por anular'
      ],
      paymentMethods: [
        'Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Factura a 30 días', 'Tarjeta d ecrédito Visa', 'Contado contraentrega', 'A 30 días', 'Crédito', 'Contado'
      ],
      destinations: [
        'Banco de Crédito del Perú - PEN ', 'Caja General'
      ],
      columsPay: [
        {
          name: 'desc',
          required: true,
          label: '#',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'paymentDate', align: 'center', label: 'Fecha de Pago', field: 'paymentDate', sortable: true },
        { name: 'paymentMethod', align: 'center', label: 'Método de Pago', field: 'paymentMethod', sortable: true },
        { name: 'destiny', align: 'center', label: 'Destino', field: 'destiny', sortable: true },
        { name: 'reference', align: 'center', label: 'Referencia', field: 'reference', sortable: true },
        { name: 'archive', align: 'center', label: 'Archivo', field: 'archive' },
        { name: 'mount', align: 'center', label: 'Monto', field: 'mount' },
        { name: 'actions', align: 'center', label: 'Acciones', field: 'action' }
      ],
      dataPay: [
        {
          name: '1'
        },
        {
          name: '2'
        },
        {
          name: '3'
        }
      ]
    }
  },
  created () {
    this.getBillElectronics()
  },
  methods: {
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
      this.getBillElectronics(this.params)
    },
    downloadXML (data) {
      console.log(data)
    },
    downloadPDF (data) {
      console.log(data)
    },
    downloadCDR (data) {
      console.log(data)
    },
    viewPayment (data) {
      this.pay = true
    },
    viewNote (data) {
      this.$router.push({ name: 'CreditNote', params: { id: data.id } })
    },
    open (position) {
      this.position = position
      this.dialog = true
    },
    /**
     * Search category
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getBillElectronics()
    },
    /**
     * Get Bill electronis
     */
    getBillElectronics () {
      this.loadingTable = true
      this.$services.getData(['bill-electronics'], this.params)
        .then(({ res }) => {
          this.data = res.data.data
          this.loadingTable = false
          this.optionPagination.rowsNumber = res.data.total
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
