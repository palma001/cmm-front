<template>
  <q-page padding>
    <div class="row q-gutter-y-sm">
      <div class="col-12 col-12 text-right">
        <q-btn
          color="primary"
          icon="add_circle"
          :label="$q.screen.lt.sm ? '' : $t('product.add')"
          @click="addDialig = true"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            v-if="$q.screen.lt.sm"
          >
            {{
              ucwords($t('product.add'))
            }}
          </q-tooltip>
      </q-btn>
      </div>
      <div class="co-12 row q-col-gutter-xs">
        <div class="col-xs-2 col-lg-1">
          <q-input
            type="text"
            label="C"
            v-model="brand"
            dense
            outlined
            @input="filterPrimary"
          />
        </div>
        <div class="col-xs-2 col-lg-1">
          <q-input
            type="text"
            label="P"
            dense
            v-model="code"
            outlined
            @input="filterPrimary"
          />
        </div>
        <div class="col-xs-2 col-lg-1">
          <q-input
            type="text"
            label="D"
            dense
            v-model="supsec"
            outlined
            @input="filterPrimary"
          />
        </div>
        <div class="offset-lg-1 col-sm-6 col-lg-8 row q-col-gutter-xs justify-end">
          <div v-for="attributeType in listAttributeTypes" class="col-xs-4 col-lg-2" :key="attributeType.id">
            <q-input
              type="text"
              dense
              outlined
              :label="attributeType.name"
              v-model="attributeTypes[attributeType.name]"
              @input="filterSecondary"
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <data-table
          title="list"
          module="product"
          searchable
          action
          :column="product"
          :data="data"
          :loading="loadingTable"
          :buttonsActions="buttonsActions"
          :optionPagination="optionPagination"
          v-if="listAttributeTypes.length"
          @view-details="viewDetails"
          @search-data="searchData"
          @on-load-data="loadData"
          @delete="deleteData"
        />
      </div>
    </div>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="editDialog"
    >
      <dynamic-form-edition
        module="product"
        :propsPanelEdition="propsPanelEdition"
        :config="product"
        :loading="loadingForm"
        @cancel="editDialog = false"
        @update="update"
      />
    </q-dialog>
    <q-dialog
      position="right"
      full-height
      persistent
      v-model="addDialig"
    >
      <dynamic-form
        module="product"
        :config="product"
        :loading="loadingForm"
        @cancel="addDialig = false"
        @save="save"
      />
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>
<script>
import DataTable from '../components/DataTable.vue'
import DynamicForm from '../components/DynamicForm.vue'
import DynamicFormEdition from '../components/DynamicFormEdition.vue'
import { product, buttonsActions, propsPanelEdition } from '../config-file/product/productConfig.js'
import { mixins } from '../mixins'
import { GETTERS } from '../store/module-login/name.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [mixins.containerMixin],
  components: {
    DataTable,
    DynamicForm,
    DynamicFormEdition
  },
  data () {
    return {
      visible: false,
      brand: null,
      code: null,
      supsec: null,
      buttonsActions,
      propsPanelEdition,
      loadingForm: false,
      /**
       * Selected data
       * @type {Object}
       */
      selectedData: null,
      /**
       * Options pagination
       * @type {Object}
       */
      optionPagination: {
        rowsPerPage: 20,
        rowsNumber: 20,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      /**
       * Params search
       * @type {Object}
       */
      params: {
        paginated: true,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 1,
        dataSearch: {
          code: '',
          description: '',
          supsec: '',
          numsec: '',
          'category.name': ''
        }
      },
      /**
       * Open add dialog
       * @type {Boolean}
       */
      addDialig: false,
      /**
       * File config module
       * @type {Object}
       */
      product,
      /**
       * Open edit dialog
       * @type {Boolean}
       */
      editDialog: false,
      /**
       * Status loading table
       * @type {Boolean}
       */
      loadingTable: false,
      /**
       * Data of table
       * @type {Array}
       */
      data: [],
      /**
       * Model Attribute
       * @type {Object} attribute type
       */
      attributeTypes: {},
      /**
       * List attribute product
       * @type {Array}
       */
      listAttributeTypes: []
    }
  },
  created () {
    this.getAttributeTypes()
    this.userSession = this[GETTERS.GET_USER]
    this.branchOffice = this[GETTERS.GET_BRANCH_OFFICE]
  },
  computed: {
    /**
     * Getters Vuex
     */
    ...mapGetters([GETTERS.GET_USER, GETTERS.GET_BRANCH_OFFICE])
  },
  methods: {
    filterSecondary () {
      console.log(this.attributeTypes)
      // this.params = {
      //   dataFilter:
      // }
    },
    /**
     * Filter primary
     */
    filterPrimary () {
      this.params = {
        filterProduct: {
          code: this.code,
          'brand.name': this.brand,
          supsec: this.supsec
        }
      }
      this.getProducts(this.params)
    },
    /**
     * Get product attrubutes
     */
    getAttributeTypes () {
      this.visible = true
      this.$services.getData(['attribute-types'])
        .then(({ res }) => {
          this.listAttributeTypes = res.data
          res.data.forEach(attributeType => {
            this.attributeTypes[attributeType.name] = null
          })
          this.visible = false
          this.newModelTable()
          this.getProducts()
        })
        .catch(() => {
          this.visible = false
        })
    },
    /**
     * Model product table
     */
    newModelTable () {
      product.map(config => {
        this.listAttributeTypes.forEach(attributeType => {
          if (config.children.length < (this.listAttributeTypes.length + 7)) {
            config.children.push({
              tabulated: {
                name: attributeType.name,
                align: 'left',
                field: row => row.attribute[attributeType.name],
                sortable: false,
                visible: true,
                traductorOff: true
              }
            })
          }
        })
      })
    },
    /**
     * Set data dialog edition
     * @param  {Object} data selected
     */
    viewDetails (data) {
      this.editDialog = true
      this.propsPanelEdition.data = data
      this.selectedData = data
    },
    /**
     * Delete data
     * @param {Object} data data selected
     */
    deleteData (data) {
      this.$q.dialog({
        title: 'Confirmación',
        message: '¿Desea eliminar la marca?',
        cancel: {
          label: 'Cancelar',
          color: 'negative'
        },
        persistent: true,
        ok: {
          label: 'Aceptar',
          color: 'primary'
        }
      }).onOk(async () => {
        await this.$services.deleteData(['products', data.id])
        this.notify(this, 'product.deleteSuccessfull', 'positive', 'mood')
        this.getProducts()
      })
    },
    /**
     * Load data sorting
     * @param  {Object}
     */
    loadData (data) {
      this.params.page = data.page
      this.params.sortBy = data.sortBy ?? this.params.sortBy
      this.params.sortOrder = data.sortOrder
      this.params.perPage = data.rowsPerPage
      this.optionPagination = data
      this.getProducts(this.params)
    },
    /**
     * Search product
     * @param  {Object}
     */
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.getProducts()
    },
    /**
     * Update Branch Office
     * @param  {Object}
     */
    update (data) {
      data.user_updated_id = this.userSession.id
      this.loadingForm = true
      this.$services.putData(['products', this.selectedData.id], data)
        .then(({ res }) => {
          this.editDialog = false
          this.loadingForm = false
          this.getProducts(this.params)
          this.notify(this, 'product.editSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Save Branch Office
     * @param  {Object}
     */
    save (data) {
      data.user_created_id = this.userSession.id
      data.user_id = this.userSession.id
      this.loadingForm = true
      this.$services.postData(['products'], data)
        .then(({ res }) => {
          this.addDialig = false
          this.loadingForm = false
          this.getProducts(this.params)
          this.notify(this, 'product.addSuccessfull', 'positive', 'mood')
        })
        .catch(() => {
          this.loadingForm = false
        })
    },
    /**
     * Get all product
     */
    getProducts (params = this.params) {
      this.loadingTable = true
      this.$services.getData(['products'], params)
        .then(({ res }) => {
          this.data = res.data.map(productData => {
            productData.attribute = {}
            productData.attribute_types.forEach(attributeType => {
              productData.attribute[attributeType.name] = attributeType.pivot.description
            })
            return productData
          })
          this.optionPagination.rowsNumber = 1000000
          this.loadingTable = false
        })
        .catch(err => {
          console.log(err)
          this.data = []
          this.loadingTable = false
          this.optionPagination.rowsNumber = 0
        })
    }
  }
}
</script>
