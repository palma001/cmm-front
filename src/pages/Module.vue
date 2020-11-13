<template>
  <q-page class="flex-start q-pa-md">
    <div class="row">
      <div class="col-xl-12 col-lg-12 col-md-12 q-pa-sm">
        <div class="text-h5 text-capitalize">
          {{ $t('modules.modules') }}
        </div>
      </div>
      <DataTable
        module="modules"
        :loading="loading"
        :column="moduleConfig"
        :data="modules"
        :optionPagination="pagination"
      />
    </div>
  </q-page>
</template>
<script>
import DataTable from 'components/DataTable.vue'
import { moduleConfig } from '../config-file/module/moduleConfig'
export default {
  name: 'Module',
  components: { DataTable },
  data () {
    return {
      /**
       * Config module
       * @type {Array} config module
       */
      moduleConfig: moduleConfig,
      /**
       * All modules
       * @type {Array} modules
       */
      modules: [],
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
        rowsPerPage: 20
      }
    }
  },
  created () {
    this.getModules()
  },
  methods: {
    /**
     * Get modules
     *
     */
    getModules () {
      this.loading = true
      this.$mockData.getData('modules')
        .then(({ response }) => {
          this.modules = response.data.content
          this.loading = false
        })
    }
  }
}
</script>
