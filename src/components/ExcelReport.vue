<template>
  <div>
    <q-btn-dropdown color="orange" label="Descargas" icon="download">
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick('xlsx')">
          <q-item-section>
            <q-item-label>Excel</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="downloadPDF">
          <q-item-section>
            <q-item-label>PDF</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1000"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      :pdf-format="format"
      :pdf-orientation="orientation"
      pdf-content-width="100%"
      ref="html2Pdf"
    >
      <section slot="pdf-content" class="text-uppercase text-dark">
        <pdf-print :title="title" :dateNow="Date()">
          <template v-slot:content>
            <table style="width: 100%; border-collapse: collapse; border-spacing: 0; font-size: 10px;">
              <slot name="table"></slot>
            </table>
            <div style="font-size: 10px;">
              <slot name="footer"></slot>
            </div>
          </template>
        </pdf-print>
      </section>
    </vue-html2pdf>
    <table border="2" v-if="tableRow" ref="tbl_export_table_to_xls">
      <slot name="table"></slot>
    </table>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { date } from 'quasar'
import VueHtml2pdf from 'vue-html2pdf'
import PdfPrint from '../components/PdfPrint.vue'
export default {
  components: {
    VueHtml2pdf,
    PdfPrint
  },
  props: {
    format: {
      type: String,
      default: 'a4'
    },
    orientation: {
      type: String,
      default: 'portrait'
    },
    data: {
      type: Array,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      tableRow: false
    }
  },
  methods: {
    downloadPDF () {
      this.$refs.html2Pdf.generatePdf()
    },
    formatDate (newDate) {
      return date.formatDate(newDate, 'DD-MM-YYYY')
    },
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
        return dl ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) : XLSX.writeFile(wb, fn || ('Formato 14.1.' + (type || 'xlsx')))
      }, 20)
    }
  }
}
</script>
