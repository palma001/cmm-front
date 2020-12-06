<template>
  <q-page class="flex-start q-pa-md">
    <div align="right">
      <q-btn color="primary"
        icon="add"
        glossy
        dense
        size="12px"
        label="Agregar Modulo"
        @click="addModule = true" />
    </div>
    <div class="row q-mt-md">
      <DataTable module="users"
        title="listUser"
        :loading="loading"
        :column="userConfig"
        :data="users"
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
import { userConfig } from '../config-file/user/userConfig'
import { mixins } from '../mixins'
export default {
  name: 'User',
  components: { DataTable },
  mixins: [mixins.containerMixin],
  data () {
    return {
      addModule: false,
      /**
       * Config module
       * @type {Array} config module
       */
      userConfig: userConfig,
      /**
       * All Users
       * @type {Array} Users
       */
      users: [],
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
    this.getUsers()
  },
  methods: {
    /**
     * Get Users
     *
     */
    getUsers (params) {
      this.loading = true
      this.$mockData.getData('users')
        .then(({ response }) => {
          this.users = response.data.content
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Sort and paginate table
     * @param  {Object} data data paginate
     */
    sortingTable (data) {
      this.getUsers(data)
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
      this.getUsers(this.pagination)
    }
  }
}
</script>
