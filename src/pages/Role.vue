<template>
  <q-page padding>
    <q-splitter
      v-model="splitterModel"
      style="height: 88vh"
    >
      <template v-slot:before>
        <div class="q-pr-md">
          <data-table
            title="list"
            module="role"
            searchable
            action
            :column="roleConfig"
            :data="dataRoles"
            :loading="loadingTable"
            :optionPagination="optionPagination"
            @search-data="searchData"
            @view-details="viewDetails"
            @on-load-data="loadData"
          />
        </div>
      </template>
      <template v-slot:after>
        <q-splitter
          v-model="insideModel"
          horizontal
        >
          <template v-slot:before>
            <div class="q-pa-md text-h6" v-if="selectedData">
              Permisos Habilitados Menú - {{ selectedData.name }}
            </div>
            <div class="q-px-md row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-lg-6" v-for="section in sections" :key="section.id">
                <div class="text-bold">
                  {{ucwords($t(`template.${section.name}`))}}
                  <q-btn
                    :color="submenu.id === section.id ? 'green' : 'negative'"
                    text-color="white"
                    size="xs"
                    :icon="submenu.id === section.id ? 'check' : 'edit'"
                    aria-label="edit_location"
                    class="q-ml-sm"
                    round
                    @click="menuSelected(section)"
                  >
                  </q-btn>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:after>
            <div class="q-pa-md text-h6">
              Permisos Habilitados Submenu {{ ucwords($t(`template.${submenu.name}`)) }}
            </div>
            <div class="q-px-md row q-col-gutter-y-sm">
              <div class="col-xs-12 col-sm-6 col-lg-6" v-for="module in submenu.modules" :key="module.id">
                <q-toggle
                  size="xs"
                  v-model="moduleSelected"
                  :val="module.id"
                  :label="ucwords($t(`modules.${module.name}`))"
                  :disable="loadingTable"
                  @input="changePermissions"
                />
              </div>
            </div>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import DataTable from '../components/DataTable.vue'
import { mixins } from '../mixins'
import { roleConfig } from '../config-file/role/roleConfig.js'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable
  },
  data () {
    return {
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc',
        rowsNumber: 20
      },
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        dataSearch: {
          name: ''
        }
      },
      moduleSelected: [],
      /**
       * Branch office session
       * @type {Object} branch office session
       */
      branchOffice: null,
      /**
       * User session
       * @type {Object} user session
       */
      userSession: null,
      /**
       * Role config file
       * @type {Array} Role config file
       */
      roleConfig,
      selectedData: null,
      splitterModel: 50, // start at 50%
      insideModel: 50,
      selected: [],
      sectionSelected: [],
      submenu: {},
      dataRoles: [],
      loadingTable: false,
      sections: []
    }
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  created () {
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
    this.getSections()
  },
  methods: {
    // selectedAll (sections) {
    //   sections.forEach(section => {
    //     this.moduleSelected.map(module => {
    //       return section.modules.map(mod => {
    //         if (mod.id === module) {
    //           console.log(mod.id)
    //           return mod.id
    //         }
    //       })
    //     })
    //   })
    //   console.log(this.moduleSelected)
    // },
    /**
     * Change permissions
     */
    changePermissions (value) {
      this.selectedData.modules = value
      this.loadingTable = true
      this.$services.putData(['roles', this.selectedData.id], this.selectedData)
        .then(res => {
          this.getRoles(this.params)
          this.notify(this, 'role.permissionChangeSuccefull', 'positive', 'mood')
        })
        .catch(() => {
          this.notify(this, 'role.permissionChangeError', 'negative', 'warning')
        })
    },
    /**
     * Menu updating
     * @param {Object} data Menu selected
     */
    menuSelected (data) {
      this.submenu = data
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getRoles(this.params)
    },
    /**
     * Search branch offices
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.getRoles(this.params)
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.selectedData = data
      this.moduleSelected = data.modules.map(element => element.id)
    },
    /**
     * Get all sections
     */
    async getSections () {
      var { res } = await this.$services.getData(['sections'])
      this.sections = res.data
      this.submenu = res.data[0]
    },
    /**
     * Get all branch offices
     */
    getRoles (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['roles'], params)
        .then(({ res }) => {
          this.dataRoles = res.data.data
          this.selectedData = this.selectedData ?? res.data.data[0]
          this.optionPagination.rowsNumber = res.data.total
          this.loadingTable = false
        })
        .catch(err => {
          console.log(err)
          this.dataRoles = []
          this.loadingTable = false
          this.optionPagination.rowsNumber = 0
        })
    }
  }
}
</script>
