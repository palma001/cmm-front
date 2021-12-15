<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-5 q-gutter-sm">
        <q-card>
          <q-card-section class="row q-col-gutter-x-xs q-py-sm">
            <div class="col-6">
              <q-input
                outlined
                :value="`${seatSelected.accounting_plan.code} ${seatSelected.accounting_plan.description}`"
                label="Sub Diario"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="seatSelected.id"
                label="Asiento"
                type="number"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="seatSelected.created_at"
                label="Fecha"
                dense
                type="date"
              />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-x-xs q-py-sm">
            <div class="col-7">
              <q-input
                outlined
                v-model="text"
                label="Moneda"
                dense
              />
            </div>
            <div class="col-5">
              <q-input
                outlined
                v-model="text"
                label="T/C"
                dense
              />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-x-xs q-py-sm">
            <div class="col-12">
              <q-input
                outlined
                :value="`${seatSelected.register.code} ${seatSelected.register.description}`"
                label="L/Registro"
                dense
              />
            </div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section class="row q-col-gutter-xs q-py-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Cuenta"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Libro"
                dense
              />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-xs q-py-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Tipo de documento"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Número del documento"
                dense
              />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-xs q-py-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Fecha del documento"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="Fecha de vencimiento"
                dense
              />
            </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-xs q-py-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                label="R.U.C"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="text"
                dense
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-7">
        <q-card>
          <q-card-section>
            <q-table
              :data="seatSelected.accounting_book_details"
              class="dense"
              :columns="columns"
              row-key="name"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
// import DataTable from '../components/DataTable.vue'
// import DynamicForm from '../components/DynamicForm.vue'
// import DynamicFormEdition from '../components/DynamicFormEdition.vue'
// import { category, buttonsActions, propsPanelEdition } from '../config-file/category/categoryConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    // DataTable,
    // DynamicForm,
    // DynamicFormEdition
  },
  data () {
    return {
      seatSelected: null,
      rows: [],
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 1,
        dataSearch: {}
      },
      loadingSeat: false,
      columns: [
        {
          name: 'account',
          align: 'left',
          label: 'Cuenta',
          field: row => row.accounting_plan.code,
          sortable: true
        },
        {
          name: 'description',
          label: 'Descripción',
          align: 'left',
          field: row => row.accounting_plan.description,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'debe',
          label: 'Debe S/.',
          field: row => row.account_type === 'debe' ? row.amount : '-',
          sortable: true
        },
        {
          name: 'haber',
          label: 'Haber S/.',
          field: row => row.account_type === 'haber' ? row.amount : '-'
        }
      ]
    }
  },
  created () {
    this.getAccountingBook()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    /**
     * Get all voucherType
     */
    getAccountingBook (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['accounting-books'], this.params)
        .then(({ res }) => {
          this.seatSelected = res.data.data[res.data.data.length - 1]
          this.loadingSeat = false
        })
        .catch(err => {
          console.log(err)
          this.loadingSeat = false
        })
    }
  }
}
</script>
