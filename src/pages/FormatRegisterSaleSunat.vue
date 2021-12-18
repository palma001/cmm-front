<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-3" style="max-width: 300px">
        <q-input v-model="from" mask="date" :rules="['date']" dense outlined>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="from">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat @click="getDataExport"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-3" style="max-width: 300px">
        <q-input v-model="to" mask="date" :rules="['date']" dense outlined>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="to">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat @click="getDataExport"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4">
        <excel-report :data="data"/>
      </div>
      <div class="col-12">
        <q-table
          title="Treats"
          :data="data"
          :columns="columns"
          row-key="name"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import ExcelReport from '../components/ExcelReport.vue'
import { date } from 'quasar'
export default {
  // name: 'PageName',
  components: {
    ExcelReport
  },
  data () {
    return {
      billingConfig: null,
      from: null,
      to: null,
      loadingTable: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Número correlativo del registro o código unico de la operación',
          align: 'left',
          field: row => row.id,
          sortable: true
        },
        {
          label: 'Fecha de emisión del comprobante de pago o documento',
          align: 'center',
          name: 'created_at',
          field: row => this.dateFormats(row.created_at),
          sortable: true
        },
        {
          label: 'Fecha de vencimiento y/o pago',
          align: 'center',
          name: 'expiration_date',
          field: row => row.expiration_date,
          sortable: true
        },
        {
          label: 'Tipo',
          align: 'center',
          name: 'voucher_type_number',
          field: row => row.voucher_type.number,
          sortable: true
        },
        {
          label: 'Nº Serie',
          align: 'center',
          name: 'serie_name',
          field: row => row.serie.name,
          sortable: true
        },
        {
          label: 'Número',
          align: 'center',
          name: 'number',
          field: row => row.number,
          sortable: true
        },
        {
          label: 'Documento',
          align: 'center',
          name: 'client_document__number',
          field: row => row.client.document_number,
          sortable: true
        },
        {
          label: 'Apellidos y nombres',
          align: 'center',
          name: 'full_name',
          field: row => `${row.client.name} ${row.client.last_name}`,
          sortable: true
        },
        {
          label: 'Base imponible de la operación gravada',
          align: 'center',
          name: 'total_bill',
          field: row => row.total_bill,
          sortable: true
        },
        {
          label: 'IGV Y/O IPM',
          align: 'center',
          name: 'total_igv',
          field: row => row.total_igv,
          sortable: true
        },
        {
          label: 'Importe total del comprobante de pago',
          align: 'center',
          name: 'total',
          field: row => row.total,
          sortable: true
        }
      ],
      data: []
    }
  },
  computed: {
    dateFormat () {
      return date.formatDate(new Date(), 'DD-M-YYYY')
    }
  },
  methods: {
    async getDataExport () {
      const params = {
        dateFilter: {
          to: this.to,
          from: this.from,
          field: 'created_at'
        }
      }
      this.$services.getData(['bill-electronics'], params)
        .then(({ res }) => {
          this.data = res.data
        })
    },
    dateFormats (data) {
      if (data) {
        return date.formatDate(data, 'DD-M-YYYY')
      }
    }
  }
}
</script>
