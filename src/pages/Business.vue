<template>
  <q-page class="flex-start q-pa-md">
    <div align="right">
      <q-btn color="primary"
        glossy
        icon="add"
        dense
        size="12px"
        label="Agregar Modulo"
        @click="addModule = true" />
    </div>
    <div class="row q-mt-md">
      <DataTable module="business"
        title="listBusiness"
        :loading="loading"
        :column="businessConfig"
        :data="business"
        :optionPagination="pagination"
        @on-load-data="sortingTable"
        @search-data="eventSearch" />
    </div>
    <q-dialog v-model="addModule"
      persistent>
      <q-card>
        <q-card-section class="text-primary text-h6">Agregar Módulo
          <div class="row">
            <div class="col-12">
              <q-input v-model="text"
                label="Registro 1"
                expanded/>
            </div>
            <div class="col-12">
              <q-input v-model="text"
                label="Registro 2"
                expanded/>
            </div>
            <div class="col-12">
              <q-input v-model="text"
                label="Registro 3"
                expanded/>
            </div>
            <div class="col-12">
              <q-input v-model="text"
                label="Registro 4"
                expanded/>
              <div class="col-12">
                <q-input v-model="text"
                  label="Registro 5"
                  expanded/>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancelar"
            color="primary"
            v-close-popup
            glossy
            dense
            icon="close"
            size="12px" />
          <q-btn label="Guardar"
            color="primary"
            v-close-popup
            icon="save"
            dense
            glossy
            size="12px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { businessConfig } from '../config-file/business/businessConfig'
import { mixins } from '../mixins'
export default {
  name: 'Busines',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      addModule: false,
      /**
       * Config module
       * @type {Array} config module
       */
      businessConfig: businessConfig,
      /**
       * All Business
       * @type {Array} Business
       */
      business: [],
      /**
       * Loading status
       * @type {Boolean} status
       */
      loading: false,
      /**
       * Option paginate
       * @type {Object} Option paginate
       */
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 25,
        search: {}
        // rowsNumber: xx if getting data from a server
      },
      /**
       * Paramaters for search
       * @type {Array}
       */
      search: {
        name: '',
        route: ''
      }
    }
  },
  created () {
    this.getBusiness()
  },
  methods: {
    /**
     * Get Business
     *
     */
    getBusiness (params) {
      this.loading = true
      this.$mockData.getData('business')
        .then(({ response }) => {
          console.log(response)
          this.business = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getBusiness(data)
    },
    /**
     * eventSearch searches data in microservices
     * @param  {String} data data search
     */
    eventSearch (data) {
      for (const field in this.search) {
        this.search[field] = data
      }
      this.pagination.page = 1
      this.pagination.search = this.search
      this.getBusiness(this.pagination)
    }
  }
}
</script>
