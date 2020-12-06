<template>
  <div style="width: 100%">
    <q-table class="primary"
      :data="data"
      :columns="columnData"
      :title="ucwords($t(`${module}.${title}`))"
      :pagination="paginationConfig"
      :loading="loading"
      @update:pagination="setPagination">
      <template v-slot:loading>
        <q-inner-loading showing
          color="primary" />
      </template>
      <!-- @update:pagination ="rowsPerPage"> -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="col.class">
            {{ ucwords((col.label) ? $t(`${module}.${col.label}`) : $t(`${module}.${col.name}`)) }}
          </q-th>
          <q-th align="left">
             {{ ucwords($t('template.actions')) }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input dense
          debounce="300"
          @input="search"
          v-model="filter"
          :placeholder="ucwords($t('template.search'))">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols"
            :key="col.name"
            :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn size="sm"
              color="primary"
              dense
              round
              icon="fullscreen"
              @click="viewDetails(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mixins } from '../mixins'
export default {
  name: 'DataTable',
  mixins: [mixins.containerMixin],
  props: {
    /**
     * Loading status
     * @type {Boolean} status
     */
    loading: {
      type: Boolean,
      required: false
    },
    /**
     * The module name
     *
     * @type {String} module name
     */
    module: {
      type: String,
      required: false
    },
    /**
     * The table title
     *
     * @type {String} table title
     */
    title: {
      type: String,
      required: false
    },
    /**
     * The column definitions (Array of Objects)
     *
     * @type {Array} list columns
     */
    column: {
      type: Array,
      required: true
    },
    /**
     * The data table
     *
     * @type {Array} data table
     */
    data: {
      type: Array,
      required: true
    },
    /**
     * The pagination options
     *
     * @type {Object} pagination options
     */
    optionPagination: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      confirm: false,
      filter: '',
      /**
       * Content the column
       * @type {Array}
       */
      columnData: []
    }
  },
  computed: {
    paginationConfig () {
      return this.optionPagination
    }
  },
  created () {
    this.setHeaders()
  },
  methods: {
    /**
     * Details data
     * @param  {Object} data
     */
    viewDetails (data) {
      this.$emit('view-details', data)
    },
    /**
     * Set data pagination emit event
     * @param  {Object} data value pagination
     */
    setPagination (data) {
      this.$emit('on-load-data', data)
    },
    /**
     * setHeaders gets headers of table
     */
    setHeaders () {
      this.column.map(element => {
        element.children.map(tag => {
          if (tag.tabulated.visible) {
            this.columnData.push(tag.tabulated)
          }
        })
      })
    },
    /**
     * search emit event for search
     * @param  {String} data value of search input
     */
    search (data) {
      this.paginationConfig.page = 1
      this.$emit('search-data', data)
    }
  }
}
</script>
