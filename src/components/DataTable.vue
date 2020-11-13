<template>
  <div  style="width: 100%">
    <q-table
      style="width: 100%"
      :data="data"
      :columns="columnData"
      :per-page="20"
      :pagination.sync="optionPagination"
      :loading="loading">
     <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="col.class"
          >
            {{
              (col.label) ? $t(`${module}.${col.label}`) : $t(`${module}.${col.name}`)
            }}
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
export default {
  props: {
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
      /**
       * Content the column
       * @type {Array}
       */
      columnData: []
    }
  },
  created () {
    this.setHeaders()
  },
  methods: {
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
