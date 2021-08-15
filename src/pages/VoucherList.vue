<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-pa-xs">
        <div class="col-8">
          <p>Comprobantes Facturas - Notas (crédito y débito) - Boletas - Anulaciones</p>
        </div>
        <div class="col-4">
          <q-btn
            color="primary"
            icon="control_point"
            label="Nuevo"
            no-caps
            glossy
            @click="$router.push({ name: 'billing' })"
          />
          <q-btn-dropdown
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
          </q-btn-dropdown>
        </div>
    </div>
    <div class="q-pa-md">
      <q-btn label="Filtro de Búsquedas" icon="keyboard_arrow_right" color="primary" @click="open('right')" />
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
      </q-dialog>
      <data-table
          title="list"
          module="billing"
          searchable
          action
          :column="billingConfig"
          :data="data"
          :loading="loadingTable"
          :optionPagination="optionPagination"
          @on-load-data="loadData"
        />
      <!-- <q-table
        title="Comprobantes"
        :data="data"
        :columns="columns"
        row-key="name"
        :visible-columns="visibleColumns"
        :filter="filter"
      >
        <template v-slot:top="props">
           <div class="row justify-end full-width">
            <div class="col-8">
              <div class="q-table__title">Comprobantes</div>
            </div>
            <div class="col-3">
              <q-input dense debounce="300" color="primary" v-model="filter">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md"
            />
            </div>
          </div>
          <div class="rows">
            <div v-if="$q.screen.gt.xs" class="col">
              <q-toggle v-model="visibleColumns" val="noteCd" label="Notas C/D" />
              <q-toggle v-model="visibleColumns" val="user" label="Usuario" />
              <q-toggle v-model="visibleColumns" val="tExportacion" label="T. Exportación" />
              <q-toggle v-model="visibleColumns" val="tGratuita" label="T. Gratuito" />
              <q-toggle v-model="visibleColumns" val="tInafecta" label="T. Inafecto" />
              <q-toggle v-model="visibleColumns" val="tExonerado" label="T. Exonerado" />
              <q-toggle v-model="visibleColumns" val="dateExp" label="F. Vencimiento" />
            </div>
            <q-select
              v-else
              v-model="visibleColumns"
              multiple
              borderless
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              style="min-width: 150px"
            />
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="soap" :props="props">
              {{ props.row.soap }}
            </q-td>
            <q-td key="dateEmission" :props="props">
              {{ props.row.dateEmission }}
            </q-td>
            <q-td key="dateExp" :props="props">
              {{ props.row.dateExp }}
            </q-td>
            <q-td key="client" :props="props">
              {{ props.row.client }}
            </q-td>
            <q-td key="number" :props="props">
              {{ props.row.number }}
            </q-td>
            <q-td key="noteCd" :props="props">
              {{ props.row.noteCd }}
            </q-td>
            <q-td key="state" :props="props">
              <q-badge color="green">
                {{ props.row.state }}
              </q-badge>
            </q-td>
            <q-td key="user" :props="props">
              {{ props.row.user }}
            </q-td>
            <q-td key="coin" :props="props">
              {{ props.row.coin }}
            </q-td>
            <q-td key="tExportacion" :props="props">
              {{ props.row.tExportacion }}
            </q-td>
            <q-td key="tGratuita" :props="props">
              {{ props.row.tGratuita }}
            </q-td>
            <q-td key="tInafecta" :props="props">
              {{ props.row.tInafecta }}
            </q-td>
            <q-td key="tExonerado" :props="props">
              {{ props.row.tExonerado }}
            </q-td>
            <q-td key="tGravado" :props="props">
              {{ props.row.tGravado }}
            </q-td>
            <q-td key="tIgv" :props="props">
              {{ props.row.tIgv }}
            </q-td>
            <q-td key="total" :props="props">
              {{ props.row.total }}
            </q-td>
            <q-td key="saldo" :props="props">
              {{ props.row.saldo }}
            </q-td>
            <q-td key="ordenCompra" :props="props">
              {{ props.row.ordenCompra }}
            </q-td>
            <q-td key="paid" :props="props">
              {{ props.row.paid }}
              <q-btn push color="primary" label="Pagos" size="12px" no-caps glossy/>
            </q-td>
            <q-td key="downloads" :props="props">
              {{ props.row.downloads }}
              <q-btn-dropdown
                splits
                color="primary"
                push
                glossy
                no-caps
                icon="file_download"
                label="Formato"
                class="q-ml-md"
                size="12px"
              >
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="file_download" color="secondary" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>XML</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="file_download" color="secondary" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>PDF</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="file_download" color="secondary" text-color="white" size="md" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>CDR</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
            <q-td key="actions" :props="props">
              {{ props.row.actions }}
              <q-btn-dropdown
                splits
                color="primary"
                push
                glossy
                no-caps
                icon="check"
                label="Acciones"
                class="q-ml-md"
                size="12px"
              >
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="clear" color="red" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Anular</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="edit" color="orange" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Nota</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="dehaze" color="orange" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Guía</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-avatar icon="chevron_right" color="primary" text-color="white" size="md"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Opciones</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </q-tr>
        </template>

      </q-table> -->
    </div>
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
          'client.name': ''
        }
      },
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
    open (position) {
      this.position = position
      this.dialog = true
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
