<template>
  <div style="width: 100%">
    <q-table
      :data="data"
      :columns="columnData"
      :title="ucwords($t(`${module}.${title}`))"
      :pagination="paginationConfig"
      :loading="loading"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <!-- @update:pagination ="rowsPerPage"> -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="col.class">
            {{
              ucwords((col.label) ? $t(`${module}.${col.label}`) : $t(`${module}.${col.name}`))
            }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" :placeholder="ucwords($t('template.search'))">
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="close" @click="filter = ''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
        </q-input>
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
      current: 3,
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
    },
    pagesNumber () {
      return Math.ceil(this.data.length / this.paginationConfig.rowsPerPage)
    }
  },
  created () {
    this.setHeaders()
  },
  methods: {
    rowsPerPage (event) {
      console.log(event)
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
    }
  }
}
</script>
