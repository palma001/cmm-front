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
          <q-td auto-width>
            <q-btn size="sm"
              color="primary"
              dense
              round
              @click="props.expand = !props.expand"
              icon="fullscreen" />
          </q-td>
          <q-td v-for="col in props.cols"
            :key="col.name"
            :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-dialog v-model="props.expand">
          <q-card>
            <q-bar class="bg-white">
              <q-title class="text-primary text-bold text-h6">Nombre fila módulo</q-title>
              <q-space />
              <q-btn class="text-primary"
                flat
                dense
                round
                size="12px"
                icon="close"
                v-close-popup>
              </q-btn>
            </q-bar>
            <q-card-section>
              <div class="row">
                <div class="col-12">
                  <q-field borderless
                    dense>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline"
                        tabindex="0">Información del registro</div>
                    </template>
                  </q-field>
                </div>
                <div class="col-12">
                  <q-field borderless
                    dense>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline"
                        tabindex="0">Información del registro</div>
                    </template>
                  </q-field>
                </div>
                <div class="col-12">
                  <q-field borderless
                    dense>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline"
                        tabindex="0">Información del registro</div>
                    </template>
                  </q-field>
                </div>
                <div class="col-12">
                  <q-field borderless
                    dense>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline"
                        tabindex="0">Información del registro</div>
                    </template>
                  </q-field>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn label="Editar"
                color="warning"
                v-close-popup
                icon="edit"
                dense
                glossy
                size="12px" />
              <q-btn label="Eliminar"
                color="negative"
                v-close-popup
                icon="delete"
                dense
                glossy
                size="12px"
                @click="confirm = true" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="confirm"
          persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm text-subtitle1">¿Esta seguro que desea eliminar el "nombre del módulo"?</span>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn label="Cancelar"
                color="primary"
                v-close-popup
                icon="close"
                dense
                glossy
                size="12px" />
              <q-btn label="Aceptar"
                color="primary"
                v-close-popup
                icon="done"
                dense
                glossy
                size="12px" />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
