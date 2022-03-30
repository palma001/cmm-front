<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-form class="row q-gutter-sm" @submit="getData" @reset="onReset">
          <div class="col-3">
            <q-input type="date" hint="Desde" dense outlined v-model="from"/>
          </div>
          <div class="col-3">
            <q-input type="date" hint="Hasta" dense outlined v-model="to"/>
          </div>
          <div class="col-3 q-gutter-xs">
            <q-btn color="primary" icon="search" type="submit"/>
            <q-btn color="negative" icon="close" type="reset"/>
            <q-btn color="orange" icon="print" @click="downloadPDF"/>
          </div>
        </q-form>
      </q-card-section>
      <q-tabs
        v-model="tab"
        dense
        active-color="orange"
        indicator-color="orange"
        class="bg-primary text-white"
        align="justify"
      >
        <q-tab name="earningsLoses" label="estado de ganancia y perdidas" />
        <q-tab name="boxBalances" label="Determinacion de saldo de caja" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="earningsLoses">
          <div class="row q-col-gutter-md">
            <div class="col-sm-5 col-xs-12 col-md-5">
              <div class="text-h6">Ingresos Diversos</div>
              <q-list dense>
                <q-item clickable v-ripple v-for="concept in concepts.filter(element => element.concept_type === 'ingreso')" :key="concept.id">
                  <q-item-section>{{ concept.name }}</q-item-section>
                  <q-item-section side>{{ concept.total_entry }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable>
                  <q-item-section>Total</q-item-section>
                  <q-item-section side>{{ totalCalculate(concepts.filter(element => element.concept_type === 'ingreso'), 'total_entry') }}</q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-sm-6 col-xs-12 col-md-6">
              <div class="text-h6">Egresos</div>
              <q-list dense>
                <q-item clickable v-ripple v-for="concept in concepts.filter(element => element.concept_type === 'egreso')" :key="concept.name">
                  <q-item-section>{{ concept.name }}</q-item-section>
                  <q-item-section side>{{ concept.total_egresses }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable>
                  <q-item-section>Total</q-item-section>
                  <q-item-section side>{{ totalCalculate(concepts.filter(element => element.concept_type === 'egreso'), 'total_egresses') }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable class="text-bold">
                  <q-item-section>UTILIDAD DEL EJERCICIO</q-item-section>
                  <q-item-section side>
                    {{ totalCalculate(concepts.filter(element => element.concept_type === 'ingreso'), 'total_entry') - totalCalculate(concepts.filter(element => element.concept_type === 'egreso'), 'total_egresses') }}
                  </q-item-section>
                </q-item>
                <q-separator/>
              </q-list>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="boxBalances">
          <div class="text-h6">
            (+)MAS
            <span class="float-right">
              {{ totalCalculate(boxBalances, 'amount') }}
            </span>
          </div>
          <div class="q-mt-sm" v-for="entryType in entryTypes" :key="entryType.id">
            <q-list class="q-mt-sm q-pr-lg text-bold">
              <q-item dense clickable v-ripple>
                <q-item-section>{{ entryType.name }}</q-item-section>
                <q-item-section side>{{ totalCalculate(filterBoxBalance(boxBalances, entryType.id, 'entry_type_id'), 'amount') }}</q-item-section>
              </q-item>
            </q-list>
            <q-list class="q-mt-sm q-pr-xl q-pl-md">
              <q-item v-for="boxBalance in filterBoxBalance(boxBalances, entryType.id, 'entry_type_id')" :key="boxBalance.id" dense clickable v-ripple>
                <q-item-section>{{ boxBalance.conceptName }}</q-item-section>
                <q-item-section side>{{ boxBalance.amount }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator/>
          <div class="text-h6 q-mt-md">
            (+)DESEMBOLSOS
            <span class="float-right">
              {{ totalCalculate(egresses, 'amount') }}
            </span>
          </div>
          <div class="q-mt-sm" v-for="egressType in egressTypes" :key="egressType.name">
            <q-list class="q-mt-sm q-pr-lg text-bold">
              <q-item dense clickable v-ripple>
                <q-item-section>{{ egressType.name }}</q-item-section>
                <q-item-section side>
                  {{ totalCalculate(filterBoxBalance(egresses, egressType.id, 'egress_type_id'), 'amount') }}
                </q-item-section>
              </q-item>
            </q-list>
            <q-list class="q-mt-sm q-ml-md q-pr-xl">
              <q-item v-for="egress in filterBoxBalance(egresses, egressType.id, 'egress_type_id')" :key="egress.id" dense clickable v-ripple>
                <q-item-section>{{ egress.concept }}</q-item-section>
                <q-item-section side>{{ egress.amount }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
      <!-- @progress="onProgress($event)" -->
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
      pdf-content-width="100%"
      ref="html2Pdf"
    >
      <section slot="pdf-content" class="text-uppercase text-dark">
        <pdf-print title="estado de ganancia y perdidas" :dateNow="Date()">
          <template v-slot:content>
            <div class="q-col-gutter-md" v-if="tab === 'earningsLoses'">
              <div>
                <div class="text-h6">Ingresos Diversos</div>
                <ul style="list-style:none;">
                  <li clickable v-ripple v-for="concept in concepts" :key="concept.id">
                    <span>{{ concept.name }}</span>
                    <span class="float-right">{{ concept.total_entry }}</span>
                  </li>
                  <hr/>
                  <li clickable>
                    <span>Total</span>
                    <span class="float-right">{{ totalCalculate(concepts, 'total_entry') }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <div class="text-h6">Egresos</div>
                <ul style="list-style:none;">
                  <li clickable v-ripple v-for="egress in egresses" :key="egress.id">
                    <span>{{ egress.concept }}</span>
                    <span class="float-right">{{ egress.amount }}</span>
                  </li>
                  <hr/>
                  <li clickable>
                    <span>Total</span>
                    <span class="float-right">{{ totalCalculate(egresses, 'amount') }}</span>
                  </li>
                  <hr/>
                  <li clickable class="text-bold">
                    <span>UTILIDAD DEL EJERCICIO</span>
                    <span class="float-right">
                      {{ totalCalculate(concepts, 'total_entry') - totalCalculate(egresses, 'amount') }}
                    </span>
                  </li>
                  <q-separator/>
                </ul>
              </div>
            </div>
            <div v-else>
              <div class="text-h6">
                (+)MAS
                <span class="float-right">
                  {{ totalCalculate(boxBalances, 'amount') }}
                </span>
              </div>
              <div class="q-mt-sm" v-for="entryType in entryTypes" :key="entryType.id">
                <span>{{ entryType.name }}</span>
                <span class="float-right">
                  {{ totalCalculate(filterBoxBalance(boxBalances, entryType.id, 'entry_type_id'), 'amount') }}
                </span>
                <ul class="q-mt-sm q-pr-xl q-pl-md">
                  <li v-for="boxBalance in filterBoxBalance(boxBalances, entryType.id, 'entry_type_id')" :key="boxBalance.id">
                    <span>{{ boxBalance.conceptName }}</span>
                    <span class="float-right">
                      {{ boxBalance.amount }}
                    </span>
                  </li>
                </ul>
              </div>
              <q-separator/>
              <div class="text-h6 q-mt-md">
                (-)DESEMBOLSOS
                <span class="float-right">
                  {{ totalCalculate(egresses, 'amount') }}
                </span>
              </div>
              <div class="q-mt-sm" v-for="egressType in egressTypes" :key="egressType.name">
                <span>{{ egressType.name }}</span>
                <span class="float-right">
                  {{ totalCalculate(filterBoxBalance(egresses, egressType.id, 'egress_type_id'), 'amount') }}
                </span>
                <ul class="q-mt-sm q-pr-xl q-pl-md">
                  <li v-for="egress in filterBoxBalance(egresses, egressType.id, 'egress_type_id')" :key="egress.id">
                    <span>{{ egress.concept }}</span>
                    <span class="float-right">
                      {{ egress.amount }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </pdf-print>
      </section>
    </vue-html2pdf>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import VueHtml2pdf from 'vue-html2pdf'
import PdfPrint from '../components/PdfPrint.vue'
export default {
  // name: 'PageName',
  components: {
    VueHtml2pdf,
    PdfPrint
  },
  data () {
    return {
      tab: 'earningsLoses',
      concepts: [],
      egressTypes: [],
      egresses: [],
      boxBalances: [],
      entryTypes: [],
      from: date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD'),
      to: date.formatDate(Date(), 'YYYY-MM-DD')
    }
  },
  created () {
    this.getConcepts()
    this.getEgresses()
    this.getBalanceBox()
    this.getEntryTypes()
    this.getEgressTypes()
    this.getBalanceBoxEgresses()
  },
  methods: {
    filterBoxBalance (data, value, field) {
      return data.filter(element => {
        return element[field] === value
      })
    },
    onReset () {
      this.to = null
      this.from = null
      this.getData()
    },
    downloadPDF () {
      this.$refs.html2Pdf.generatePdf()
    },
    async getEntryTypes () {
      const { res } = await this.$services.getData(['entry-types'])
      this.entryTypes = res.data
    },
    async getEgressTypes () {
      const { res } = await this.$services.getData(['egress-types'])
      this.egressTypes = res.data
    },
    async getConcepts () {
      const { res } = await this.$services.getData(['reports', 'earnings-loses'], {
        to: this.to,
        from: this.from
      })
      this.concepts = res.data
    },
    async getBalanceBox () {
      const { res } = await this.$services.getData(['get-box-balances'], {
        to: this.to,
        from: this.from
      })
      this.boxBalances = res.data
    },
    async getBalanceBoxEgresses () {
      const { res } = await this.$services.getData(['get-box-balances-egresses'], {
        to: this.to,
        from: this.from
      })
      console.log(res.data)
    },
    async getEgresses () {
      const { res } = await this.$services.getData(['egresses'], {
        dateFilter: {
          to: this.to,
          from: this.from,
          field: 'created_at'
        }
      })
      this.egresses = res.data
    },
    getData () {
      switch (this.tab) {
        case 'earningsLoses':
          this.getConcepts()
          this.getEgresses()
          break
        case 'boxBalances':
          this.getBalanceBox()
          this.getEgresses()
          break
        default:
          break
      }
    },
    totalCalculate (data, field) {
      let total = 0
      data.forEach(element => {
        total = Number(total) + Number(element[field])
      })
      return total
    }
  }
}
</script>
