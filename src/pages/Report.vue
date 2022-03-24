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
            <q-btn color="orange" icon="print" @click="print"/>
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
        <q-tab name="alarms" label="Determinacion de saldo de caja" />
        <q-tab name="movies" label="Cuentas por cobrar" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="earningsLoses">
          <div class="row q-col-gutter-md">
            <div class="col-sm-5 col-xs-12 col-md-5">
              <div class="text-h6">Ingresos Diversos</div>
              <q-list dense>
                <q-item clickable v-ripple v-for="concept in concepts" :key="concept.id">
                  <q-item-section>{{ concept.name }}</q-item-section>
                  <q-item-section side>{{ concept.total }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable>
                  <q-item-section>Total</q-item-section>
                  <q-item-section side>{{ totalCalculate(concepts, 'total') }}</q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-sm-6 col-xs-12 col-md-6">
              <div class="text-h6">Egresos</div>
              <q-list dense>
                <q-item clickable v-ripple v-for="egress in egresses" :key="egress.id">
                  <q-item-section>{{ egress.concept }}</q-item-section>
                  <q-item-section side>{{ egress.amount }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable>
                  <q-item-section>Total</q-item-section>
                  <q-item-section side>{{ totalCalculate(egresses, 'amount') }}</q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item clickable class="text-bold">
                  <q-item-section>UTILIDAD DEL EJERCICIO</q-item-section>
                  <q-item-section side>
                    {{ totalCalculate(concepts, 'total') - totalCalculate(egresses, 'amount') }}
                  </q-item-section>
                </q-item>
                <q-separator/>
              </q-list>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>Single line item</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Item with caption</q-item-label>
                <q-item-label caption>Caption</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>OVERLINE</q-item-label>
                <q-item-label>Item with caption</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>Single line item</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Item with caption</q-item-label>
                <q-item-label caption>Caption</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>OVERLINE</q-item-label>
                <q-item-label>Item with caption</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  // name: 'PageName',
  data () {
    return {
      tab: 'earningsLoses',
      concepts: [],
      egresses: [],
      from: date.formatDate(date.startOfDate(Date(), 'month'), 'YYYY-MM-DD'),
      to: date.formatDate(Date(), 'YYYY-MM-DD')
    }
  },
  created () {
    this.getConcepts()
    this.getEgresses()
  },
  methods: {
    print () {
    },
    onReset () {
      this.to = null
      this.from = null
      this.getData()
    },
    async getConcepts () {
      const { res } = await this.$services.getData(['reports', 'earnings-loses'], {
        to: this.to,
        from: this.from
      })
      this.concepts = res.data
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
