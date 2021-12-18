<template>
  <div>
    <q-btn-dropdown color="primary" label="Tipo de archivo">
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick('xlsx')">
          <q-item-section>
            <q-item-label>Excel</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="onItemClick('txt')">
          <q-item-section>
            <q-item-label>Text</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <table border="2" v-if="tableRow" ref="tbl_export_table_to_xls">
      <thead>
        <tr>
          <th rowspan="3">Número correlativo del registro o código unico de la operación</th>
          <th rowspan="3">Fecha de emisión del comprobante de pago o documento</th>
          <th rowspan="3">Fecha de vencimiento y/o pago</th>
          <th colspan="3">Comprobante de pago o documento</th>
          <th colspan="3">Información del cliente</th>
          <th rowspan="3">Valor facturado de la exportación</th>
          <th rowspan="3">Base imponible de la operación gravada</th>
          <th colspan="2">Importe total de la operación exonerada o inafecta</th>
          <th rowspan="3">ISC</th>
          <th rowspan="3">IGV Y/O IPM</th>
          <th rowspan="3">Otros tributos y cargos que no forman parte de la base imponible</th>
          <th rowspan="3">Importe total del comprobante de pago</th>
          <th rowspan="3">Tipo de cambio</th>
          <th colspan="4">Referencia del comprobante de pago o documento original que se modifica</th>
        </tr>
        <tr>
          <th rowspan="2">Tipo</th>
          <th rowspan="2">Nº Serie</th>
          <th rowspan="2">Número</th>
          <th colspan="2">Documento</th>
          <th rowspan="2">Apellidos y nombres</th>
          <th rowspan="2">Exonerada</th>
          <th rowspan="2">Inafecta</th>
          <th rowspan="2">Fecha</th>
          <th rowspan="2">Tipo</th>
          <th rowspan="2">Serie</th>
          <th rowspan="2">Nº del comprobante</th>
        </tr>
        <tr>
          <th>Tipo</th>
          <th>Número</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in data" :key="d.id">
          <th>{{ d.id }}</th>
          <td>{{ d.created_at }}</td>
          <td>{{ d.expiration_date }}</td>
          <td>{{ d.voucher_type.number }}</td>
          <td>{{ d.serie.name }}</td>
          <td>{{ d.number }}</td>
          <td>{{ d.client.document_type.number }}</td>
          <td>{{  d.client.document_number }}</td>
          <td>{{ `${d.client.name} ${d.client.last_name}` }}</td>
          <td></td>
          <td>{{ d.total_bill }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ d.total_igv }}</td>
          <td></td>
          <td>{{ d.total }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  props: {
    data: {
      type: [],
      require: true
    }
  },
  data () {
    return {
      tableRow: false
    }
  },
  methods: {
    // exportToExcel (type, fn, dl) {
    //   var elt = this.$refs.tbl_export_table_to_xls
    //   var wb = XLSX.utils.table_to_book(elt, { sheet: 'sheet1' })
    //   return dl ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) : XLSX.writeFile(wb, fn || ('Formato 8.1.' + (type || 'xlsx')))
    // }
    onItemClick (type, fn, dl) {
      this.tableRow = true
      setTimeout(() => {
        var elt = this.$refs.tbl_export_table_to_xls
        var wb = XLSX.utils.table_to_book(elt, { sheet: 'sheet1' })
        this.tableRow = false
        return dl ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) : XLSX.writeFile(wb, fn || ('Formato 8.1.' + (type || 'xlsx')))
      }, 20)
    }
  }
}
</script>
