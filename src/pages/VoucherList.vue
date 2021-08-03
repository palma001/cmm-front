<template>
  <q-page class="flex-start q-pa-md">
    <div class="row q-pa-xs">
        <div class="col-8">
          <h7>Comprobantes Facturas - Notas (crédito y débito) - Boletas - Anulaciones</h7>
        </div>
        <div class="col-4">
          <q-btn color="primary" icon="control_point" label="Nuevo" no-caps glossy/>
          <q-btn-dropdown
            splits
            color="primary"
            push
            glossy
            no-caps
            icon="text_snippet"
            label="Reporte de Pagos"
            @click="onMainClick"
            class="q-ml-md"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section avatar>
                  <q-avatar icon="description" color="primary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Generar Reporte</q-item-label>
                  <q-item-label caption>February 22, 2016</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="info" color="amber" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section avatar>
                  <q-avatar icon="file_download" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Descargar Hoja de Cálculo</q-item-label>
                  <q-item-label caption>February 22, 2016</q-item-label>
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
      <q-table
        title="Comprobantes"
        :data="data"
        :columns="columns"
        row-key="name"
        :visible-columns="visibleColumns"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">Comprobantes</div>

          <q-space />

          <div v-if="$q.screen.gt.xs" class="col">
            <q-toggle v-model="visibleColumns" val="Notas C/D" label="Notas C/D" />
            <q-toggle v-model="visibleColumns" val="Usuario" label="Usuario" />
            <q-toggle v-model="visibleColumns" val="T. Exportación" label="T. Exportación" />
            <q-toggle v-model="visibleColumns" val="T. Gratuito" label="T. Gratuito" />
            <q-toggle v-model="visibleColumns" val="T. Inafecto" label="T. Inafecto" />
            <q-toggle v-model="visibleColumns" val="T. Exonerado" label="T. Exonerado" />
            <q-toggle v-model="visibleColumns" val="F. Vencimiento" label="F. Vencimiento" />
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

          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </template>

      </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      visibleColumns: ['desc', 'SOAP', 'client', 'number', 'state', 'coin', 'tGravado', 'tIgv', 'total', 'saldo', 'ordenCompra', 'download', 'actions'],
      columns: [
        {
          name: 'desc',
          required: true,
          label: '#',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'SOAP', align: 'center', label: 'Soap', field: 'soap', sortable: true },
        { name: 'date', label: 'Fecha', field: 'date', sortable: true },
        { name: 'client', label: 'Cliente', field: 'client' },
        { name: 'number', label: 'Número', field: 'number' },
        { name: 'state', label: 'Estado', field: 'state' },
        { name: 'coin', label: 'Moneda', field: 'coin', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'tGravado', label: 'T. Gravado', field: 'tGravado', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'tIgv', label: 'T. Igv', field: 'tIgv', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'total', label: 'Total', field: 'total', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'saldo', label: 'Saldo', field: 'saldo', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'ordenCompra', label: 'Orden de Compra', field: 'ordenCompra', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'download', label: 'Descargas', field: 'download' },
        { name: 'actions', label: 'Acciones', field: 'actions' }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ],
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
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
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
  methods: {
    open (position) {
      this.position = position
      this.dialog = true
    }
  }
}
</script>
