<template>
  <div style="width: 100%">
    <q-table
      class="q-table"
      :data="data"
      :columns="columnData"
      :title="ucwords($t(`${module}.${title}`))"
      :pagination.sync="paginationConfig"
      :loading="loading"
      :selection="selection"
      :selected.sync="selected"
      :grid="grid"
      binary-state-sort
      @request="setPagination"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="toggable" align="left">
            <q-toggle
              v-model="props.selected"
              size="xs"
              @input="selectionToggleAll"
            />
          </q-th>
          <q-th v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="col.class"
          >
            <span v-if="col.traductorOff">
              {{ ucwords(col.label ? col.label : col.name) }}
            </span>
            <span v-else>
              {{ ucwords((col.label) ? $t(`${module}.${col.label}`) : $t(`${module}.${col.name}`)) }}
            </span>
          </q-th>
          <q-th align="center" v-if="action">
            {{ ucwords($t('template.actions')) }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-right v-if="searchable">
        <q-input dense
          debounce="300"
          outlined
          @input="search"
          v-model="filter"
          :placeholder="ucwords($t('template.search'))">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :class="props.rowIndex === bgColor ? 'bg-primary text-white' : ''" @click="color(props.rowIndex)">
          <q-td v-if="toggable">
            <q-toggle
              v-model="props.selected"
              size="xs"
              @input="selectionToggle(props.row)"
            />
          </q-td>
          <q-td v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <q-btn-dropdown
              :splits="col.button.splits ? col.button.splits : false"
              :push="col.button.push ? col.button.push : false"
              :glossy="col.button.glossy ? col.button.glossy : false"
              :color="col.button.color"
              :icon="col.button.icon"
              :label="col.button.label ? ucwords($t(`${module}.${col.name}`)) : ''"
              :class="col.button.class"
              :size="col.button.size"
              v-if="col.button && col.button.type === 'dropdown'"
            >
              <q-list>
                <q-item
                  clickable
                  v-for="option in col.button.options"
                  :key="option.id"
                  @click="$emit(option.event, props.row)"
                >
                  <q-item-section avatar v-if="option.avatar">
                    <q-avatar
                      :icon="option.avatar.icon"
                      :color="option.avatar.color"
                      :text-color="option.avatar.textColor"
                      :size="option.avatar.size"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-if="option.label">
                      {{ ucwords($t(`${module}.${option.label}`)) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn
              v-else-if="col.button && col.button.type === 'button'"
              :label="col.button.label ? ucwords($t(`${module}.${col.button.label}`)) : ''"
              :icon="col.button.icon"
              :color="col.button.color"
              :size="col.button.size"
              :push="col.button.push"
              :class="col.button.class"
              @click="$emit(col.button.event, props.row)"
            />
            <span v-else>
              {{ col.value ? col.value : '-' }}
            </span>
          </q-td>
          <q-td v-if="action" align="center">
            <q-btn
              dense
              round
              v-for="buttonAction in buttonsActions"
              :key="buttonAction.id"
              :size="buttonAction.size"
              :color="buttonAction.color"
              :icon="buttonAction.icon"
              :class="buttonAction.class"
              @click="emitEvent(buttonAction.event, props.row)"
            >
              <q-tooltip v-if="buttonAction.tooltip">
                {{ ucwords($t(`${module}.${buttonAction.tooltip.text}`)) }}
              </q-tooltip>
            </q-btn>
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
     * Actions buttons
     * @type {Array} array buttons
     */
    buttonsActions: {
      type: Array,
      default: () => {
        return [
          {
            color: 'primary',
            icon: 'fullscreen',
            size: 'sm',
            event: 'view-details'
          }
        ]
      }
    },
    /**
     * Visibility toggle
     * @type {Boolean} status toggle
     */
    toggable: {
      type: Boolean,
      default: false
    },
    /**
     * Selection type
     * @type {String} selection type
     */
    selection: {
      type: String,
      default: 'single'
    },
    /**
     * Actions
     * @type {Boolean} status
     */
    action: {
      type: Boolean,
      required: false
    },
    /**
     * Searchable
     * @type {Boolean} status
     */
    searchable: {
      type: Boolean,
      required: false
    },
    /**
     * Loading status
     * @type {Boolean} status
     */
    loading: {
      type: Boolean,
      required: false
    },
    /**
     * Grid status
     * @type {Boolean} status
     */
    grid: {
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
      required: true
    }
  },
  mounted () {
    // get initial data from server (1st page)
    this.setPagination({
      pagination: this.paginationConfig,
      filter: undefined
    })
  },
  data () {
    return {
      bgColor: 0,
      paginationConfig: null,
      confirm: false,
      filter: '',
      /**
       * Content the column
       * @type {Array}
       */
      columnData: [],
      selected: []
    }
  },
  watch: {
    optionPagination () {
      this.paginationConfig = this.optionPagination
    },
    data () {
      this.bgColor = 0
    }
  },
  created () {
    this.setHeaders()
    this.paginationConfig = this.optionPagination
  },
  methods: {
    color (index) {
      this.bgColor = index
    },
    /**
     * Selected all data
     */
    selectionToggleAll () {
      this.$emit('selected', this.selected)
    },
    /**
     * Selected one data
     * @param {Object} Data selected
     */
    selectionToggle (data) {
      this.$emit('selected', this.selected, data)
    },
    /**
     * Details data
     * @param  {Object} data
     */
    emitEvent (event, data) {
      this.$emit(event, data)
    },
    /**
     * Set data pagination emit event
     * @param  {Object} data value pagination
     */
    setPagination (data) {
      data.pagination.sortOrder = data.pagination.descending ? 'asc' : 'desc'
      this.$emit('on-load-data', data.pagination)
    },
    /**
     * setHeaders gets headers of table
     */
    setHeaders () {
      this.column.map(element => {
        element.children.map(tag => {
          if (tag.tabulated && tag.tabulated.visible) {
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
<style lang="stylus">
  .q-table tbody td:after
    background: lightblue
</style>
