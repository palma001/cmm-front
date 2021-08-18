<template>
    <q-page class="flex-start q-pa-md">
        <h6>Nueva Guía de Remisión</h6>
        <div class= "row q-col-gutter-xs" >
            <div class="col-2">
                <q-select outlined v-model="model" :options="options" label="Establecimiento" dense/>
            </div>
            <div class="col-2">
                <q-select outlined v-model="model" :options="serie" label="Serie" dense/>
            </div>
            <div class="col-2">
                 <q-input outlined v-model="date" type="date" label="Fecha de emisión"  dense/>
            </div>
            <div class="col-2">
                <q-input outlined v-model="date" type="date" label="Fecha de traslado"  dense/>
            </div>
            <div class="col-4">
                 <q-input outlined v-model="text" label="Cliente" dense />
            </div>
        </div>
        <br>
        <div class= "row q-col-gutter-xs" >
            <div class="col-2">
                <q-select outlined v-model="model" :options="mode" label="Modo de traslado" dense/>
            </div>
            <div class="col-4">
                <q-select outlined v-model="model" :options="reason" label="Motivo de traslado" dense/>
            </div>
            <div class="col-6">
                <q-input outlined v-model="text" label="Descripción motivo de traslado" dense />
            </div>
        </div>
        <br>
         <div class= "row q-col-gutter-xs" >
            <div class="col-2">
                <q-select outlined v-model="model" :options="unit" label="Unidad de medidad" dense/>
            </div>
            <div class="col-2">
                <q-input outlined v-model="text" label="Peso total" dense type="number"/>
            </div>
            <div class="col-2">
                <q-input outlined v-model="text" label="Número de paquetes" dense type="number" />
            </div>
            <div class="col-6">
                <q-input outlined v-model="text" label="Observaciones" dense />
            </div>
        </div>
        <q-separator/>
        <h6>Datos envío</h6>
        <div>Dirección de partida</div>
        <div class="row">
            <div class="col-3">
                <q-select outlined v-model="model" :options="country" label="País" dense/>
            </div>
            <div class="col-3">
                <q-select outlined v-model="model" :options="ubigeo" label="Ubigeo" dense/>
            </div>
            <div class="col-6">
                <q-input outlined v-model="text" label="Dirección" dense />
            </div>
        </div>
        <div>Dirección de llegada</div>
        <div class="row">
            <div class="col-3">
                <q-select outlined v-model="model" :options="country" label="País" dense/>
            </div>
            <div class="col-3">
                <q-select outlined v-model="model" :options="ubigeo" label="Ubigeo" dense/>
            </div>
            <div class="col-6">
                <q-input outlined v-model="text" label="Dirección" dense />
            </div>
        </div>
        <h6>Datos transportista</h6>
        <div class="row">
            <div class="col-4">
                <q-select outlined v-model="model" :options="idType" label="Tipo Doc. identidad" dense/>
            </div>
            <div class="col-4">
                <q-input outlined v-model="text" label="Número" dense />
            </div>
            <div class="col-4">
                <q-input outlined v-model="text" label="Nombre y/o razón social" dense />
            </div>
        </div>
         <h6>Datos del conductor</h6>
        <div class="row">
            <div class="col-4">
                <q-select outlined v-model="model" :options="idType" label="Tipo Doc. identidad" dense/>
            </div>
            <div class="col-4">
                <q-input outlined v-model="text" label="Número" dense />
            </div>
            <div class="col-4">
                <q-input outlined v-model="text" label="Nombre y/o razón social" dense />
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-4">
                <q-select outlined v-model="model" :options="idType" label="Licencia del Conductor" dense/>
            </div>
            <div class="col-4">
                <q-input outlined v-model="text" label="N° de placa semirremolque" dense />
            </div>
            <div class="col-4">
            </div>
        </div>
        <br>
        <!-- <q-btn
          color="primary"
          icon="control_point"
          label="Agregar Producto"
          no-caps
          glossy
        /> -->
        <q-table
            title="Treats"
            :data="dataProducts"
            :columns="columsProducts"
            row-key="id"
            :filter="filter"
            :loading="loading"
        >

            <template v-slot:top>
                <q-btn
                    color="primary"
                    icon="control_point"
                    label="Agregar Producto"
                    no-caps
                    glossy
                    @click="addRow"
                    />
                <!-- <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" /> -->
                <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />
                <q-space />
                <q-input borderless dense debounce="300" color="primary" v-model="filter">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>

        </q-table>
    </q-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      filter: '',
      rowCount: 10,
      columsProducts: [
        {
          name: 'desc',
          required: true,
          label: '#',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'unit', align: 'center', label: 'Unidad', field: 'unit', sortable: true },
        { name: 'description', align: 'center', label: 'Descripción', field: 'description', sortable: true },
        { name: 'cant', align: 'center', label: 'Cantidad', field: 'cant', sortable: true }
      ],
      dataProducts: [
        {
          name: '1',
          unit: 'Lts',
          description: 'Aceite de motor 20/50',
          cant: 1
        },
        {
          name: '2',
          unit: 'Kg',
          description: 'Tornilos 1/2"',
          cant: 1
        },
        {
          name: '3',
          unit: 'Lts',
          description: 'Aceite de motor 20/50',
          cant: 1
        }
      ],
      date: '',
      model: null,
      options: [
        'No hay datos', '', '', '', ''
      ],
      series: [
        'No hay datos', '', '', '', ''
      ],
      mode: [
        'No hay datos', '', '', '', ''
      ],
      reason: [
        'No hay datos', '', '', '', ''
      ],
      unit: [
        'No hay datos', '', '', '', ''
      ]
    }
  },
  methods: {
    // emulate fetching data from server
    addRow () {
      this.loading = true
      setTimeout(() => {
        const
          index = Math.floor(Math.random() * (this.data.length + 1)),
          row = this.original[Math.floor(Math.random() * this.original.length)]
        if (this.data.length === 0) {
          this.rowCount = 0
        }
        row.id = ++this.rowCount
        const addRow = { ...row } // extend({}, row, { name: `${row.name} (${row.__count})` })
        this.data = [...this.data.slice(0, index), addRow, ...this.data.slice(index)]
        this.loading = false
      }, 500)
    },

    removeRow () {
      this.loading = true
      setTimeout(() => {
        const index = Math.floor(Math.random() * this.data.length)
        this.data = [...this.data.slice(0, index), ...this.data.slice(index + 1)]
        this.loading = false
      }, 500)
    }
  }
}

</script>
