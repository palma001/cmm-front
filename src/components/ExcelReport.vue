<template>
  <div>
    <table ref="tbl_export_table_to_xls" border="2">
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
        <tr>
          <th>01</th>
          <td>05-12-2021</td>
          <td></td>
          <td>01</td>
          <td>F001</td>
          <td>0000001</td>
          <td>6</td>
          <td>20603007868</td>
          <td>DOMITEC SAC</td>
          <td></td>
          <td>100</td>
          <td></td>
          <td></td>
          <td></td>
          <td>18</td>
          <td></td>
          <td>118</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <q-btn color="teal" @click="exportToExcel('xlsx')"/>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  methods: {
    exportToExcel (type, fn, dl) {
      var elt = this.$refs.tbl_export_table_to_xls
      var wb = XLSX.utils.table_to_book(elt, { sheet: 'sheet1' })
      return dl ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) : XLSX.writeFile(wb, fn || ('Formato 8.1.' + (type || 'xlsx')))
    }
  }
}
</script>
