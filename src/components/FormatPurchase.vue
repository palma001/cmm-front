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
          <td rowspan="3">Número correlativo del registro o código unico de la operación</td>
          <td rowspan="3">Fecha de emisión del comprobante de pago o documento</td>
          <td rowspan="3">Fecha de vencimiento y/o pago</td>
          <td colspan="3">Comprobante de pago o documento</td>
          <td colspan="3">Información del cliente</td>
          <td rowspan="3">Valor facturado de la exportación</td>
          <td rowspan="3">Base imponible de la operación gravada</td>
          <td colspan="2">Importe total de la operación exonerada o inafecta</td>
          <td rowspan="3">ISC</td>
          <td rowspan="3">IGV Y/O IPM</td>
          <td rowspan="3">Otros tributos y cargos que no forman parte de la base imponible</td>
          <td rowspan="3">Importe total del comprobante de pago</td>
          <td rowspan="3">Tipo de cambio</td>
          <td colspan="4">Referencia del comprobante de pago o documento original que se modifica</td>
        </tr>
        <tr>
          <td rowspan="2">Tipo</td>
          <td rowspan="2">Nº Serie</td>
          <td rowspan="2">Número</td>
          <td colspan="2">Documento</td>
          <td rowspan="2">Apellidos y nombres</td>
          <td rowspan="2">Exonerada</td>
          <td rowspan="2">Inafecta</td>
          <td rowspan="2">Fecha</td>
          <td rowspan="2">Tipo</td>
          <td rowspan="2">Serie</td>
          <td rowspan="2">Nº del comprobante</td>
        </tr>
        <tr>
          <td>Tipo</td>
          <td>Número</td>
        </tr>
      </thead>
      <tbody>
        <tr class="row3" v-for="d in data" :key="d.id">
          <td>{{ d.id }}</td>
          <td>{{ d.created_at }}</td>
          <td>{{ d.expiration_date }}</td>
          <td>{{ d.voucher_type.number }}</td>
          <td>{{ d.serie }}</td>
          <td>{{ d.number }}</td>
          <td>{{ d.provider.document_type.number }}</td>
          <td>{{  d.provider.document_number }}</td>
          <td>{{ `${d.provider.name} ${d.provider.last_name}` }}</td>
          <td></td>
          <td>{{ d.subtotal }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ d.total_igv }}</td>
          <td></td>
          <td>{{ d.total }}</td>
          <td>{{ d.exchange_rate }}</td>
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
