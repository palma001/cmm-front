<template>
  <q-page class="flex-start q-pa-md">
    <div align="right">
      <q-btn color="primary"
        glossy
        size="12px"
        label="Agragar Modulo"
        @click="addModule = true" />
    </div>
    <div class="row q-mt-md">
      <DataTable module="roles"
        title="listRoles"
        :loading="loading"
        :column="roleConfig"
        :data="role"
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

        <q-card-actions align="right">
          <q-btn label="Cancelar"
            color="negative"
            v-close-popup
            glossy
            size="12px" />
          <q-btn label="Guardar"
            color="primary"
            glossy
            size="12px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { roleConfig } from '../config-file/role/roleConfig'
import { mixins } from '../mixins'
export default {
  name: 'Role',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      text: '',
      addModule: false,
      /**
       * Config module
       * @type {Array} config module
       */
      roleConfig: roleConfig,
      /**
       * All Role
       * @type {Array} Role
       */
      role: [],
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
    this.getRoles()
  },
  methods: {
    /**
     * Get Role
     *
     */
    getRoles (params) {
      this.loading = true
      this.$mockData.getData('roles')
        .then(({ response }) => {
          this.role = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getRoles(data)
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
      this.getRoles(this.pagination)
    }
  }
}
</script>
