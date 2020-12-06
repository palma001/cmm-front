<template>
  <q-page class="flex-start q-pa-md">
    <div align="right">
      <q-btn color="primary"
        icon="add"
        glossy
        dense
        size="12px"
        label="Agragar Rol"
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
    <q-dialog
      v-model="addModule"
      full-height
      position="right"
      persistent
    >
      <DynamicForm
        module="roles"
        :loading="loadingAdd"
        :buttons="buttonsRole"
        :config="roleConfig"
        @save="save"
        @cancel="cancel"
      />
    </q-dialog>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import DynamicForm from 'components/DynamicForm.vue'
import { roleConfig, buttonsRole } from '../config-file/role/roleConfig'
import { mixins } from '../mixins'
export default {
  name: 'Role',
  components: { DataTable, DynamicForm },
  mixins: [mixins.containerMixin],
  data () {
    return {
      loadingAdd: false,
      text: '',
      addModule: false,
      /**
       * Config role
       * @type {Array} config role
       */
      roleConfig: roleConfig,
      /**
       * Button role
       * @type {Array} config role
       */
      buttonsRole: buttonsRole,
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
    cancel () {
      this.addModule = false
    },
    /**
     * Get Role
     *
     */
    getRoles (params) {
      this.loading = true
      this.$mockData.getData('roles')
        .then(({ response }) => {
          this.role = response.data.content.reverse()
          this.loading = false
          this.pagination = params
        })
    },

    /**
     * Get Role
     *
     */
    async save (data, self) {
      this.loadingAdd = true
      await this.$mockData.postData('roles', data)
      this.loadingAdd = false
      this.getRoles(this.pagination)
      this.$q.notify({
        position: 'top-left',
        message: 'Agregado exitosamente!',
        color: 'teal',
        icon: 'thumb_up'
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
